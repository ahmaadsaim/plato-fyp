"use client";

import React, { useState } from "react";
import { Store, ExternalLink, Plus, Copy, Check, Globe, Trash2 } from "lucide-react";
import type { Tenant } from "@/lib/tenant";

interface RestaurantListCardProps {
  tenants: Tenant[];
  onOpenCreate: () => void;
  platformDomain: string;
  platformProtocol: string;
  onNavigateToTab?: (
    tenant: Tenant,
    tab: "restaurant-menu" | "restaurant-theme" | "restaurant-details"
  ) => void;
  onRequestDelete?: (tenant: Tenant) => void;
}

export function RestaurantListCard({
  tenants,
  onOpenCreate,
  platformDomain,
  platformProtocol,
  onNavigateToTab,
  onRequestDelete,
}: RestaurantListCardProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, url: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-zinc-200 bg-white p-5 sm:p-7 shadow-xs space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-zinc-900 tracking-tight flex items-center gap-2">
            <Store className="w-4 h-4 text-lime-600" />
            <span>My Restaurants</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-zinc-100 border border-zinc-200 text-zinc-700 font-semibold">
              {tenants.length}
            </span>
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Active multi-tenant storefronts connected to your Plato account
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenCreate}
          className="px-3.5 py-1.5 rounded-lg bg-lime-500 hover:bg-lime-400 text-black font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Restaurant</span>
        </button>
      </div>

      {tenants.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 p-8 text-center space-y-3 bg-zinc-50">
          <div className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-400 mx-auto shadow-2xs">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-800">No restaurants created yet</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Get started by creating your first restaurant below.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenCreate}
            className="px-4 py-2 rounded-lg bg-lime-500 hover:bg-lime-400 text-black font-bold text-xs transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create First Restaurant</span>
          </button>
        </div>
      ) : (
        <div className="grid gap-3">
          {tenants.map((tenant) => {
            const tenantUrl = `${platformProtocol}://${tenant.slug}.${platformDomain}`;
            const isCopied = copiedId === tenant.id;

            return (
              <div
                key={tenant.id}
                className="flex flex-col lg:flex-row lg:items-center justify-between p-4 rounded-xl border border-zinc-200 bg-zinc-50/80 hover:bg-white hover:border-zinc-300 transition-colors gap-3.5"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-lime-700 flex-shrink-0 shadow-2xs font-bold text-sm">
                    {tenant.name[0] || "R"}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-zinc-900 text-xs sm:text-sm truncate">
                        {tenant.name}
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-lime-100 border border-lime-300 text-lime-800">
                        LIVE
                      </span>
                    </div>
                    <span className="block text-[11px] text-zinc-500 font-mono truncate mt-0.5">
                      {tenantUrl}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  {onNavigateToTab && (
                    <>
                      <button
                        type="button"
                        onClick={() => onNavigateToTab(tenant, "restaurant-menu")}
                        className="px-2.5 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 font-semibold text-xs transition-colors shadow-2xs cursor-pointer flex items-center gap-1"
                      >
                        <span>Menu</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onNavigateToTab(tenant, "restaurant-theme")}
                        className="px-2.5 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 font-semibold text-xs transition-colors shadow-2xs cursor-pointer flex items-center gap-1"
                      >
                        <span>Theme</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onNavigateToTab(tenant, "restaurant-details")}
                        className="px-2.5 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 font-semibold text-xs transition-colors shadow-2xs cursor-pointer flex items-center gap-1"
                      >
                        <span>Details</span>
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => handleCopy(tenant.id, tenantUrl)}
                    className="p-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer text-xs flex items-center gap-1 shadow-2xs"
                    title="Copy URL"
                  >
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5 text-lime-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <a
                    href={tenantUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-lime-500 hover:bg-lime-400 text-black font-bold text-xs transition-colors flex items-center gap-1.5 shadow-2xs flex-shrink-0"
                  >
                    <span>Open Store</span>
                    <ExternalLink className="w-3 h-3 text-black" />
                  </a>

                  {onRequestDelete && (
                    <button
                      type="button"
                      onClick={() => onRequestDelete(tenant)}
                      className="p-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-red-50 text-zinc-400 hover:text-red-600 transition-colors cursor-pointer text-xs flex items-center shadow-2xs"
                      title={`Delete ${tenant.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
