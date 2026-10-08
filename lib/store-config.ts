import type { StoreConfig } from "@/storefront/types/store";
import { sampleStores } from "@/storefront/config/sampleStores";
import defaultStoreJson from "@/storefront/config/default-store.json";
import { query } from "@/lib/db";
import {
  getTenantBySlug,
  getTenantThemeOverride,
  normalizeThemeSource,
  updateTenantTheme,
  upsertTenantThemeOverride,
} from "@/lib/tenant/repository";

export { sampleStores } from "@/storefront/config/sampleStores";

export interface TenantCustomization {
  name?: string;
  slug?: string;
  logo?: string;
  currency?: string;
  cuisine?: string;
  phone?: string;
  address?: string;
  hours?: string;
  headline?: string;
  primaryColor?: string;
  secondaryColor?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  cardColor?: string;
  backgroundColor?: string;
  textColor?: string;
  fontStyle?: "sans" | "serif" | "display" | "geometric" | string;
  animationOption?: "smooth" | "energetic" | "minimal" | string;
  theme?: string;
  themeId?: string;
  themeSource?: string;
  tokensOverride?: Record<string, unknown>;
  layoutOverride?: Record<string, unknown>;
  menuProducts?: import('@/storefront/types/store').Product[];
  menuCategories?: import('@/storefront/types/store').Category[];
  updatedAt?: string;
}

function normalizeJsonObject(input: unknown): Record<string, unknown> {
  if (input && typeof input === "object" && !Array.isArray(input)) {
    return input as Record<string, unknown>;
  }

  return {};
}

function buildTokensOverride(data: Partial<TenantCustomization>): Record<string, unknown> {
  const colors: Record<string, string> = {};
  const typography: Record<string, string> = {};

  if (data.primaryColor) colors.primary = data.primaryColor;
  if (data.secondaryColor) colors.secondary = data.secondaryColor;
  if (data.buttonColor) colors.button = data.buttonColor;
  if (data.buttonTextColor) colors.buttonText = data.buttonTextColor;
  if (data.cardColor) colors.card = data.cardColor;
  if (data.backgroundColor) colors.background = data.backgroundColor;
  if (data.textColor) colors.text = data.textColor;

  if (data.fontStyle === "serif") {
    typography.fontFamily = "Georgia, 'Playfair Display', Cambria, serif";
    typography.headingFont = "Georgia, 'Playfair Display', Cambria, serif";
  } else if (data.fontStyle === "display") {
    typography.fontFamily = "'Outfit', 'Montserrat', sans-serif";
    typography.headingFont = "'Outfit', 'Montserrat', sans-serif";
  } else if (data.fontStyle === "geometric") {
    typography.fontFamily = "'Plus Jakarta Sans', system-ui, sans-serif";
    typography.headingFont = "'Plus Jakarta Sans', system-ui, sans-serif";
  }

  const payload: Record<string, unknown> = {};
  if (Object.keys(colors).length > 0) payload.colors = colors;
  if (Object.keys(typography).length > 0) payload.typography = typography;
  return payload;
}

function buildLayoutOverride(data: Partial<TenantCustomization>): Record<string, unknown> {
  const layout: Record<string, unknown> = {};
  const hero: Record<string, unknown> = {};

  if (data.headline) hero.title = data.headline;
  if (data.cuisine) hero.subtitle = data.cuisine;

  if (Object.keys(hero).length > 0) {
    layout.home = { hero };
  }

  return layout;
}

export async function getTenantCustomization(slug: string): Promise<TenantCustomization | null> {
  try {
    const tenant = await getTenantBySlug(slug);
    if (!tenant) return null;

    const override = await getTenantThemeOverride(tenant.id);
    const tokensOverride = normalizeJsonObject(override?.tokens_override ?? {});
    const layoutOverride = normalizeJsonObject(override?.layout_override ?? {});
    const colors = normalizeJsonObject(tokensOverride.colors);
    const typography = normalizeJsonObject(tokensOverride.typography);

    const homeLayout = normalizeJsonObject((layoutOverride as Record<string, unknown>).home);
    const homeHero = normalizeJsonObject(homeLayout.hero);
    const rootHero = normalizeJsonObject((layoutOverride as Record<string, unknown>).hero);

    const headline =
      (typeof homeHero.title === "string" ? homeHero.title : undefined) ||
      (typeof rootHero.title === "string" ? rootHero.title : undefined);

    return {
      name: tenant.name,
      slug: tenant.slug,
      theme: tenant.theme_id || "modern",
      themeId: tenant.theme_id || "modern",
      themeSource: normalizeThemeSource((tenant as { theme_source?: string | null }).theme_source),
      primaryColor: typeof colors.primary === "string" ? String(colors.primary) : undefined,
      secondaryColor: typeof colors.secondary === "string" ? String(colors.secondary) : undefined,
      buttonColor: typeof colors.button === "string" ? String(colors.button) : undefined,
      buttonTextColor: typeof colors.buttonText === "string" ? String(colors.buttonText) : undefined,
      cardColor: typeof colors.card === "string" ? String(colors.card) : undefined,
      backgroundColor: typeof colors.background === "string" ? String(colors.background) : undefined,
      textColor: typeof colors.text === "string" ? String(colors.text) : undefined,
      fontStyle:
        typeof typography.fontFamily === "string" && typography.fontFamily.includes("Georgia")
          ? "serif"
          : typeof typography.fontFamily === "string" && typography.fontFamily.includes("Outfit")
            ? "display"
            : typeof typography.fontFamily === "string" && typography.fontFamily.includes("Plus Jakarta")
              ? "geometric"
              : "sans",
      headline,
      cuisine:
        (typeof homeHero.subtitle === "string" ? homeHero.subtitle : undefined) ||
        (typeof rootHero.subtitle === "string" ? rootHero.subtitle : undefined),
      tokensOverride,
      layoutOverride,
      updatedAt: override?.updated_at ?? tenant.created_at,
    };
  } catch {
    return null;
  }
}

