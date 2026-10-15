"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { HoverLines } from "./HoverWord";
import {
  Flame,
  Boxes,
  ArrowRight,
  Camera,
} from "lucide-react";

export function BentoFeatures() {
  const reviews = [
    "“We took a photo of our physical counter menu and Plato generated our entire burger and pizza POS and online ordering store in 4 minutes.”",
    "“Plato’s offline mode saved our Friday night dinner rush when the internet died. Zero lost tickets and our burger line and fryers kept humming.”",
    "“The demand forecasting cut our prep waste by 23% and automated daily burger patty and pizza dough prep lists for our kitchen crew.”",
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  return (
    <section id="features" className="py-20 md:py-28 relative overflow-hidden bg-white">
      {/* Subtle soft backdrop gradient */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] rounded-full blur-3xl opacity-20 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(190, 242, 100, 0.4) 0%, rgba(254, 243, 199, 0.3) 50%, rgba(255, 255, 255, 0) 80%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Block with 3-card stacked reviews slider on top right */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            {/* Section Eyebrow Tag */}
            <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-lime-600 mb-3">
              All-in-One Restaurant Platform
            </p>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-black tracking-tight leading-tight">
              <HoverLines lines={["Built for every side", "of your business"]} />
            </h2>
            <p className="mt-4 text-base sm:text-lg text-neutral-600 leading-relaxed font-normal">
              From back-of-house ingredient prep to front-of-house table ordering and instant menu setup, Plato keeps your whole team in sync.
            </p>
          </div>

          {/* 3-Card Reviews Deck Slider (Pure Black, 1 sharp sliding in front, 2 blurred in back, same size, quote only) */}
          {/* 3-Card Vertical Scroll Deck (New card scrolls up forward, previous card tucks down behind) */}
          <div className="w-full lg:max-w-md pt-2 pb-6 flex flex-col items-center">
            <div
              className="relative w-full h-[115px] sm:h-[105px] cursor-pointer"
              onClick={() => setActiveIndex((prev) => (prev + 1) % reviews.length)}
              title="Click to next review"
            >
              {reviews.map((review, index) => {
                const position = (index - activeIndex + reviews.length) % reviews.length;
                const isFront = position === 0;
                const isMid = position === 1;

                // Polished 3D vertical scroll positions with rock-solid text stability:
                const yOffset = isFront ? 0 : isMid ? 8 : 16;
                const scale = isFront ? 1 : isMid ? 0.97 : 0.94;
                const opacity = isFront ? 1 : isMid ? 0.55 : 0.25;
                const zIndex = isFront ? 30 : isMid ? 20 : 10;

                return (
                  <motion.div
                    key={index}
                    animate={{
                      y: yOffset,
                      scale,
                      opacity,
                      zIndex,
                    }}
                    transition={{
                      y: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                      scale: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                      opacity: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                      zIndex: { delay: isFront ? 0 : 0.12 },
                    }}
                    style={{
                      filter: isFront ? "none" : isMid ? "blur(1.5px)" : "blur(3px)",
                      willChange: "transform, opacity",
                      transform: "translate3d(0, 0, 0)",
                      backfaceVisibility: "hidden",
                      WebkitFontSmoothing: "antialiased",
                    }}
                    className={`absolute inset-0 w-full h-full bg-black text-white p-4 sm:p-5 rounded-2xl border flex items-center select-none ${
                      isFront
                        ? "border-neutral-700/80 shadow-[0_12px_32px_rgba(0,0,0,0.5)]"
                        : "border-neutral-800/90 shadow-md pointer-events-none"
                    }`}
                  >
                    <p
                      className={`text-xs sm:text-[13px] leading-relaxed font-normal text-left w-full antialiased ${
                        isFront
                          ? "text-neutral-100"
                          : isMid
                          ? "text-neutral-300"
                          : "text-neutral-500"
                      }`}
                      style={{ textRendering: "geometricPrecision" }}
                    >
                      {review}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* Subtle Slide Indicators */}
            <div className="flex items-center justify-center gap-1.5 mt-3.5">
              {reviews.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIndex(idx);
                  }}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    activeIndex === idx
                      ? "w-5 bg-lime-400"
                      : "w-1.5 bg-neutral-800 hover:bg-neutral-600"
                  }`}
                  aria-label={`Go to review ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 3 Distinct Minimal Card Columns (Matching exact gradient and without inner mockup boxes) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Card 1: Omnichannel POS, KDS & Waiter PWA */}
          <div
            className="group rounded-2xl border border-lime-200/80 p-6 sm:p-8 flex flex-col justify-between hover:shadow-xl hover:border-lime-300 transition-all duration-300 relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(240, 253, 244, 0.9) 0%, rgba(254, 243, 199, 0.6) 50%, rgba(255, 255, 255, 0.95) 100%)",
            }}
          >
            <div>
              {/* Icon Badge */}
              <div className="w-11 h-11 rounded-xl bg-white border border-lime-200/80 shadow-2xs flex items-center justify-center text-lime-800 mb-5 group-hover:scale-105 transition-transform">
                <Flame className="w-5 h-5 text-lime-700" />
              </div>
              <h3 className="text-xl font-bold text-black tracking-tight mb-2.5">
                Cloud POS & Kitchen Displays
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Orders route instantly from table tablets, counter registers, and online customers straight to kitchen screens with color-coded timers.
              </p>
            </div>

            <Link
              href="#kds-system"
              className="inline-flex items-center gap-2 text-xs font-bold text-black group-hover:text-lime-700 transition-colors pt-6"
            >
              <span>Explore Kitchen Displays & POS</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Card 2: AI Menu Scanner & Storefront */}
          <div
            className="group rounded-2xl border border-lime-200/80 p-6 sm:p-8 flex flex-col justify-between hover:shadow-xl hover:border-lime-300 transition-all duration-300 relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(240, 253, 244, 0.9) 0%, rgba(254, 243, 199, 0.6) 50%, rgba(255, 255, 255, 0.95) 100%)",
            }}
          >
            <div>
              {/* Icon Badge */}
              <div className="w-11 h-11 rounded-xl bg-white border border-amber-200/80 shadow-2xs flex items-center justify-center text-amber-800 mb-5 group-hover:scale-105 transition-transform">
                <Camera className="w-5 h-5 text-amber-700" />
              </div>
              <h3 className="text-xl font-bold text-black tracking-tight mb-2.5">
                AI Menu Scan to POS & Storefront
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Snap a photo of your paper menu or chalkboard. Plato instantly pulls items, categories, prices, and modifiers into your register and online store.
              </p>
            </div>

            <Link
              href="#menu-scanner"
              className="inline-flex items-center gap-2 text-xs font-bold text-black group-hover:text-lime-700 transition-colors pt-6"
            >
              <span>See Menu Scanner in Action</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Card 3: Real-Time Inventory & Sales Forecasting */}
          <div
            className="group rounded-2xl border border-lime-200/80 p-6 sm:p-8 flex flex-col justify-between hover:shadow-xl hover:border-lime-300 transition-all duration-300 relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(240, 253, 244, 0.9) 0%, rgba(254, 243, 199, 0.6) 50%, rgba(255, 255, 255, 0.95) 100%)",
            }}
          >
            <div>
              {/* Icon Badge */}
              <div className="w-11 h-11 rounded-xl bg-white border border-lime-200/80 shadow-2xs flex items-center justify-center text-lime-800 mb-5 group-hover:scale-105 transition-transform">
                <Boxes className="w-5 h-5 text-lime-700" />
              </div>
              <h3 className="text-xl font-bold text-black tracking-tight mb-2.5">
                Smart Inventory & Demand Forecasts
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Automatic ingredient deduction, low-stock warnings, and AI sales forecasts to help your kitchen prep the exact amount of food each day.
              </p>
            </div>

            <Link
              href="#ai-insights"
              className="inline-flex items-center gap-2 text-xs font-bold text-black group-hover:text-lime-700 transition-colors pt-6"
            >
              <span>Explore Inventory & Forecasts</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
