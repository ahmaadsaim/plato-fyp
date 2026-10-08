"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShoppingBag, MapPin, Phone, Menu, X } from "lucide-react";
import type { SectionComponentProps } from "@/lib/theme/types";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useStoreSafe } from "@/storefront/context/StoreContext";

interface NavbarSettings {
  showAnnouncement?: boolean;
  announcementText?: string;
  sticky?: boolean;
  ctaText?: string;
}

export function NavbarSection({
  settings,
  restaurant,
}: SectionComponentProps<NavbarSettings>) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const storeContext = useStoreSafe();

  const {
    showAnnouncement = true,
    announcementText = "🔥 Free Delivery on orders over $35",
    sticky = true,
    ctaText = "Order Now",
  } = settings || {};

  const cartCount = storeContext?.cartItems?.reduce((acc, i) => acc + i.quantity, 0) || 0;

  return (
    <header
      className={`w-full z-40 transition-colors ${
        sticky ? "sticky top-0 backdrop-blur-xl" : "relative"
      }`}
      style={{
        backgroundColor: "var(--theme-color-card, #FFFFFF)",
        borderBottom: "1px solid var(--theme-color-border, #E5E7EB)",
      }}
    >
      {/* Announcement Strip */}
      {showAnnouncement && announcementText && (
        <div
          className="w-full py-1.5 px-4 text-center text-xs font-semibold tracking-wide transition-colors"
          style={{
            backgroundColor: "var(--theme-color-primary, #84CC16)",
            color: "var(--theme-color-button-text, #FFFFFF)",
          }}
        >
          <span>{announcementText}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Container>
        <div className="flex items-center justify-between h-18 py-3 gap-4">
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            {restaurant.logo &&
            (restaurant.logo.startsWith("data:") ||
              restaurant.logo.startsWith("http") ||
              restaurant.logo.startsWith("/")) ? (
              <img
                src={restaurant.logo}
                alt={restaurant.name}
                className="w-10 h-10 rounded-xl object-contain p-1 border shadow-xs group-hover:scale-105 transition-transform"
                style={{
                  backgroundColor: "var(--theme-color-background, #FFFFFF)",
                  borderColor: "var(--theme-color-border, #E5E7EB)",
                }}
              />
            ) : (
              <span
                className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border shadow-xs group-hover:scale-105 transition-transform"
                style={{
                  backgroundColor: "var(--theme-color-primary, #84CC16)",
                  color: "var(--theme-color-button-text, #FFFFFF)",
                  borderColor: "var(--theme-color-border, #E5E7EB)",
                }}
              >
                {restaurant.name ? restaurant.name[0] : "P"}
              </span>
            )}
            <div className="flex flex-col">
              <span
                className="text-lg font-extrabold tracking-tight leading-none"
                style={{ color: "var(--theme-color-text, #111111)" }}
              >
                {restaurant.name}
              </span>
              {restaurant.tagline && (
                <span
                  className="text-xs font-medium tracking-wide mt-1 hidden sm:inline"
                  style={{ color: "var(--theme-color-muted-text, #666666)" }}
                >
                  {restaurant.tagline.slice(0, 38)}...
                </span>
              )}
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
            <a
              href="#categories-section"
              className="hover:opacity-80 transition-opacity"
              style={{ color: "var(--theme-color-text, #111111)" }}
            >
              Categories
            </a>
            <a
              href="#menu-section"
              className="hover:opacity-80 transition-opacity"
              style={{ color: "var(--theme-color-text, #111111)" }}
            >
              Menu
            </a>
            <a
              href="#promo-section"
              className="hover:opacity-80 transition-opacity"
              style={{ color: "var(--theme-color-text, #111111)" }}
            >
              Special Offers
            </a>
            <a
              href="#footer-section"
              className="hover:opacity-80 transition-opacity"
              style={{ color: "var(--theme-color-text, #111111)" }}
            >
              Hours & Info
            </a>
          </nav>

          {/* Right Actions: Phone + Cart + CTA */}
          <div className="flex items-center gap-3">
            {restaurant.phone && (
              <a
                href={`tel:${restaurant.phone}`}
                className="hidden lg:flex items-center gap-1.5 text-xs font-semibold hover:opacity-80 transition-opacity"
                style={{ color: "var(--theme-color-muted-text, #666666)" }}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{restaurant.phone}</span>
              </a>
            )}

            {/* Cart Drawer Trigger */}
            {storeContext && (
              <button
                type="button"
                onClick={() => storeContext.setCartOpen(true)}
                className="relative p-2 rounded-xl border transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center shadow-2xs"
                style={{
                  backgroundColor: "var(--theme-color-surface, #F8F8F8)",
                  borderColor: "var(--theme-color-border, #E5E7EB)",
                  color: "var(--theme-color-text, #111111)",
                }}
                aria-label="Open Shopping Cart"
              >
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span
                    className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-black flex items-center justify-center shadow-xs"
                    style={{
                      backgroundColor: "var(--theme-color-primary, #84CC16)",
                      color: "var(--theme-color-button-text, #FFFFFF)",
                    }}
                  >
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            <Button
              variant="primary"
              size="sm"
              href="#menu-section"
              className="hidden sm:inline-flex"
            >
              {ctaText}
            </Button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:opacity-80 transition-opacity"
              style={{ color: "var(--theme-color-text, #111111)" }}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            className="md:hidden py-4 px-2 border-t space-y-3 animate-in fade-in duration-200"
            style={{
              borderColor: "var(--theme-color-border, #E5E7EB)",
            }}
          >
            <nav className="flex flex-col space-y-2 text-sm font-semibold">
              <a
                href="#categories-section"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 px-3 rounded-lg hover:bg-black/5"
                style={{ color: "var(--theme-color-text, #111111)" }}
              >
                Categories
              </a>
              <a
                href="#menu-section"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 px-3 rounded-lg hover:bg-black/5"
                style={{ color: "var(--theme-color-text, #111111)" }}
              >
                Full Menu
              </a>
              <a
                href="#promo-section"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 px-3 rounded-lg hover:bg-black/5"
                style={{ color: "var(--theme-color-text, #111111)" }}
              >
                Special Offer
              </a>
              <a
                href="#footer-section"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 px-3 rounded-lg hover:bg-black/5"
                style={{ color: "var(--theme-color-text, #111111)" }}
              >
                Hours & Contact
              </a>
            </nav>

            <div className="pt-2 border-t border-black/5 flex flex-col gap-2">
              {restaurant.phone && (
                <a
                  href={`tel:${restaurant.phone}`}
                  className="flex items-center gap-2 text-xs font-semibold py-1.5 px-3 rounded-lg bg-black/5"
                  style={{ color: "var(--theme-color-text, #111111)" }}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call: {restaurant.phone}</span>
                </a>
              )}
              <Button
                variant="primary"
                size="sm"
                href="#menu-section"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center justify-center"
              >
                {ctaText}
              </Button>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}
