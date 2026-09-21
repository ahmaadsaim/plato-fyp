import fs from "fs/promises";
import path from "path";
import type {
  ThemeConfig,
  PageConfig,
  ThemeSummary,
} from "./types";

const THEMES_DIR = path.join(process.cwd(), "themes");

/**
 * Returns summaries of all available themes discovered locally.
 * Later, this function can query PostgreSQL (e.g., SELECT * FROM themes)
 * without altering the calling components.
 */
export async function getAvailableThemes(): Promise<ThemeSummary[]> {
  try {
    const entries = await fs.readdir(THEMES_DIR, { withFileTypes: true });
    const themeDirs = entries.filter((e) => e.isDirectory()).map((e) => e.name);

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
 * Loads the complete theme configuration (tokens, metadata, sections) by theme ID.
 */
export async function loadTheme(themeId: string): Promise<ThemeConfig> {
  const themeFilePath = path.join(THEMES_DIR, themeId, "theme.json");

  try {
    const fileContent = await fs.readFile(themeFilePath, "utf-8");
    const themeConfig: ThemeConfig = JSON.parse(fileContent);
    return themeConfig;
  } catch (error) {
    throw new Error(
      `[themeRepository] Failed to load theme "${themeId}" from ${themeFilePath}: ${(error as Error).message}`
    );
  }
}

/**
 * Loads page structure JSON (e.g. "home.json") for a specific theme.
 */
export async function loadPage(
  themeId: string,
  pageName: string = "home"
): Promise<PageConfig> {
  const pageFilePath = path.join(THEMES_DIR, themeId, "pages", `${pageName}.json`);

  try {
    const fileContent = await fs.readFile(pageFilePath, "utf-8");
    const pageConfig: PageConfig = JSON.parse(fileContent);
    return pageConfig;
  } catch (error) {
    throw new Error(
      `[themeRepository] Failed to load page "${pageName}" for theme "${themeId}" from ${pageFilePath}: ${(error as Error).message}`
    );
  }
}
