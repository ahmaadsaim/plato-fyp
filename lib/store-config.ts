import fs from "fs/promises";
import path from "path";
import type { StoreConfig } from "@/template/types/store";
import defaultStoreJson from "@/template/config/default-store.json";
import burgerCraftJson from "@/template/config/samples/burger-craft.json";
import pizzaArtisanJson from "@/template/config/samples/pizza-artisan.json";
import sushiSakuraJson from "@/template/config/samples/sushi-sakura.json";
import velvetBakeryJson from "@/template/config/samples/velvet-bakery.json";
import tacoCantinaJson from "@/template/config/samples/taco-cantina.json";

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
  menuProducts?: any[];
  menuCategories?: any[];
  updatedAt?: string;
}

export const sampleStores: Record<string, StoreConfig> = {
  "holy-buns": defaultStoreJson as unknown as StoreConfig,
  "burger-craft": burgerCraftJson as unknown as StoreConfig,
  "pizza-artisan": pizzaArtisanJson as unknown as StoreConfig,
  "sushi-sakura": sushiSakuraJson as unknown as StoreConfig,
  "velvet-bakery": velvetBakeryJson as unknown as StoreConfig,
  "taco-cantina": tacoCantinaJson as unknown as StoreConfig,
};

const TENANTS_DIR = path.join(process.cwd(), "data", "tenants");

/**
 * Ensures data/tenants directory exists
 */
async function ensureTenantsDir(): Promise<void> {
  try {
    await fs.mkdir(TENANTS_DIR, { recursive: true });
  } catch {
    // Already exists or ignore
  }
}

/**
 * Loads saved tenant customization from data/tenants/{slug}.json
 */
export async function getTenantCustomization(slug: string): Promise<TenantCustomization | null> {
  try {
    await ensureTenantsDir();
    const filePath = path.join(TENANTS_DIR, `${slug.toLowerCase()}.json`);
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content) as TenantCustomization;
  } catch {
    return null;
  }
}

/**
 * Persists tenant customization to data/tenants/{slug}.json
 */
export async function saveTenantCustomization(
  slug: string,
  data: Partial<TenantCustomization>
): Promise<TenantCustomization> {
  await ensureTenantsDir();
  const existing = (await getTenantCustomization(slug)) || {};
  const updated: TenantCustomization = {
    ...existing,
    ...data,
    slug: slug.toLowerCase(),
    updatedAt: new Date().toISOString(),
  };

  const filePath = path.join(TENANTS_DIR, `${slug.toLowerCase()}.json`);
  await fs.writeFile(filePath, JSON.stringify(updated, null, 2), "utf-8");
  return updated;
}

/**
 * Removes saved tenant customization file
 */
export async function deleteTenantCustomization(slug: string): Promise<void> {
  try {
    const filePath = path.join(TENANTS_DIR, `${slug.toLowerCase()}.json`);
    await fs.unlink(filePath);
  } catch {
    // Ignore if file doesn't exist
  }
}

/**
 * Returns complete StoreConfig for a tenant, merging their profile & colors with the default MVP template
 */
export async function getStoreConfigForTenant(
  slug: string,
  tenantName?: string
): Promise<StoreConfig> {
  // Load customizations if saved
  const custom = await getTenantCustomization(slug);

  // If it's a sample store preset and no custom was saved, return preset
  if (sampleStores[slug] && !custom) {
    return sampleStores[slug];
  }

  // Clone template base config (preset if exists, otherwise default)
  const baseConfig = sampleStores[slug] || defaultStoreJson;
  const config = JSON.parse(JSON.stringify(baseConfig)) as StoreConfig;

  config.storeId = slug;

  // Custom menu categories & products
  if (custom?.menuCategories && custom.menuCategories.length > 0) {
    config.categories = custom.menuCategories;
  }
  if (custom?.menuProducts && custom.menuProducts.length > 0) {
    config.products = custom.menuProducts;
  }

  // 1. Restaurant Name & Tagline & Logo
  const resolvedName = custom?.name || tenantName || formatNameFromSlug(slug);
  config.metadata.name = resolvedName;
  if (custom?.logo) {
    config.metadata.logo = custom.logo;
  }
  if (custom?.headline || custom?.cuisine) {
    config.metadata.tagline = custom.headline || custom.cuisine || config.metadata.tagline;
  }

  // Update hero banner title & subtitle if custom headline / cuisine exists
  if (config.heroBanners && config.heroBanners.length > 0) {
    if (custom?.headline) {
      config.heroBanners[0].title = custom.headline;
    }
    if (custom?.cuisine) {
      config.heroBanners[0].subtitle = custom.cuisine;
    }
  }

  // 2. Contact details
  if (custom?.phone) {
    config.metadata.contact.phone = custom.phone;
    config.metadata.contact.whatsapp = custom.phone.replace(/[^0-9]/g, "");
  }
  if (custom?.address) {
    config.metadata.contact.address = custom.address;
  }

  // 3. Operating hours
  if (custom?.hours) {
    config.metadata.openingHours = [
      {
        days: "Monday - Sunday",
        hours: custom.hours,
      },
    ];
  }

  // 4. Currency
  if (custom?.currency) {
    const parts = custom.currency.trim().split(" ");
    const symbol = parts[0] || "$";
    const code = parts[1] || "USD";
    config.metadata.currency = {
      symbol,
      code,
      position: symbol === "₨" || symbol === "Rs." ? "before" : "before",
    };
  }

  // 5. Theme Palette & Visual Customization
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

  // 6. Branch details
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

/**
 * Currency formatter
 */
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
