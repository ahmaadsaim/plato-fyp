import { timingSafeEqual } from "node:crypto";
import { OAuth2Client } from "google-auth-library";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/auth";
import { pool } from "@/lib/db";
import {
  createGoogleRegistrationTicket,
  GOOGLE_REGISTRATION_COOKIE,
  GOOGLE_REGISTRATION_MAX_AGE,
} from "@/lib/auth/google-registration";

const CALLBACK_PATH = "/api/auth/google/callback";

function getGoogleConfig() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const appUrl = process.env.APP_URL;
  if (!clientId || !clientSecret || !appUrl) return null;

  try {
    const baseUrl = new URL(appUrl);
    if (baseUrl.protocol !== "https:" && baseUrl.hostname !== "localhost") return null;
    return { clientId, clientSecret, appUrl: baseUrl.origin };
  } catch {
    return null;
  }
}

function redirectToAuth(baseUrl: string, intent: string | undefined, error: string) {
  const path = intent === "signup" ? "/signup" : "/login";
  return NextResponse.redirect(new URL(`${path}?error=${error}`, baseUrl));
}

function clearOAuthCookies(response: NextResponse) {
  response.cookies.delete({ name: "google_oauth_state", path: CALLBACK_PATH });
  response.cookies.delete({ name: "google_oauth_verifier", path: CALLBACK_PATH });
  response.cookies.delete({ name: "google_oauth_nonce", path: CALLBACK_PATH });
  response.cookies.delete({ name: "google_oauth_intent", path: CALLBACK_PATH });
  response.cookies.delete({ name: GOOGLE_REGISTRATION_COOKIE, path: "/signup" });
  return response;
}

