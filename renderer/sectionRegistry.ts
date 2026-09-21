import type { ComponentType } from "react";
import type { SectionComponentProps, SectionRegistry } from "@/lib/theme/types";
import { NavbarSection } from "@/components/sections/NavbarSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { CategorySection } from "@/components/sections/CategorySection";
import { ProductGridSection } from "@/components/sections/ProductGridSection";
import { PromoSection } from "@/components/sections/PromoSection";
import { FooterSection } from "@/components/sections/FooterSection";

/**
 * Global section registry mapping JSON section "type" strings
 * to their corresponding React Section component implementations.
 */
export const sectionRegistry: SectionRegistry = {
  navbar: NavbarSection as ComponentType<SectionComponentProps<any>>,
  hero: HeroSection as ComponentType<SectionComponentProps<any>>,
  categories: CategorySection as ComponentType<SectionComponentProps<any>>,
  "product-grid": ProductGridSection as ComponentType<SectionComponentProps<any>>,
  promo: PromoSection as ComponentType<SectionComponentProps<any>>,
  footer: FooterSection as ComponentType<SectionComponentProps<any>>,
};

/**
 * Safe component lookup from the section registry.
 * Returns null if the type is unknown or unregistered.
 */
export function getSectionComponent(
  type: string
): ComponentType<SectionComponentProps<any>> | null {
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
