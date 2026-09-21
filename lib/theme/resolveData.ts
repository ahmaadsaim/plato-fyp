import type { ProductData, CategoryData } from "@/lib/theme/types";

/**
 * Filter products by category ID.
 * If categoryId is 'all' or undefined, returns all products.
 */
export function filterProductsByCategory(
  products: ProductData[],
  categoryId?: string
): ProductData[] {
  if (!categoryId || categoryId === "all") {
    return products;
  }
  return products.filter((p) => p.categoryId === categoryId);
}

/**
 * Filter products flagged as featured.
 */
export function getFeaturedProducts(products: ProductData[]): ProductData[] {
  return products.filter((p) => p.featured);
}

/**
 * Format currency with restaurant symbol.
 */
export function formatPrice(price: number, currency = "$"): string {
  return `${currency}${price.toFixed(2)}`;
}

/**
 * Find category by ID.
 */
export function findCategoryById(
  categories: CategoryData[],
  categoryId: string
): CategoryData | undefined {
  return categories.find((c) => c.id === categoryId);
}
