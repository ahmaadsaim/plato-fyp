"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { useAuth } from "./AuthContext";
import { HoverLines } from "./HoverWord";

export function PricingPlans() {
  const { openSignUp } = useAuth();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");

  const plans = [
    {
      name: "Starter",
      badge: "Single Location",
      desc: "For burger spots, pizza shops, and fast food counters looking to speed up orders.",
      monthlyPrice: 79,
      annualPrice: 65,
      features: [
        "Up to 2 POS Terminals & Server Handhelds",
        "AI Menu Scanner (100 scans / mo)",
        "Kitchen Display Screen (KDS)",
        "Desktop App with 100% Offline Mode Protection",
        "Branded Digital Ordering Web Store",
        "Standard Business Hours Support",
      ],
      popular: false,
      ctaText: "Start 14-day trial",
      ctaHref: "#demo",
    },
    {
      name: "Growth",
      badge: "Most Popular",
      desc: "For busy burger lines, pizza kitchens, and high-volume drive-thrus.",
      monthlyPrice: 189,
      annualPrice: 149,
      features: [
        "Unlimited POS Terminals & Server Handhelds",
        "Unlimited AI Paper Menu Scans",
        "Kitchen Display Screen with Live Order Timers",
        "AI Daily Sales & Demand Forecasting",
        "Automatic Ingredient Tracking & Spoilage Alerts",
        "Automated WhatsApp Digital Guest Receipts",
        "Real-time Low-Stock & Food Waste Warnings",
        "24/7 Priority Emergency Support",
      ],
      popular: true,
      ctaText: "Get started free",
      ctaHref: "#demo",
    },
    {
      name: "Enterprise",
      badge: "Multi-Branch & Franchise",
      desc: "For fast food franchises, multi-unit burger chains, and pizza delivery brands.",
      monthlyPrice: 399,
      annualPrice: 319,
      features: [
        "Centralized Multi-Location Dashboard",
        "One-Click Cross-Branch Menu Updates",
        "Consolidated Group P&L & Inventory Reports",
        "Dedicated Cloud Hosting & Backups",
        "Custom Accounting & Hardware Integrations",
        "Guaranteed 99.99% Uptime Support",
        "Dedicated Account & Support Manager",
      ],
      popular: false,
      ctaText: "Book enterprise demo",
      ctaHref: "#contact",
    },
  ];

  return (
    <section id="pricing" className="bg-[#0B0F19] text-white py-24 md:py-32 relative overflow-hidden border-t border-neutral-800">
      {/* Background Accent Gradients & Grid Pattern (Matching Dark Engineering Theme) */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full blur-[140px] opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(132, 204, 22, 0.5) 0%, rgba(16, 185, 129, 0.2) 50%, transparent 80%)",
          }}
        />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-lime-400 mb-3">
            Transparent, Flat Pricing
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight cursor-default">
            <HoverLines
              lines={["Predictable plans", "for every restaurant size"]}
              underlineColor="bg-lime-400"
            />
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-400 font-normal leading-relaxed">
            Zero per-order commission fees. Zero hidden penalties. Keep 100% of your hard-earned revenue with built-in offline protection and smart kitchen automation.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 p-1.5 rounded-full bg-[#121826] border border-neutral-800 shadow-inner">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`btn-animate px-5 py-2 rounded-full text-xs font-bold ${
                billingCycle === "monthly"
                  ? "bg-white text-black shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`btn-animate px-5 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                billingCycle === "annual"
                  ? "bg-lime-500 text-black shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <span>Annual Billing</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-black text-lime-400">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* 3 Tier Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => {
            const price = billingCycle === "annual" ? plan.annualPrice : plan.monthlyPrice;

            return (
              <div
                key={index}
                className={`rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 relative ${
                  plan.popular
                    ? "bg-[#111728] border-2 border-lime-500 shadow-[0_0_40px_rgba(132,204,22,0.15)] lg:-translate-y-2"
                    : "bg-[#101524] border border-neutral-800 hover:border-neutral-700 shadow-xl"
                }`}
              >
                {/* Popular Pill */}
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-lime-500 text-black font-extrabold text-xs uppercase tracking-wider shadow-md">
                    Most Popular
                  </div>
                )}

                <div>
                  {/* Top Plan Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-extrabold text-white">{plan.name}</h3>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700/60">
                      {plan.badge}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-400 leading-relaxed min-h-[36px] mb-6">
                    {plan.desc}
                  </p>

                  {/* Price Block */}
                  <div className="pb-6 mb-6 border-b border-neutral-800/80">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                        ${price}
                      </span>
                      <span className="text-sm text-neutral-400 font-medium">/ month</span>
                    </div>
                    <span className="text-[11px] text-neutral-500 block mt-1">
                      {billingCycle === "annual" ? "Billed annually ($" + price * 12 + "/yr)" : "Billed monthly"}
                    </span>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3.5 mb-8">
                    <p className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                      Included with {plan.name}:
                    </p>
                    {plan.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs text-neutral-300">
                        <div className="w-4 h-4 rounded-full bg-lime-500/20 border border-lime-500/40 text-lime-400 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 text-lime-400" />
                        </div>
                        <span className="leading-snug">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Plan CTA */}
                <div>
                  <button
                    onClick={openSignUp}
                    className={`w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center cursor-pointer shadow-md ${
                      plan.popular
                        ? "btn-animate-lime bg-lime-500 text-black hover:bg-lime-400"
                        : "btn-animate bg-white text-black hover:bg-neutral-100"
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Assurance Banner */}
        <div className="mt-16 text-center text-xs text-neutral-400 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <span>✓ 14-day free trial on all plans</span>
          <span>✓ Zero hardware lock-in</span>
          <span>✓ No per-order commissions</span>
          <span>✓ Migrate from Toast/Square in 2 minutes</span>
        </div>
      </div>
    </section>
  );
}
