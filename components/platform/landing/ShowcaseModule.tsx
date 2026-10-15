"use client";

import React from "react";
import {
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import { HoverLines } from "./HoverWord";

export function ShowcaseModule() {
  return (
    <section className="py-20 md:py-28 bg-white border-t border-neutral-100 overflow-hidden">
      {/* Keyframes for Wi-Fi Signals Increasing One by One (1 bar -> 2 bars -> 3 bars) */}
      <style>{`
        @keyframes wifiDotPulse {
          0%, 100% {
            fill: #84cc16;
            opacity: 0.85;
          }
          40%, 80% {
            fill: #84cc16;
            opacity: 1;
          }
        }

        /* Arc 1: First signal wave (activates at 10%, fully on by 24%) */
        @keyframes wifiWave1 {
          0%, 10% {
            stroke: #cbd5e1;
            opacity: 0.25;
          }
          24%, 78% {
            stroke: #84cc16;
            opacity: 1;
          }
          90%, 100% {
            stroke: #cbd5e1;
            opacity: 0.25;
          }
        }

        /* Arc 2: Second signal wave (activates at 32%, fully on by 46% - exactly 22% interval) */
        @keyframes wifiWave2 {
          0%, 32% {
            stroke: #cbd5e1;
            opacity: 0.25;
          }
          46%, 78% {
            stroke: #84cc16;
            opacity: 1;
          }
          90%, 100% {
            stroke: #cbd5e1;
            opacity: 0.25;
          }
        }

        /* Arc 3: Third signal wave (activates at 54%, fully on by 68% - exactly 22% interval) */
        @keyframes wifiWave3 {
          0%, 54% {
            stroke: #cbd5e1;
            opacity: 0.25;
          }
          68%, 78% {
            stroke: #84cc16;
            opacity: 1;
          }
          90%, 100% {
            stroke: #cbd5e1;
            opacity: 0.25;
          }
        }

        .animate-wifi-step-dot {
          animation: wifiDotPulse 2.6s ease-in-out infinite;
        }
        .animate-wifi-step-1 {
          animation: wifiWave1 2.6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .animate-wifi-step-2 {
          animation: wifiWave2 2.6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .animate-wifi-step-3 {
          animation: wifiWave3 2.6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 md:space-y-32">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-lime-600 mb-3">
            Built For Restaurant Operators
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-black tracking-tight leading-tight">
            <HoverLines lines={["Run your floor, kitchen,", "and inventory in sync"]} />
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 font-normal leading-relaxed">
            Everything connects seamlessly behind the scenes, so your staff moves faster and your guests leave happy.
          </p>
        </div>

        {/* =========================================================================
            SECTION 1: DISH PROFIT MARGIN - ASCENDING BARS & STRAIGHT UPWARD ARROW
        ========================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Text Description */}
          <div className="lg:col-span-6 space-y-6">
            <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-lime-600">
              Profit Tracking
            </p>

            <h3 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight leading-tight">
              Know your profit margin on every single plate
            </h3>

            <p className="text-base text-neutral-600 leading-relaxed font-normal">
              Tie recipes directly to your pantry stock. As plates are rung up on the floor, ingredients subtract automatically, calculating your exact food costs and protecting your margins on every burger, pizza, and side.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-lime-100 text-lime-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-900">Automatic Stock Subtraction</h4>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Buns, beef, and sauces deduct with every order without counting by hand.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-lime-100 text-lime-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-900">Live Margin Visibility</h4>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Spot your highest-earning items instantly and price your menu for healthy profit.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-lime-100 text-lime-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-900">Low-Stock Warnings</h4>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Get alerted before critical ingredients run out mid-dinner rush so you never 86 favorites.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Minimal Aesthetic Graphic (Ascending Bars + Straight Vertical Upward Arrow) */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center py-6 relative">
            {/* Ambient Lime Glow in Theme */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-lime-300/25 rounded-full blur-3xl pointer-events-none -z-10" />

            <div className="relative w-full max-w-[340px] h-[240px] flex items-end justify-between px-4 pb-2">
              {/* Dynamic SVG with Curve Straightening into a Straight Upward Arrow */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
                viewBox="0 0 340 240"
              >
                <defs>
                  <linearGradient id="profitArrowGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#d9f99d" />
                    <stop offset="50%" stopColor="#84cc16" />
                    <stop offset="100%" stopColor="#65a30d" />
                  </linearGradient>
                  <filter id="arrowGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3.5" floodColor="#84cc16" floodOpacity="0.45" />
                  </filter>
                </defs>

                {/* Smooth ascending growth curve following bar trajectory */}
                <path
                  d="M 26 195 C 98 178, 185 132, 256 74 Q 278 54, 296 34"
                  fill="none"
                  stroke="url(#profitArrowGrad)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  filter="url(#arrowGlow)"
                />

                {/* Redesigned sleek directional arrowhead pointing naturally up-right (↗) */}
                <path
                  d="M 310 20 L 287 31 Q 293 33 296 34 Q 298 37 300 44 Z"
                  fill="url(#profitArrowGrad)"
                  stroke="#3f6212"
                  strokeWidth="0.8"
                  strokeLinejoin="round"
                  filter="url(#arrowGlow)"
                />
              </svg>

              {/* 5 Sculptural Ascending Bars in Theme Lime Gradients */}
              <div className="w-11 sm:w-12 h-16 rounded-full bg-lime-100/90 transition-all hover:bg-lime-200" />
              <div className="w-11 sm:w-12 h-24 rounded-full bg-lime-200 transition-all hover:bg-lime-300" />
              <div className="w-11 sm:w-12 h-32 rounded-full bg-lime-300 transition-all hover:bg-lime-400" />
              <div className="w-11 sm:w-12 h-40 rounded-full bg-lime-400 transition-all hover:bg-lime-500" />
              <div className="w-11 sm:w-12 h-52 rounded-full bg-gradient-to-t from-lime-500 via-lime-500 to-lime-600 shadow-lg shadow-lime-500/25" />

              {/* Single Minimal Tag at Arrow Apex - Realistic +18% Profit */}
              <div className="absolute -top-3 right-0 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-lime-500 text-black text-xs font-black shadow-md">
                <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>+18% Profit</span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            SECTION 2: OFFLINE RESILIENCE - WI-FI SIGNALS INCREASING ONE BY ONE
        ========================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Large Animated Wi-Fi Signals (1 bar -> 2 bars -> 3 bars) */}
          <div className="lg:col-span-6 order-2 lg:order-1 flex flex-col items-center justify-center py-6 relative">
            {/* Large Sculptural Animated Wi-Fi Graphic */}
            <div className="relative flex items-center justify-center">
              <svg
                className="w-72 h-64 sm:w-80 sm:h-72 md:w-96 md:h-80 overflow-visible"
                viewBox="0 0 240 210"
              >
                {/* Arc 3: Outer Signal Wave (Turns ON 3rd) */}
                <path
                  d="M 42 97 A 110 110 0 0 1 198 97"
                  fill="none"
                  strokeWidth="13"
                  strokeLinecap="round"
                  className="animate-wifi-step-3"
                />

                {/* Arc 2: Middle Signal Wave (Turns ON 2nd) */}
                <path
                  d="M 67 122 A 75 75 0 0 1 173 122"
                  fill="none"
                  strokeWidth="13"
                  strokeLinecap="round"
                  className="animate-wifi-step-2"
                />

                {/* Arc 1: Inner Signal Wave (Turns ON 1st) */}
                <path
                  d="M 92 147 A 40 40 0 0 1 148 147"
                  fill="none"
                  strokeWidth="13"
                  strokeLinecap="round"
                  className="animate-wifi-step-1"
                />

                {/* Center Base Dot */}
                <circle
                  cx="120"
                  cy="175"
                  r="11"
                  className="animate-wifi-step-dot"
                />
              </svg>
            </div>

            {/* Single Minimal Status Tag Grounded Under the Graphic */}
            <div className="mt-6 inline-flex items-center px-4 py-1.5 rounded-full bg-neutral-900 text-white text-xs font-bold shadow-md">
              <span>100% Offline Active</span>
            </div>
          </div>

          {/* Right: Text Description */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
            <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-lime-600">
              Zero-Downtime Guarantee
            </p>

            <h3 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight leading-tight">
              When your Wi-Fi dies, your restaurant doesn’t
            </h3>

            <p className="text-base text-neutral-600 leading-relaxed font-normal">
              Internet outages happen, but service should never freeze. Plato keeps ringing up orders, sending tickets to kitchen printers, and taking payments — then syncs smoothly the second you&apos;re back online.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-lime-100 text-lime-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-900">Full Offline Operation</h4>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Cash drawers pop, kitchen printers cut tickets, and orders keep flowing without delay.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-lime-100 text-lime-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-900">Zero Lost Data</h4>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Every ticket and transaction is saved safely locally and uploads immediately upon reconnect.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
