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
import { ThemeRenderer } from "@/themes/engine/ThemeRenderer";
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

  // State for tenant override presets & custom theme controls
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [customColors, setCustomColors] = useState({
    button: initialTheme.tokens.colors.button || initialTheme.tokens.colors.primary || "#E05A2B",
    card: initialTheme.tokens.colors.card || initialTheme.tokens.colors.surfaceCard || "#1E222B",
    background: initialTheme.tokens.colors.background || "#0D0F12",
    text: initialTheme.tokens.colors.text || "#F8FAFC",
    primary: initialTheme.tokens.colors.primary || "#E05A2B",
    secondary: initialTheme.tokens.colors.secondary || "#1A1A1A",
  });
  const [customFontStyle, setCustomFontStyle] = useState<string>("sans");
  const [customAnimation, setCustomAnimation] = useState<string>("smooth");

  // State for showing inspect JSON modal
  const [showJsonModal, setShowJsonModal] = useState<"theme" | "page" | null>(null);

  // Compute effective theme with live customization overrides
  const effectiveTheme: ThemeConfig = React.useMemo(() => {
    let fontVal = initialTheme.tokens.typography.fontFamily;
    if (customFontStyle === "serif") {
      fontVal = "Georgia, 'Playfair Display', Cambria, serif";
    } else if (customFontStyle === "display") {
      fontVal = "'Outfit', 'Montserrat', sans-serif";
    } else if (customFontStyle === "geometric") {
      fontVal = "'Plus Jakarta Sans', system-ui, sans-serif";
    }

    return {
      ...initialTheme,
      name: "Plato Default",
      tokens: {
        ...initialTheme.tokens,
        colors: {
          ...initialTheme.tokens.colors,
          primary: customColors.primary,
          primaryHover: customColors.primary,
          secondary: customColors.secondary,
          button: customColors.button,
          buttonHover: customColors.button,
          buttonText: "#FFFFFF",
          card: customColors.card,
          surfaceCard: customColors.card,
          surface: customColors.card,
          background: customColors.background,
          text: customColors.text,
        },
        typography: {
          ...initialTheme.tokens.typography,
          fontFamily: fontVal,
          headingFont: fontVal,
        },
      },
    };
  }, [initialTheme, customColors, customFontStyle]);

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

            {/* Live Customizer Toggle Button */}
            <button
              type="button"
              onClick={() => setShowCustomizer(!showCustomizer)}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                showCustomizer
                  ? "bg-lime-500 text-black ring-2 ring-lime-400"
                  : "bg-zinc-800 hover:bg-zinc-700 text-lime-400 border border-zinc-700"
              }`}
            >
              <span>🎨</span>
              <span>Customize Plato Default</span>
            </button>

            {/* Reset */}
            <button
              type="button"
              onClick={() => {
                handleResetSections();
                setCustomColors({
                  button: initialTheme.tokens.colors.button || initialTheme.tokens.colors.primary || "#E05A2B",
                  card: initialTheme.tokens.colors.card || initialTheme.tokens.colors.surfaceCard || "#1E222B",
                  background: initialTheme.tokens.colors.background || "#0D0F12",
                  text: initialTheme.tokens.colors.text || "#F8FAFC",
                  primary: initialTheme.tokens.colors.primary || "#E05A2B",
                  secondary: initialTheme.tokens.colors.secondary || "#1A1A1A",
                });
                setCustomFontStyle("sans");
                setCustomAnimation("smooth");
              }}
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

        {/* Live Theme Customizer Flyout */}
        {showCustomizer && (
          <div className="max-w-7xl mx-auto mt-3 p-4 sm:p-5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl text-zinc-100 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-lime-500 animate-pulse" />
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Plato Default Live Customization Controls
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCustomizer(false)}
                className="text-xs text-zinc-400 hover:text-white px-2 py-1 rounded bg-zinc-800 cursor-pointer"
              >
                ✕ Close Panel
              </button>
            </div>

            {/* Controls Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 1. Button Color */}
              <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-200">Button Color</label>
                  <span className="text-[10px] text-lime-400 font-mono">CTAs & Cart</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={customColors.button}
                    onChange={(e) => setCustomColors((c) => ({ ...c, button: e.target.value }))}
                    className="w-8 h-8 rounded border border-zinc-700 bg-transparent cursor-pointer shrink-0"
                  />
                  <input
                    type="text"
                    value={customColors.button}
                    onChange={(e) => setCustomColors((c) => ({ ...c, button: e.target.value }))}
                    className="w-full px-2 py-1 rounded bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-200 uppercase"
                  />
                </div>
              </div>

              {/* 2. Card Color */}
              <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-200">Card Color</label>
                  <span className="text-[10px] text-zinc-400 font-mono">Surfaces</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={customColors.card}
                    onChange={(e) => setCustomColors((c) => ({ ...c, card: e.target.value }))}
                    className="w-8 h-8 rounded border border-zinc-700 bg-transparent cursor-pointer shrink-0"
                  />
                  <input
                    type="text"
                    value={customColors.card}
                    onChange={(e) => setCustomColors((c) => ({ ...c, card: e.target.value }))}
                    className="w-full px-2 py-1 rounded bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-200 uppercase"
                  />
                </div>
              </div>

              {/* 3. Background Color */}
              <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-200">Background Color</label>
                  <span className="text-[10px] text-zinc-400 font-mono">Page Canvas</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={customColors.background}
                    onChange={(e) => setCustomColors((c) => ({ ...c, background: e.target.value }))}
                    className="w-8 h-8 rounded border border-zinc-700 bg-transparent cursor-pointer shrink-0"
                  />
                  <input
                    type="text"
                    value={customColors.background}
                    onChange={(e) => setCustomColors((c) => ({ ...c, background: e.target.value }))}
                    className="w-full px-2 py-1 rounded bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-200 uppercase"
                  />
                </div>
              </div>

              {/* 4. Text Color */}
              <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-200">Text Color</label>
                  <span className="text-[10px] text-zinc-400 font-mono">Headings</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={customColors.text}
                    onChange={(e) => setCustomColors((c) => ({ ...c, text: e.target.value }))}
                    className="w-8 h-8 rounded border border-zinc-700 bg-transparent cursor-pointer shrink-0"
                  />
                  <input
                    type="text"
                    value={customColors.text}
                    onChange={(e) => setCustomColors((c) => ({ ...c, text: e.target.value }))}
                    className="w-full px-2 py-1 rounded bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-200 uppercase"
                  />
                </div>
              </div>

              {/* 5. Primary Color */}
              <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-200">Primary Color</label>
                  <span className="text-[10px] text-zinc-400 font-mono">Accents</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={customColors.primary}
                    onChange={(e) => setCustomColors((c) => ({ ...c, primary: e.target.value }))}
                    className="w-8 h-8 rounded border border-zinc-700 bg-transparent cursor-pointer shrink-0"
                  />
                  <input
                    type="text"
                    value={customColors.primary}
                    onChange={(e) => setCustomColors((c) => ({ ...c, primary: e.target.value }))}
                    className="w-full px-2 py-1 rounded bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-200 uppercase"
                  />
                </div>
              </div>

              {/* 6. Secondary Color */}
              <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-200">Secondary Color</label>
                  <span className="text-[10px] text-zinc-400 font-mono">Header & Bar</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={customColors.secondary}
                    onChange={(e) => setCustomColors((c) => ({ ...c, secondary: e.target.value }))}
                    className="w-8 h-8 rounded border border-zinc-700 bg-transparent cursor-pointer shrink-0"
                  />
                  <input
                    type="text"
                    value={customColors.secondary}
                    onChange={(e) => setCustomColors((c) => ({ ...c, secondary: e.target.value }))}
                    className="w-full px-2 py-1 rounded bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-200 uppercase"
                  />
                </div>
              </div>

              {/* 7. Font Style */}
              <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80 space-y-1.5">
                <label className="text-xs font-bold text-zinc-200 block">Font Style</label>
                <select
                  value={customFontStyle}
                  onChange={(e) => setCustomFontStyle(e.target.value)}
                  className="w-full px-2 py-1.5 rounded bg-zinc-900 border border-zinc-700 text-xs font-semibold text-zinc-200 cursor-pointer"
                >
                  <option value="sans">Modern Sans (Inter/Geist)</option>
                  <option value="serif">Elegant Serif (Playfair)</option>
                  <option value="display">Bold Display (Outfit)</option>
                  <option value="geometric">Sleek Geometric (Jakarta)</option>
                </select>
              </div>

              {/* 8. Animations Option */}
              <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80 space-y-1.5">
                <label className="text-xs font-bold text-zinc-200 block">Animations Option</label>
                <select
                  value={customAnimation}
                  onChange={(e) => setCustomAnimation(e.target.value)}
                  className="w-full px-2 py-1.5 rounded bg-zinc-900 border border-zinc-700 text-xs font-semibold text-zinc-200 cursor-pointer"
                >
                  <option value="smooth">Subtle & Smooth (300ms Ease)</option>
                  <option value="energetic">Bouncy & Energetic (Scale Up)</option>
                  <option value="minimal">Clean & Instant (No Delay)</option>
                </select>
              </div>
            </div>
          </div>
        )}

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
