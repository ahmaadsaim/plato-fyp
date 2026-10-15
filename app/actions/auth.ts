"use server";

import { redirect } from "next/navigation";
import { queryOne } from "@/lib/db";
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

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  try {
    const existingUser = await queryOne<{ id: string }>(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingUser) {
      return { error: "An account with this email already exists." };
    }

    const passwordHash = await hashPassword(password);

    const newUser = await queryOne<{ id: string; name: string; email: string }>(
      "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING RETURNING id, name, email",
      [name, email, passwordHash]
    );

    if (newUser) {
      await createSession(newUser);
      redirect("/dashboard");
    }
    return { error: "An account with this email already exists." };
  } catch (error) {
    // If NEXT_REDIRECT was thrown, rethrow it
    if ((error as { digest?: string })?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    return { error: "Unable to create your account. Please try again later." };
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

  // Authenticate against the persistent database.
  try {
    const user = await queryOne<{
      id: string;
      name: string;
      email: string;
      password_hash: string;
    }>("SELECT id, name, email, password_hash FROM users WHERE email = $1", [email]);

    if (!user) {
      return {
        error: "Invalid email or password.",
      };
    }

    const isValid = await verifyPassword(password, user.password_hash);
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

    return {
      error: "Unable to sign in right now. Please try again later.",
    };
  }
}

// ─── Logout ───────────────────────────────────────────────────────────────────

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
