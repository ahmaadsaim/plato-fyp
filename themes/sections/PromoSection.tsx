"use client";

import React, { useState } from "react";
import Image from "next/image";
import type { SectionComponentProps } from "@/lib/theme/types";
import { Container } from "@/components/ui/Container";

interface PromoSettings {
  headline?: string;
  subtext?: string;
  promoCode?: string;
  buttonText?: string;
  expiryText?: string;
  bannerImage?: string;
}

export function PromoSection({
  settings,
}: SectionComponentProps<PromoSettings>) {
  const {
    headline = "Unlock 20% Off Your First Feast",
    subtext = "Join the Plato Dining Club and taste the difference of chef-crafted comfort dining delivered right to your door.",
    promoCode = "PLATO20",
    buttonText = "Copy & Apply Discount",
    expiryText = "Valid this week only • Minimum $20 order",
    bannerImage = "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
  } = settings || {};

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(promoCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section id="promo-section" className="py-12 sm:py-16">
      <Container>
        <div
          className="relative overflow-hidden rounded-3xl p-8 sm:p-12 lg:p-16 border shadow-2xl"
          style={{
            backgroundColor: "var(--theme-color-surface, #16191F)",
            borderColor: "var(--theme-color-border, #2E3646)",
          }}
        >
          {/* Background Image with Dark & Primary Gradient */}
          <div className="absolute inset-0 z-0">
            <Image
              src={bannerImage}
              alt="Feast promotion background"
              fill
              sizes="100vw"
              className="object-cover opacity-20"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, rgba(13,15,18,0.98) 0%, rgba(22,25,31,0.92) 50%, rgba(224,90,43,0.3) 100%)",
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-2xl">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4"
              style={{
                backgroundColor: "var(--theme-color-accent-bg, #2A2016)",
                color: "var(--theme-color-accent, #F59E0B)",
                border: "1px solid rgba(245, 158, 11, 0.4)",
              }}
            >
              🎉 Limited Time Special Offer
            </span>

            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-4"
              style={{
                fontFamily: "var(--theme-font-heading)",
                color: "var(--theme-color-text, #F8FAFC)",
              }}
            >
              {headline}
            </h2>

            <p
              className="text-sm sm:text-base mb-8 max-w-xl leading-relaxed"
              style={{ color: "var(--theme-color-muted-text, #94A3B8)" }}
            >
              {subtext}
            </p>

            {/* Promo Code Box */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div
                className="flex items-center justify-between px-5 py-3 rounded-xl border border-dashed text-lg font-mono font-black tracking-widest uppercase select-all"
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  borderColor: "var(--theme-color-primary, #E05A2B)",
                  color: "var(--theme-color-accent, #F59E0B)",
                }}
              >
                <span>{promoCode}</span>
                <span className="text-xs text-zinc-500 font-sans tracking-normal ml-3">
                  (20% OFF)
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold rounded-xl transition-all cursor-pointer shadow-lg active:scale-95"
                style={{
                  backgroundColor: copied
                    ? "#10B981"
                    : "var(--theme-color-primary, #E05A2B)",
                  color: "#FFFFFF",
                }}
              >
                {copied ? (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Code Copied!</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                      />
                    </svg>
                    <span>{buttonText}</span>
                  </>
                )}
              </button>
            </div>

            {expiryText && (
              <p className="text-xs text-zinc-500 mt-3 font-medium">
                {expiryText}
              </p>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
