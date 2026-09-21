import fs from "fs/promises";
import path from "path";
import type {
  CategoryData,
  ProductData,
  RestaurantData,
} from "@/lib/theme/types";

const CATALOG_DATA_DIR = path.join(process.cwd(), "data");

/**
 * Loads the local restaurant catalog.
 * The repository boundary can later be replaced with tenant-scoped database queries.
 */
export async function loadRestaurantCatalog(): Promise<{
  restaurant: RestaurantData;
  products: ProductData[];
  categories: CategoryData[];
}> {
  try {
    const [restaurantRaw, productsRaw, categoriesRaw] = await Promise.all([
      fs.readFile(path.join(CATALOG_DATA_DIR, "restaurant.json"), "utf-8"),
      fs.readFile(path.join(CATALOG_DATA_DIR, "products.json"), "utf-8"),
      fs.readFile(path.join(CATALOG_DATA_DIR, "categories.json"), "utf-8"),
    ]);

    return {
      restaurant: JSON.parse(restaurantRaw) as RestaurantData,
      products: JSON.parse(productsRaw) as ProductData[],
      categories: JSON.parse(categoriesRaw) as CategoryData[],
    };
  } catch (error) {
    throw new Error(
      `[catalogRepository] Failed to load restaurant catalog data: ${(error as Error).message}`
    );
  }
}
