"use client";

import React, { useState } from "react";
import Image from "next/image";
import type { ProductData } from "@/lib/theme/types";
import { formatPrice } from "@/lib/theme/resolveData";
import { Badge } from "@/components/ui/Badge";
import { useStoreSafe } from "@/storefront/context/StoreContext";
import ProductModal from "@/storefront/components/product-modal";
import type { Product } from "@/storefront/types/store";

export interface ProductCardProps {
  product: ProductData | Product;
  currency?: string;
  onAddToCart?: (product: ProductData) => void;
  layout?: "grid" | "horizontal";
}

export function ProductCard({
  product,
  currency = "$",
  onAddToCart,
  layout = "grid",
}: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const store = useStoreSafe();

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdded(true);

    if (store) {
      store.addToCart({
        productId: product.id,
        name: product.name,
        description: product.description,
        image: product.image,
        price: product.price,
        quantity: 1,
        selectedAddOns: [],
        totalPrice: product.price,
      });
      store.setCartOpen(true);
    }

    if (onAddToCart) {
      onAddToCart(product as ProductData);
    }

    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  const formattedPrice = store
    ? store.formatPrice(product.price)
    : formatPrice(product.price, currency);

  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        className="group flex flex-col h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer"
        style={{
          backgroundColor: "var(--theme-color-card, #FFFFFF)",
          border: "1px solid var(--theme-color-border, #E5E7EB)",
          borderRadius: "var(--theme-radius-large, var(--brand-border-radius, 1rem))",
          boxShadow: "var(--theme-shadow-card, 0 4px 6px -1px rgba(0,0,0,0.05))",
        }}
      >
        {/* Product Image & Badges */}
        <div className="relative w-full aspect-[4/3] overflow-hidden bg-black/5">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            {product.badge ? (
              <Badge variant="primary" size="sm">
                {product.badge}
              </Badge>
            ) : (
              <span />
            )}

            {"rating" in product && product.rating && (
              <div
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold text-white shadow-sm backdrop-blur-md"
                style={{ backgroundColor: "rgba(13, 15, 18, 0.75)" }}
              >
                <span className="text-amber-400">★</span>
                <span>{product.rating}</span>
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col flex-1 p-4 justify-between gap-3">
          <div className="space-y-1">
            {"categoryName" in product && product.categoryName && (
              <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--theme-color-muted-text, #666666)" }}>
                {product.categoryName}
              </div>
            )}

            <h3
              className="text-base font-bold leading-snug line-clamp-1 transition-colors"
              style={{ color: "var(--theme-color-text, #111111)" }}
            >
              {product.name}
            </h3>

            <p
              className="text-xs line-clamp-2 leading-relaxed"
              style={{ color: "var(--theme-color-muted-text, #666666)" }}
            >
              {product.description}
            </p>
          </div>

          {/* Price & Add to Cart Button */}
          <div className="pt-2 flex items-center justify-between border-t border-black/5">
            <span
              className="text-base font-extrabold tracking-tight"
              style={{ color: "var(--theme-color-primary, #84CC16)" }}
            >
              {formattedPrice}
            </span>

            <button
              type="button"
              onClick={handleAdd}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-2xs"
              style={{
                backgroundColor: isAdded
                  ? "var(--theme-color-accent, #10B981)"
                  : "var(--theme-color-button, var(--brand-button-bg, #84CC16))",
                color: "var(--theme-color-button-text, var(--brand-button-fg, #FFFFFF))",
              }}
            >
              {isAdded ? (
                <>
                  <span>✓</span>
                  <span>Added</span>
                </>
              ) : (
                <>
                  <span>+</span>
                  <span>Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <ProductModal
          product={product as Product}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

export default ProductCard;
