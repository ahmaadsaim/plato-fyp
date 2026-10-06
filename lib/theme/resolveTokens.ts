import type { CSSProperties } from "react";
import type { ThemeTokens } from "@/lib/theme/types";

/**
 * Resolves theme tokens into CSS custom properties (variables) that can be
 * applied to the theme container or root document.
 * Sets both `--theme-*` and `--brand-*` variables so all sections and components
 * inherit the exact same design tokens seamlessly.
 */
export function resolveThemeCssVariables(tokens: ThemeTokens): CSSProperties {
  const vars: Record<string, string> = {};

  // Colors
  if (tokens.colors) {
    Object.entries(tokens.colors).forEach(([key, value]) => {
      if (typeof value === "string") {
        const kebab = key.replace(/([A-Z])/g, "-$1").toLowerCase();
        vars[`--theme-color-${kebab}`] = value;
      }
    });

    const primary = tokens.colors.primary || "#84CC16";
    const secondary = tokens.colors.secondary || "#18181B";
    const buttonBg = tokens.colors.button || primary;
    const buttonFg = tokens.colors.buttonText || "#FFFFFF";
    const cardBg = tokens.colors.card || tokens.colors.surfaceCard || "#FFFFFF";
    const pageBg = tokens.colors.background || "#FFFFFF";
    const textColor = tokens.colors.text || "#111111";

    // Ensure dedicated theme variables
    if (!vars["--theme-color-button"]) vars["--theme-color-button"] = buttonBg;
    if (!vars["--theme-color-button-text"]) vars["--theme-color-button-text"] = buttonFg;
    if (!vars["--theme-color-card"]) vars["--theme-color-card"] = cardBg;

    // Bridge to --brand-* variables for storefront components
    vars["--brand-primary"] = primary;
    vars["--brand-secondary"] = secondary;
    vars["--brand-button-bg"] = buttonBg;
    vars["--brand-button-fg"] = buttonFg;
    vars["--brand-card-bg"] = cardBg;
    vars["--brand-page-bg"] = pageBg;
    vars["--brand-text"] = textColor;
    vars["--brand-accent"] = tokens.colors.accent || primary;
  }

  // Typography
  if (tokens.typography) {
    const font = String(tokens.typography.fontFamily || "inherit");
    const headingFont = String(tokens.typography.headingFont || font);

    vars["--theme-font-family"] = font;
    vars["--theme-font-heading"] = headingFont;
    vars["--brand-font-family"] = font;

    if (tokens.typography.headingWeight) {
      vars["--theme-font-heading-weight"] = String(tokens.typography.headingWeight);
    }
    if (tokens.typography.bodyWeight) {
      vars["--theme-font-body-weight"] = String(tokens.typography.bodyWeight);
    }
    if (tokens.typography.headingScale) {
      vars["--theme-font-heading-scale"] = String(tokens.typography.headingScale);
    }
    if (tokens.typography.bodySize) {
      vars["--theme-font-body-size"] = String(tokens.typography.bodySize);
    }
  }

  // Spacing
  if (tokens.spacing) {
    if (tokens.spacing.section) vars["--theme-spacing-section"] = tokens.spacing.section;
    if (tokens.spacing.container) vars["--theme-spacing-container"] = tokens.spacing.container;
    if (tokens.spacing.card) vars["--theme-spacing-card"] = tokens.spacing.card;
    if (tokens.spacing.element) vars["--theme-spacing-element"] = tokens.spacing.element;
    if (tokens.spacing.cardGap) vars["--theme-spacing-card-gap"] = tokens.spacing.cardGap;
  }

  // Radius
  if (tokens.radius) {
    if (tokens.radius.button) vars["--theme-radius-button"] = tokens.radius.button;
    if (tokens.radius.card) {
      vars["--theme-radius-card"] = tokens.radius.card;
      vars["--brand-border-radius"] = tokens.radius.card;
    }
    if (tokens.radius.input) vars["--theme-radius-input"] = tokens.radius.input;
    if (tokens.radius.small) vars["--theme-radius-small"] = tokens.radius.small;
    if (tokens.radius.medium) vars["--theme-radius-medium"] = tokens.radius.medium;
    if (tokens.radius.large) vars["--theme-radius-large"] = tokens.radius.large;
    if (tokens.radius.full) vars["--theme-radius-full"] = tokens.radius.full;
  }

  // Shadows
  if (tokens.shadows) {
    if (tokens.shadows.sm) vars["--theme-shadow-sm"] = tokens.shadows.sm;
    if (tokens.shadows.card) vars["--theme-shadow-card"] = tokens.shadows.card;
    if (tokens.shadows.floating) vars["--theme-shadow-floating"] = tokens.shadows.floating;
  }

  // Layout
  if (tokens.layout) {
    if (tokens.layout.maxWidth) vars["--theme-layout-max-width"] = String(tokens.layout.maxWidth);
    if (tokens.layout.productColumns) vars["--theme-layout-columns"] = String(tokens.layout.productColumns);
  }

  return vars as CSSProperties;
}
