"use client";

import React, { useState, useTransition } from "react";
import { User } from "@/lib/auth";
import { Tenant } from "@/lib/tenant";
import { logoutAction } from "@/app/actions/auth";
import { createTenantAction } from "@/app/actions/tenant";

interface DashboardViewProps {
  user: User;
  initialTenants: Tenant[];
  platformDomain: string;
  platformProtocol: "http" | "https";
}

export function DashboardView({
  user,
  initialTenants,
  platformDomain,
  platformProtocol,
}: DashboardViewProps) {
  const [tenants, setTenants] = useState<Tenant[]>(initialTenants);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [createdTenant, setCreatedTenant] = useState<{
    name: string;
    slug: string;
    url: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleCreateTenant = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("name", nameInput);

    startTransition(async () => {
      const result = await createTenantAction(null, formData);
      if (result.error) {
        setErrorMessage(result.error);
      } else if (result.tenant) {
        const newT: Tenant = {
          id: result.tenant.id,
          user_id: user.id,
          name: result.tenant.name,
          slug: result.tenant.slug,
          created_at: new Date().toISOString(),
        };
        setTenants((prev) => [newT, ...prev.filter((t) => t.id !== newT.id)]);
        setCreatedTenant(result.tenant);
        setNameInput("");
        setShowCreateForm(false);
      }
    });
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-start p-6 sm:p-12">
      <div className="w-full max-w-xl space-y-8">
        {/* Top bar: Welcome & Logout */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Welcome, {user.name}
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">{user.email}</p>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-xs px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Log out
            </button>
          </form>
        </div>

        {/* Recently Created Tenant Success Banner */}
        {createdTenant && (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-400">
                ✓ Restaurant Created Successfully
              </span>
              <button
                type="button"
                onClick={() => setCreatedTenant(null)}
                className="text-xs text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div>
              <p className="text-sm font-bold text-white">{createdTenant.name}</p>
              <p className="text-xs text-emerald-300/80 font-mono mt-0.5">
                {createdTenant.url}
              </p>
            </div>
            <div>
              <a
                href={createdTenant.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 transition-colors shadow-sm"
              >
                Open Restaurant ↗
              </a>
            </div>
          </div>
        )}

        {/* Create Restaurant Form (Collapsible/Inline) */}
        {showCreateForm && (
          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/70 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Create Restaurant</h3>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="text-xs text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
            </div>

            {errorMessage && (
              <div className="p-2.5 text-xs rounded-lg bg-red-950/60 border border-red-800 text-red-300">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleCreateTenant} className="space-y-3">
              <div>
                <label htmlFor="restaurant-name" className="block text-xs font-medium text-zinc-300 mb-1">
                  Restaurant Name
                </label>
                <input
                  id="restaurant-name"
                  type="text"
                  required
                  autoFocus
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="e.g. Pizza House"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-600"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending || !nameInput.trim()}
                  className="px-4 py-1.5 rounded-lg bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isPending ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Restaurants Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Your Restaurants</h2>
            {!showCreateForm && (
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(true);
                  setErrorMessage(null);
                }}
                className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white text-zinc-950 hover:bg-zinc-200 transition-colors shadow-sm cursor-pointer"
              >
                + Create Restaurant
              </button>
            )}
          </div>

          {tenants.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-800 p-8 text-center space-y-4 bg-zinc-900/40">
              <p className="text-sm text-zinc-400">No restaurants yet</p>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(true);
                  setErrorMessage(null);
                }}
                className="inline-flex items-center gap-1 text-xs font-semibold px-4 py-2 rounded-lg bg-white text-zinc-950 hover:bg-zinc-200 transition-colors cursor-pointer"
              >
                + Create Restaurant
              </button>
            </div>
          ) : (
            <div className="grid gap-3">
              {tenants.map((tenant) => {
                const tenantUrl = `${platformProtocol}://${tenant.slug}.${platformDomain}`;
                return (
                  <div
                    key={tenant.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 transition-colors gap-3"
                  >
                    <div>
                      <span className="font-semibold text-white block">
                        {tenant.name}
                      </span>
                      <span className="block text-xs text-zinc-400 font-mono mt-0.5">
                        {tenantUrl}
                      </span>
                    </div>
                    <div>
                      <a
                        href={tenantUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-white text-zinc-950 hover:bg-zinc-200 transition-colors shadow-sm"
                      >
                        Open Restaurant ↗
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
