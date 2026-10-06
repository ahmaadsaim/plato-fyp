"use client";

import React from "react";
import Image from "next/image";
import type { SectionComponentProps } from "@/lib/theme/types";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface HeroSettings {
  badge?: string;
  title?: string;
  subtitle?: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  rating?: number;
  reviewCount?: string;
  deliveryEstimate?: string;
  image?: string;
}

export function HeroSection({
  settings,
  restaurant,
}: SectionComponentProps<HeroSettings>) {
  const {
    badge = "Chef-Curated Kitchen • Handcrafted Daily",
    title = restaurant.tagline || "Artisan Flavors, Blistered Crusts & Pure Comfort",
    subtitle = restaurant.description,
    primaryButtonText = "Order Online Now",
    primaryButtonHref = "#menu-section",
    secondaryButtonText = "Explore Menu",
    secondaryButtonHref = "#categories-section",
    rating = restaurant.rating || 4.9,
    reviewCount = `${restaurant.reviewCount || 2400}+ reviews`,
    deliveryEstimate = `${restaurant.deliveryTime || "25-35 min"} delivery`,
    image = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
  } = settings || {};

  return (
    <section
      className="relative overflow-hidden py-12 md:py-20 lg:py-24 transition-colors"
      style={{
        backgroundColor: "var(--theme-color-background, #FFFFFF)",
      }}
    >
      {/* Background Ambience Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full blur-[140px] opacity-15"
        style={{
          background:
            "radial-gradient(circle, var(--theme-color-primary, #84CC16) 0%, transparent 70%)",
        }}
      />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 flex flex-col items-start gap-6 text-left z-10">
            {badge && (
              <Badge variant="accent" size="md">
                ✨ {badge}
              </Badge>
            )}

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]"
              style={{
                fontFamily: "var(--theme-font-heading, var(--brand-font-family, inherit))",
                color: "var(--theme-color-text, #111111)",
              }}
            >
              {title}
            </h1>

            <p
              className="text-base sm:text-lg max-w-2xl leading-relaxed"
              style={{ color: "var(--theme-color-muted-text, #666666)" }}
            >
              {subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button variant="primary" size="lg" href={primaryButtonHref}>
                <span>{primaryButtonText}</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Button>

              <Button variant="secondary" size="lg" href={secondaryButtonHref}>
                {secondaryButtonText}
              </Button>
            </div>

            {/* Trust Proof Badges */}
            <div
              className="pt-6 flex flex-wrap items-center gap-6 border-t w-full"
              style={{ borderColor: "var(--theme-color-border, #E5E7EB)" }}
            >
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400 text-sm">
                  {"★".repeat(5)}
                </div>
                <span
                  className="text-xs font-bold"
                  style={{ color: "var(--theme-color-text, #111111)" }}
                >
                  {rating} ({reviewCount})
                </span>
              </div>

              <div
                className="h-4 w-px hidden sm:block"
                style={{ backgroundColor: "var(--theme-color-border, #E5E7EB)" }}
              />

              <div
                className="flex items-center gap-2 text-xs font-semibold"
                style={{ color: "var(--theme-color-muted-text, #666666)" }}
              >
                <span className="p-1 rounded-md bg-emerald-500/20 text-emerald-600">⚡</span>
                <span>{deliveryEstimate}</span>
              </div>

              <div
                className="h-4 w-px hidden sm:block"
                style={{ backgroundColor: "var(--theme-color-border, #E5E7EB)" }}
              />

              <div
                className="flex items-center gap-2 text-xs font-semibold"
                style={{ color: "var(--theme-color-muted-text, #666666)" }}
              >
                <span className="p-1 rounded-md bg-amber-500/20 text-amber-600">🌿</span>
                <span>100% Fresh Daily</span>
              </div>
            </div>
          </div>

          {/* Hero Image Showcase */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div
              className="relative w-full aspect-[4/3] sm:aspect-[1/1] max-w-lg rounded-3xl overflow-hidden shadow-2xl border"
              style={{
                borderColor: "var(--theme-color-border, #E5E7EB)",
                boxShadow: "var(--theme-shadow-floating, 0 20px 40px -15px rgba(0,0,0,0.15))",
              }}
            >
              <Image
                src={image}
                alt="Signature gourmet dish from Plato Kitchen"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              {/* Floating Chef Pill */}
              <div
                className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl backdrop-blur-xl border border-white/20 flex items-center justify-between"
                style={{ backgroundColor: "rgba(13, 15, 18, 0.85)" }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">👨‍🍳</span>
                  <div>
                    <p className="text-xs font-extrabold text-white">
                      Executive Chef Crafted
                    </p>
                    <p className="text-[11px] text-zinc-300">
                      Made fresh to order with zero preservatives
                    </p>
                  </div>
                </div>

                <div
                  className="px-2.5 py-1 rounded-full text-xs font-black shadow-xs"
                  style={{
                    backgroundColor: "var(--theme-color-primary, #84CC16)",
                    color: "var(--theme-color-button-text, #FFFFFF)",
                  }}
                >
                  TOP CHOICE
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
