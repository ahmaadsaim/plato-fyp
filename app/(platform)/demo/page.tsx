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
                1 Default Theme Active
              </span>
            </div>
          </div>
        </div>

        {/* Featured Default Theme Card */}
        {defaultTheme ? (
          <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-xs hover:border-zinc-300 transition-all">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* Left / Top: Theme Preview Image */}
              <div className="lg:col-span-7 relative aspect-[16/10] bg-zinc-950 overflow-hidden border-b lg:border-b-0 lg:border-r border-zinc-200 group">
                {defaultTheme.previewImage ? (
                  <Image
                    src={defaultTheme.previewImage}
                    alt={defaultTheme.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover group-hover:scale-102 transition-transform duration-500"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-500">
                    Storefront Theme Preview
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Overlays on Preview */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-lime-500 text-black shadow-xs">
                    DEFAULT THEME
                  </span>
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-black/60 text-white backdrop-blur-md border border-white/10">
                    v{defaultTheme.version}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                  <div>
                    <span className="text-xs font-medium text-zinc-300 block">Active Layout</span>
                    <span className="text-sm font-bold tracking-tight">Responsive Multi-Tenant Storefront</span>
                  </div>
                  <Link
                    href={`/demo/${defaultTheme.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 hover:bg-white text-zinc-950 text-xs font-bold transition-colors shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Open Demo</span>
                  </Link>
                </div>
              </div>

              {/* Right: Theme Specification & Actions */}
              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="text-xl font-bold text-zinc-900 tracking-tight flex items-center gap-2">
                        <span>{defaultTheme.name}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-lime-100 text-lime-800 border border-lime-300">
                          Active
                        </span>
                      </h2>
                      <span className="text-xs font-mono text-zinc-400">ID: {defaultTheme.id}</span>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-600 leading-relaxed">
                    {defaultTheme.description}
                  </p>

                  {/* Core Features */}
                  <div className="space-y-2 pt-2 border-t border-zinc-100">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block font-mono">
                      Theme Customization Features
                    </span>
                    <ul className="space-y-1.5 text-xs text-zinc-700">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-lime-600 shrink-0" />
                        <span><strong>Button & Card Colors</strong>: Custom action button & card surface backgrounds</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-lime-600 shrink-0" />
                        <span><strong>Background & Text</strong>: Dynamic body text & page background colors</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-lime-600 shrink-0" />
                        <span><strong>Primary & Secondary</strong>: Brand accents & secondary surfaces</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-lime-600 shrink-0" />
                        <span><strong>Font Styles</strong>: Modern Sans, Elegant Serif, Bold Display & Sleek Geometric</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-lime-600 shrink-0" />
                        <span><strong>Animations Option</strong>: Subtle & Smooth, Bouncy & Energetic, or Clean & Instant</span>
                      </li>
                    </ul>
                  </div>

                  {/* Swatches */}
                  <div className="pt-2 border-t border-zinc-100">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-2 font-mono">
                      Default Color Tokens
                    </span>
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-6 h-6 rounded-full border border-black/10 shadow-2xs"
                        style={{ backgroundColor: defaultTheme.tokens.colors.primary }}
                        title={`Primary: ${defaultTheme.tokens.colors.primary}`}
                      />
                      <div
                        className="w-6 h-6 rounded-full border border-black/10 shadow-2xs"
                        style={{ backgroundColor: defaultTheme.tokens.colors.accent }}
                        title={`Accent: ${defaultTheme.tokens.colors.accent}`}
                      />
                      <div
                        className="w-6 h-6 rounded-full border border-black/10 shadow-2xs"
                        style={{ backgroundColor: defaultTheme.tokens.colors.background }}
                        title={`Background: ${defaultTheme.tokens.colors.background}`}
                      />
                      <div
                        className="w-6 h-6 rounded-full border border-black/10 shadow-2xs"
                        style={{ backgroundColor: defaultTheme.tokens.colors.surfaceCard }}
                        title={`Surface: ${defaultTheme.tokens.colors.surfaceCard}`}
                      />
                      <span className="text-[11px] text-zinc-500 font-mono ml-1">
                        Customizable in onboarding
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 border-t border-zinc-100 flex flex-col sm:flex-row gap-2.5">
                  <Link
                    href={`/demo/${defaultTheme.id}`}
                    className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-lime-500 hover:bg-lime-400 text-black transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <span>Inspect Live Demo</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/dashboard"
                    className="py-2.5 px-4 rounded-xl text-xs font-semibold border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-800 transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Sliders className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Customize in Dashboard</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-zinc-200 p-8 text-center text-zinc-500">
            No default theme found in registry.
          </div>
        )}

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