export async function saveTenantCustomization(
  slug: string,
  data: Partial<TenantCustomization>
): Promise<TenantCustomization> {
  const tenant = await getTenantBySlug(slug);
  if (!tenant) {
    throw new Error(`Tenant "${slug}" not found.`);
  }

  const selectedThemeId = data.themeId || data.theme || tenant.theme_id || "modern";
  const selectedThemeSource = normalizeThemeSource(data.themeSource || "LOCAL");

  await updateTenantTheme(slug, selectedThemeId, tenant.user_id, selectedThemeSource);

  const tokensOverride = buildTokensOverride(data);
  const layoutOverride = buildLayoutOverride(data);

  await upsertTenantThemeOverride(tenant.id, {
    tokensOverride,
    layoutOverride,
  });

  return {
    ...data,
    name: tenant.name,
    slug: tenant.slug,
    theme: selectedThemeId,
    themeId: selectedThemeId,
    themeSource: selectedThemeSource,
    tokensOverride,
    layoutOverride,
    updatedAt: new Date().toISOString(),
  };
}

export async function deleteTenantCustomization(slug: string): Promise<void> {
  const tenant = await getTenantBySlug(slug);
  if (!tenant) return;

  await query("DELETE FROM theme_overrides WHERE tenant_id = $1", [tenant.id]);
}

/**
 * Returns complete StoreConfig for a tenant, merging their profile & colors with the default MVP template
 */
export async function getStoreConfigForTenant(
  slug: string,
  tenantName?: string
): Promise<StoreConfig> {
  const custom = await getTenantCustomization(slug);

  if (sampleStores[slug] && !custom) {
    return sampleStores[slug];
  }

  const baseConfig = sampleStores[slug] || defaultStoreJson;
  const config = JSON.parse(JSON.stringify(baseConfig)) as StoreConfig;

  config.storeId = slug;

  if (custom?.menuCategories && custom.menuCategories.length > 0) {
    config.categories = custom.menuCategories;
  }
  if (custom?.menuProducts && custom.menuProducts.length > 0) {
    config.products = custom.menuProducts;
  }

  const resolvedName = custom?.name || tenantName || formatNameFromSlug(slug);
  config.metadata.name = resolvedName;
  if (custom?.logo) {
    config.metadata.logo = custom.logo;
  }
  if (custom?.headline || custom?.cuisine) {
    config.metadata.tagline = custom.headline || custom.cuisine || config.metadata.tagline;
  }

  if (config.heroBanners && config.heroBanners.length > 0) {
    if (custom?.headline) {
      config.heroBanners[0].title = custom.headline;
    }
    if (custom?.cuisine) {
      config.heroBanners[0].subtitle = custom.cuisine;
    }
  }

  if (custom?.phone) {
    config.metadata.contact.phone = custom.phone;
    config.metadata.contact.whatsapp = custom.phone.replace(/[^0-9]/g, "");
  }
  if (custom?.address) {
    config.metadata.contact.address = custom.address;
  }

  if (custom?.hours) {
    config.metadata.openingHours = [
      {
        days: "Monday - Sunday",
        hours: custom.hours,
      },
    ];
  }

  if (custom?.currency) {
    const parts = custom.currency.trim().split(" ");
    const symbol = parts[0] || "$";
    const code = parts[1] || "USD";
    config.metadata.currency = {
      symbol,
      code,
      position: "before",
    };
  }

  config.metadata.theme = {
    ...config.metadata.theme,
    name: custom?.theme || config.metadata.theme?.name || "Plato Default",
    primaryColor: custom?.primaryColor || config.metadata.theme?.primaryColor || "#84CC16",
    secondaryColor: custom?.secondaryColor || config.metadata.theme?.secondaryColor || "#18181B",
    buttonColor: custom?.buttonColor || custom?.primaryColor || config.metadata.theme?.buttonColor || config.metadata.theme?.primaryColor || "#84CC16",
    buttonTextColor: custom?.buttonTextColor || config.metadata.theme?.buttonTextColor || "#000000",
    cardColor: custom?.cardColor || config.metadata.theme?.cardColor || "#FFFFFF",
    backgroundColor: custom?.backgroundColor || config.metadata.theme?.backgroundColor || "#F8FAFC",
    textColor: custom?.textColor || config.metadata.theme?.textColor || "#09090B",
    fontStyle: custom?.fontStyle || config.metadata.theme?.fontStyle || "sans",
    animationOption: custom?.animationOption || config.metadata.theme?.animationOption || "smooth",
    primaryForeground: custom?.buttonTextColor || config.metadata.theme?.primaryForeground || "#000000",
    accentColor: custom?.primaryColor || config.metadata.theme?.accentColor || "#84CC16",
  };

  if (config.branches && config.branches.length > 0) {
    config.branches[0].name = `${resolvedName} - Main`;
    if (custom?.address) config.branches[0].address = custom.address;
    if (custom?.phone) config.branches[0].phone = custom.phone;
  }

  return config;
}

function formatNameFromSlug(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatCurrency(
  amount: number,
  currency?: { symbol: string; position?: "before" | "after" }
): string {
  const symbol = currency?.symbol || "Rs.";
  const position = currency?.position || "before";
  const formatted = amount.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return position === "after" ? `${formatted} ${symbol}` : `${symbol} ${formatted}`;
}
