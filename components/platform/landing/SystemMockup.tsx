"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  Boxes,
  ArrowUpRight,
  CheckCircle2,
  PieChart,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function SystemMockup() {
  const [activeTab, setActiveTab] = useState<"forecast" | "inventory" | "profit">("forecast");

  return (
    <section id="ai-insights" className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto -mt-4 mb-20 md:mb-28">
      {/* Soft Ambient Glow */}
      <div className="absolute inset-0 max-w-5xl mx-auto h-[500px] bg-gradient-to-b from-lime-100/40 via-amber-50/20 to-transparent blur-3xl -z-10 rounded-3xl pointer-events-none" />

      {/* Main Container Window */}
      <div className="rounded-2xl border border-neutral-200/90 bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden">
        
        {/* Browser / App Top Header */}
        <div className="bg-neutral-50/90 border-b border-neutral-200/80 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            {/* macOS Style Window Dots */}
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-400/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-400/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-400/80 inline-block" />
            </div>

            {/* Restaurant Store Badge */}
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-neutral-200 text-neutral-700 font-medium">
              <span className="w-2 h-2 rounded-full bg-lime-500 animate-pulse" />
              <span className="font-semibold text-neutral-900">Metro Burger & Pizza</span>
              <span className="text-neutral-400">•</span>
              <span className="text-neutral-500 font-mono text-[11px]">Downtown Store #402</span>
            </div>
          </div>

          {/* Clean 3-Tab Switcher */}
          <div className="flex items-center bg-neutral-200/60 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("forecast")}
              className={`btn-animate flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold ${
                activeTab === "forecast"
                  ? "bg-white text-black shadow-xs"
                  : "text-neutral-600 hover:text-black"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-lime-600" />
              <span>Sales Forecast</span>
            </button>

            <button
              onClick={() => setActiveTab("inventory")}
              className={`btn-animate flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold ${
                activeTab === "inventory"
                  ? "bg-white text-black shadow-xs"
                  : "text-neutral-600 hover:text-black"
              }`}
            >
              <Boxes className="w-3.5 h-3.5 text-lime-600" />
              <span>Live Inventory</span>
            </button>

            <button
              onClick={() => setActiveTab("profit")}
              className={`btn-animate flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold ${
                activeTab === "profit"
                  ? "bg-white text-black shadow-xs"
                  : "text-neutral-600 hover:text-black"
              }`}
            >
              <PieChart className="w-3.5 h-3.5 text-lime-600" />
              <span>Menu Profitability</span>
            </button>
          </div>
        </div>

        {/* Workspace Canvas */}
        <div className="p-5 sm:p-7 lg:p-8 bg-neutral-50/40">
          
          {/* Top 3 Metric Cards (Clean & Spacious) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-white border border-neutral-200/80 shadow-2xs">
              <span className="text-xs font-medium text-neutral-500">Today&apos;s Projected Sales</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-extrabold text-neutral-900">$4,280.00</span>
                <span className="text-xs font-semibold text-lime-700 bg-lime-50 px-2 py-0.5 rounded-md flex items-center">
                  <ArrowUpRight className="w-3 h-3 mr-0.5" /> +18.4%
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-neutral-200/80 shadow-2xs">
              <span className="text-xs font-medium text-neutral-500">Expected Dinner Rush</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-extrabold text-neutral-900">6:30 – 8:30 PM</span>
                <span className="text-xs font-semibold text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded-md">
                  185+ Burgers & Pizzas
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-neutral-200/80 shadow-2xs">
              <span className="text-xs font-medium text-neutral-500">Inventory Status</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-extrabold text-neutral-900">100% In Stock</span>
                <span className="text-xs font-semibold text-lime-700 bg-lime-50 px-2 py-0.5 rounded-md">
                  Zero Stockouts
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Tab Viewports */}
          <AnimatePresence mode="wait">
            
            {/* TAB 1: SALES FORECAST */}
            {activeTab === "forecast" && (
              <motion.div
                key="forecast"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-5"
              >
                {/* Visual Chart Card */}
                <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200/80 shadow-2xs">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h4 className="text-base font-bold text-neutral-900">
                        Daily Demand & Sales Forecast
                      </h4>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        Predicted order volume based on previous weekend sales trends
                      </p>
                    </div>
                    <span className="text-xs font-bold bg-lime-100 text-lime-900 border border-lime-200 px-2.5 py-1 rounded-full">
                      88% Accuracy
                    </span>
                  </div>

                  {/* Clean Visual Bars */}
                  <div className="h-44 flex items-end justify-between gap-3 pt-4 pb-2 px-2 border-b border-neutral-100">
                    {[
                      { day: "Wed", actual: 85, forecast: 88, label: "Regular" },
                      { day: "Thu", actual: 110, forecast: 115, label: "Dinner" },
                      { day: "Fri", actual: 190, forecast: 195, label: "Rush" },
                      { day: "Sat", actual: 0, forecast: 260, label: "+35% Rush Peak", highlight: true },
                      { day: "Sun", actual: 0, forecast: 210, label: "+20% Game Day" },
                      { day: "Mon", actual: 0, forecast: 75, label: "Steady" },
                    ].map((item, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                        {item.highlight && (
                          <span className="text-[10px] font-bold text-lime-800 bg-lime-100 px-1.5 py-0.5 rounded">
                            {item.label}
                          </span>
                        )}
                        <div className="w-full flex items-end justify-center gap-1.5 h-28">
                          {item.actual > 0 && (
                            <div
                              className="w-1/2 bg-neutral-300 rounded-t-sm"
                              style={{ height: `${(item.actual / 280) * 100}%` }}
                              title={`Actual: ${item.actual} orders`}
                            />
                          )}
                          <div
                            className={`w-1/2 rounded-t-sm transition-all duration-300 ${
                              item.highlight ? "bg-lime-500 shadow-sm" : "bg-neutral-900"
                            }`}
                            style={{ height: `${(item.forecast / 280) * 100}%` }}
                            title={`Forecast: ${item.forecast} orders`}
                          />
                        </div>
                        <span className="text-xs font-semibold text-neutral-700">{item.day}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 text-xs text-neutral-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded bg-neutral-300 inline-block" /> Past Sales
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded bg-neutral-900 inline-block" /> Predicted Demand
                      </span>
                      <span className="flex items-center gap-1.5 text-lime-800 font-semibold">
                        <span className="w-2.5 h-2.5 rounded bg-lime-500 inline-block" /> Weekend Rush Surge
                      </span>
                    </div>
                  </div>
                </div>

                {/* Kitchen Prep Recommendation Card */}
                <div
                  className="lg:col-span-5 flex flex-col justify-between p-5 sm:p-6 rounded-2xl border border-lime-200/80 shadow-2xs"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(240, 253, 244, 0.95) 0%, rgba(254, 243, 199, 0.6) 50%, rgba(255, 255, 255, 0.95) 100%)",
                  }}
                >
                  <div>
                    <div className="mb-2">
                      <span className="text-xs font-bold text-lime-900 uppercase tracking-wide">
                        Suggested Kitchen Prep
                      </span>
                    </div>
                    <h5 className="text-base font-extrabold text-neutral-900 mt-1">
                      Prep for Saturday Rush Peak
                    </h5>
                    <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                      High volume predicted between 6:00 PM and 9:00 PM. Automated prep targets:
                    </p>

                    <div className="mt-4 space-y-2 bg-white/90 p-3.5 rounded-xl border border-lime-200/70 text-xs">
                      <div className="flex items-center justify-between text-neutral-700">
                        <span>Burger Patties Pressed</span>
                        <span className="font-bold text-neutral-900">320 patties ready</span>
                      </div>
                      <div className="flex items-center justify-between text-neutral-700">
                        <span>Pizza Dough Balls Proofed</span>
                        <span className="font-bold text-neutral-900">85 dough portions</span>
                      </div>
                      <div className="flex items-center justify-between text-neutral-700">
                        <span>French Fries Pre-portioned</span>
                        <span className="font-bold text-neutral-900">45 kg staged</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center gap-2">
                    <button className="btn-animate-dark flex-1 py-2 px-4 rounded-xl bg-black text-white text-xs font-bold hover:bg-neutral-800 shadow-sm cursor-pointer">
                      Apply Prep Targets
                    </button>
                    <button className="btn-animate py-2 px-4 rounded-xl bg-white border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 shadow-2xs cursor-pointer">
                      Print Prep Sheet
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 2: LIVE INVENTORY */}
            {activeTab === "inventory" && (
              <motion.div
                key="inventory"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-100 gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center text-xs font-bold">
                      POS
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-neutral-900">
                        Live Order Auto-Deductions
                      </h4>
                      <p className="text-xs text-neutral-500">
                        Ingredients deduct the instant counter, kiosk, or delivery orders are paid
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-lime-100 text-lime-900 border border-lime-200 self-start sm:self-auto">
                    Real-time stock sync active
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                  {[
                    { name: "Potato Burger Buns", remaining: "164 left", status: "Optimal", color: "bg-lime-500" },
                    { name: "Angus Beef Patties", remaining: "28.5 kg left", status: "Optimal", color: "bg-lime-500" },
                    { name: "American Cheese Slices", remaining: "180 slices left", status: "Optimal", color: "bg-lime-500" },
                    { name: "House Burger Sauce", remaining: "1.8 L left", status: "Low Stock Alert", color: "bg-amber-500" },
                    { name: "Golden Russet Potatoes", remaining: "42 kg left", status: "Optimal", color: "bg-lime-500" },
                    { name: "Mozzarella Cheese", remaining: "24 kg left", status: "Optimal", color: "bg-lime-500" },
                  ].map((ing, i) => (
                    <div key={i} className="p-3.5 rounded-xl border border-neutral-100 bg-neutral-50/70 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-neutral-900">{ing.name}</p>
                        <p className="text-neutral-500 text-[11px] mt-0.5">{ing.remaining}</p>
                      </div>
                      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-700 bg-white px-2.5 py-1 rounded-lg border border-neutral-200">
                        <span className={`w-2 h-2 rounded-full ${ing.color}`} />
                        <span>{ing.status}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-lime-50/80 border border-lime-200 rounded-xl p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-lime-700 shrink-0" />
                    <span className="text-neutral-800 font-medium">
                      Supplier draft PO auto-created for House Burger Sauce before low threshold.
                    </span>
                  </div>
                  <span className="text-xs font-bold text-lime-900 bg-lime-200/80 px-2.5 py-1 rounded-lg">
                    1-Click Restock
                  </span>
                </div>
              </motion.div>
            )}

            {/* TAB 3: MENU PROFITABILITY */}
            {activeTab === "profit" && (
              <motion.div
                key="profit"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-5"
              >
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">
                      Menu Item Margins & Sales Volume
                    </h4>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Identify your best profit-drivers and popular fast food combos
                    </p>
                  </div>
                  <span className="text-xs font-bold bg-lime-100 text-lime-900 border border-lime-200 px-3 py-1 rounded-full">
                    Live Menu Pricing
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
                  <div className="p-4 rounded-xl border border-lime-200 bg-lime-50/50">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-lime-800 bg-lime-200/70 px-2 py-0.5 rounded">
                      Top Seller
                    </span>
                    <h5 className="text-sm font-bold text-neutral-900 mt-2.5">Double Smash Burger</h5>
                    <p className="text-xs text-neutral-600 mt-0.5">79.2% Margin • 360/wk</p>
                    <p className="text-[11px] text-lime-800 mt-2 font-medium">Keep prime kiosk placement</p>
                  </div>

                  <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded">
                      High Profit
                    </span>
                    <h5 className="text-sm font-bold text-neutral-900 mt-2.5">Large Golden Fries</h5>
                    <p className="text-xs text-neutral-600 mt-0.5">83.5% Margin • 580/wk</p>
                    <p className="text-[11px] text-amber-800 mt-2 font-medium">Bundle into combo meals</p>
                  </div>

                  <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-800 bg-blue-200/70 px-2 py-0.5 rounded">
                      Family Favorite
                    </span>
                    <h5 className="text-sm font-bold text-neutral-900 mt-2.5">14&quot; Pepperoni Pizza</h5>
                    <p className="text-xs text-neutral-600 mt-0.5">78.0% Margin • 145/wk</p>
                    <p className="text-[11px] text-blue-800 mt-2 font-medium">Promote as 2-for-1 dinner deal</p>
                  </div>

                  <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-100/50">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-700 bg-neutral-200 px-2 py-0.5 rounded">
                      Steady Item
                    </span>
                    <h5 className="text-sm font-bold text-neutral-900 mt-2.5">Crispy Chicken Tenders</h5>
                    <p className="text-xs text-neutral-600 mt-0.5">74.0% Margin • 190/wk</p>
                    <p className="text-[11px] text-neutral-700 mt-2 font-medium">Highlight sauce combos</p>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </div>
      </div>
    </section>
  );
}
