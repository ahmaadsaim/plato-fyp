import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Palette,
  ExternalLink,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Sliders,
  Layers,
  Smartphone,
  Eye,
} from "lucide-react";
import { getAvailableThemes } from "@/lib/theme/repository";

export const dynamic = "force-dynamic";

export default async function DemoThemesPage() {
  const themes = await getAvailableThemes();
  // Display only the default theme as requested
  const defaultTheme = themes.find((t) => t.id === "modern") || themes[0];

  return (
    <div className="min-h-screen bg-[#F6F6F7] text-zinc-900 font-sans flex flex-col selection:bg-lime-500 selection:text-black">
      {/* Top App Command Bar (Matching Plato Header) */}
      <header className="sticky top-0 z-40 w-full h-14 border-b border-zinc-200 bg-white px-4 sm:px-6 flex items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2 pr-2">
            <div className="w-7 h-7 rounded-lg bg-lime-500 text-black flex items-center justify-center font-black text-sm shadow-2xs">
              P
            </div>
            <span className="font-extrabold text-sm tracking-tight text-zinc-900">
              PLATO
            </span>
          </Link>

          <div className="hidden sm:block h-5 w-[1px] bg-zinc-200" />

          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-600">
            <Link
              href="/dashboard"
              className="hover:text-zinc-900 transition-colors hidden sm:inline"
            >
              Dashboard
            </Link>
            <span className="text-zinc-400 hidden sm:inline">/</span>
            <span className="text-zinc-900 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-lime-600" />
              <span>Theme Gallery</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 hover:text-zinc-900 transition-colors shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
          {defaultTheme && (
            <Link
              href={`/demo/${defaultTheme.id}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-lime-500 hover:bg-lime-400 text-black font-bold transition-colors shadow-xs cursor-pointer"
            >
              <span>Live Preview</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full flex-1">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-lime-100/80 text-lime-800 border border-lime-300 mb-2">
                <span className="w-2 h-2 rounded-full bg-lime-600 animate-pulse" />
                <span>Storefront Presentation Engine</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
                Theme Gallery
              </h1>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1 max-w-2xl">
                Official storefront theme applied to all multi-tenant restaurant websites. Themes are completely driven by JSON configurations and automatically reflect your brand colors, logo, and menu.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-white border border-zinc-200 text-zinc-700 shadow-2xs font-mono">
                {themes.length} Themes Discovered
              </span>
            </div>
          </div>
        </div>

        {/* All Themes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes.map((t) => {
            const isModern = t.id === "modern";
            const primaryColor = t.tokens?.colors?.primary || "#84CC16";
            const accentColor = t.tokens?.colors?.accent || t.tokens?.colors?.secondary || "#18181B";
            const bgColor = t.tokens?.colors?.background || "#FFFFFF";
            const cardColor = t.tokens?.colors?.surfaceCard || t.tokens?.colors?.card || "#FFFFFF";
            const buttonColor = t.tokens?.colors?.button || primaryColor;

            return (
              <div
                key={t.id}
                className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-xs hover:border-zinc-300 hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Theme Header Bar */}
                  <div
                    className="h-28 relative p-4 flex flex-col justify-between overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%)`,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-black/40 text-white backdrop-blur-xs font-mono">
                        v{t.version}
                      </span>
                      {isModern && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-lime-400 text-black shadow-xs">
                          DEFAULT
                        </span>
                      )}
                    </div>
                    <div className="text-white drop-shadow-xs">
                      <h3 className="font-extrabold text-lg leading-tight tracking-tight">
                        {t.name}
                      </h3>
                      <span className="text-[11px] font-mono text-white/80">ID: {t.id}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-4">
                    <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                      {t.description || "A responsive, customizable storefront theme for restaurants."}
                    </p>

                    {/* Color Swatches */}
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1.5 font-mono">
                        Color Tokens
                      </span>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-5 h-5 rounded-full border border-black/10 shadow-2xs"
                          style={{ backgroundColor: primaryColor }}
                          title={`Primary: ${primaryColor}`}
                        />
                        <div
                          className="w-5 h-5 rounded-full border border-black/10 shadow-2xs"
                          style={{ backgroundColor: accentColor }}
                          title={`Accent: ${accentColor}`}
                        />
                        <div
                          className="w-5 h-5 rounded-full border border-black/10 shadow-2xs"
                          style={{ backgroundColor: bgColor }}
                          title={`Background: ${bgColor}`}
                        />
                        <div
                          className="w-5 h-5 rounded-full border border-black/10 shadow-2xs"
                          style={{ backgroundColor: cardColor }}
                          title={`Card: ${cardColor}`}
                        />
                        <div
                          className="w-5 h-5 rounded-full border border-black/10 shadow-2xs"
                          style={{ backgroundColor: buttonColor }}
                          title={`Button: ${buttonColor}`}
                        />
                      </div>
                    </div>

                    {/* Template Mapping */}
                    <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
                      <span>Template:</span>
                      <span className="font-mono font-medium text-zinc-700 bg-zinc-100 px-2 py-0.5 rounded">
                        {t.templates?.home || "restaurant-home"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-4 pt-0 border-t border-zinc-100 flex items-center gap-2">
                  <Link
                    href={`/demo/${t.id}`}
                    className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-lime-500 hover:bg-lime-400 text-black transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Live Preview</span>
                  </Link>
                  <Link
                    href="/dashboard"
                    className="py-2 px-3 rounded-xl text-xs font-semibold border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 transition-colors flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
                    title="Configure in dashboard"
                  >
                    <Sliders className="w-3.5 h-3.5 text-zinc-500" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Informational Architecture Card */}
        <div className="mt-8 p-5 sm:p-6 rounded-2xl border border-zinc-200 bg-white shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700 shrink-0">
              <Layers className="w-5 h-5 text-lime-700" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-zinc-900">
                Multi-Tenant Theme Architecture
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Every tenant storefront is powered by this standardized theme engine. All branding, logos, color palettes, and menu catalogs are injected dynamically per restaurant without code duplication.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard"
            className="px-3.5 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-800 text-xs font-semibold shrink-0 shadow-2xs transition-colors"
          >
            Manage Your Store →
          </Link>
        </div>
      </main>
    </div>
  );
}
