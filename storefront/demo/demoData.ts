import type {
  RestaurantData,
  ProductData,
  CategoryData,
} from "@/lib/theme/types";
import restaurantJson from "@/data/restaurant.json";
import productsJson from "@/data/products.json";
import categoriesJson from "@/data/categories.json";

/**
 * Isolated demo data for development, theme previews, and offline testing.
 * Strictly decoupled from production PostgreSQL/Prisma business logic.
 */
export const demoRestaurant: RestaurantData = {
  id: restaurantJson.id || "demo-restaurant",
  name: restaurantJson.name || "Plato Kitchen & Bar",
  tagline: restaurantJson.tagline || "Handcrafted Comfort Food & Artisanal Bakes",
  description:
    restaurantJson.description ||
    "Chef-driven seasonal recipes crafted with fresh ingredients, slow fermentation, and pure passion.",
  logo: restaurantJson.logo || "🍽️",
  phone: restaurantJson.phone || "+1 (555) 234-5678",
  email: restaurantJson.email || "orders@platodining.com",
  address: {
    street: restaurantJson.address?.street || "104 Culinary Blvd, Suite A",
    city: restaurantJson.address?.city || "New York",
    state: restaurantJson.address?.state || "NY",
    postalCode: restaurantJson.address?.postalCode || "10012",
    country: restaurantJson.address?.country || "USA",
  },
  hours: {
    weekdays: restaurantJson.hours?.weekdays || "11:00 AM – 10:00 PM",
    weekends: restaurantJson.hours?.weekends || "10:00 AM – 11:00 PM",
  },
  rating: restaurantJson.rating || 4.9,
  reviewCount: restaurantJson.reviewCount || 2400,
  deliveryTime: restaurantJson.deliveryTime || "25-35 min",
  deliveryFee: restaurantJson.deliveryFee || "$2.99",
  minimumOrder: restaurantJson.minimumOrder || "$15.00",
  currency: restaurantJson.currency || "$",
  social: restaurantJson.social || {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
  },
};

export const demoProducts: ProductData[] = (productsJson as unknown as ProductData[]) || [];
export const demoCategories: CategoryData[] = (categoriesJson as unknown as CategoryData[]) || [];
