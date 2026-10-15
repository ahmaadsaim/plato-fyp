"use client";

import React from "react";
import {
  CreditCard,
  MessageSquare,
  Mail,
} from "lucide-react";
import { HoverLines } from "./HoverWord";

export function IntegrationsSection() {
  const integrations = [
    {
      name: "WhatsApp for Business",
      category: "Guest Updates & Special Offers",
      desc: "Send special promotions, table ready alerts, and digital receipts straight to your guests on WhatsApp.",
      badge: "Official WhatsApp",
      icon: MessageSquare,
    },
    {
      name: "Stripe & Fast Payments",
      category: "Payment Processing",
      desc: "Instant contactless pay-at-table, Apple Pay, easy bill splitting, and automated same-day direct payouts.",
      badge: "Instant Checkout",
      icon: CreditCard,
    },
    {
      name: "SMS & Email Updates",
      category: "Guest Loyalty & Messaging",
      desc: "Send friendly automated text messages and emails with exclusive offers to keep regular customers coming back.",
      badge: "Smart Loyalty",
      icon: Mail,
    },
  ];

  return (
    <section id="integrations" className="py-24 md:py-32 bg-neutral-50/50 border-t border-neutral-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-lime-600 mb-3">
            Connected Tools
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-black tracking-tight leading-tight">
            <HoverLines lines={["Integrate with the best"]} />
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 leading-relaxed font-normal">
            Plato connects easily with WhatsApp, Stripe, and SMS tools to send updates, take fast payments, and keep guests coming back.
          </p>
        </div>

        {/* 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {integrations.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="group rounded-2xl border border-neutral-200/90 bg-white p-6 sm:p-7 flex flex-col justify-between hover:border-lime-500 hover:shadow-[0_10px_30px_rgba(132,204,22,0.12)] transition-all duration-300 cursor-default"
              >
                <div>
                  {/* Top Bar with Icon & Badge */}
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-100 group-hover:border-lime-100 transition-colors duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200/50 group-hover:bg-lime-500/10 group-hover:border-lime-300/80 flex items-center justify-center transition-all duration-300">
                        <Icon className="w-5 h-5 text-neutral-700 group-hover:text-lime-600 transition-colors duration-300" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-neutral-900 group-hover:text-black">
                          {item.name}
                        </h3>
                        <p className="text-[11px] text-neutral-500 font-medium">
                          {item.category}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-neutral-600 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
