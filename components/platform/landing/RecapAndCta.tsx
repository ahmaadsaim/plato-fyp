"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  Zap,
  DollarSign,
  TrendingUp,
  MessageCircle,
  Database,
  Cpu,
} from "lucide-react";
import { useAuth } from "./AuthContext";
import { HoverLines } from "./HoverWord";

export function RecapAndCta() {
  const { openSignUp, openSignIn } = useAuth();
  const recapPillars = [
    {
      icon: Zap,
      title: "2-Minute Instant Setup",
      desc: "Get your digital menu, counter POS, and kitchen screens up and running in under two minutes.",
    },
    {
      icon: Cpu,
      title: "Smart Sales Forecasts",
      desc: "Accurate daily demand predictions so your kitchen preps the right amount and cuts food waste.",
    },
    {
      icon: Database,
      title: "100% Offline Reliability",
      desc: "Desktop app keeps billing and kitchen printing alive through Wi-Fi dropouts without lost tickets.",
    },
    {
      icon: Layers,
      title: "Multi-Location Control",
      desc: "Manage menus, pricing, and revenue across multiple locations from one centralized screen.",
    },
  ];

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Soft Pastel Gradient Highlight / Recap Card (matching image_1.png) */}
        <div
          className="relative rounded-3xl p-8 sm:p-12 lg:p-16 border border-lime-200/80 overflow-hidden shadow-sm"
          style={{
            background:
              "linear-gradient(135deg, rgba(240, 253, 244, 0.9) 0%, rgba(254, 243, 199, 0.6) 50%, rgba(255, 255, 255, 0.95) 100%)",
          }}
        >
          {/* Subtle blurred ambient highlights */}
          <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-lime-300/30 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-amber-200/30 blur-3xl pointer-events-none" />

          <div className="relative z-10">
            {/* Upper Badge & Headline */}
            <div className="max-w-2xl mb-12">
              <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-lime-700 mb-3">
                All-in-One Restaurant Platform
              </p>
              <h3 className="text-3xl sm:text-5xl font-extrabold text-black tracking-tight leading-tight mt-4">
                The modern software your restaurant deserves.
              </h3>
              <p className="text-base sm:text-lg text-neutral-600 mt-3 font-normal leading-relaxed">
                Replace disconnected tools with an intuitive platform that brings front-of-house staff, your kitchen crew, and inventory together effortlessly.
              </p>
            </div>

            {/* 4 Feature Columns from FYP Objectives */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-neutral-200/60">
              {recapPillars.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-white border border-lime-200/80 shadow-2xs flex items-center justify-center text-lime-800">
                      <Icon className="w-5 h-5 text-lime-700" />
                    </div>
                    <h4 className="text-sm font-bold text-neutral-900 pt-1">{item.title}</h4>
                    <p className="text-xs text-neutral-600 leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom CTA Block (matching image_1.png bottom CTA) */}
        <div className="relative text-center max-w-3xl mx-auto pt-6">
          {/* Soft Glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] rounded-full blur-3xl opacity-30 -z-10 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(163, 230, 53, 0.4) 0%, rgba(254, 240, 138, 0.25) 50%, transparent 75%)",
            }}
          />

          <h2 className="text-4xl sm:text-6xl font-extrabold text-black tracking-tight leading-[1.12] cursor-default">
            <HoverLines lines={["Get started with", "Plato today"]} />
          </h2>
          <p className="mt-5 text-base sm:text-xl text-neutral-600 leading-relaxed font-normal">
            Join forward-thinking restaurant owners saving 12+ hours weekly, reducing food waste, and growing their profits.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={openSignUp}
              className="btn-animate-dark w-full sm:w-auto inline-flex items-center justify-center px-9 py-3.5 rounded-full bg-black text-white text-base font-semibold shadow-md hover:bg-neutral-900 cursor-pointer"
            >
              <span>Get started free</span>
            </button>
            <button
              onClick={openSignIn}
              className="btn-animate w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-white border border-neutral-200 text-neutral-800 text-base font-medium shadow-sm hover:bg-neutral-50 hover:border-neutral-300 cursor-pointer"
            >
              <span>Log in to your account</span>
            </button>
          </div>

          <p className="mt-4 text-xs text-neutral-500 font-medium">
            2-minute setup • 14-day full feature trial • Private & secure data
          </p>
        </div>
      </div>
    </section>
  );
}
