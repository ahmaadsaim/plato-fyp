"use client";

import React from "react";
import type { TemplateProps } from "./HomeTemplate";
import { SectionRenderer } from "@/storefront/SectionRenderer";
import CartSidebar from "@/storefront/components/cart-sidebar";

/**
 * Classic Restaurant Home Page Template ("classic-restaurant-home")
 * Tailored for classic bistros, fine dining, and artisanal trattorias.
 */
export function ClassicHomeTemplate({
  sections,
  theme,
  restaurant,
  products,
  categories,
}: TemplateProps) {
  return (
    <main className="min-h-screen w-full flex flex-col font-serif selection:bg-amber-600 selection:text-white transition-colors duration-300">
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
