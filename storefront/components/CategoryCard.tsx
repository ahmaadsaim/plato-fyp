import React from "react";
import Image from "next/image";
import type { CategoryData } from "@/lib/theme/types";

export interface CategoryCardProps {
  category: CategoryData;
  isActive?: boolean;
  onClick?: (category: CategoryData) => void;
}

export function CategoryCard({
  category,
  isActive = false,
  onClick,
}: CategoryCardProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(category)}
      className={`group relative flex flex-col items-center text-center p-4 w-full transition-all duration-300 cursor-pointer overflow-hidden ${
        isActive ? "ring-2 scale-[1.02]" : "hover:-translate-y-1"
      }`}
      style={{
        backgroundColor: isActive
          ? "var(--theme-color-surface-hover, var(--theme-color-surface, #F3F4F6))"
          : "var(--theme-color-card, #FFFFFF)",
        border: `1px solid ${
          isActive
            ? "var(--theme-color-primary, #84CC16)"
            : "var(--theme-color-border, #E5E7EB)"
        }`,
        borderRadius: "var(--theme-radius-large, var(--brand-border-radius, 1rem))",
        boxShadow: "var(--theme-shadow-card, 0 4px 6px -1px rgba(0,0,0,0.05))",
      }}
    >
      {/* Category Image */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-3 border-2 border-black/10 shadow-inner transition-colors">
        {category.image ? (
          <Image
            src={category.image}
            alt={category.name}
            fill
            sizes="96px"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl bg-black/5">
            {category.icon || "🍽️"}
          </div>
        )}
        <div className="absolute inset-0 bg-black/10" />
        {category.icon && (
          <span className="absolute bottom-1 right-1 text-base select-none">
            {category.icon}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="w-full">
        <h4
          className="text-sm font-bold tracking-tight mb-1 transition-colors"
          style={{ color: "var(--theme-color-text, #111111)" }}
        >
          {category.name}
        </h4>
        {category.itemCount !== undefined && (
          <p
            className="text-xs line-clamp-1 font-medium"
            style={{ color: "var(--theme-color-muted-text, #666666)" }}
          >
            {category.itemCount} items
          </p>
        )}
      </div>
    </button>
  );
}

export default CategoryCard;
