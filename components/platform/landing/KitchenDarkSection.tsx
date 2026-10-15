"use client";

import React, { useState } from "react";
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  WifiOff,
  Gauge,
  Volume2,
  VolumeX,
} from "lucide-react";
import { HoverLines } from "./HoverWord";

export function KitchenDarkSection() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [bumpedTickets, setBumpedTickets] = useState<number[]>([]);

  const handleBump = (id: number) => {
    setBumpedTickets((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  return (
    <section id="kds-system" className="bg-neutral-50/70 text-neutral-900 py-24 md:py-32 relative overflow-hidden border-t border-neutral-200/70">
      {/* Subtle Ambient Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] rounded-full blur-3xl opacity-20 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(190, 242, 100, 0.4) 0%, rgba(254, 243, 199, 0.3) 50%, rgba(255, 255, 255, 0) 80%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-lime-600 mb-3">
            Kitchen Display System
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-black tracking-tight leading-tight">
            <HoverLines lines={["All kitchen orders", "in one unified screen"]} />
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 font-normal leading-relaxed">
            A high-contrast kitchen screen built for fast-food lines. Dine-in, drive-thru, and delivery orders flow into a single live queue with clear order timers and 1-tap bumping.
          </p>
        </div>

        {/* Redesigned Dark KDS Screen Terminal (Framed on Light Background) */}
        <div className="rounded-3xl border border-neutral-800 bg-[#0B0F19] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden mb-12">
          {/* Top Bezel / Header of the KDS */}
          <div className="bg-[#0e1322] border-b border-neutral-800 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-lime-500 text-black flex items-center justify-center font-extrabold text-xs shadow-sm">
                KDS
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white tracking-wide">Plato Main Kitchen Display</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-800 text-neutral-300">
                    Downtown Flagship
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
                  <Clock className="w-3 h-3 text-lime-400" />
                  <span>19:42:08 Line Clock</span>
                </div>
              </div>
            </div>

            {/* Single Unified Order Queue Indicator */}
            <div className="flex items-center gap-2 bg-[#141b2d] px-3.5 py-1.5 rounded-xl border border-neutral-800">
              <span className="w-2.5 h-2.5 rounded-full bg-lime-400 animate-pulse" />
              <span className="text-xs font-bold text-white tracking-wide">Main Order Queue</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-lime-500/15 text-lime-400 border border-lime-500/20">
                {3 - bumpedTickets.length} Active Tickets
              </span>
            </div>

            {/* Hardware Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="btn-animate w-8 h-8 rounded-lg bg-[#141b2d] border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white cursor-pointer"
                title={soundEnabled ? "Mute Buzzer" : "Unmute Buzzer"}
              >
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-lime-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-neutral-500" />
                )}
              </button>
              <div className="flex items-center gap-2 text-xs font-medium text-neutral-300 bg-neutral-900/90 px-3 py-1.5 rounded-lg border border-neutral-800">
                <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
                <span className="font-mono text-[11px]">Instant Live Sync</span>
              </div>
            </div>
          </div>

          {/* KDS Active Tickets Grid - Single Main Section */}
          <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4.5 bg-[#080B12] min-h-[400px]">
            {/* Ticket 1 */}
            <div className={`rounded-2xl border p-4.5 flex flex-col justify-between transition-all duration-300 ${
              bumpedTickets.includes(1)
                ? "bg-[#0d121c]/60 border-neutral-800/50 opacity-40"
                : "bg-[#111726] border-neutral-800 hover:border-lime-500/50"
            }`}>
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80">
                  <div>
                    <span className="text-base font-extrabold text-white">#4192 • Counter 2</span>
                    <p className="text-[11px] text-neutral-400">Cashier: Alex M. • Dine-in</p>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-lime-500/10 border border-lime-500/30 text-lime-400 text-xs font-mono font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>03:18</span>
                  </div>
                </div>

                <div className="py-3.5 space-y-3">
                  <div className="text-xs">
                    <p className="font-bold text-white text-sm">2x Double Smash Bacon Burger</p>
                    <p className="text-lime-400 text-xs font-semibold mt-0.5">1x Extra Cheese • 1x No Pickles</p>
                    <p className="text-neutral-400 text-[11px]">House burger sauce on toasted bun</p>
                  </div>

                  <div className="text-xs pt-2.5 border-t border-neutral-800/60">
                    <p className="font-semibold text-neutral-200">1x Large Golden French Fries</p>
                    <p className="text-neutral-400 text-[11px]">Extra seasoning salt</p>
                  </div>

                  <div className="text-xs pt-2.5 border-t border-neutral-800/60">
                    <p className="font-semibold text-neutral-200">1x Salted Caramel Shake</p>
                    <p className="text-neutral-400 text-[11px]">Whipped cream on top</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleBump(1)}
                className={`w-full mt-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer ${
                  bumpedTickets.includes(1)
                    ? "btn-animate bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                    : "btn-animate-lime bg-lime-500 text-black hover:bg-lime-400 shadow-md"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{bumpedTickets.includes(1) ? "Recall Ticket" : "Bump Ticket"}</span>
              </button>
            </div>

            {/* Ticket 2 (Priority Rush) */}
            <div className={`rounded-2xl border p-4.5 flex flex-col justify-between relative transition-all duration-300 ${
              bumpedTickets.includes(2)
                ? "bg-[#0d121c]/60 border-neutral-800/50 opacity-40"
                : "border-amber-500/60 bg-[#161c2d] shadow-[0_0_25px_rgba(245,158,11,0.12)]"
            }`}>
              <div className="absolute -top-3 right-4 px-2.5 py-0.5 bg-amber-500 text-black text-[10px] font-extrabold uppercase rounded-full tracking-wider shadow-sm">
                Drive-Thru Rush
              </div>
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80">
                  <div>
                    <span className="text-base font-extrabold text-white">#4190 • Online Pickup</span>
                    <p className="text-[11px] text-neutral-400">Curbside Drive-Thru • Bay 2</p>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-500/20 text-amber-300 text-xs font-mono font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>08:42</span>
                  </div>
                </div>

                <div className="py-3.5 space-y-3">
                  <div className="text-xs">
                    <p className="font-bold text-white text-sm">1x 14&quot; Pepperoni Feast Pizza</p>
                    <p className="text-amber-400 text-xs font-bold flex items-center gap-1 mt-0.5">
                      <AlertTriangle className="w-3.5 h-3.5" /> WELL-DONE CRUST • EXTRA CHEESE
                    </p>
                    <p className="text-neutral-400 text-[11px]">Garlic dipping sauce</p>
                  </div>

                  <div className="text-xs pt-2.5 border-t border-neutral-800/60">
                    <p className="font-semibold text-neutral-200">2x Loaded Cheese & Bacon Fries</p>
                    <p className="text-neutral-400 text-[11px]">Cheddar cheese sauce & bacon bits</p>
                  </div>

                  <div className="text-xs pt-2.5 border-t border-neutral-800/60">
                    <p className="font-semibold text-neutral-200">2x Large Fountain Soda</p>
                    <p className="text-neutral-400 text-[11px]">1x Cola • 1x Zero Sugar</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <button
                  onClick={() => handleBump(2)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer ${
                    bumpedTickets.includes(2)
                      ? "btn-animate bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                      : "btn-animate bg-white text-black hover:bg-neutral-200 shadow-sm"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{bumpedTickets.includes(2) ? "Recall Ticket" : "Bump Ticket"}</span>
                </button>
              </div>
            </div>

            {/* Ticket 3 */}
            <div className={`rounded-2xl border p-4.5 flex flex-col justify-between transition-all duration-300 ${
              bumpedTickets.includes(3)
                ? "bg-[#0d121c]/60 border-neutral-800/50 opacity-40"
                : "bg-[#111726] border-neutral-800 hover:border-lime-500/50"
            }`}>
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80">
                  <div>
                    <span className="text-base font-extrabold text-white">#4188 • Delivery App</span>
                    <p className="text-[11px] text-neutral-400">Driver Arriving • Order #4188</p>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-neutral-800 text-neutral-300 text-xs font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>01:15</span>
                  </div>
                </div>

                <div className="py-3.5 space-y-3">
                  <div className="text-xs">
                    <p className="font-bold text-white text-sm">1x Crispy Chicken Tenders (6pc)</p>
                    <p className="text-neutral-400 text-[11px]">Honey mustard & smoky BBQ dip</p>
                  </div>

                  <div className="text-xs pt-2.5 border-t border-neutral-800/60">
                    <p className="font-semibold text-neutral-200">1x Crispy Mozzarella Sticks (6pc)</p>
                    <p className="text-neutral-400 text-[11px]">Warm marinara dipping cup</p>
                  </div>

                  <div className="text-xs pt-2.5 border-t border-neutral-800/60">
                    <p className="font-semibold text-neutral-200">1x Golden Onion Rings</p>
                    <p className="text-neutral-400 text-[11px]">Zesty ranch dip</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleBump(3)}
                className={`w-full mt-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer ${
                  bumpedTickets.includes(3)
                    ? "btn-animate bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                    : "btn-animate bg-neutral-800 text-white hover:bg-neutral-700"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{bumpedTickets.includes(3) ? "Recall Ticket" : "Bump Ticket"}</span>
              </button>
            </div>
          </div>

          {/* Bottom KDS Velocity Bar */}
          <div className="bg-[#0b0e18] border-t border-neutral-800 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between text-xs text-neutral-400 font-mono">
            <div className="flex items-center gap-4">
              <span>Kitchen Prep Pace: <strong className="text-white">05m 40s avg</strong></span>
              <span>Active In Queue: <strong className="text-lime-400">{3 - bumpedTickets.length} Orders</strong></span>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span>KDS Version 4.2</span>
              <span>Touchscreen & Kitchen Screen Ready</span>
            </div>
          </div>
        </div>

        {/* 2 Feature Metric Cards (Clean Light Cards with Lime Green Hover State) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <div className="group p-6 sm:p-7 rounded-2xl border border-neutral-200/90 bg-white flex items-start gap-4 hover:border-lime-500 hover:shadow-[0_10px_30px_rgba(132,204,22,0.12)] transition-all duration-300 cursor-default">
            <div className="w-12 h-12 rounded-xl bg-neutral-100 border border-neutral-200/50 group-hover:bg-lime-500/10 group-hover:border-lime-300/80 flex items-center justify-center shrink-0 transition-all duration-300">
              <WifiOff className="w-6 h-6 text-neutral-700 group-hover:text-lime-600 transition-colors duration-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900 group-hover:text-black transition-colors duration-200">Works 100% Offline When Wi-Fi Drops</h3>
              <p className="mt-2 text-sm text-neutral-600 leading-relaxed font-normal">
                Never lose a ticket during an internet outage. Your kitchen screens, server handhelds, and ticket printers keep running smoothly without missing a beat.
              </p>
            </div>
          </div>

          <div className="group p-6 sm:p-7 rounded-2xl border border-neutral-200/90 bg-white flex items-start gap-4 hover:border-lime-500 hover:shadow-[0_10px_30px_rgba(132,204,22,0.12)] transition-all duration-300 cursor-default">
            <div className="w-12 h-12 rounded-xl bg-neutral-100 border border-neutral-200/50 group-hover:bg-lime-500/10 group-hover:border-lime-300/80 flex items-center justify-center shrink-0 transition-all duration-300">
              <Gauge className="w-6 h-6 text-neutral-700 group-hover:text-lime-600 transition-colors duration-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900 group-hover:text-black transition-colors duration-200">1.8x Faster Order Turnaround</h3>
              <p className="mt-2 text-sm text-neutral-600 leading-relaxed font-normal">
                Clear live order timers and 1-tap ticket bumping keep prep moving quickly, saving an average of 4 minutes per ticket during dinner rush.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
