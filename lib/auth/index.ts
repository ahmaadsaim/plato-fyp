import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { queryOne } from "@/lib/db";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SESSION_COOKIE_NAME = "plato_session";

const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "plato-multi-tenant-auth-secret-key-32-bytes!!"
);

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

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
}) {
  const token = await new SignJWT({
    name: user.name,
    email: user.email,
  })
    .setSubject(user.id)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);

  const cookieStore = await cookies();
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
  cookieStore.delete(SESSION_COOKIE_NAME);
}

// ─── User Retrieval ───────────────────────────────────────────────────────────

/** Returns the current session user, or null if not authenticated. */
export async function getSessionUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.sub;
    if (!userId) return null;

    return await queryOne<User>(
      "SELECT id, name, email, created_at FROM users WHERE id = $1",
      [userId]
    );
  } catch {
    return null;
  }
}

/** Returns the current session user, redirecting to /login if not authenticated. */
export async function requireUser(): Promise<User> {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return user;
}
