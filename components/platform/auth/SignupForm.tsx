"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signupAction, AuthState } from "@/app/actions/auth";
import { GoogleAuthControls } from "./GoogleAuthControls";

const initialState: AuthState = {};

export function SignupForm({ googleError }: { googleError?: string }) {
  const [state, formAction, isPending] = useActionState(signupAction, initialState);

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-5 py-12 text-zinc-900">
      <section aria-labelledby="signup-title" className="w-full max-w-sm space-y-6 rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm">
        <header className="space-y-2 text-center">
          <h1 id="signup-title" className="text-2xl font-semibold tracking-tight">Create your account</h1>
          <p className="text-sm text-zinc-500">Set up your store workspace.</p>
        </header>
        <GoogleAuthControls intent="signup" error={googleError} />

        <form action={formAction} className="space-y-4">
          {state?.error && (
            <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {state.error}
            </p>
          )}

          <label className="block space-y-1.5 text-sm font-medium text-zinc-700" htmlFor="name">
            Name
            <input
              id="name"
              name="name"
              type="text"
              required
              minLength={2}
              maxLength={80}
              autoComplete="name"
              placeholder="Your name"
              className="w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
            />
          </label>

          <label className="block space-y-1.5 text-sm font-medium text-zinc-700" htmlFor="email">
            Email
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
            />
          </label>

          <label className="block space-y-1.5 text-sm font-medium text-zinc-700" htmlFor="password">
            Password
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              className="w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
            />
          </label>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:cursor-wait disabled:opacity-60"
          >
            {isPending ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-zinc-900 underline-offset-4 hover:underline">
            Log in
          </Link>
        </p>
      </section>
    </main>
  );
}
