"use client";

import React, { useState, useMemo } from "react";
import type { SectionComponentProps } from "@/lib/theme/types";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/storefront/components/ProductCard";

interface ProductGridSettings {
  title?: string;
  subtitle?: string;
  limit?: number;
  columns?: number;
  filterCategory?: string;
  showFilterTabs?: boolean;
}

export function ProductGridSection({
  settings,
  theme,
  restaurant,
  products,
  categories,
}: SectionComponentProps<ProductGridSettings>) {
  const {
    title = "Chef's Signature Selections",
    subtitle = "Our most coveted dishes, prepared fresh with seasonal farm ingredients",
    limit = 12,
    columns = (theme.layout?.productColumns as number) || 4,
    filterCategory = "all",
    showFilterTabs = true,
  } = settings || {};

  const [selectedCategory, setSelectedCategory] = useState<string>(filterCategory);

  const displayedProducts = useMemo(() => {
    let filtered = products;
    if (selectedCategory && selectedCategory !== "all") {
      filtered = products.filter(
        (p) => p.categoryId === selectedCategory || p.categoryName === selectedCategory
      );
    }
    return filtered.slice(0, limit);
  }, [products, selectedCategory, limit]);

  const gridColumnClasses = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  }[columns as 2 | 3 | 4] || "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  return (
    <section
      id="menu-section"
      className="py-16 md:py-24 transition-colors"
      style={{
        backgroundColor: "var(--theme-color-background, #FFFFFF)",
      }}
    >
      <Container>
        {/* Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-10">
          <span
            className="text-xs font-bold tracking-widest uppercase mb-2"
            style={{ color: "var(--theme-color-primary, #84CC16)" }}
          >
            Fresh From Our Kitchen
          </span>
          <h2
            className="text-3xl sm:text-4xl font-black tracking-tight"
            style={{
              fontFamily: "var(--theme-font-heading, var(--brand-font-family, inherit))",
              color: "var(--theme-color-text, #111111)",
            }}
          >
            {title}
          </h2>
          <p
            className="mt-2 text-sm sm:text-base"
            style={{ color: "var(--theme-color-muted-text, #666666)" }}
          >
            {subtitle}
          </p>
        </div>

        {/* Category Filter Tabs */}
        {showFilterTabs && (
          <div className="flex items-center justify-center flex-wrap gap-2 mb-12">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 text-xs font-bold transition-all cursor-pointer rounded-full ${
                selectedCategory === "all" ? "shadow-md scale-105" : "hover:opacity-80"
              }`}
              style={{
                backgroundColor:
                  selectedCategory === "all"
                    ? "var(--theme-color-primary, #84CC16)"
                    : "var(--theme-color-surface, #F3F4F6)",
                color:
                  selectedCategory === "all"
                    ? "var(--theme-color-button-text, #FFFFFF)"
                    : "var(--theme-color-text, #111111)",
                border: "1px solid var(--theme-color-border, #E5E7EB)",
              }}
            >
              All Items ({products.length})
            </button>

            {categories.map((cat) => {
              const catKey = cat.id || cat.slug;
              const isSelected = selectedCategory === catKey || selectedCategory === cat.name;

              return (
                <button
                  key={catKey}
                  type="button"
                  onClick={() => setSelectedCategory(catKey)}
                  className={`px-4 py-2 text-xs font-bold transition-all cursor-pointer rounded-full flex items-center gap-1.5 ${
                    isSelected ? "shadow-md scale-105" : "hover:opacity-80"
                  }`}
                  style={{
                    backgroundColor: isSelected
                      ? "var(--theme-color-primary, #84CC16)"
                      : "var(--theme-color-surface, #F3F4F6)",
                    color: isSelected
                      ? "var(--theme-color-button-text, #FFFFFF)"
                      : "var(--theme-color-text, #111111)",
                    border: "1px solid var(--theme-color-border, #E5E7EB)",
                  }}
                >
                  {cat.icon && <span>{cat.icon}</span>}
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Product Grid */}
        {displayedProducts.length > 0 ? (
          <div className={`grid gap-6 ${gridColumnClasses}`}>
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                currency={restaurant.currency || "$"}
              />
            ))}
          </div>
        ) : (
          <div
            className="p-12 text-center rounded-2xl border"
            style={{
              backgroundColor: "var(--theme-color-surface, #F8F8F8)",
              borderColor: "var(--theme-color-border, #E5E7EB)",
            }}
          >
            <p className="text-sm font-medium" style={{ color: "var(--theme-color-muted-text, #666666)" }}>
              No dishes found in this category.
            </p>
          </div>
        )}
      </Container>
    </section>
  );
}
