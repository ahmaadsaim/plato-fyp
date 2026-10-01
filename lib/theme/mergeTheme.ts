import type { ThemeConfig } from "@/lib/theme/types";

/**
 * Performs a deep merge of base theme configuration and tenant-level overrides.
 * This ensures that when a tenant customizes individual tokens (like primary color),
 * all other baseline tokens and configurations are preserved.
 */
export function mergeTheme(
  baseTheme: ThemeConfig,
  overrides?: Partial<ThemeConfig> | null
): ThemeConfig {
  if (!overrides) {
    return baseTheme;
  }

  return {
    ...baseTheme,
    ...overrides,
    metadata: {
      ...baseTheme.metadata,
      ...overrides.metadata,
    },
    tokens: {
      ...baseTheme.tokens,
      ...(overrides.tokens
        ? {
            colors: {
              ...baseTheme.tokens.colors,
              ...(overrides.tokens.colors || {}),
            },
            typography: {
              ...baseTheme.tokens.typography,
              ...(overrides.tokens.typography || {}),
            },
            spacing: {
              ...baseTheme.tokens.spacing,
              ...(overrides.tokens.spacing || {}),
            },
            radius: {
              ...baseTheme.tokens.radius,
              ...(overrides.tokens.radius || {}),
            },
            shadows: {
              ...baseTheme.tokens.shadows,
              ...(overrides.tokens.shadows || {}),
            },
            layout: {
              ...baseTheme.tokens.layout,
              ...(overrides.tokens.layout || {}),
            },
          }
        : {}),
    },
    supportedSections: overrides.supportedSections || baseTheme.supportedSections,
  };
}