export async function GET(request: NextRequest) {
  const config = getGoogleConfig();
  if (!config) {
    const fallbackOrigin = process.env.APP_URL;
    if (!fallbackOrigin) {
      return new NextResponse("Google OAuth is not configured: APP_URL is missing.", { status: 503 });
    }
    try {
      return NextResponse.redirect(
        new URL("/login?error=google_not_configured", new URL(fallbackOrigin).origin)
      );
    } catch {
      return new NextResponse("Google OAuth is not configured: APP_URL is invalid.", { status: 503 });
    }
  }

  const baseUrl = config.appUrl;
  const state = request.nextUrl.searchParams.get("state");
  const storedState = request.cookies.get("google_oauth_state")?.value;
  const verifier = request.cookies.get("google_oauth_verifier")?.value;
  const nonce = request.cookies.get("google_oauth_nonce")?.value;
  const intent = request.cookies.get("google_oauth_intent")?.value;

  if (!state || !storedState || !verifier || !nonce || !intent || !["login", "signup"].includes(intent)) {
    console.warn("[Google OAuth] Callback is missing one or more transaction values or cookies.");
    return clearOAuthCookies(redirectToAuth(baseUrl, intent, "google_oauth_failed"));
  }

  const receivedStateBytes = Buffer.from(state);
  const storedStateBytes = Buffer.from(storedState);
  const stateMatches =
    receivedStateBytes.length === storedStateBytes.length &&
    timingSafeEqual(receivedStateBytes, storedStateBytes);
  if (!stateMatches) {
    console.warn("[Google OAuth] State cookie mismatch; the authorization attempt should be restarted.");
    return clearOAuthCookies(redirectToAuth(baseUrl, intent, "google_oauth_failed"));
  }

  const providerError = request.nextUrl.searchParams.get("error");
  const code = request.nextUrl.searchParams.get("code");
  if (providerError === "access_denied") {
    return clearOAuthCookies(redirectToAuth(baseUrl, intent, "google_cancelled"));
  }
  if (!code) {
    return clearOAuthCookies(redirectToAuth(baseUrl, intent, "google_oauth_failed"));
  }

  let failureStage = "authorization-code exchange";
  try {
    const redirectUri = new URL(CALLBACK_PATH, baseUrl).toString();
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
        code_verifier: verifier,
      }),
      cache: "no-store",
    });

    if (!tokenResponse.ok) {
      const responseError = (await tokenResponse.json().catch(() => null)) as { error?: string } | null;
      console.error("[Google OAuth] Token exchange rejected", {
        status: tokenResponse.status,
        error: responseError?.error ?? "unknown_error",
      });
      throw new Error("Google token exchange failed");
    }
    const tokenSet = (await tokenResponse.json()) as { id_token?: string };
    if (!tokenSet.id_token) throw new Error("Google did not return an ID token");

    failureStage = "ID token verification";
    const googleClient = new OAuth2Client(config.clientId);
    const ticket = await googleClient.verifyIdToken({
      idToken: tokenSet.id_token,
      audience: config.clientId,
    });
    const profile = ticket.getPayload();
    if (!profile?.sub || profile.nonce !== nonce || !profile.email || profile.email_verified !== true) {
      throw new Error("Required verified identity claims were missing or invalid");
    }

    const email = profile.email.trim().toLowerCase();
    failureStage = "account lookup or persistence";

    const subjectResult = await pool.query<{
      id: string;
      name: string;
      email: string;
      google_sub: string | null;
      password_hash: string | null;
    }>("SELECT id, name, email, google_sub, password_hash FROM users WHERE google_sub = $1", [profile.sub]);
    let existingUser = subjectResult.rows[0];

    if (!existingUser) {
      const emailResult = await pool.query<{
        id: string;
        name: string;
        email: string;
        google_sub: string | null;
        password_hash: string | null;
      }>("SELECT id, name, email, google_sub, password_hash FROM users WHERE email = $1", [email]);
      existingUser = emailResult.rows[0];
    }

    if (existingUser && existingUser.google_sub !== profile.sub) {
      if (existingUser.google_sub !== null) {
        return clearOAuthCookies(redirectToAuth(baseUrl, intent, "google_email_in_use"));
      }

      // The ID token's email was required to be Google-verified above. Link atomically
      // only this matching account; a unique index prevents linking a Google subject twice.
      const linkedAccount = await pool.query<{
        id: string;
        name: string;
        email: string;
        google_sub: string | null;
        password_hash: string | null;
      }>(
        "UPDATE users SET google_sub = $1 WHERE id = $2 AND google_sub IS NULL RETURNING id, name, email, google_sub, password_hash",
        [profile.sub, existingUser.id]
      );

      if (linkedAccount.rows[0]) {
        existingUser = linkedAccount.rows[0];
      } else {
        // A concurrent callback may already have linked this same Google account.
        const concurrentLink = await pool.query<{
          id: string;
          name: string;
          email: string;
          google_sub: string | null;
          password_hash: string | null;
        }>("SELECT id, name, email, google_sub, password_hash FROM users WHERE google_sub = $1", [profile.sub]);

        if (concurrentLink.rows[0]?.id !== existingUser.id) {
          return clearOAuthCookies(redirectToAuth(baseUrl, intent, "google_email_in_use"));
        }
        existingUser = concurrentLink.rows[0];
      }
    }

    if (!existingUser) {
      const registrationTicket = createGoogleRegistrationTicket({
        name: profile.name?.trim() || email,
        email,
        subject: profile.sub,
      });
      const response = clearOAuthCookies(
        NextResponse.redirect(new URL("/signup?google=1", baseUrl))
      );
      response.cookies.set(GOOGLE_REGISTRATION_COOKIE, registrationTicket, {
        httpOnly: true,
        secure: baseUrl.startsWith("https://"),
        sameSite: "lax",
        maxAge: GOOGLE_REGISTRATION_MAX_AGE,
        path: "/signup",
      });
      return response;
    }

    failureStage = "application session creation";
    await createSession({
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      provider: "google",
    });
    revalidatePath("/");

    return clearOAuthCookies(
      NextResponse.redirect(new URL("/auth/processing/google", baseUrl))
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`[Google OAuth] Callback failed during ${failureStage}: ${message}`);
    const errorCode =
      failureStage === "application session creation"
        ? "google_session_failed"
        : failureStage === "account lookup or persistence"
          ? "google_database_failed"
          : "google_oauth_failed";
    return clearOAuthCookies(redirectToAuth(baseUrl, intent, errorCode));
  }
}