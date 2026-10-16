"use server";

import { redirect } from "next/navigation";
import { pool } from "@/lib/db";
import { hashPassword, verifyPassword, createSession, destroySession } from "@/lib/auth";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthState {
  error?: string;
}

// ─── Signup ───────────────────────────────────────────────────────────────────

export async function signupAction(
  _prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "Please fill in all fields." };
  }

  if (name.length < 2 || name.length > 80) {
    return { error: "Name must be between 2 and 80 characters." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Enter a valid email address." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  try {
    const passwordHash = await hashPassword(password);
    const result = await pool.query<{ id: string; name: string; email: string }>(
      "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING RETURNING id, name, email",
      [name, email, passwordHash]
    );
    const newUser = result.rows[0];
    if (!newUser) return { error: "An account with this email already exists. Please log in." };
    await createSession(newUser);
    redirect("/dashboard");
  } catch (error) {
    if ((error as { digest?: string })?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("[signupAction] Account creation failed:", error);
    return { error: "We couldn't create your account. Please try again." };
  }
}

// ─── Login ────────────────────────────────────────────────────────────────────

export async function loginAction(
  _prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Please enter both email and password." };
  }

  try {
    const result = await pool.query<{
      id: string;
      name: string;
      email: string;
      password_hash: string | null;
    }>("SELECT id, name, email, password_hash FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user) {
      return { error: "Invalid email or password." };
    }

    const isValid = user.password_hash
      ? await verifyPassword(password, user.password_hash)
      : false;
    if (!isValid) {
      return { error: "Invalid email or password." };
    }

    await createSession({ id: user.id, name: user.name, email: user.email });
    redirect("/dashboard");
  } catch (error) {
    // If NEXT_REDIRECT was thrown, rethrow it
    if ((error as { digest?: string })?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    console.error("[loginAction] Sign-in failed:", error);
    return { error: "Sign-in is temporarily unavailable. Please try again shortly." };
  }
}

// ─── Logout ───────────────────────────────────────────────────────────────────

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
