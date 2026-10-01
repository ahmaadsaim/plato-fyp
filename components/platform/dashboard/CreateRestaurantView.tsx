"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { createTenantAction, saveTenantCustomizationAction } from "@/app/actions/tenant";
import { UploadCloud, Image as ImageIcon, X, ArrowLeft, Store } from "lucide-react";

export function CreateRestaurantView() {
  const [name, setName] = useState("");
  const [logo, setLogo] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [createdTenant, setCreatedTenant] = useState<{
    name: string;
    slug: string;
    url: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      alert("Logo file size must be less than 3MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setLogo(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

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
        if (logo) {
          await saveTenantCustomizationAction(res.tenant.slug, {
            name: res.tenant.name,
            logo,
          });
        }
        setCreatedTenant(res.tenant);
      }
    });
  };

  return (
    <main className="min-h-screen bg-[#F6F6F7] text-zinc-900 flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md space-y-6">
        <div>
          <Link
            href="/dashboard"
            className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors inline-flex items-center gap-1.5 mb-3 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lime-500 text-black flex items-center justify-center font-black text-lg shadow-2xs">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-zinc-900">
                Create Restaurant
              </h1>
              <p className="text-xs text-zinc-500">
                Set up a new isolated multi-tenant restaurant instance
              </p>
            </div>
          </div>
        </div>

        {createdTenant ? (
          <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 text-lime-700 font-bold text-xs">
              <span className="w-2 h-2 rounded-full bg-lime-500 animate-pulse" />
              <span>Restaurant Created Successfully</span>
            </div>
            {logo && (
              <div className="w-16 h-16 rounded-xl border border-zinc-200 p-1 flex items-center justify-center">
                <img src={logo} alt={createdTenant.name} className="w-full h-full object-contain" />
              </div>
            )}
            <div>
              <p className="text-base font-bold text-zinc-900">{createdTenant.name}</p>
              <p className="text-xs text-lime-700 font-mono mt-0.5">{createdTenant.url}</p>
            </div>
            <div className="flex gap-2 pt-2">
              <a
                href={createdTenant.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold px-4 py-2 rounded-lg bg-lime-500 hover:bg-lime-400 text-black transition-colors cursor-pointer shadow-xs"
              >
                Open Live Store ↗
              </a>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1 text-xs font-semibold px-4 py-2 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-800 transition-colors cursor-pointer shadow-2xs"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-5">
            {error && (
              <div className="p-3 text-xs rounded-lg bg-red-50 border border-red-200 text-red-700">
                {error}
              </div>
            )}

            <div>
              <label
                className="block text-xs font-semibold text-zinc-700 mb-1.5"
                htmlFor="name"
              >
                Restaurant Name <span className="text-lime-600">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Hearth & Stone Pizzeria"
                className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-zinc-300 text-zinc-900 placeholder-zinc-400 text-xs focus:outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-500 transition-colors"
              />
            </div>

            {/* Logo Upload in Create View */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-zinc-700 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-lime-600" />
                  <span>Restaurant Logo (Optional)</span>
                </span>
                <span className="text-[10px] text-zinc-400 font-normal">PNG, JPG, SVG</span>
              </label>

              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs relative group">
                  {logo ? (
                    <>
                      <img src={logo} alt="Logo preview" className="w-full h-full object-contain p-1" />
                      <button
                        type="button"
                        onClick={() => setLogo("")}
                        className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <UploadCloud className="w-5 h-5 text-zinc-400" />
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <label className="px-3 py-1.5 rounded-lg bg-white border border-zinc-300 hover:border-zinc-400 text-xs font-semibold text-zinc-800 cursor-pointer shadow-2xs inline-flex items-center gap-1.5 transition-colors">
                    <UploadCloud className="w-3.5 h-3.5 text-lime-600" />
                    <span>{logo ? "Replace Logo" : "Upload Logo"}</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                  {logo && (
                    <button
                      type="button"
                      onClick={() => setLogo("")}
                      className="text-xs text-red-600 hover:text-red-700 font-medium ml-2 cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending || !name.trim()}
              className="w-full py-2.5 px-4 rounded-lg bg-lime-500 hover:bg-lime-400 text-black font-bold text-xs transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {isPending ? "Creating Restaurant..." : "Create Restaurant Instance"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
