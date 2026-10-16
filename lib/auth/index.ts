import { createHash, randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { pool } from "@/lib/db";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
  provider: "google" | "email";
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SESSION_COOKIE_NAME = "plato_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

// ─── Password Helpers ─────────────────────────────────────────────────────────

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ─── Session Management ───────────────────────────────────────────────────────

export async function createSession(user: {
  id: string;
  name: string;
  email: string;
  provider?: "google" | "email";
}) {
  const token = randomBytes(32).toString("base64url");
  const tokenHash = hashSessionToken(token);
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);
  const cookieStore = await cookies();
  const previousToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  await pool.query(
    "INSERT INTO sessions (user_id, token_hash, expires_at) VALUES ($1, $2, $3)",
    [user.id, tokenHash, expiresAt]
  );
  if (previousToken) {
    await pool.query(
      "UPDATE sessions SET revoked_at = NOW() WHERE token_hash = $1 AND revoked_at IS NULL",
      [hashSessionToken(previousToken)]
    );
  }
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (token) {
    try {
      await pool.query(
        "UPDATE sessions SET revoked_at = NOW() WHERE token_hash = $1 AND revoked_at IS NULL",
        [hashSessionToken(token)]
      );
    } catch (error) {
      console.error("[destroySession] Could not revoke the server session:", error);
    }
  }
  cookieStore.delete(SESSION_COOKIE_NAME);
}

// ─── User Retrieval ───────────────────────────────────────────────────────────

/** Returns the current session user, or null if not authenticated. */
export async function getSessionUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const result = await pool.query<{
      id: string;
      name: string;
      email: string;
      created_at: string;
      google_sub: string | null;
    }>(
      `SELECT u.id, u.name, u.email, u.created_at, u.google_sub
       FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.token_hash = $1 AND s.revoked_at IS NULL AND s.expires_at > NOW()
       LIMIT 1`,
      [hashSessionToken(token)]
    );
    const dbUser = result.rows[0];
    if (!dbUser) return null;
    return {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      created_at: dbUser.created_at,
      provider: dbUser.google_sub ? "google" : "email",
    };
  } catch {
    // Authentication fails closed if the session store is unavailable.
    return null;
  }
}

export const getCurrentUser = getSessionUser;

/** Returns the current session user, redirecting to /login if not authenticated. */
export async function requireUser(): Promise<User> {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return user;
}

/** Verifies a user's password against the persisted password hash. */
export async function verifyUserPassword(
  userId: string,
  email: string,
  passwordAttempt: string
): Promise<boolean> {
  if (!passwordAttempt) return false;

  try {
    const result = await pool.query<{ password_hash: string | null }>(
      "SELECT password_hash FROM users WHERE id = $1 AND email = $2",
      [userId, email.toLowerCase()]
    );
    const passwordHash = result.rows[0]?.password_hash;
    return passwordHash ? verifyPassword(passwordAttempt, passwordHash) : false;
  } catch {
    return false;
  }
}

