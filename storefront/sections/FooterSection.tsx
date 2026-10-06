"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { SectionComponentProps } from "@/lib/theme/types";
import { Container } from "@/components/ui/Container";

interface FooterSettings {
  copyright?: string;
  newsletterTitle?: string;
  newsletterSubtitle?: string;
  showHours?: boolean;
  showSocial?: boolean;
}

export function FooterSection({
  settings,
  restaurant,
}: SectionComponentProps<FooterSettings>) {
  const {
    copyright = `© ${new Date().getFullYear()} ${restaurant.name}. All rights reserved.`,
    newsletterTitle = "Get Secret Menu Drops & 15% Off",
    newsletterSubtitle = "Subscribe for exclusive tastings, seasonal specials, and secret menu drops.",
    showHours = true,
  } = settings || {};

  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer
      id="footer-section"
      className="pt-16 pb-12 border-t transition-colors"
      style={{
        backgroundColor: "var(--theme-color-card, #FFFFFF)",
        borderColor: "var(--theme-color-border, #E5E7EB)",
      }}
    >
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-black/10">
          {/* Brand Info */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              {restaurant.logo &&
              (restaurant.logo.startsWith("data:") ||
                restaurant.logo.startsWith("http") ||
                restaurant.logo.startsWith("/")) ? (
                <img
                  src={restaurant.logo}
                  alt={restaurant.name}
                  className="w-12 h-12 rounded-xl object-contain p-1 border shadow-xs"
                  style={{
                    backgroundColor: "var(--theme-color-background, #FFFFFF)",
                    borderColor: "var(--theme-color-border, #E5E7EB)",
                  }}
                />
              ) : (
                <span
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg border shadow-xs"
                  style={{
                    backgroundColor: "var(--theme-color-primary, #84CC16)",
                    color: "var(--theme-color-button-text, #FFFFFF)",
                    borderColor: "var(--theme-color-border, #E5E7EB)",
                  }}
                >
                  {restaurant.name ? restaurant.name[0] : "P"}
                </span>
              )}
              <div>
                <span
                  className="text-xl font-black tracking-tight block"
                  style={{ color: "var(--theme-color-text, #111111)" }}
                >
                  {restaurant.name}
                </span>
                <span
                  className="text-xs font-semibold"
                  style={{ color: "var(--theme-color-primary, #84CC16)" }}
                >
                  Artisan Kitchen & Storefront
                </span>
              </div>
            </div>

            <p
              className="text-xs leading-relaxed max-w-sm"
              style={{ color: "var(--theme-color-muted-text, #666666)" }}
            >
              {restaurant.tagline || restaurant.description}
            </p>

            <div
              className="flex flex-col gap-1.5 text-xs mt-2"
              style={{ color: "var(--theme-color-muted-text, #666666)" }}
            >
              {restaurant.address?.street && <p>📍 {restaurant.address.street}</p>}
              {restaurant.address?.city && (
                <p>
                  {restaurant.address.city}, {restaurant.address.state || ""}{" "}
                  {restaurant.address.postalCode || ""}
                </p>
              )}
              {restaurant.phone && <p>📞 {restaurant.phone}</p>}
              {restaurant.email && <p>✉️ {restaurant.email}</p>}
            </div>
          </div>

          {/* Opening Hours */}
          {showHours && (
            <div className="lg:col-span-3 flex flex-col gap-3">
              <h4
                className="text-sm font-bold uppercase tracking-wider"
                style={{ color: "var(--theme-color-text, #111111)" }}
              >
                Opening Hours
              </h4>
              <div
                className="flex flex-col gap-2 text-xs"
                style={{ color: "var(--theme-color-muted-text, #666666)" }}
              >
                <div>
                  <span className="font-semibold block" style={{ color: "var(--theme-color-text, #111111)" }}>
                    Monday – Friday
                  </span>
                  <span>{restaurant.hours?.weekdays || "11:00 AM – 10:00 PM"}</span>
                </div>
                <div>
                  <span className="font-semibold block" style={{ color: "var(--theme-color-text, #111111)" }}>
                    Saturday – Sunday
                  </span>
                  <span>{restaurant.hours?.weekends || "10:00 AM – 11:00 PM"}</span>
                </div>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Kitchen Online Now</span>
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Links */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h4
              className="text-sm font-bold uppercase tracking-wider"
              style={{ color: "var(--theme-color-text, #111111)" }}
            >
              Navigation
            </h4>
            <ul
              className="flex flex-col gap-2 text-xs font-medium"
              style={{ color: "var(--theme-color-muted-text, #666666)" }}
            >
              <li>
                <a href="#categories-section" className="hover:opacity-80 transition-opacity">
                  Menu Categories
                </a>
              </li>
              <li>
                <a href="#menu-section" className="hover:opacity-80 transition-opacity">
                  Signature Dishes
                </a>
              </li>
              <li>
                <a href="#promo-section" className="hover:opacity-80 transition-opacity">
                  Special Promotions
                </a>
              </li>
              <li>
                <Link href="/checkout" className="hover:opacity-80 transition-opacity">
                  View Checkout
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h4
              className="text-sm font-bold uppercase tracking-wider"
              style={{ color: "var(--theme-color-text, #111111)" }}
            >
              {newsletterTitle}
            </h4>
            <p
              className="text-xs leading-relaxed"
              style={{ color: "var(--theme-color-muted-text, #666666)" }}
            >
              {newsletterSubtitle}
            </p>

            {subscribed ? (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs font-semibold">
                ✓ You are on the VIP guest list!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl text-xs border outline-none transition-colors"
                  style={{
                    backgroundColor: "var(--theme-color-surface, #F8F8F8)",
                    borderColor: "var(--theme-color-border, #E5E7EB)",
                    color: "var(--theme-color-text, #111111)",
                  }}
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all hover:opacity-90 active:scale-95 cursor-pointer shadow-xs"
                  style={{
                    backgroundColor: "var(--theme-color-primary, #84CC16)",
                    color: "var(--theme-color-button-text, #FFFFFF)",
                  }}
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium"
          style={{ color: "var(--theme-color-muted-text, #666666)" }}
        >
          <p>{copyright}</p>
          <p className="flex items-center gap-1">
            <span>Powered by</span>
            <span
              className="font-bold tracking-tight"
              style={{ color: "var(--theme-color-primary, #84CC16)" }}
            >
              PLATO Storefront Engine
            </span>
          </p>
        </div>
      </Container>
    </footer>
  );
}
