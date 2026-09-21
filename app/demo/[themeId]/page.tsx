import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  loadTheme,
  loadPage,
  getAvailableThemes,
} from "@/lib/theme/repository";
import { loadRestaurantCatalog } from "@/lib/catalog/repository";
import { ThemeDemoViewer } from "@/components/demo/ThemeDemoViewer";

interface ThemeDemoPageProps {
  params: Promise<{ themeId: string }>;
}

export const dynamic = "force-dynamic";

/**
 * Generate static params for all available themes discovered locally.
 */
export async function generateStaticParams() {
  const themes = await getAvailableThemes();
  return themes.map((t) => ({ themeId: t.id }));
}

/**
 * Server Component for /demo/[themeId]
 * Loads theme configuration, page configuration, and restaurant catalog data from local JSON.
 */
export default async function ThemeDemoPage({ params }: ThemeDemoPageProps) {
  const { themeId } = await params;

  try {
    const [themeConfig, pageConfig, catalogData] = await Promise.all([
      loadTheme(themeId),
      loadPage(themeId, "home"),
      loadRestaurantCatalog(),
    ]);

    return (
      <ThemeDemoViewer
        initialTheme={themeConfig}
        initialPage={pageConfig}
        restaurant={catalogData.restaurant}
        products={catalogData.products}
        categories={catalogData.categories}
      />
    );
  } catch (error) {
    console.error(`[ThemeDemoPage] Failed to render theme '${themeId}':`, error);
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md p-8 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl">
          <span className="text-4xl mb-4 block">🔍</span>
          <h1 className="text-2xl font-black mb-2">Theme Not Found</h1>
          <p className="text-sm text-zinc-400 mb-6">
            Could not load theme configuration for ID <code>&quot;{themeId}&quot;</code>.
            Verify that <code>themes/{themeId}/theme.json</code> exists.
          </p>
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white transition-colors"
          >
            ← Return to Theme Directory
          </Link>
        </div>
      </div>
    );
  }
}
