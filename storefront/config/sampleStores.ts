/**
 * Sample storefront configurations for demo/preview purposes.
 * This file is client-safe — no Node.js imports.
 */
import type { StoreConfig } from "@/storefront/types/store";
import defaultStoreJson from "./default-store.json";
import burgerCraftJson from "./samples/burger-craft.json";
import pizzaArtisanJson from "./samples/pizza-artisan.json";
import sushiSakuraJson from "./samples/sushi-sakura.json";
import velvetBakeryJson from "./samples/velvet-bakery.json";
import tacoCantinaJson from "./samples/taco-cantina.json";

export const sampleStores: Record<string, StoreConfig> = {
  "holy-buns": defaultStoreJson as unknown as StoreConfig,
  "burger-craft": burgerCraftJson as unknown as StoreConfig,
  "pizza-artisan": pizzaArtisanJson as unknown as StoreConfig,
  "sushi-sakura": sushiSakuraJson as unknown as StoreConfig,
  "velvet-bakery": velvetBakeryJson as unknown as StoreConfig,
  "taco-cantina": tacoCantinaJson as unknown as StoreConfig,
};
