"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signupAction, AuthState } from "@/app/actions/auth";
import { GoogleAuthControls } from "./GoogleAuthControls";
import { AuthField } from "./AuthField";
import { AuthCard } from "./AuthCard";
import { TextureButton } from "@/components/ui/texture-button";
import { ProcessingScreen } from "@/components/ui/ProcessingScreen";

const initialState: AuthState = {};

export function SignupForm({
  googleError,
  googleRegistration,
}: {
  googleError?: string;
  googleRegistration?: { name: string; email: string };
}) {
  const [state, formAction, isPending] = useActionState(signupAction, initialState);

  return (
    <AuthCard
      labelledBy="signup-title"
      title={googleRegistration ? "Finish setting up your account" : "Create your account"}
      description={
        googleRegistration
          ? "Your Google account is verified. Add your name and confirm the email below to get started."
          : "Set up your Plato workspace and bring your store online."
      }
      step={googleRegistration ? "Profile · 1 of 1" : undefined}
    >
        {isPending && (
          <ProcessingScreen
            variant="overlay"
            title="Creating your account"
            description="We’re securely setting up your Plato workspace."
          />
        )}
        {!googleRegistration && (
          <GoogleAuthControls intent="signup" error={googleError} />
        )}

        <form action={formAction} className="space-y-5" aria-busy={isPending}>
          {state?.error && (
            <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200">
              {state.error}
            </p>
          )}

          <AuthField
            id="name"
            name="name"
            label="Name"
            type="text"
            required
            minLength={2}
            maxLength={80}
            defaultValue={googleRegistration?.name}
            autoComplete="name"
            placeholder="Your name"
          />

          {googleRegistration ? (
            <AuthField
              id="google-email"
              name="email"
              label="Email address"
              type="email"
              value={googleRegistration.email}
              readOnly
              verified
              autoComplete="email"
              aria-readonly="true"
            />
          ) : (
            <AuthField
              id="email"
              name="email"
              label="Email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
            />
          )}

          {!googleRegistration && (
            <AuthField
              id="password"
              name="password"
              label="Password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="At least 8 characters"
            />
          )}

          <TextureButton
            type="submit"
            disabled={isPending}
            aria-busy={isPending}
            className="w-full rounded-xl"
            size="lg"
          >
            <span>{isPending ? "Creating your account…" : googleRegistration ? "Create my account" : "Create account"}</span>
          </TextureButton>
        </form>

        {!googleRegistration && (
          <p className="border-t border-white/10 pt-5 text-center text-sm text-zinc-400">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-white underline-offset-4 hover:underline">
              Log in
            </Link>
          </p>
        )}
    </AuthCard>
  );
}
