import React from "react";
import Image from "next/image";
import type { CategoryData } from "@/lib/theme/types";

interface CategoryCardProps {
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
      className={`group relative flex flex-col items-center text-center p-4 w-full text-left transition-all duration-300 cursor-pointer overflow-hidden ${
        isActive ? "ring-2 scale-[1.02]" : "hover:-translate-y-1"
      }`}
      style={{
        backgroundColor: isActive
          ? "var(--theme-color-surface-hover, #272C38)"
          : "var(--theme-color-surface-card, #1E222B)",
        border: `1px solid ${
          isActive
            ? "var(--theme-color-primary, #E05A2B)"
            : "var(--theme-color-border, #2E3646)"
        }`,
        borderRadius: "var(--theme-radius-large, 1.25rem)",
      }}
    >
      {/* Category Image */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-3 border-2 border-zinc-700/50 shadow-inner group-hover:border-amber-500/60 transition-colors">
        <Image
          src={category.image}
          alt={category.name}
          fill
          sizes="96px"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/20" />
        <span className="absolute bottom-1 right-1 text-base select-none">
          {category.icon}
        </span>
      </div>

      {/* Info */}
      <div className="w-full">
        <h4
          className="text-sm font-bold tracking-tight mb-1 group-hover:text-amber-400 transition-colors"
          style={{ color: "var(--theme-color-text, #F8FAFC)" }}
        >
          {category.name}
        </h4>
        <p
          className="text-xs line-clamp-1 font-medium"
          style={{ color: "var(--theme-color-muted-text, #94A3B8)" }}
        >
          {category.itemCount} signature items
        </p>
      </div>
    </button>
  );
}
