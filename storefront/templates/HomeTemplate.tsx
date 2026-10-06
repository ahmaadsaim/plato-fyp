"use client";

import React from "react";
import type {
  SectionConfig,
  ThemeTokens,
  RestaurantData,
  ProductData,
  CategoryData,
} from "@/lib/theme/types";
import { SectionRenderer } from "@/storefront/SectionRenderer";
import CartSidebar from "@/storefront/components/cart-sidebar";

export interface TemplateProps {
  sections: SectionConfig[];
  theme: ThemeTokens;
  restaurant: RestaurantData;
  products: ProductData[];
  categories: CategoryData[];
}

/**
 * Modern Restaurant Home Page Template ("restaurant-home")
 * Renders page sections sequentially as configured by the theme layout.
 */
export function HomeTemplate({
  sections,
  theme,
  restaurant,
  products,
  categories,
}: TemplateProps) {
  return (
    <main className="min-h-screen w-full flex flex-col font-sans transition-colors duration-300">
      {sections.map((section, index) => (
        <SectionRenderer
          key={section.id || `${section.type}-${index}`}
          section={section}
          theme={theme}
          restaurant={restaurant}
          products={products}
          categories={categories}
          index={index}
        />
      ))}
      <CartSidebar />
    </main>
  );
}
