"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { pool } from "@/lib/db";
import { hashPassword, verifyPassword, createSession, destroySession } from "@/lib/auth";
import { clearGoogleRegistrationTicket, getGoogleRegistrationProfile } from "@/lib/auth/google-registration";
import { keepProcessingVisible } from "@/lib/processing";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthState {
  error?: string;
}

// ─── Signup ───────────────────────────────────────────────────────────────────

export async function signupAction(
  _prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const processingStartedAt = Date.now();
  const name = (formData.get("name") as string)?.trim();
  const googleProfile = await getGoogleRegistrationProfile();

  if (googleProfile) {
    if (!name || name.length < 2 || name.length > 80) {
      return { error: "Name must be between 2 and 80 characters." };
    }

    try {
      const created = await pool.query<{ id: string; name: string; email: string }>(
        `INSERT INTO users (name, email, password_hash, google_sub)
         VALUES ($1, $2, NULL, $3)
         ON CONFLICT DO NOTHING
         RETURNING id, name, email`,
        [name, googleProfile.email, googleProfile.subject]
      );
      let user = created.rows[0];

      if (!user) {
        const sameGoogleAccount = await pool.query<{ id: string; name: string; email: string }>(
          "SELECT id, name, email FROM users WHERE google_sub = $1",
          [googleProfile.subject]
        );
        user = sameGoogleAccount.rows[0];
      }

      if (!user) {
        const linkedAccount = await pool.query<{ id: string; name: string; email: string }>(
          `UPDATE users SET google_sub = $1
           WHERE email = $2 AND google_sub IS NULL
           RETURNING id, name, email`,
          [googleProfile.subject, googleProfile.email]
        );
        user = linkedAccount.rows[0];
      }

      if (!user) {
        await clearGoogleRegistrationTicket();
        redirect(`/login?error=account_exists&email=${encodeURIComponent(googleProfile.email)}`);
      }

      await clearGoogleRegistrationTicket();
      await createSession({ ...user, provider: "google" });
      revalidatePath("/");
      await keepProcessingVisible(processingStartedAt);
      redirect("/dashboard");
    } catch (error) {
      if ((error as { digest?: string })?.digest?.startsWith("NEXT_REDIRECT")) {
        throw error;
      }
      console.error("[signupAction] Google account creation failed:", error);
      return { error: "We couldn't create your account. Please try again." };
    }
  }

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
    if (!newUser) {
      redirect(`/login?error=account_exists&email=${encodeURIComponent(email)}`);
    }
    await createSession(newUser);
    revalidatePath("/");
    await keepProcessingVisible(processingStartedAt);
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
  const processingStartedAt = Date.now();
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
    revalidatePath("/");
    await keepProcessingVisible(processingStartedAt);
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
  const processingStartedAt = Date.now();
  await destroySession();
  revalidatePath("/");
  await keepProcessingVisible(processingStartedAt);
  redirect("/");
}
