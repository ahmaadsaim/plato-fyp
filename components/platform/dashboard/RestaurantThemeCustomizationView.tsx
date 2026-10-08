"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  Palette,
  Check,
  Save,
  Sparkles,
  ExternalLink,
  Eye,
  Type,
  Pipette,
} from "lucide-react";
import type { Tenant } from "@/lib/tenant";
import {
  saveTenantCustomizationAction,
  getTenantCustomizationAction,
} from "@/app/actions/tenant";

interface RestaurantThemeCustomizationViewProps {
  tenant: Tenant;
  platformDomain: string;
  platformProtocol: string;
}

const THEME_PRESETS = [
  {
    id: "plato-lime",
    name: "Plato Lime (Default)",
    badge: "Clean Light",
    primary: "#84CC16",
    secondary: "#18181B",
    button: "#84CC16",
    buttonText: "#000000",
    card: "#FFFFFF",
    bg: "#F8FAFC",
    text: "#09090B",
    font: "sans",
  },
  {
    id: "dark-modern",
    name: "Obsidian Slate",
    badge: "Dark Mode",
    primary: "#10B981",
    secondary: "#09090B",
    button: "#10B981",
    buttonText: "#000000",
    card: "#18181B",
    bg: "#09090B",
    text: "#F4F4F5",
    font: "sans",
  },
  {
    id: "warm-bistro",
    name: "Amber Artisan",
    badge: "Warm Craft",
    primary: "#F59E0B",
    secondary: "#292524",
    button: "#F59E0B",
    buttonText: "#000000",
    card: "#FFFFFF",
    bg: "#FAFAF9",
    text: "#1C1917",
    font: "serif",
  },
  {
    id: "terracotta",
    name: "Tuscan Rust",
    badge: "Authentic",
    primary: "#EA580C",
    secondary: "#18181B",
    button: "#EA580C",
    buttonText: "#FFFFFF",
    card: "#FFFFFF",
    bg: "#FFF7ED",
    text: "#1C1917",
    font: "display",
  },
];

