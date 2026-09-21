import React from "react";
import { Tenant } from "@/lib/tenant";

interface TenantWebsiteProps {
  tenant: Tenant;
}

export function TenantWebsite({ tenant }: TenantWebsiteProps) {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-sm p-8 text-center space-y-6 shadow-2xl">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-800/80 border border-zinc-700/60 text-3xl shadow-inner">
          🍕
        </div>

        <div className="space-y-2">
          <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wide uppercase">
            Public Tenant
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            {tenant.name}
          </h1>
        </div>

        <div className="pt-4 border-t border-zinc-800 text-sm text-zinc-300 space-y-1.5 leading-relaxed">
          <p className="font-medium text-zinc-200">This is a tenant</p>
          <p className="text-zinc-400">
            Tenant name: <span className="text-white font-semibold">{tenant.name}</span>
          </p>
          <p className="font-mono text-xs text-zinc-500 pt-1">
            slug: {tenant.slug}
          </p>
        </div>
      </div>
    </main>
  );
}
