import fs from "fs/promises";
import path from "path";
import type {
  ThemeConfig,
  PageConfig,
  ThemeSummary,
  ThemeTokens,
  ThemeLayoutJson,
  ThemeMetadataFile,
} from "./types";

const STOREFRONT_THEMES_DIR = path.join(process.cwd(), "storefront", "themes");
const LEGACY_THEMES_DIR = path.join(process.cwd(), "themes");

/**
 * Returns the active themes directory.
 */
async function getThemesDir(): Promise<string> {
  try {
    await fs.access(STOREFRONT_THEMES_DIR);
    return STOREFRONT_THEMES_DIR;
  } catch {
    return LEGACY_THEMES_DIR;
  }
}

/**
 * Validates that a theme ID corresponds to a valid existing theme folder
 * containing valid metadata.json, tokens.json, and layout.json files.
 */
export async function isValidTheme(themeId: string): Promise<boolean> {
  if (!themeId || typeof themeId !== "string") return false;
  try {
    const themesDir = await getThemesDir();
    const themeFolderPath = path.join(themesDir, themeId);

    const stat = await fs.stat(themeFolderPath);
    if (!stat.isDirectory()) return false;

    const metadataPath = path.join(themeFolderPath, "metadata.json");
    const metaRaw = await fs.readFile(metadataPath, "utf-8");
    const meta: ThemeMetadataFile = JSON.parse(metaRaw);

    if (meta.id !== themeId) return false;

    const tokensPath = path.join(themeFolderPath, meta.tokens || "tokens.json");
    const layoutPath = path.join(themeFolderPath, meta.layout || "layout.json");

    await fs.access(tokensPath);
    await fs.access(layoutPath);

    return true;
  } catch {
    return false;
  }
}

/**
 * Returns summaries of all available themes discovered in storefront/themes/.
 * Every theme folder with metadata.json or tokens.json is automatically discovered.
 */
export async function getAvailableThemes(): Promise<ThemeSummary[]> {
  try {
    const themesDir = await getThemesDir();
    const entries = await fs.readdir(themesDir, { withFileTypes: true });
    const themeDirs: string[] = [];

    for (const e of entries) {
      if (e.isDirectory()) {
        try {
          const hasMetadata = await fs
            .access(path.join(themesDir, e.name, "metadata.json"))
            .then(() => true)
            .catch(() => false);

          const hasTokens = await fs
            .access(path.join(themesDir, e.name, "tokens.json"))
            .then(() => true)
            .catch(() => false);

          const hasLegacy = await fs
            .access(path.join(themesDir, e.name, "theme.json"))
            .then(() => true)
            .catch(() => false);

          if (hasMetadata || hasTokens || hasLegacy) {
            themeDirs.push(e.name);
          }
        } catch {
          // Ignore non-theme directories
        }
      }
    }

    const summaries: ThemeSummary[] = [];

    for (const themeId of themeDirs) {
      try {
        const themeConfig = await loadTheme(themeId);
        summaries.push({
          id: themeConfig.id,
          name: themeConfig.name,
          version: themeConfig.version,
          description: themeConfig.description,
          previewImage: themeConfig.metadata?.previewImage,
          tags: themeConfig.metadata?.tags,
          tokens: themeConfig.tokens,
          templates: themeConfig.layout?.templates,
        });
      } catch (err) {
        console.warn(`[themeRepository] Could not load summary for theme: ${themeId}`, err);
      }
    }

    return summaries;
  } catch (error) {
    console.error("[themeRepository] Error listing available themes:", error);
    return [];
  }
}

/**
 * Loads the complete theme configuration by theme ID.
 * Reads metadata.json first, then the referenced tokens and layout files.
 */
export async function loadTheme(themeId: string): Promise<ThemeConfig> {
  const themesDir = await getThemesDir();
  const themeFolderPath = path.join(themesDir, themeId);

  // 1. Read metadata.json if present
  const metadataPath = path.join(themeFolderPath, "metadata.json");
  let metadata: ThemeMetadataFile | null = null;
  try {
    const metaRaw = await fs.readFile(metadataPath, "utf-8");
    metadata = JSON.parse(metaRaw);
  } catch {
    metadata = null;
  }

  // 2. Resolve token & layout paths from metadata or default convention
  const tokensFileName = metadata?.tokens || "tokens.json";
  const layoutFileName = metadata?.layout || "layout.json";
  const tokensPath = path.join(themeFolderPath, tokensFileName);
  const layoutPath = path.join(themeFolderPath, layoutFileName);

  try {
    const hasTokens = await fs
      .access(tokensPath)
      .then(() => true)
      .catch(() => false);

    if (hasTokens) {
      const tokensRaw = await fs.readFile(tokensPath, "utf-8");
      const tokensData = JSON.parse(tokensRaw);

      let layoutData: ThemeLayoutJson = {
        themeId,
        templates: { home: "restaurant-home" },
        pages: { home: [] },
      };

      try {
        const layoutRaw = await fs.readFile(layoutPath, "utf-8");
        layoutData = JSON.parse(layoutRaw);
      } catch {
        // Fallback layout if layout.json missing
      }

      const tokens: ThemeTokens = {
        colors: tokensData.colors || {},
        typography: tokensData.typography || { fontFamily: "inherit" },
        spacing: tokensData.spacing,
        radius: tokensData.radius,
        shadows: tokensData.shadows,
        layout: tokensData.layout,
        animation: tokensData.animation,
      };

      return {
        id: metadata?.id || tokensData.themeId || themeId,
        name: metadata?.name || tokensData.name || formatThemeName(themeId),
        version: tokensData.version || "1.0.0",
        description: metadata?.description || tokensData.description || "",
        metadata: tokensData.metadata,
        tokens,
        layout: layoutData,
        supportedSections: layoutData.pages?.home?.map((s) => s.type) || [],
      };
    }
  } catch (err) {
    // Proceed to legacy check
  }

  // 3. Fallback to legacy theme.json if present
  const legacyFilePath = path.join(themeFolderPath, "theme.json");
  try {
    const fileContent = await fs.readFile(legacyFilePath, "utf-8");
    const themeConfig: ThemeConfig = JSON.parse(fileContent);
    return themeConfig;
  } catch (error) {
    throw new Error(
      `[themeRepository] Failed to load theme "${themeId}" from ${themeFolderPath}: ${(error as Error).message}`
    );
  }
}

/**
 * Loads page structure for a specific theme from its layout.json.
 */
export async function loadPage(
  themeId: string,
  pageName: string = "home"
): Promise<PageConfig> {
  const theme = await loadTheme(themeId);
  const sections = theme.layout?.pages?.[pageName] || [];

  if (sections.length > 0) {
    return {
      page: pageName,
      title: `${theme.name} ${pageName.charAt(0).toUpperCase() + pageName.slice(1)}`,
      sections,
    };
  }

  // Fallback to legacy pages/{pageName}.json if exists
  const themesDir = await getThemesDir();
  const legacyPageFilePath = path.join(themesDir, themeId, "pages", `${pageName}.json`);
  try {
    const fileContent = await fs.readFile(legacyPageFilePath, "utf-8");
    return JSON.parse(fileContent) as PageConfig;
  } catch {
    return {
      page: pageName,
      title: pageName,
      sections: [],
    };
  }
}

function formatThemeName(id: string): string {
  return id
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
