"use client";

import React from "react";
import type { StorefrontData } from "@/lib/theme/types";
import { StoreProvider } from "./context/StoreContext";
import { ThemeRenderer } from "./ThemeRenderer";

export interface StorefrontProps {
  data: StorefrontData;
  className?: string;
}

/**
 * Top-level Storefront Component.
 * Receives prepared StorefrontData and orchestrates:
 * 1. StoreProvider for cart, ordering, and branch state
 * 2. ThemeRenderer for dynamic JSON-driven layout, sections & design tokens
 */
export function Storefront({ data, className = "" }: StorefrontProps) {
  return (
    <StoreProvider initialConfig={data.storeConfig}>
      <ThemeRenderer
        theme={data.theme}
        restaurant={data.restaurant}
        products={data.products}
        categories={data.categories}
        className={className}
      />
    </StoreProvider>
  );
}

export default Storefront;
