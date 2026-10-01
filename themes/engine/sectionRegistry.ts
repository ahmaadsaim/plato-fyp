import type { ComponentType } from "react";
import type { SectionComponentProps, SectionRegistry } from "@/lib/theme/types";
import { NavbarSection } from "@/themes/sections/NavbarSection";
import { HeroSection } from "@/themes/sections/HeroSection";
import { CategorySection } from "@/themes/sections/CategorySection";
import { ProductGridSection } from "@/themes/sections/ProductGridSection";
import { PromoSection } from "@/themes/sections/PromoSection";
import { FooterSection } from "@/themes/sections/FooterSection";

/**
 * Global section registry mapping JSON section "type" strings
 * to their corresponding React Section component implementations.
 */
export const sectionRegistry: SectionRegistry = {
  navbar: NavbarSection as unknown as ComponentType<SectionComponentProps<Record<string, unknown>>>,
  hero: HeroSection as unknown as ComponentType<SectionComponentProps<Record<string, unknown>>>,
  categories: CategorySection as unknown as ComponentType<SectionComponentProps<Record<string, unknown>>>,
  "product-grid": ProductGridSection as unknown as ComponentType<SectionComponentProps<Record<string, unknown>>>,
  promo: PromoSection as unknown as ComponentType<SectionComponentProps<Record<string, unknown>>>,
  footer: FooterSection as unknown as ComponentType<SectionComponentProps<Record<string, unknown>>>,
};

/**
 * Safe component lookup from the section registry.
 * Returns null if the type is unknown or unregistered.
 */
export function getSectionComponent(
  type: string
): ComponentType<SectionComponentProps<Record<string, unknown>>> | null {
  if (!type || typeof type !== "string") {
    return null;
  }
  return sectionRegistry[type] || null;
}

/**
 * Check if a section type is supported in the registry.
 */
export function isSectionSupported(type: string): boolean {
  return Boolean(sectionRegistry[type]);
}

/**
 * Retrieve list of all currently registered section type keys.
 */
export function getRegisteredSectionTypes(): string[] {
  return Object.keys(sectionRegistry);
}
