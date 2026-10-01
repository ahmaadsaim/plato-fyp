import type { ComponentType } from "react";

/**
 * Design tokens defining the visual appearance of a theme.
 */
export interface ThemeColorTokens {
  primary: string;
  primaryHover: string;
  secondary: string;
  secondaryHover: string;
  background: string;
  surface: string;
  surfaceCard: string;
  surfaceHover: string;
  text: string;
  mutedText: string;
  border: string;
  accent: string;
  accentBg: string;
  badge: string;
  badgeText: string;
  price: string;
  [key: string]: string;
}

export interface ThemeTypographyTokens {
  fontFamily: string;
  headingFont: string;
  headingWeight: string;
  bodyWeight: string;
  headingScale: string;
  bodySize: string;
  [key: string]: string;
}

export interface ThemeSpacingTokens {
  section: string;
  container: string;
  card: string;
  element: string;
  [key: string]: string;
}

export interface ThemeRadiusTokens {
  small: string;
  medium: string;
  large: string;
  full: string;
  [key: string]: string;
}

export interface ThemeShadowTokens {
  sm: string;
  card: string;
  floating: string;
  [key: string]: string;
}

export interface ThemeLayoutTokens {
  maxWidth: string;
  productColumns: number;
  [key: string]: string | number;
}

export interface ThemeTokens {
  colors: ThemeColorTokens;
  typography: ThemeTypographyTokens;
  spacing: ThemeSpacingTokens;
  radius: ThemeRadiusTokens;
  shadows: ThemeShadowTokens;
  layout: ThemeLayoutTokens;
}

export interface ThemeMetadata {
  author?: string;
  category?: string;
  tags?: string[];
  previewImage?: string;
  [key: string]: unknown;
}

export interface ThemeConfig {
  id: string;
  name: string;
  version: string;
  description: string;
  metadata?: ThemeMetadata;
  tokens: ThemeTokens;
  supportedSections: string[];
}

export interface ThemeSummary {
  id: string;
  name: string;
  version: string;
  description: string;
  previewImage?: string;
  tags?: string[];
  tokens: ThemeTokens;
}

/**
 * Section definition inside a page configuration.
 */
export interface SectionConfig<TSettings = Record<string, unknown>> {
  id: string;
  type: string;
  settings: TSettings;
}

/**
 * Page structure JSON file.
 */
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
  icon: string;
  image: string;
  itemCount: number;
}

export interface ProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  categoryName: string;
  image: string;
  featured: boolean;
  available: boolean;
  rating: number;
  reviewCount: number;
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
  settings: TSettings;
  theme: ThemeTokens;
  restaurant: RestaurantData;
  products: ProductData[];
  categories: CategoryData[];
}

/**
 * Registry type mapping section types to React component implementations.
 */
export type SectionRegistry = Record<
  string,
  ComponentType<SectionComponentProps<Record<string, unknown>>>
>;
