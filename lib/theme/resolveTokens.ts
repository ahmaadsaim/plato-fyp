import type { CSSProperties } from "react";
import type { ThemeTokens } from "@/lib/theme/types";

/**
 * Resolves theme tokens into CSS custom properties (variables) that can be
 * applied to the theme container or root document.
 */
export function resolveThemeCssVariables(tokens: ThemeTokens): CSSProperties {
  const vars: Record<string, string> = {};

  // Colors
  if (tokens.colors) {
    Object.entries(tokens.colors).forEach(([key, value]) => {
      // kebab-case the key e.g. primaryHover -> primary-hover
      const kebab = key.replace(/([A-Z])/g, "-$1").toLowerCase();
      vars[`--theme-color-${kebab}`] = value;
    });
  }

  // Typography
  if (tokens.typography) {
    vars["--theme-font-family"] = tokens.typography.fontFamily;
    vars["--theme-font-heading"] = tokens.typography.headingFont || tokens.typography.fontFamily;
    vars["--theme-font-heading-weight"] = tokens.typography.headingWeight;
    vars["--theme-font-body-weight"] = tokens.typography.bodyWeight;
    vars["--theme-font-heading-scale"] = tokens.typography.headingScale;
    vars["--theme-font-body-size"] = tokens.typography.bodySize;
  }

  // Spacing
  if (tokens.spacing) {
    vars["--theme-spacing-section"] = tokens.spacing.section;
    vars["--theme-spacing-container"] = tokens.spacing.container;
    vars["--theme-spacing-card"] = tokens.spacing.card;
    vars["--theme-spacing-element"] = tokens.spacing.element;
  }

  // Radius
  if (tokens.radius) {
    vars["--theme-radius-small"] = tokens.radius.small;
    vars["--theme-radius-medium"] = tokens.radius.medium;
    vars["--theme-radius-large"] = tokens.radius.large;
    vars["--theme-radius-full"] = tokens.radius.full;
  }

  // Shadows
  if (tokens.shadows) {
    vars["--theme-shadow-sm"] = tokens.shadows.sm;
    vars["--theme-shadow-card"] = tokens.shadows.card;
    vars["--theme-shadow-floating"] = tokens.shadows.floating;
  }

  // Layout
  if (tokens.layout) {
    vars["--theme-layout-max-width"] = tokens.layout.maxWidth;
    vars["--theme-layout-columns"] = String(tokens.layout.productColumns || 4);
  }

  return vars as CSSProperties;
}
