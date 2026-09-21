"use client";

import React, { useMemo } from "react";
import type {
  ThemeConfig,
  PageConfig,
  RestaurantData,
  ProductData,
  CategoryData,
} from "@/lib/theme/types";
import { resolveThemeCssVariables } from "@/lib/theme/resolveTokens";
import { ThemeProvider, RestaurantDataProvider } from "@/components/common/ThemeContext";
import { SectionRenderer } from "./SectionRenderer";

export interface ThemeRendererProps {
  theme: ThemeConfig;
  page: PageConfig;
  restaurant: RestaurantData;
  products: ProductData[];
  categories: CategoryData[];
  className?: string;
}

/**
 * ThemeRenderer is the top-level orchestration engine of the JSON-driven theme architecture.
 *
 * It receives:
 * 1. Theme Configuration (tokens, typography, colors, layout)
 * 2. Page Configuration (ordered list of sections & settings)
 * 3. Local Restaurant Data (brand profile, catalog, categories)
 *
 * It resolves the design tokens into CSS variables, sets up React Theme Context,
 * and iterates over the sections strictly in the order prescribed by the JSON page config.
 */
export function ThemeRenderer({
  theme,
  page,
  restaurant,
  products,
  categories,
  className = "",
}: ThemeRendererProps) {
  // Resolve theme tokens to CSS custom properties
  const cssVariables = useMemo(() => {
    return resolveThemeCssVariables(theme.tokens);
  }, [theme.tokens]);

  return (
    <ThemeProvider
      theme={theme.tokens}
      themeId={theme.id}
      themeName={theme.name}
    >
      <RestaurantDataProvider
        restaurant={restaurant}
        products={products}
        categories={categories}
      >
        <div
          id="theme-root"
          style={cssVariables}
          className={`theme-container min-h-screen w-full transition-colors duration-300 ${className}`}
        >
          {page.sections.map((section, index) => (
            <SectionRenderer
              key={section.id || `${section.type}-${index}`}
              section={section}
              theme={theme.tokens}
              restaurant={restaurant}
              products={products}
              categories={categories}
              index={index}
            />
          ))}
        </div>
      </RestaurantDataProvider>
    </ThemeProvider>
  );
}
