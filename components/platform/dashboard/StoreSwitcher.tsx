"use client";

import React, { useState, useRef, useEffect } from "react";
import { Store, ChevronDown, Plus, Check, ExternalLink } from "lucide-react";
import type { Tenant } from "@/lib/tenant";

interface StoreSwitcherProps {
  tenants: Tenant[];
  selectedTenant: Tenant | null;
  onSelectTenant: (tenant: Tenant | null) => void;
  onOpenCreate: () => void;
  platformDomain: string;
  platformProtocol: string;
}

export function StoreSwitcher({
  tenants,
  selectedTenant,
  onSelectTenant,
  onOpenCreate,
  platformDomain,
  platformProtocol,
}: StoreSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:border-zinc-300 transition-colors cursor-pointer text-left text-xs shadow-2xs"
      >
        <div className="w-5 h-5 rounded bg-lime-50 border border-lime-200 flex items-center justify-center text-lime-700">
          <Store className="w-3 h-3" />
        </div>
        <div className="flex flex-col min-w-[120px] max-w-[180px]">
          <span className="font-semibold text-zinc-900 truncate text-xs">
            {selectedTenant ? selectedTenant.name : "All Restaurants"}
          </span>
          <span className="text-[10px] text-zinc-500 font-mono truncate">
            {selectedTenant ? `${selectedTenant.slug}.${platformDomain}` : `${tenants.length} active stores`}
          </span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-zinc-400 ml-1" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-64 rounded-xl border border-zinc-200 bg-white shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-2.5 py-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            Restaurants ({tenants.length})
          </div>

          <div className="max-h-60 overflow-y-auto space-y-0.5">
            {tenants.map((t) => {
              const isSelected = selectedTenant?.id === t.id;
              const storeUrl = `${platformProtocol}://${t.slug}.${platformDomain}`;

              return (
                <div
                  key={t.id}
                  className={`group flex items-center justify-between px-2.5 py-2 rounded-lg text-xs cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-zinc-100 text-zinc-900 font-semibold"
                      : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900"
                  }`}
                  onClick={() => {
                    onSelectTenant(t);
                    setIsOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isSelected ? "bg-lime-500" : "bg-zinc-300"
                      }`}
                    />
                    <div className="truncate">
                      <p className="truncate font-medium">{t.name}</p>
                      <p className="text-[10px] text-zinc-500 font-mono truncate">
                        {t.slug}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isSelected && <Check className="w-3.5 h-3.5 text-lime-600" />}
                    <a
                      href={storeUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      title="Open storefront"
                      className="text-zinc-400 hover:text-lime-700 p-1 rounded hover:bg-zinc-200/50"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}

            {tenants.length === 0 && (
              <div className="px-3 py-4 text-center text-xs text-zinc-500">
                No restaurants yet
              </div>
            )}
          </div>

          <div className="pt-1 mt-1 border-t border-zinc-100">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenCreate();
              }}
              className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-lime-700 hover:bg-lime-50 transition-colors font-semibold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-lime-600" />
              <span>Add another restaurant</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
