"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { createTenantAction } from "@/app/actions/tenant";

export function CreateRestaurantView() {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [createdTenant, setCreatedTenant] = useState<{
    name: string;
    slug: string;
    url: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData();
    formData.append("name", name);

    startTransition(async () => {
      const res = await createTenantAction(null, formData);
      if (res.error) {
        setError(res.error);
      } else if (res.tenant) {
        setCreatedTenant(res.tenant);
      }
    });
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1">
          <Link
            href="/dashboard"
            className="text-xs text-zinc-400 hover:text-white transition-colors inline-block mb-2 cursor-pointer"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Create Restaurant
          </h1>
          <p className="text-xs text-zinc-400">
            Set up a new restaurant tenant
          </p>
        </div>

        {createdTenant ? (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800 space-y-3">
            <span className="text-xs font-semibold text-emerald-400 block">
              ✓ Restaurant Created Successfully
            </span>
            <p className="text-sm font-bold text-white">{createdTenant.name}</p>
            <p className="text-xs text-emerald-300 font-mono">{createdTenant.url}</p>
            <div className="flex gap-2 pt-2">
              <a
                href={createdTenant.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 transition-colors cursor-pointer"
              >
                Open Restaurant ↗
              </a>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-xs rounded-lg bg-red-950/60 border border-red-800 text-red-300">
                {error}
              </div>
            )}

            <div>
              <label
                className="block text-xs font-medium text-zinc-300 mb-1"
                htmlFor="name"
              >
                Restaurant Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Pizza House"
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-600"
              />
            </div>

            <button
              type="submit"
              disabled={isPending || !name.trim()}
              className="w-full py-2.5 px-4 rounded-lg bg-white text-zinc-950 font-semibold text-sm hover:bg-zinc-200 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isPending ? "Creating restaurant..." : "Create Restaurant"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
