import { loadTheme } from "@/lib/theme/repository";
import { mergeTheme, type TenantThemeOverrides } from "@/lib/theme/mergeTheme";
import type {
  StorefrontData,
  RestaurantData,
  ProductData,
  CategoryData,
  ThemeConfig,
} from "@/lib/theme/types";
import { getTenantCustomization } from "@/lib/store-config";
import { demoRestaurant, demoProducts, demoCategories } from "@/storefront/demo/demoData";
import type { StoreConfig, Product, Category } from "@/storefront/types/store";
import defaultStoreJson from "@/storefront/config/default-store.json";

export async function getStorefrontData(
  tenantId: string,
  tenantSlug?: string,
  tenantName?: string,
  themeOverride?: string
): Promise<StorefrontData> {
  const slug = (tenantSlug || tenantId).toLowerCase();

  const custom = await getTenantCustomization(slug);
  const selectedThemeId = themeOverride || custom?.themeId || custom?.theme || "modern";

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
    layoutHomeOverrides.hero = { title: custom.headline };
  }

  const overrideData = custom?.layoutOverride || {};
  const overrides: TenantThemeOverrides = {
    tokens: {
      colors: {
        ...tokenOverrides,
        ...((custom?.tokensOverride as Record<string, unknown> | undefined)?.colors as Record<string, string> | undefined || {}),
      },
      typography: {
        ...typographyOverrides,
        ...((custom?.tokensOverride as Record<string, unknown> | undefined)?.typography as Record<string, string> | undefined || {}),
      },
      ...((custom?.tokensOverride as Record<string, unknown>) || {}),
    },
    layout: {
      home: {
        ...layoutHomeOverrides,
        ...((overrideData as Record<string, unknown>).home as Record<string, unknown> | undefined || {}),
      },
      ...(overrideData as Record<string, unknown>),
    },
  };

  const finalTheme = mergeTheme(baseTheme, overrides);
  const resolvedName = custom?.name || tenantName || formatNameFromSlug(slug);

  const restaurant: RestaurantData = {
    id: tenantId,
    name: resolvedName,
    tagline: custom?.headline || custom?.cuisine || demoRestaurant.tagline,
    description: custom?.cuisine ? `Specializing in ${custom.cuisine} prepared fresh daily.` : demoRestaurant.description,
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

  const products: ProductData[] =
    custom?.menuProducts && custom.menuProducts.length > 0
      ? (custom.menuProducts as unknown as ProductData[])
      : demoProducts;

  const categories: CategoryData[] =
    custom?.menuCategories && custom.menuCategories.length > 0
      ? (custom.menuCategories as unknown as CategoryData[])
      : demoCategories;

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
