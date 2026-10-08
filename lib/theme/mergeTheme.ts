import type { ThemeConfig, ThemeLayoutJson } from "@/lib/theme/types";

export interface TenantThemeOverrides {
  tokens?: {
    colors?: Record<string, string>;
    typography?: Record<string, string | number>;
    spacing?: Record<string, string>;
    radius?: Record<string, string>;
    shadows?: Record<string, string>;
    layout?: Record<string, string | number>;
    animation?: Record<string, unknown>;
  };
  layout?: Partial<ThemeLayoutJson> & {
    home?: {
      hero?: Record<string, unknown>;
      [sectionId: string]: unknown;
    };
  };
}

/**
 * Performs a deep merge of base theme configuration and tenant-level overrides.
 * Preserves all base tokens and settings while allowing granular customization.
 */
export function mergeTheme(
  baseTheme: ThemeConfig,
  overrides?: TenantThemeOverrides | Partial<ThemeConfig> | null
): ThemeConfig {
  if (!overrides) {
    return baseTheme;
  }

  const mergedColors = {
    ...baseTheme.tokens.colors,
    ...(overrides.tokens?.colors || {}),
  };

  const mergedTypography = {
    ...baseTheme.tokens.typography,
    ...(overrides.tokens?.typography || {}),
  };

  const mergedSpacing = {
    ...baseTheme.tokens.spacing,
    ...(overrides.tokens?.spacing || {}),
  };

  const mergedRadius = {
    ...baseTheme.tokens.radius,
    ...(overrides.tokens?.radius || {}),
  };

  const mergedShadows = {
    ...baseTheme.tokens.shadows,
    ...(overrides.tokens?.shadows || {}),
  };

  const mergedTokens = {
    colors: mergedColors,
    typography: mergedTypography,
    spacing: mergedSpacing,
    radius: mergedRadius,
    shadows: mergedShadows,
    layout: {
      ...baseTheme.tokens.layout,
      ...(overrides.tokens?.layout || {}),
    },
    animation: {
      ...baseTheme.tokens.animation,
      ...(overrides.tokens?.animation || {}),
    },
  };

  // Merge layout overrides
  let mergedLayout: ThemeLayoutJson = baseTheme.layout || {
    themeId: baseTheme.id,
    templates: { home: "restaurant-home" },
    pages: { home: [] },
  };

  if (overrides.layout) {
    const overrideLayout = overrides.layout as Partial<ThemeLayoutJson> & Record<string, unknown>;
    const mergedPages: Record<string, typeof mergedLayout.pages[string]> = {
      ...(mergedLayout.pages || {}),
    };

    // If layout has page overrides
    if (overrideLayout.pages) {
      Object.entries(overrideLayout.pages).forEach(([pageName, sections]) => {
        mergedPages[pageName] = sections;
      });
    }

    // If layout has section-level setting overrides (e.g. overrides.layout.home.hero)
    if (overrideLayout.home && typeof overrideLayout.home === "object") {
      const homeSections = [...(mergedPages.home || [])];
      Object.entries(overrideLayout.home).forEach(([sectionType, customSettings]) => {
        const secIndex = homeSections.findIndex((s) => s.type === sectionType);
        if (secIndex !== -1 && typeof customSettings === "object" && customSettings !== null) {
          homeSections[secIndex] = {
            ...homeSections[secIndex],
            settings: {
              ...(homeSections[secIndex].settings || {}),
              ...(customSettings as Record<string, unknown>),
            },
          };
        }
      });
      mergedPages.home = homeSections;
    }

    mergedLayout = {
      themeId: baseTheme.id,
      templates: {
        ...(mergedLayout.templates || {}),
        ...(overrideLayout.templates || {}),
      },
      pages: mergedPages,
    };
  }

  return {
    ...baseTheme,
    tokens: mergedTokens,
    layout: mergedLayout,
    supportedSections:
      baseTheme.supportedSections ||
      mergedLayout.pages?.home?.map((s) => s.type) ||
      [],
  };
}
