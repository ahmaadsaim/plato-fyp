import type { ComponentType } from "react";
import type { StoreConfig } from "@/storefront/types/store";

/**
 * Design tokens defining the visual appearance of a theme (tokens.json).
 */
export interface ThemeColorTokens {
  primary: string;
  primaryHover?: string;
  secondary: string;
  secondaryHover?: string;
  background: string;
  surface?: string;
  surfaceCard?: string;
  surfaceHover?: string;
  card?: string;
  text: string;
  mutedText?: string;
  border?: string;
  accent?: string;
  accentBg?: string;
  badge?: string;
  badgeText?: string;
  price?: string;
  button?: string;
  buttonText?: string;
  buttonHover?: string;
  [key: string]: string | undefined;
}

export interface ThemeTypographyTokens {
  fontFamily: string;
  headingFont?: string;
  headingWeight?: string | number;
  bodyWeight?: string | number;
  headingScale?: string;
  bodySize?: string;
  [key: string]: string | number | undefined;
}

export interface ThemeSpacingTokens {
  section?: string;
  container?: string;
  card?: string;
  element?: string;
  cardGap?: string;
  [key: string]: string | undefined;
}

export interface ThemeRadiusTokens {
  button?: string;
  card?: string;
  input?: string;
  small?: string;
  medium?: string;
  large?: string;
  full?: string;
  [key: string]: string | undefined;
}

export interface ThemeShadowTokens {
  sm?: string;
  card?: string;
  floating?: string;
  [key: string]: string | undefined;
}

export interface ThemeLayoutTokens {
  maxWidth?: string;
  productColumns?: number;
  [key: string]: string | number | undefined;
}

export interface ThemeAnimationTokens {
  enabled?: boolean;
  duration?: string;
  hover?: string;
  [key: string]: unknown;
}

export interface ThemeTokens {
  colors: ThemeColorTokens;
  typography: ThemeTypographyTokens;
  spacing?: ThemeSpacingTokens;
  radius?: ThemeRadiusTokens;
  shadows?: ThemeShadowTokens;
  layout?: ThemeLayoutTokens;
  animation?: ThemeAnimationTokens;
}

export interface ThemeMetadata {
  author?: string;
  category?: string;
  tags?: string[];
  previewImage?: string;
  [key: string]: unknown;
}

/**
 * Theme identity and file mapping definition (metadata.json).
 */
export interface ThemeMetadataFile {
  id: string;
  name: string;
  description: string;
  tokens: string;
  layout: string;
}

/**
 * Theme layout representation (layout.json).
 */
export interface SectionConfig<TSettings = Record<string, unknown>> {
  id: string;
  type: string;
  settings?: TSettings;
}

export interface ThemeLayoutJson {
  themeId: string;
  templates: Record<string, string>;
  pages: Record<string, SectionConfig[]>;
}

/**
 * Full combined theme object.
 */
export interface ThemeConfig {
  id: string;
  name: string;
  version: string;
  description: string;
  metadata?: ThemeMetadata;
  tokens: ThemeTokens;
  layout?: ThemeLayoutJson;
  supportedSections?: string[];
}

export interface ThemeSummary {
  id: string;
  name: string;
  version: string;
  description: string;
  previewImage?: string;
  tags?: string[];
  tokens: ThemeTokens;
  templates?: Record<string, string>;
}

export interface PageConfig {
  page: string;
  title?: string;
  sections: SectionConfig[];
}

/**
 * Restaurant catalog & branding data types.
 */
export interface RestaurantAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface RestaurantHours {
  weekdays: string;
  weekends: string;
}

export interface RestaurantSocial {
  instagram?: string;
  facebook?: string;
  twitter?: string;
}

export interface RestaurantData {
  id: string;
  name: string;
  tagline: string;
  description: string;
  logo: string;
  phone: string;
  email: string;
  address: RestaurantAddress;
  hours: RestaurantHours;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  deliveryFee: string;
  minimumOrder: string;
  currency: string;
  social: RestaurantSocial;
}

export interface CategoryData {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon?: string;
  image?: string;
  itemCount?: number;
}

export interface ProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  categoryName?: string;
  image: string;
  featured?: boolean;
  available?: boolean;
  rating?: number;
  reviewCount?: number;
  prepTime?: string;
  calories?: number;
  badge?: string;
  dietary?: string[];
}

/**
 * Props passed to section components.
 */
export interface SectionComponentProps<TSettings = Record<string, unknown>> {
  id: string;
  settings?: TSettings;
  theme: ThemeTokens;
  restaurant: RestaurantData;
  products: ProductData[];
  categories: CategoryData[];
  index?: number;
}

export type SectionRegistry = Record<
  string,
  ComponentType<SectionComponentProps<Record<string, unknown>>>
>;

/**
 * Top-level Storefront data passed into ThemeRenderer.
 */
export interface StorefrontData {
  tenant: {
    id: string;
    name: string;
    slug: string;
  };
  theme: ThemeConfig;
  restaurant: RestaurantData;
  products: ProductData[];
  categories: CategoryData[];
  storeConfig: StoreConfig;
}
