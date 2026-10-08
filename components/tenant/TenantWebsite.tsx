"use client";

import React from "react";
import type { Tenant } from "@/lib/tenant";
import type { StoreConfig } from "@/storefront/types/store";
import type { StorefrontData } from "@/lib/theme/types";
import { Storefront } from "@/storefront/Storefront";

interface TenantWebsiteProps {
  tenant: Tenant;
  initialConfig?: StoreConfig;
  storefrontData?: StorefrontData;
}

/**
 * TenantWebsite adapter component.
 * Directs rendering to the single unified Storefront and ThemeRenderer.
 */
export function TenantWebsite({
  tenant,
  initialConfig,
  storefrontData,
}: TenantWebsiteProps) {
  if (storefrontData) {
    return <Storefront data={storefrontData} />;
  }

  // Fallback synthetic data if only initialConfig is provided
  const config = initialConfig || ({} as StoreConfig);
  const themeName = config.metadata?.theme?.name || "modern";
  const primaryColor = config.metadata?.theme?.primaryColor || "#84CC16";

  const syntheticData: StorefrontData = {
    tenant: {
      id: tenant.id,
      name: tenant.name,
      slug: tenant.slug,
    },
    theme: {
      id: "modern",
      name: themeName,
      version: "1.0.0",
      description: config.metadata?.description || "",
      tokens: {
        colors: {
          primary: primaryColor,
          secondary: config.metadata?.theme?.secondaryColor || "#18181B",
          background: config.metadata?.theme?.backgroundColor || "#FFFFFF",
          card: config.metadata?.theme?.cardColor || "#FFFFFF",
          text: config.metadata?.theme?.textColor || "#111111",
          button: config.metadata?.theme?.buttonColor || primaryColor,
          buttonText: config.metadata?.theme?.buttonTextColor || "#FFFFFF",
        },
        typography: {
          fontFamily: "var(--font-geist-sans), Inter, sans-serif",
        },
      },
      layout: {
        themeId: "modern",
        templates: { home: "restaurant-home" },
        pages: {
          home: [
            { id: "nav-1", type: "navbar" },
            { id: "hero-1", type: "hero" },
            { id: "cat-1", type: "categories" },
            { id: "prod-1", type: "product-grid" },
            { id: "promo-1", type: "promo" },
            { id: "foot-1", type: "footer" },
          ],
        },
      },
    },
    restaurant: {
      id: tenant.id,
      name: tenant.name,
      tagline: config.metadata?.tagline || "",
      description: config.metadata?.description || "",
      logo: config.metadata?.logo || "",
      phone: config.metadata?.contact?.phone || "",
      email: config.metadata?.contact?.email || "",
      address: {
        street: config.metadata?.contact?.address || "",
        city: config.metadata?.contact?.city || "",
        state: "",
        postalCode: "",
        country: config.metadata?.contact?.country || "",
      },
      hours: {
        weekdays: "11:00 AM – 10:00 PM",
        weekends: "10:00 AM – 11:00 PM",
      },
      rating: 4.9,
      reviewCount: 2400,
      deliveryTime: "25-35 min",
      deliveryFee: "$2.99",
      minimumOrder: "$15.00",
      currency: "$",
      social: {},
    },
    products: (config.products || []) as unknown as StorefrontData["products"],
    categories: (config.categories || []) as unknown as StorefrontData["categories"],
    storeConfig: config,
  };

  return <Storefront data={syntheticData} />;
}

export default TenantWebsite;
