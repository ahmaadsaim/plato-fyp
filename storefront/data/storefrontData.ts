import { loadTheme } from "@/lib/theme/repository";
import { mergeTheme, type TenantThemeOverrides } from "@/lib/theme/mergeTheme";
import type {
  StorefrontData,
  RestaurantData,
  ProductData,
  CategoryData,
  ThemeConfig,
} from "@/lib/theme/types";
import { getTenantCustomization, type TenantCustomization } from "@/lib/store-config";
import { demoRestaurant, demoProducts, demoCategories } from "@/storefront/demo/demoData";
import type { StoreConfig, Product, Category } from "@/storefront/types/store";
import defaultStoreJson from "@/storefront/config/default-store.json";

/**
 * ONE UNIFIED STOREFRONT DATA ENTRY POINT.
 *
 * Current: Reads JSON files (data/tenants/{slug}.json, storefront/themes/{id}/tokens.json, data/products.json).
 * Future: Reads PostgreSQL tables (tenants, tenant_overrides, products, categories).
 *
 * The ThemeRenderer and Storefront do NOT care whether this data comes from JSON or PostgreSQL.
 */
export async function getStorefrontData(
  tenantId: string,
  tenantSlug?: string,
  tenantName?: string,
  themeOverride?: string
): Promise<StorefrontData> {
  const slug = (tenantSlug || tenantId).toLowerCase();

  // 1. Read tenant customization
  type TenantCustomizationWithOverrides = TenantCustomization & {
    themeId?: string;
    overrides?: TenantThemeOverrides;
  };

  let custom: TenantCustomizationWithOverrides | null = null;

  try {
    custom = (await getTenantCustomization(slug)) as TenantCustomizationWithOverrides | null;
  } catch {
    custom = null;
  }

  // 2. Resolve theme ID
  const selectedThemeId =
    themeOverride ||
    custom?.themeId ||
    custom?.theme ||
    "modern";

  // 3. Load base theme from storefront/themes/{themeId}
  let baseTheme: ThemeConfig;
  try {
    baseTheme = await loadTheme(selectedThemeId);
  } catch (error) {
    console.warn(
      `[storefrontData] Theme "${selectedThemeId}" not found, falling back to "modern":`,
      error
    );
    baseTheme = await loadTheme("modern");
  }

  // 4. Construct tenant theme overrides
  const tokenOverrides: Record<string, string> = {};
  if (custom?.primaryColor) tokenOverrides.primary = custom.primaryColor;
  if (custom?.secondaryColor) tokenOverrides.secondary = custom.secondaryColor;
  if (custom?.buttonColor) tokenOverrides.button = custom.buttonColor;
  if (custom?.buttonTextColor) tokenOverrides.buttonText = custom.buttonTextColor;
  if (custom?.cardColor) tokenOverrides.card = custom.cardColor;
  if (custom?.backgroundColor) tokenOverrides.background = custom.backgroundColor;
  if (custom?.textColor) tokenOverrides.text = custom.textColor;

  const fontStyle = custom?.fontStyle;
  const typographyOverrides: Record<string, string> = {};
  if (fontStyle === "serif") {
    typographyOverrides.fontFamily = "Georgia, 'Playfair Display', Cambria, serif";
    typographyOverrides.headingFont = "Georgia, 'Playfair Display', Cambria, serif";
  } else if (fontStyle === "display") {
    typographyOverrides.fontFamily = "'Outfit', 'Montserrat', sans-serif";
    typographyOverrides.headingFont = "'Outfit', 'Montserrat', sans-serif";
  } else if (fontStyle === "geometric") {
    typographyOverrides.fontFamily = "'Plus Jakarta Sans', system-ui, sans-serif";
    typographyOverrides.headingFont = "'Plus Jakarta Sans', system-ui, sans-serif";
  }

  const layoutHomeOverrides: Record<string, unknown> = {};
  if (custom?.headline) {
    layoutHomeOverrides.hero = {
      title: custom.headline,
    };
  }

  const overrides: TenantThemeOverrides = {
    tokens: {
      colors: {
        ...tokenOverrides,
        ...(custom?.overrides?.tokens?.colors || {}),
      },
      typography: {
        ...typographyOverrides,
        ...(custom?.overrides?.tokens?.typography || {}),
      },
      ...(custom?.overrides?.tokens || {}),
    },
    layout: {
      home: {
        ...layoutHomeOverrides,
        ...(custom?.overrides?.layout?.home || {}),
      },
      ...(custom?.overrides?.layout || {}),
    },
  };

  // 5. Deep merge base theme + tenant overrides
  const finalTheme = mergeTheme(baseTheme, overrides);

  // 6. Business Data (Isolated from theme overrides)
  const resolvedName = custom?.name || tenantName || formatNameFromSlug(slug);

  const restaurant: RestaurantData = {
    id: tenantId,
    name: resolvedName,
    tagline: custom?.headline || custom?.cuisine || demoRestaurant.tagline,
    description: custom?.cuisine
      ? `Specializing in ${custom.cuisine} prepared fresh daily.`
      : demoRestaurant.description,
    logo: custom?.logo || demoRestaurant.logo,
    phone: custom?.phone || demoRestaurant.phone,
    email: demoRestaurant.email,
    address: custom?.address
      ? {
          street: custom.address,
          city: "Lahore",
          state: "Punjab",
          postalCode: "54000",
          country: "Pakistan",
        }
      : demoRestaurant.address,
    hours: custom?.hours
      ? {
          weekdays: custom.hours,
          weekends: custom.hours,
        }
      : demoRestaurant.hours,
    rating: demoRestaurant.rating,
    reviewCount: demoRestaurant.reviewCount,
    deliveryTime: demoRestaurant.deliveryTime,
    deliveryFee: demoRestaurant.deliveryFee,
    minimumOrder: demoRestaurant.minimumOrder,
    currency: custom?.currency?.split(" ")?.[0] || demoRestaurant.currency,
    social: demoRestaurant.social,
  };

  // Products and Categories
  const products: ProductData[] =
    custom?.menuProducts && custom.menuProducts.length > 0
      ? (custom.menuProducts as unknown as ProductData[])
      : demoProducts;

  const categories: CategoryData[] =
    custom?.menuCategories && custom.menuCategories.length > 0
      ? (custom.menuCategories as unknown as CategoryData[])
      : demoCategories;

  // 7. StoreConfig compatibility bridge for cart & checkout
  const storeConfig: StoreConfig = {
    ...(defaultStoreJson as unknown as StoreConfig),
    storeId: slug,
    metadata: {
      ...(defaultStoreJson.metadata as unknown as StoreConfig["metadata"]),
      name: resolvedName,
      tagline: restaurant.tagline,
      description: restaurant.description,
      logo: restaurant.logo,
      contact: {
        phone: restaurant.phone,
        email: restaurant.email,
        address: restaurant.address.street,
        city: restaurant.address.city,
        country: restaurant.address.country,
        whatsapp: restaurant.phone.replace(/[^0-9]/g, ""),
      },
      currency: {
        symbol: restaurant.currency,
        code: "USD",
        position: "before",
      },
      theme: {
        name: finalTheme.name,
        primaryColor: finalTheme.tokens.colors.primary,
        secondaryColor: finalTheme.tokens.colors.secondary,
        buttonColor: finalTheme.tokens.colors.button || finalTheme.tokens.colors.primary,
        buttonTextColor: finalTheme.tokens.colors.buttonText || "#FFFFFF",
        cardColor: finalTheme.tokens.colors.card || "#FFFFFF",
        backgroundColor: finalTheme.tokens.colors.background || "#FFFFFF",
        textColor: finalTheme.tokens.colors.text || "#111111",
        accentColor: finalTheme.tokens.colors.accent || finalTheme.tokens.colors.primary,
        primaryForeground: finalTheme.tokens.colors.buttonText || "#FFFFFF",
      },
    },
    products: products as unknown as Product[],
    categories: categories as unknown as Category[],
  };

  return {
    tenant: {
      id: tenantId,
      name: resolvedName,
      slug,
    },
    theme: finalTheme,
    restaurant,
    products,
    categories,
    storeConfig,
  };
}

function formatNameFromSlug(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
