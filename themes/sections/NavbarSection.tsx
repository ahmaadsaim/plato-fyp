"use client";

import React, { useState } from "react";
import type { SectionComponentProps } from "@/lib/theme/types";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

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

  const {
    showAnnouncement = true,
    announcementText = "🔥 Free Delivery on orders over $35",
    sticky = true,
    ctaText = "Order Now",
  } = settings || {};

  return (
    <header
      className={`w-full z-40 ${
        sticky ? "sticky top-0 backdrop-blur-xl" : "relative"
      }`}
      style={{
        backgroundColor: "rgba(13, 15, 18, 0.88)",
        borderBottom: "1px solid var(--theme-color-border, #2E3646)",
      }}
    >
      {/* Announcement Strip */}
      {showAnnouncement && announcementText && (
        <div
          className="w-full py-1.5 px-4 text-center text-xs font-semibold tracking-wide transition-colors"
          style={{
            backgroundColor: "var(--theme-color-primary, #E05A2B)",
            color: "var(--theme-color-badge-text, #FFFFFF)",
          }}
        >
          <span>{announcementText}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Container>
        <div className="flex items-center justify-between h-18 py-3">
          {/* Brand Logo & Name */}
          <a href="#" className="flex items-center gap-3 group">
            {restaurant.logo && (restaurant.logo.startsWith("data:") || restaurant.logo.startsWith("http") || restaurant.logo.startsWith("/")) ? (
              <img
                src={restaurant.logo}
                alt={restaurant.name}
                className="w-10 h-10 rounded-xl object-contain p-1 bg-zinc-800/80 border border-zinc-700/60 shadow-sm group-hover:scale-105 transition-transform"
              />
            ) : (
              <span className="text-2xl p-2 rounded-xl bg-zinc-800/80 border border-zinc-700/60 shadow-sm group-hover:scale-105 transition-transform">
                {restaurant.logo || "🍽️"}
              </span>
            )}
            <div className="flex flex-col">
              <span
                className="text-lg font-extrabold tracking-tight leading-none"
                style={{ color: "var(--theme-color-text, #F8FAFC)" }}
              >
                {restaurant.name}
              </span>
              <span
                className="text-xs font-medium tracking-wide mt-1"
                style={{ color: "var(--theme-color-muted-text, #94A3B8)" }}
              >
                {restaurant.tagline.slice(0, 36)}...
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
            <a
              href="#categories-section"
              className="text-zinc-300 hover:text-white transition-colors"
            >
              Categories
            </a>
            <a
              href="#menu-section"
              className="text-zinc-300 hover:text-white transition-colors"
            >
              Menu
            </a>
            <a
              href="#promo-section"
              className="text-zinc-300 hover:text-white transition-colors"
            >
              Special Offer
            </a>
            <a
              href="#footer-section"
              className="text-zinc-300 hover:text-white transition-colors"
            >
              Hours & Info
            </a>
          </nav>

          {/* Right Actions */}
          <div className="hidden sm:flex items-center gap-4">
            {/* Open status */}
            <div className="hidden lg:flex items-center gap-2 text-xs text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Open Now • {restaurant.deliveryTime}</span>
            </div>

            <Button variant="primary" size="sm" href="#menu-section">
              {ctaText}
            </Button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800/60"
            aria-label="Toggle navigation menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div
            className="md:hidden py-4 border-t flex flex-col gap-3"
            style={{ borderColor: "var(--theme-color-border, #2E3646)" }}
          >
            <a
              href="#categories-section"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-semibold text-zinc-200 hover:bg-zinc-800 rounded-lg"
            >
              Categories
            </a>
            <a
              href="#menu-section"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-semibold text-zinc-200 hover:bg-zinc-800 rounded-lg"
            >
              Full Menu
            </a>
            <a
              href="#promo-section"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-semibold text-zinc-200 hover:bg-zinc-800 rounded-lg"
            >
              Special Offer
            </a>
            <a
              href="#footer-section"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-semibold text-zinc-200 hover:bg-zinc-800 rounded-lg"
            >
              Store Hours & Contact
            </a>
            <div className="pt-2 px-3">
              <Button
                variant="primary"
                fullWidth
                size="md"
                href="#menu-section"
                onClick={() => setMobileMenuOpen(false)}
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
