import React from "react";
import Link from "next/link";
import { User } from "@/lib/auth";

interface PlatformLandingProps {
  user: User | null;
}

export function PlatformLanding({ user }: PlatformLandingProps) {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md text-center space-y-8">
        <div className="space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 text-3xl mb-2 shadow-sm">
            🍽️
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white">
            Restaurant Platform
          </h1>
          <p className="text-sm text-zinc-400">
            Simple Multi-Tenant SaaS Foundation
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          {user ? (
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold bg-white text-zinc-900 hover:bg-zinc-200 transition-colors shadow-sm text-center cursor-pointer"
            >
              Go to Dashboard ({user.name}) →
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 transition-colors text-center cursor-pointer"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold bg-white text-zinc-900 hover:bg-zinc-200 transition-colors shadow-sm text-center cursor-pointer"
              >
                Create Account
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
