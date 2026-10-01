"use client";

import React, { createContext, useContext } from "react";
import type {
  ThemeTokens,
  RestaurantData,
  ProductData,
  CategoryData,
} from "@/lib/theme/types";

interface ThemeContextValue {
  theme: ThemeTokens;
  themeId: string;
  themeName: string;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
  theme,
  themeId,
  themeName,
  children,
}: {
  theme: ThemeTokens;
  themeId: string;
  themeName: string;
  children: React.ReactNode;
}) {
  return (
    <ThemeContext.Provider value={{ theme, themeId, themeName }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

interface RestaurantDataContextValue {
  restaurant: RestaurantData;
  products: ProductData[];
  categories: CategoryData[];
}

const RestaurantDataContext = createContext<RestaurantDataContextValue | null>(
  null
);

export function RestaurantDataProvider({
  restaurant,
  products,
  categories,
  children,
}: {
  restaurant: RestaurantData;
  products: ProductData[];
  categories: CategoryData[];
  children: React.ReactNode;
}) {
  return (
    <RestaurantDataContext.Provider value={{ restaurant, products, categories }}>
      {children}
    </RestaurantDataContext.Provider>
  );
}

export function useRestaurantData(): RestaurantDataContextValue {
  const context = useContext(RestaurantDataContext);
  if (!context) {
    throw new Error(
      "useRestaurantData must be used within a RestaurantDataProvider"
    );
  }
  return context;
}
