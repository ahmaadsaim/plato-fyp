"use client";

import React, { useState } from "react";
import Image from "next/image";
import type { ProductData } from "@/lib/theme/types";
import { formatPrice } from "@/lib/theme/resolveData";
import { Badge } from "@/components/ui/Badge";

interface ProductCardProps {
  product: ProductData;
  currency?: string;
  onAddToCart?: (product: ProductData) => void;
}

export function ProductCard({
  product,
  currency = "$",
  onAddToCart,
}: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    setIsAdded(true);
    if (onAddToCart) {
      onAddToCart(product);
    }
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  return (
    <div
      className="group flex flex-col h-full overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{
        backgroundColor: "var(--theme-color-surface-card, #1E222B)",
        border: "1px solid var(--theme-color-border, #2E3646)",
        borderRadius: "var(--theme-radius-large, 1.25rem)",
        boxShadow: "var(--theme-shadow-card, 0 10px 25px -5px rgba(0,0,0,0.4))",
      }}
    >
      {/* Product Image & Badges */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-zinc-900">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {product.badge ? (
            <Badge variant="primary" size="sm">
              {product.badge}
            </Badge>
          ) : <span />}

          <div
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold text-white shadow-sm backdrop-blur-md"
            style={{ backgroundColor: "rgba(13, 15, 18, 0.75)" }}
          >
            <span className="text-amber-400">★</span>
            <span>{product.rating}</span>
          </div>
        </div>

        {/* Dietary tags */}
        {product.dietary && product.dietary.length > 0 && (
          <div className="absolute bottom-2.5 left-3 flex flex-wrap gap-1">
            {product.dietary.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-black/60 text-zinc-200 backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-1 p-5 justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-medium">{product.categoryName}</span>
            {product.prepTime && <span>⏱️ {product.prepTime}</span>}
          </div>

          <h3
            className="text-base font-bold leading-snug line-clamp-1 transition-colors group-hover:text-amber-400"
            style={{ color: "var(--theme-color-text, #F8FAFC)" }}
          >
            {product.name}
          </h3>

          <p
            className="text-xs leading-relaxed line-clamp-2"
            style={{ color: "var(--theme-color-muted-text, #94A3B8)" }}
          >
            {product.description}
          </p>
        </div>

        {/* Price & Add to Order Button */}
        <div
          className="pt-3 flex items-center justify-between border-t"
          style={{ borderColor: "var(--theme-color-border, #2E3646)" }}
        >
          <div>
            <span
              className="text-lg font-extrabold tracking-tight"
              style={{ color: "var(--theme-color-price, #34D399)" }}
            >
              {formatPrice(product.price, currency)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className={`inline-flex items-center justify-center text-xs font-bold px-3.5 py-2 transition-all duration-200 cursor-pointer ${
              isAdded
                ? "bg-emerald-500 text-white scale-105"
                : "text-white active:scale-95"
            }`}
            style={{
              backgroundColor: isAdded
                ? "#10B981"
                : "var(--theme-color-primary, #E05A2B)",
              borderRadius: "var(--theme-radius-medium, 0.75rem)",
            }}
          >
            {isAdded ? (
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                Added!
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                Add +
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
