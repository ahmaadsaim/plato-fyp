"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, AuthState } from "@/app/actions/auth";
import { GoogleAuthControls } from "./GoogleAuthControls";
import { AuthField } from "./AuthField";
import { AuthCard } from "./AuthCard";
import { TextureButton } from "@/components/ui/texture-button";
import { ProcessingScreen } from "@/components/ui/ProcessingScreen";

const initialState: AuthState = {};

export function LoginForm({
  googleError,
  initialEmail,
}: {
  googleError?: string;
  initialEmail?: string;
}) {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <AuthCard
      labelledBy="login-title"
      title="Welcome back"
      description="Log in to manage your stores and keep your business moving."
    >
        {isPending && (
          <ProcessingScreen
            variant="overlay"
            title="Signing you in"
            description="We’re securely connecting you to your Plato workspace."
          />
        )}
        {googleError === "account_exists" && (
          <p role="status" className="rounded-xl border border-amber-300/20 bg-amber-300/10 p-3 text-sm text-amber-100">
            An account already uses this email. Log in to continue.
          </p>
        )}
        <GoogleAuthControls intent="login" error={googleError} />

        <form action={formAction} className="space-y-5" aria-busy={isPending}>
          {state?.error && (
            <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200">
              {state.error}
            </p>
          )}

          <AuthField
            id="email"
            name="email"
            label="Email address"
            type="email"
            required
            defaultValue={initialEmail}
            autoComplete="email"
            placeholder="you@example.com"
          />

          <AuthField
            id="password"
            name="password"
            label="Password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="Enter your password"
          />

          <TextureButton
            type="submit"
            disabled={isPending}
            aria-busy={isPending}
            className="w-full rounded-xl"
            size="lg"
          >
            <span>{isPending ? "Signing you in…" : "Log in"}</span>
          </TextureButton>
        </form>

        <p className="border-t border-white/10 pt-5 text-center text-sm text-zinc-400">
          New to Plato?{" "}
          <Link href="/signup" className="font-semibold text-white underline-offset-4 hover:underline">
            Create an account
          </Link>
        </p>
    </AuthCard>
  );
}
