"use client";

import React, { useState, useActionState } from "react";
import Link from "next/link";
import { loginAction, AuthState } from "@/app/actions/auth";
import { Sparkles } from "lucide-react";

const initialState: AuthState = {};

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleFillDemo = () => {
    setEmail("demo@plato.local");
    setPassword("plato123");
  };

  return (
    <main className="min-h-screen bg-[#F6F6F7] text-zinc-900 flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-sm space-y-6 bg-white border border-zinc-200 p-6 sm:p-8 rounded-2xl shadow-xs">
        <div className="text-center space-y-2">
          <Link
            href="/"
            className="w-10 h-10 rounded-xl bg-lime-500 text-black font-black text-lg inline-flex items-center justify-center hover:bg-lime-400 transition-colors cursor-pointer shadow-xs"
          >
            P
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Welcome Back</h1>
          <p className="text-xs text-zinc-500">Log in to manage your restaurants & onboarding</p>
        </div>

        {/* Demo Credentials Quick-Fill Banner */}
        <div className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-lime-700 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-lime-600" />
              Demo Credentials
            </span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[11px] font-semibold text-lime-700 hover:text-lime-800 hover:underline cursor-pointer"
            >
              Auto-fill ⚡
            </button>
          </div>
          <div className="font-mono text-[11px] text-zinc-600 space-y-0.5">
            <p>
              Email: <span className="text-zinc-900 font-semibold">demo@plato.local</span>
            </p>
            <p>
              Password: <span className="text-zinc-900 font-semibold">plato123</span>
            </p>
          </div>
        </div>

        <form action={formAction} className="space-y-4">
          {state?.error && (
            <div className="p-3 text-xs rounded-lg bg-red-50 border border-red-200 text-red-700">
              {state.error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="demo@plato.local"
              className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-zinc-300 text-zinc-900 placeholder-zinc-400 text-xs focus:outline-none focus:border-lime-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-zinc-300 text-zinc-900 placeholder-zinc-400 text-xs focus:outline-none focus:border-lime-500 transition-colors font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2.5 px-4 rounded-lg bg-lime-500 text-black font-bold text-xs hover:bg-lime-400 transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
          >
            {isPending ? "Logging in..." : "Log in to Dashboard"}
          </button>
        </form>

        <p className="text-center text-xs text-zinc-500">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-lime-700 hover:text-lime-800 font-semibold hover:underline cursor-pointer">
            Create account
          </Link>
        </p>
      </div>
    </main>
  );
}
