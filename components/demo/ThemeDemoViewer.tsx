"use client";

import React, { useState } from "react";
import Link from "next/link";
import type {
  ThemeConfig,
  PageConfig,
  RestaurantData,
  ProductData,
  CategoryData,
  SectionConfig,
} from "@/lib/theme/types";
import { ThemeRenderer } from "@/renderer/ThemeRenderer";
import { mergeTheme } from "@/lib/theme/mergeTheme";

interface ThemeDemoViewerProps {
  initialTheme: ThemeConfig;
  initialPage: PageConfig;
  restaurant: RestaurantData;
  products: ProductData[];
  categories: CategoryData[];
}

export function ThemeDemoViewer({
  initialTheme,
  initialPage,
  restaurant,
  products,
  categories,
}: ThemeDemoViewerProps) {
  // State for active page configuration (allowing live reordering demonstration)
  const [currentPage, setCurrentPage] = useState<PageConfig>(initialPage);

  // State for tenant override presets
  const [activePreset, setActivePreset] = useState<"default" | "emerald" | "indigo">("default");

  // State for showing inspect JSON modal
  const [showJsonModal, setShowJsonModal] = useState<"theme" | "page" | null>(null);

  // Tenant override configurations to demonstrate multi-tenant brand customization
  const tenantOverrides: Record<"default" | "emerald" | "indigo", Partial<ThemeConfig> | null> = {
    default: null,
    emerald: {
      tokens: {
        ...initialTheme.tokens,
        colors: {
          ...initialTheme.tokens.colors,
          primary: "#059669",
          primaryHover: "#047857",
          accent: "#34D399",
          accentBg: "#064E3B",
          badge: "#059669",
        },
      },
    },
    indigo: {
      tokens: {
        ...initialTheme.tokens,
        colors: {
          ...initialTheme.tokens.colors,
          primary: "#6366F1",
          primaryHover: "#4F46E5",
          accent: "#818CF8",
          accentBg: "#1E1B4B",
          badge: "#6366F1",
        },
      },
    },
  };

  const effectiveTheme = mergeTheme(initialTheme, tenantOverrides[activePreset]);

  // Handler to swap Products and Categories sections in JSON array
  const handleSwapProductsAndCategories = () => {
    const sections = [...currentPage.sections];
    const catIdx = sections.findIndex((s) => s.type === "categories");
    const prodIdx = sections.findIndex((s) => s.type === "product-grid");

    if (catIdx !== -1 && prodIdx !== -1) {
      const temp = sections[catIdx];
      sections[catIdx] = sections[prodIdx];
      sections[prodIdx] = temp;
      setCurrentPage({ ...currentPage, sections });
    }
  };

  // Handler to inject an unknown section type to verify graceful degradation
  const handleToggleUnknownSection = () => {
    const exists = currentPage.sections.some((s) => s.type === "mystery-ai-recommendations");
    if (exists) {
      setCurrentPage({
        ...currentPage,
        sections: currentPage.sections.filter(
          (s) => s.type !== "mystery-ai-recommendations"
        ),
      });
    } else {
      const mysterySection: SectionConfig = {
        id: "unknown-section-test",
        type: "mystery-ai-recommendations",
        settings: {
          note: "This section is not in the sectionRegistry to prove graceful fallback.",
        },
      };
      // Insert after hero
      const heroIdx = currentPage.sections.findIndex((s) => s.type === "hero");
      const nextSections = [...currentPage.sections];
      nextSections.splice(heroIdx + 1, 0, mysterySection);
      setCurrentPage({ ...currentPage, sections: nextSections });
    }
  };

  // Reset page to initial JSON order
  const handleResetSections = () => {
    setCurrentPage(initialPage);
  };

  return (
    <div className="relative min-h-screen">
      {/* Floating Demo Control Bar */}
      <aside
        aria-label="Plato Theme Testing Controls"
        className="sticky top-0 z-50 w-full bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800 text-xs text-zinc-200 px-4 py-2.5 shadow-xl transition-all"
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left: Branding & Status */}
          <div className="flex items-center gap-3">
            <Link
              href="/demo"
              className="font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1.5 transition-colors"
            >
              <span>← Themes</span>
            </Link>
            <span className="text-zinc-700">|</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white tracking-tight">
                {effectiveTheme.name}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-400 border border-zinc-700">
                JSON-Driven
              </span>
            </div>
          </div>

          {/* Center: Live Interactive Testing Tools */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Live Reorder Test */}
            <button
              type="button"
              onClick={handleSwapProductsAndCategories}
              title="Test JSON reordering: swaps Categories and Products sections dynamically"
              className="px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold border border-zinc-700 active:scale-95 transition-all cursor-pointer flex items-center gap-1"
            >
              <span>⇄</span>
              <span>Swap Products & Categories</span>
            </button>

            {/* Unknown Section Test */}
            <button
              type="button"
              onClick={handleToggleUnknownSection}
              title="Inject an unsupported section type into JSON to test graceful error handling"
              className={`px-2.5 py-1 rounded-md font-semibold border transition-all cursor-pointer active:scale-95 ${
                currentPage.sections.some((s) => s.type === "mystery-ai-recommendations")
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                  : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700"
              }`}
            >
              <span>⚠️</span>
              <span>
                {currentPage.sections.some((s) => s.type === "mystery-ai-recommendations")
                  ? "Remove Unknown Section"
                  : "Test Unknown Section"}
              </span>
            </button>

            {/* Tenant Color Override Preset Selector */}
            <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded-lg border border-zinc-800">
              <span className="text-[10px] text-zinc-400 px-1.5 font-medium">
                Tenant:
              </span>
              <button
                type="button"
                onClick={() => setActivePreset("default")}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                  activePreset === "default"
                    ? "bg-orange-600 text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Warm Amber
              </button>
              <button
                type="button"
                onClick={() => setActivePreset("emerald")}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                  activePreset === "emerald"
                    ? "bg-emerald-600 text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Emerald
              </button>
              <button
                type="button"
                onClick={() => setActivePreset("indigo")}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                  activePreset === "indigo"
                    ? "bg-indigo-600 text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Indigo
              </button>
            </div>

            {/* Reset */}
            <button
              type="button"
              onClick={handleResetSections}
              className="px-2 py-1 text-[11px] text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer underline"
            >
              Reset
            </button>
          </div>

          {/* Right: Inspect JSON Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowJsonModal(showJsonModal === "theme" ? null : "theme")}
              className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[11px] font-mono font-medium text-zinc-300 border border-zinc-700 cursor-pointer"
            >
              {showJsonModal === "theme" ? "Close" : "theme.json"}
            </button>
            <button
              type="button"
              onClick={() => setShowJsonModal(showJsonModal === "page" ? null : "page")}
              className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[11px] font-mono font-medium text-zinc-300 border border-zinc-700 cursor-pointer"
            >
              {showJsonModal === "page" ? "Close" : "home.json"}
            </button>
          </div>
        </div>

        {/* Modal / Flyout for inspecting JSON */}
        {showJsonModal && (
          <div className="max-w-7xl mx-auto mt-2 p-4 rounded-xl bg-zinc-900 border border-zinc-800 max-h-72 overflow-auto font-mono text-[11px] text-zinc-300">
            <div className="flex items-center justify-between mb-2 text-zinc-400 font-sans font-bold border-b border-zinc-800 pb-1">
              <span>
                Active {showJsonModal === "theme" ? "Theme Tokens & Schema" : "Page Sections Array"}
              </span>
              <button
                type="button"
                onClick={() => setShowJsonModal(null)}
                className="text-xs hover:text-white cursor-pointer"
              >
                ✕ Close
              </button>
            </div>
            <pre className="text-emerald-400 whitespace-pre-wrap">
              {JSON.stringify(
                showJsonModal === "theme" ? effectiveTheme : currentPage,
                null,
                2
              )}
            </pre>
          </div>
        )}
      </aside>

      {/* The Pure Theme Renderer */}
      <ThemeRenderer
        theme={effectiveTheme}
        page={currentPage}
        restaurant={restaurant}
        products={products}
        categories={categories}
      />
    </div>
  );
}
