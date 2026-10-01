"use client";

import React, { useState, useTransition } from "react";
import {
  Trash2,
  AlertTriangle,
  Lock,
  Eye,
  EyeOff,
  X,
} from "lucide-react";
import type { Tenant } from "@/lib/tenant";
import { deleteTenantAction } from "@/app/actions/tenant";

interface DeleteRestaurantModalProps {
  tenant: Tenant;
  platformDomain: string;
  onClose: () => void;
  onSuccess: (deletedTenant: Tenant) => void;
}

export function DeleteRestaurantModal({
  tenant,
  platformDomain,
  onClose,
  onSuccess,
}: DeleteRestaurantModalProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("Please enter your account password to confirm deletion.");
      return;
    }
    setError(null);

    startTransition(async () => {
      const result = await deleteTenantAction(tenant.slug, password);
      if (!result.success) {
        setError(result.error || "Failed to delete restaurant. Check password.");
      } else {
        onSuccess(tenant);
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-zinc-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 border border-red-200 flex items-center justify-center text-red-600 flex-shrink-0">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900">
                Delete Restaurant
              </h3>
              <p className="text-xs text-zinc-500 font-mono">
                {tenant.slug}.{platformDomain}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-700 text-xs cursor-pointer p-1 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Warning Callout */}
        <div className="p-3.5 rounded-xl bg-red-50/70 border border-red-200 text-xs text-red-900 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-red-800">
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>Permanent Deletion Warning</span>
          </div>
          <p className="text-[11px] leading-relaxed text-red-700">
            Are you sure you want to delete <strong className="text-red-900">{tenant.name}</strong>?
            This will permanently erase its menu catalog, live storefront URL, and configuration. This action cannot be reversed.
          </p>
        </div>

        {error && (
          <div className="p-3 text-xs rounded-xl bg-red-100/80 border border-red-300 text-red-800 font-medium">
            {error}
          </div>
        )}

        {/* Password Confirmation Form */}
        <form onSubmit={handleDelete} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-zinc-500" />
                <span>Confirm with Account Password</span>
              </span>
              <span className="text-[10px] text-zinc-400 font-normal">
                Required for security
              </span>
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your account password"
                className="w-full pl-3.5 pr-10 py-2.5 rounded-lg bg-zinc-50 border border-zinc-300 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-red-500 focus:bg-white transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-3.5 h-3.5" />
                ) : (
                  <Eye className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-zinc-300 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || !password.trim()}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isPending ? "Verifying & Deleting..." : "Confirm Deletion"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
