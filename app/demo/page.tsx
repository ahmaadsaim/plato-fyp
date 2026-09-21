import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getAvailableThemes } from "@/lib/theme/repository";

export const dynamic = "force-dynamic";

export default async function DemoThemesPage() {
  const themes = await getAvailableThemes();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      {/* Top Banner */}
      <header className="border-b border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 font-black text-lg tracking-tight hover:opacity-80 transition-opacity"
            >
              <span className="text-xl">⚡</span>
              <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
                Plato Engine
              </span>
            </Link>
            <span className="text-zinc-600">/</span>
            <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
              Theme Browser
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <Link
              href="/"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              ← Architecture Overview
            </Link>
            <Link
              href="/demo/modern"
              className="px-3.5 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition-colors shadow-sm"
            >
              Quick Launch Modern →
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Intro */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-zinc-900 text-zinc-300 border border-zinc-800 mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Multi-Tenant Restaurant SaaS • Theme Registry</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
            Available Restaurant Themes
          </h1>
          <p className="text-base text-zinc-400 leading-relaxed">
            Select a theme to inspect its rendering behavior. Themes are completely driven by JSON configurations,
            decoupled from hardcoded templates, and ready for future database-backed multi-tenant overrides.
          </p>
        </div>

        {/* Themes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {themes.map((theme) => (
            <div
              key={theme.id}
              className="group flex flex-col bg-zinc-900/90 rounded-2xl border border-zinc-800 overflow-hidden hover:border-zinc-700 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              {/* Preview Thumbnail */}
              <div className="relative w-full aspect-[16/10] bg-zinc-950 overflow-hidden">
                {theme.previewImage ? (
                  <Image
                    src={theme.previewImage}
                    alt={theme.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-600">
                    No Preview
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />

                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-black/70 text-zinc-300 backdrop-blur-md border border-white/10">
                    v{theme.version}
                  </span>
                </div>
              </div>

              {/* Theme Details */}
              <div className="p-6 flex flex-col flex-1 justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white tracking-tight">
                      {theme.name}
                    </h2>
                    <span className="text-xs font-mono text-zinc-500">
                      ID: {theme.id}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                    {theme.description}
                  </p>

                  {/* Tags */}
                  {theme.tags && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {theme.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700/50"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Token Color Palette Preview */}
                  <div className="pt-2">
                    <span className="text-[11px] uppercase font-bold text-zinc-500 tracking-wider block mb-2">
                      Design Token Swatches
                    </span>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: theme.tokens.colors.primary }}
                        title={`Primary: ${theme.tokens.colors.primary}`}
                      />
                      <div
                        className="w-6 h-6 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: theme.tokens.colors.accent }}
                        title={`Accent: ${theme.tokens.colors.accent}`}
                      />
                      <div
                        className="w-6 h-6 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: theme.tokens.colors.background }}
                        title={`Background: ${theme.tokens.colors.background}`}
                      />
                      <div
                        className="w-6 h-6 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: theme.tokens.colors.surfaceCard }}
                        title={`Surface: ${theme.tokens.colors.surfaceCard}`}
                      />
                      <span className="text-xs text-zinc-400 font-mono ml-2">
                        {theme.tokens.typography.fontFamily.split(",")[0]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Launch Button */}
                <div className="pt-4 border-t border-zinc-800/80">
                  <Link
                    href={`/demo/${theme.id}`}
                    className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white transition-all duration-200 shadow-md active:scale-95"
                  >
                    <span>View Theme ({theme.name})</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {/* Placeholder Card for Future Themes */}
          <div className="rounded-2xl border border-dashed border-zinc-800 p-8 flex flex-col items-center justify-center text-center gap-3 bg-zinc-900/30">
            <span className="text-3xl text-zinc-600">➕</span>
            <h3 className="text-sm font-bold text-zinc-400">
              Future Themes Extensibility
            </h3>
            <p className="text-xs text-zinc-500 max-w-xs">
              Add new folders under <code>themes/classic</code> or <code>themes/minimal</code> with a <code>theme.json</code> and <code>pages/home.json</code> to automatically display here.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
