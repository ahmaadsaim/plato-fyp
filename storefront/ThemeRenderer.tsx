"use client";

import React, { useMemo } from "react";
import type {
  ThemeConfig,
  PageConfig,
  RestaurantData,
  ProductData,
  CategoryData,
  SectionConfig,
} from "@/lib/theme/types";
import { resolveThemeCssVariables } from "@/lib/theme/resolveTokens";
import { HomeTemplate } from "./templates/HomeTemplate";
import { ClassicHomeTemplate } from "./templates/ClassicHomeTemplate";

export interface ThemeRendererProps {
  theme: ThemeConfig;
  page?: string | PageConfig;
  restaurant: RestaurantData;
  products: ProductData[];
  categories: CategoryData[];
  className?: string;
}

/**
 * THE SINGLE UNIFIED THEMERENDERER.
 * Used identically by:
 * - Live tenant storefront
 * - Theme gallery preview
 * - Theme demo viewer
 *
 * Flow:
 * Theme + Overrides -> resolveTokens (CSS variables) -> Resolve Template -> Template renders Sections -> Components -> HTML
 */
export function ThemeRenderer({
  theme,
  page = "home",
  restaurant,
  products,
  categories,
  className = "",
}: ThemeRendererProps) {
  // 1. Resolve tokens into CSS custom properties
  const cssVariables = useMemo(() => {
    return resolveThemeCssVariables(theme.tokens);
  }, [theme.tokens]);

  // 2. Resolve page sections
  const { pageKey, sections } = useMemo(() => {
    if (typeof page === "object" && page !== null) {
      return {
        pageKey: page.page || "home",
        sections: page.sections || [],
      };
    }
    const key = page || "home";
    const resolvedSections = theme.layout?.pages?.[key] || [];
    return {
      pageKey: key,
      sections: resolvedSections,
    };
  }, [page, theme.layout]);

  // 3. Resolve template component based on layout.templates[pageKey]
  const templateName = theme.layout?.templates?.[pageKey] || "restaurant-home";

  const renderTemplate = (resolvedSections: SectionConfig[]) => {
    const props = {
      sections: resolvedSections,
      theme: theme.tokens,
      restaurant,
      products,
      categories,
    };

    switch (templateName) {
      case "classic-restaurant-home":
        return <ClassicHomeTemplate {...props} />;
      case "restaurant-home":
      default:
        return <HomeTemplate {...props} />;
    }
  };

  return (
    <div
      id="theme-root"
      style={cssVariables}
      className={`theme-container min-h-screen w-full transition-colors duration-300 ${className}`}
    >
      {renderTemplate(sections)}
    </div>
  );
}

export default ThemeRenderer;
