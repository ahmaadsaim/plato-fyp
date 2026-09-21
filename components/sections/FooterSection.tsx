"use client";

import React, { useState } from "react";
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
      className="pt-16 pb-12 border-t"
      style={{
        backgroundColor: "var(--theme-color-surface, #16191F)",
        borderColor: "var(--theme-color-border, #2E3646)",
      }}
    >
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-zinc-800">
          {/* Brand Info */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl p-2 rounded-xl bg-zinc-800 border border-zinc-700">
                {restaurant.logo || "🍽️"}
              </span>
              <div>
                <span
                  className="text-xl font-black tracking-tight block"
                  style={{ color: "var(--theme-color-text, #F8FAFC)" }}
                >
                  {restaurant.name}
                </span>
                <span
                  className="text-xs font-semibold"
                  style={{ color: "var(--theme-color-primary, #E05A2B)" }}
                >
                  Artisan Kitchen & Bakery
                </span>
              </div>
            </div>

            <p
              className="text-xs leading-relaxed max-w-sm"
              style={{ color: "var(--theme-color-muted-text, #94A3B8)" }}
            >
              {restaurant.tagline}
            </p>

            <div className="flex flex-col gap-1.5 text-xs text-zinc-400 mt-2">
              <p>📍 {restaurant.address.street}</p>
              <p>
                {restaurant.address.city}, {restaurant.address.state}{" "}
                {restaurant.address.postalCode}
              </p>
              <p>📞 {restaurant.phone}</p>
              <p>✉️ {restaurant.email}</p>
            </div>
          </div>

          {/* Opening Hours */}
          {showHours && (
            <div className="lg:col-span-3 flex flex-col gap-3">
              <h4
                className="text-sm font-bold uppercase tracking-wider"
                style={{ color: "var(--theme-color-text, #F8FAFC)" }}
              >
                Hours & Delivery
              </h4>
              <div className="text-xs space-y-2 text-zinc-400">
                <div>
                  <p className="font-semibold text-zinc-300">Monday - Thursday</p>
                  <p>{restaurant.hours?.weekdays || "11:00 AM - 10:00 PM"}</p>
                </div>
                <div>
                  <p className="font-semibold text-zinc-300">Friday - Sunday</p>
                  <p>{restaurant.hours?.weekends || "10:00 AM - 11:00 PM"}</p>
                </div>
                <div className="pt-2 border-t border-zinc-800">
                  <p className="font-semibold text-emerald-400">
                    Average Delivery: {restaurant.deliveryTime}
                  </p>
                  <p>Min. Order: {restaurant.minimumOrder}</p>
                </div>
              </div>
            </div>
          )}

          {/* Newsletter Signup */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <h4
              className="text-sm font-bold uppercase tracking-wider"
              style={{ color: "var(--theme-color-text, #F8FAFC)" }}
            >
              {newsletterTitle}
            </h4>
            <p
              className="text-xs leading-relaxed"
              style={{ color: "var(--theme-color-muted-text, #94A3B8)" }}
            >
              {newsletterSubtitle}
            </p>

            {subscribed ? (
              <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-semibold">
                ✓ Thank you for subscribing! Check your inbox for 15% off code.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 mt-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2.5 rounded-xl text-xs bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-white active:scale-95"
                  style={{
                    backgroundColor: "var(--theme-color-primary, #E05A2B)",
                  }}
                >
                  Join Club
                </button>
              </form>
            )}

            {/* Social icons */}
            <div className="flex items-center gap-3 mt-4 text-xs text-zinc-400">
              <span className="font-semibold">Follow Us:</span>
              <a href="#" className="hover:text-amber-400 transition-colors">
                Instagram
              </a>
              <span>•</span>
              <a href="#" className="hover:text-amber-400 transition-colors">
                Facebook
              </a>
              <span>•</span>
              <a href="#" className="hover:text-amber-400 transition-colors">
                Twitter/X
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>{copyright}</p>
          <div className="flex items-center gap-6">
            <span className="text-zinc-600">Powered by Plato Theme Engine</span>
            <a href="/demo" className="hover:text-zinc-300 transition-colors underline">
              Theme Browser
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
