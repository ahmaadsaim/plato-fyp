import { createHash, randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";

const CALLBACK_PATH = "/api/auth/google/callback";
const COOKIE_MAX_AGE = 10 * 60;

function getGoogleConfig() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const appUrl = process.env.APP_URL;
  if (!clientId || !process.env.GOOGLE_CLIENT_SECRET || !appUrl) return null;

  try {
    const baseUrl = new URL(appUrl);
    if (baseUrl.protocol !== "https:" && baseUrl.hostname !== "localhost") return null;
    return { clientId, appUrl: baseUrl.origin };
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const intent = request.nextUrl.searchParams.get("intent");
  const errorPath = intent === "signup" ? "/signup" : "/login";
  const config = getGoogleConfig();

  if (!config) {
    const fallbackOrigin = process.env.APP_URL;
    if (!fallbackOrigin) {
      return new NextResponse("Google OAuth is not configured: APP_URL is missing.", { status: 503 });
    }
    try {
      return NextResponse.redirect(
        new URL(`${errorPath}?error=google_not_configured`, new URL(fallbackOrigin).origin)
      );
    } catch {
      return new NextResponse("Google OAuth is not configured: APP_URL is invalid.", { status: 503 });
    }
  }

  if (intent !== "signup" && intent !== "login") {
    return NextResponse.redirect(new URL("/login?error=google_oauth_failed", config.appUrl));
  }

  if ((intent === "login" || intent === "signup") && (await getSessionUser())) {
    return NextResponse.redirect(new URL("/dashboard", config.appUrl));
  }

  const state = randomBytes(32).toString("base64url");
  const verifier = randomBytes(32).toString("base64url");
  const nonce = randomBytes(32).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  const redirectUri = new URL(CALLBACK_PATH, config.appUrl).toString();
  const authorizeUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authorizeUrl.search = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    nonce,
    code_challenge: challenge,
    code_challenge_method: "S256",
    prompt: "select_account",
  }).toString();

  const response = NextResponse.redirect(authorizeUrl);
  const cookieOptions = {
    httpOnly: true,
    secure: config.appUrl.startsWith("https://"),
    sameSite: "lax" as const,
    maxAge: COOKIE_MAX_AGE,
    path: CALLBACK_PATH,
  };
  response.cookies.set("google_oauth_state", state, cookieOptions);
  response.cookies.set("google_oauth_verifier", verifier, cookieOptions);
  response.cookies.set("google_oauth_nonce", nonce, cookieOptions);
  response.cookies.set("google_oauth_intent", intent, cookieOptions);
  return response;
}