export function RestaurantThemeCustomizationView({
  tenant,
  platformDomain,
  platformProtocol,
}: RestaurantThemeCustomizationViewProps) {
  const [selectedThemeId, setSelectedThemeId] = useState(tenant?.theme_id || "modern");
  const [headline, setHeadline] = useState("Handcrafted Flavors Delivered Fresh");
  const [primaryColor, setPrimaryColor] = useState("#84CC16");
  const [secondaryColor, setSecondaryColor] = useState("#18181B");
  const [buttonColor, setButtonColor] = useState("#84CC16");
  const [buttonTextColor, setButtonTextColor] = useState("#000000");
  const [cardColor, setCardColor] = useState("#FFFFFF");
  const [backgroundColor, setBackgroundColor] = useState("#F8FAFC");
  const [textColor, setTextColor] = useState("#09090B");
  const [fontStyle, setFontStyle] = useState<"sans" | "serif" | "display" | "geometric">("sans");

  const [isPending, startTransition] = useTransition();
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (tenant?.slug) {
      getTenantCustomizationAction(tenant.slug).then((res) => {
        if (res.success && res.data) {
          if (res.data.themeId || res.data.theme) {
            setSelectedThemeId(res.data.themeId || res.data.theme || "modern");
          } else if (tenant?.theme_id) {
            setSelectedThemeId(tenant.theme_id);
          }
          if (res.data.headline) setHeadline(res.data.headline);
          if (res.data.primaryColor) setPrimaryColor(res.data.primaryColor);
          if (res.data.secondaryColor) setSecondaryColor(res.data.secondaryColor);
          if (res.data.buttonColor) setButtonColor(res.data.buttonColor);
          if (res.data.buttonTextColor) setButtonTextColor(res.data.buttonTextColor);
          if (res.data.cardColor) setCardColor(res.data.cardColor);
          if (res.data.backgroundColor) setBackgroundColor(res.data.backgroundColor);
          if (res.data.textColor) setTextColor(res.data.textColor);
          if (res.data.fontStyle) {
            const nextFont = res.data.fontStyle as "sans" | "serif" | "display" | "geometric";
            if (["sans", "serif", "display", "geometric"].includes(nextFont)) {
              setFontStyle(nextFont);
            }
          }
        }
      });
    }
  }, [tenant?.slug, tenant?.theme_id]);

  const applyPreset = (preset: typeof THEME_PRESETS[0]) => {
    setSelectedThemeId(preset.id);
    setPrimaryColor(preset.primary);
    setSecondaryColor(preset.secondary);
    setButtonColor(preset.button);
    setButtonTextColor(preset.buttonText);
    setCardColor(preset.card);
    setBackgroundColor(preset.bg);
    setTextColor(preset.text);
    setFontStyle(preset.font as "sans" | "serif" | "display" | "geometric");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await saveTenantCustomizationAction(tenant.slug, {
        name: tenant.name,
        headline,
        primaryColor,
        secondaryColor,
        buttonColor,
        buttonTextColor,
        cardColor,
        backgroundColor,
        textColor,
        fontStyle,
        themeId: selectedThemeId,
        theme: selectedThemeId,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    });
  };

  const liveStoreUrl = `${platformProtocol}://${tenant.slug}.${platformDomain}`;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-lime-500 text-black uppercase font-mono">
              THEME & BRANDING
            </span>
            <span className="text-xs text-zinc-400 font-mono">•</span>
            <span className="text-xs font-semibold text-zinc-700">
              {tenant.name}
            </span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900">
            Theme Customization Studio
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 mt-1">
            Personalize storefront color tokens, brand typography, and live layout appearance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={liveStoreUrl}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-800 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <span>Live Store</span>
            <ExternalLink className="w-3.5 h-3.5 text-lime-700" />
          </a>

          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="px-4 py-1.5 rounded-lg bg-lime-500 hover:bg-lime-400 text-black font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
          >
            {isPending ? (
              <span>Saving...</span>
            ) : saveSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Theme</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preset Palettes */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-zinc-900 uppercase font-mono tracking-wider">
          Curated Theme Presets
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {THEME_PRESETS.map((p) => {
            const isSelected =
              selectedThemeId === p.id ||
              (primaryColor === p.primary && backgroundColor === p.bg);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPreset(p)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? "border-lime-500 ring-2 ring-lime-500/20 bg-lime-50/20"
                    : "border-zinc-200 hover:border-zinc-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-zinc-900 truncate">
                    {p.name}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-lime-600 flex-shrink-0" />}
                </div>

                <div className="flex items-center gap-1.5 mb-2">
                  <span
                    className="w-4 h-4 rounded-full border border-black/10 shadow-2xs"
                    style={{ backgroundColor: p.primary }}
                  />
                  <span
                    className="w-4 h-4 rounded-full border border-black/10 shadow-2xs"
                    style={{ backgroundColor: p.secondary }}
                  />
                  <span
                    className="w-4 h-4 rounded-full border border-black/10 shadow-2xs"
                    style={{ backgroundColor: p.bg }}
                  />
                </div>

                <span className="text-[10px] font-mono text-zinc-500 block truncate">
                  {p.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customization Controls */}
        <div className="space-y-4">
          {/* Brand Headline */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-zinc-900 uppercase font-mono tracking-wider">
              Storefront Hero Headline
            </h4>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Handcrafted Flavors Delivered Fresh"
              className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-lime-500 focus:bg-white transition-colors"
            />
          </div>

          {/* Color Tokens */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-zinc-900 uppercase font-mono tracking-wider">
              Brand Color Tokens
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-zinc-600 mb-1">
                  Primary Brand
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border border-zinc-200 p-0.5"
                  />
                  <span className="text-xs font-mono text-zinc-800 uppercase">
                    {primaryColor}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-600 mb-1">
                  Button Action
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={buttonColor}
                    onChange={(e) => setButtonColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border border-zinc-200 p-0.5"
                  />
                  <span className="text-xs font-mono text-zinc-800 uppercase">
                    {buttonColor}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-600 mb-1">
                  Card Surface
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={cardColor}
                    onChange={(e) => setCardColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border border-zinc-200 p-0.5"
                  />
                  <span className="text-xs font-mono text-zinc-800 uppercase">
                    {cardColor}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-600 mb-1">
                  Page Background
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border border-zinc-200 p-0.5"
                  />
                  <span className="text-xs font-mono text-zinc-800 uppercase">
                    {backgroundColor}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-600 mb-1">
                  Text & Headings
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border border-zinc-200 p-0.5"
                  />
                  <span className="text-xs font-mono text-zinc-800 uppercase">
                    {textColor}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-600 mb-1">
                  Button Text
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={buttonTextColor}
                    onChange={(e) => setButtonTextColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border border-zinc-200 p-0.5"
                  />
                  <span className="text-xs font-mono text-zinc-800 uppercase">
                    {buttonTextColor}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Typography */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-zinc-900 uppercase font-mono tracking-wider">
              Brand Typography
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "sans", name: "Modern Sans (Inter)", preview: "Clean & Contemporary" },
                { id: "serif", name: "Artisanal Serif (Playfair)", preview: "Elegant & Fine Dining" },
                { id: "display", name: "Bold Display (Outfit)", preview: "Punchy & High Energy" },
                { id: "geometric", name: "Geometric (Space)", preview: "Minimalist & Tech" },
              ].map((font) => (
                <button
                  key={font.id}
                  type="button"
                  onClick={() =>
                    setFontStyle(font.id as "sans" | "serif" | "display" | "geometric")
                  }
                  className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                    fontStyle === font.id
                      ? "border-lime-500 bg-lime-50/30"
                      : "border-zinc-200 hover:border-zinc-300 bg-white"
                  }`}
                >
                  <p className="text-xs font-bold text-zinc-900">{font.name}</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">{font.preview}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Interactive Storefront Mockup Preview */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-zinc-900 uppercase font-mono tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-lime-600" />
                <span>Live Storefront Preview</span>
              </h4>
              <span className="text-[10px] font-mono text-zinc-400">
                Responsive Simulated Canvas
              </span>
            </div>

            {/* Simulated Storefront Container */}
            <div
              className="rounded-xl border border-zinc-200 p-4 transition-all duration-200 space-y-4 shadow-inner"
              style={{
                backgroundColor: backgroundColor,
                color: textColor,
              }}
            >
              {/* Simulated Header */}
              <div className="flex items-center justify-between pb-3 border-b border-black/10">
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs"
                    style={{ backgroundColor: primaryColor, color: buttonTextColor }}
                  >
                    {tenant.name[0] || "P"}
                  </div>
                  <span className="font-bold text-xs tracking-tight">
                    {tenant.name}
                  </span>
                </div>
                <div
                  className="px-2 py-0.5 rounded text-[10px] font-semibold"
                  style={{ backgroundColor: buttonColor, color: buttonTextColor }}
                >
                  Cart (0)
                </div>
              </div>

              {/* Simulated Hero */}
              <div
                className="rounded-lg p-4 text-center space-y-1.5 shadow-2xs"
                style={{
                  backgroundColor: cardColor,
                  border: `1px solid ${primaryColor}22`,
                }}
              >
                <span
                  className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider"
                  style={{ backgroundColor: primaryColor, color: buttonTextColor }}
                >
                  Open For Orders
                </span>
                <h5 className="font-extrabold text-sm sm:text-base leading-snug">
                  {headline}
                </h5>
                <p className="text-[11px] opacity-75 max-w-xs mx-auto">
                  Chef-curated gourmet recipes prepared with premium, locally-sourced ingredients.
                </p>
                <div className="pt-1.5">
                  <button
                    type="button"
                    className="px-3 py-1 rounded-md text-xs font-bold shadow-xs"
                    style={{ backgroundColor: buttonColor, color: buttonTextColor }}
                  >
                    Explore Menu
                  </button>
                </div>
              </div>

              {/* Simulated Food Item Card */}
              <div
                className="rounded-lg p-3 flex items-center justify-between gap-3 shadow-2xs"
                style={{
                  backgroundColor: cardColor,
                  border: "1px solid rgba(0,0,0,0.08)",
                }}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80"
                    alt="Burger"
                    className="w-10 h-10 rounded-md object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-xs truncate">Truffle Wagyu Burger</p>
                    <p className="text-[10px] opacity-75 font-mono">$18.50</p>
                  </div>
                </div>

                <button
                  type="button"
                  className="px-2 py-1 rounded text-[10px] font-bold flex-shrink-0"
                  style={{ backgroundColor: buttonColor, color: buttonTextColor }}
                >
                  + Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
