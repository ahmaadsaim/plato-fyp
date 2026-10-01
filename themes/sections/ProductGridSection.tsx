"use client";

import React, { useState, useMemo } from "react";
import type { SectionComponentProps } from "@/lib/theme/types";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/themes/common/ProductCard";

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
    limit = 8,
    columns = (theme.layout?.productColumns as number) || 4,
    filterCategory = "all",
    showFilterTabs = true,
  } = settings || {};

  const [selectedCategory, setSelectedCategory] = useState<string>(filterCategory);

  // Filtered products list
  const displayedProducts = useMemo(() => {
    let filtered = products;
    if (selectedCategory && selectedCategory !== "all") {
      filtered = products.filter((p) => p.categoryId === selectedCategory);
    }
    return filtered.slice(0, limit);
  }, [products, selectedCategory, limit]);

  // Dynamic grid class based on columns setting
  const gridColumnClasses = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  }[columns as 2 | 3 | 4] || "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

  return (
    <section
      id="menu-section"
      className="py-16 md:py-24"
      style={{
        backgroundColor: "var(--theme-color-background, #0D0F12)",
      }}
    >
      <Container>
        {/* Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-10">
          <span
            className="text-xs font-bold tracking-widest uppercase mb-2"
            style={{ color: "var(--theme-color-primary, #E05A2B)" }}
          >
            Fresh From Our Hearth
          </span>
          <h2
            className="text-3xl sm:text-4xl font-black tracking-tight"
            style={{
              fontFamily: "var(--theme-font-heading)",
              color: "var(--theme-color-text, #F8FAFC)",
            }}
          >
            {title}
          </h2>
          <p
            className="mt-2 text-sm sm:text-base"
            style={{ color: "var(--theme-color-muted-text, #94A3B8)" }}
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
                selectedCategory === "all"
                  ? "shadow-md scale-105"
                  : "hover:bg-zinc-800 text-zinc-400"
              }`}
              style={{
                backgroundColor:
                  selectedCategory === "all"
                    ? "var(--theme-color-primary, #E05A2B)"
                    : "var(--theme-color-surface-card, #1E222B)",
                color:
                  selectedCategory === "all"
                    ? "#FFFFFF"
                    : "var(--theme-color-text, #F8FAFC)",
                border: "1px solid var(--theme-color-border, #2E3646)",
              }}
            >
              All Items ({products.length})
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 text-xs font-bold transition-all cursor-pointer rounded-full flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? "shadow-md scale-105"
                    : "hover:bg-zinc-800 text-zinc-400"
                }`}
                style={{
                  backgroundColor:
                    selectedCategory === cat.id
                      ? "var(--theme-color-primary, #E05A2B)"
                      : "var(--theme-color-surface-card, #1E222B)",
                  color:
                    selectedCategory === cat.id
                      ? "#FFFFFF"
                      : "var(--theme-color-text, #F8FAFC)",
                  border: "1px solid var(--theme-color-border, #2E3646)",
                }}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
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
              backgroundColor: "var(--theme-color-surface, #16191F)",
              borderColor: "var(--theme-color-border, #2E3646)",
            }}
          >
            <p className="text-zinc-400 text-sm">
              No dishes found in this category.
            </p>
          </div>
        )}
      </Container>
    </section>
  );
}
