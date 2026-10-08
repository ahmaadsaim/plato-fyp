"use client";

import React from "react";
import type { SectionComponentProps } from "@/lib/theme/types";
import { Container } from "@/components/ui/Container";
import { CategoryCard } from "@/storefront/components/CategoryCard";

interface CategorySettings {
  title?: string;
  subtitle?: string;
  layout?: "cards" | "pills";
}

export function CategorySection({
  settings,
  categories,
}: SectionComponentProps<CategorySettings>) {
  const {
    title = "Explore by Category",
    subtitle = "From stone-fired artisan pizzas to handcrafted pasta and botanical beverages",
  } = settings || {};

  const handleCategoryClick = () => {
    const el = document.getElementById("menu-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="categories-section"
      className="py-16 md:py-20 transition-colors"
      style={{
        backgroundColor: "var(--theme-color-surface, #F8F8F8)",
        borderTop: "1px solid var(--theme-color-border, #E5E7EB)",
        borderBottom: "1px solid var(--theme-color-border, #E5E7EB)",
      }}
    >
      <Container>
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="max-w-2xl">
            <span
              className="text-xs font-bold tracking-widest uppercase mb-2 block"
              style={{ color: "var(--theme-color-primary, #84CC16)" }}
            >
              Curated Offerings
            </span>
            <h2
              className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight"
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

          <div className="hidden sm:block">
            <a
              href="#menu-section"
              className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wide transition-colors hover:underline"
              style={{ color: "var(--theme-color-accent, #84CC16)" }}
            >
              <span>View Full Menu</span>
              <span>→</span>
            </a>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.id || category.slug}
              category={category}
              onClick={handleCategoryClick}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
