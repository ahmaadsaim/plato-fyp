"use client";

import React, { useState } from "react";
import { Camera, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { HoverLines } from "./HoverWord";

export function MenuScanAnimation() {
  const [isScanning, setIsScanning] = useState(false);
  const [flash, setFlash] = useState(false);

  const handleRetakeScan = () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 200);
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 2000);
  };

  return (
    <section id="menu-scanner" className="py-20 md:py-28 bg-white border-t border-neutral-100 relative overflow-hidden">
      {/* Background Soft Ambient Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full blur-[140px] opacity-20 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, rgba(163, 230, 53, 0.45) 0%, rgba(254, 240, 138, 0.25) 45%, transparent 75%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left: Text Description (Matching Priority Margin Section Style) */}
          <div className="lg:col-span-6 space-y-6">
            <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-lime-600">
              Menu Scanner
            </p>

            <h3 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight leading-tight">
              <HoverLines lines={["Scan paper menus directly", "into your register"]} />
            </h3>

            <p className="text-base text-neutral-600 leading-relaxed font-normal">
              Skip hours of manual spreadsheet data entry. Point any smartphone camera at your printed paper menu. Plato's vision engine instantly reads dish names, prices, descriptions, and modifiers — ready for your register in under two minutes.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-lime-100 text-lime-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-900">Zero Manual Data Entry</h4>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Converts printed sheets, laminated cards, and takeout flyers into clean digital catalog items.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-lime-100 text-lime-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-900">Automatic Modifier & Price Detection</h4>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Understands add-on pricing, combo sizes, and preparation choices without manual configuration.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-lime-100 text-lime-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-900">Universal Register & KDS Sync</h4>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    The moment you approve, items populate all counter POS terminals, kitchen screens, and web checkout.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Clean Mobile Phone Scanner Visual */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center py-6 relative">
            {/* Ambient Lime Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-lime-300/25 rounded-full blur-3xl pointer-events-none -z-10" />

            <div className="w-full max-w-[325px] sm:max-w-[340px] relative">
              {/* iPhone Titanium Device Shell */}
              <div className="rounded-[48px] bg-[#0c1017] p-3 shadow-[0_25px_65px_rgba(0,0,0,0.25),0_10px_25px_rgba(0,0,0,0.15)] border-[3px] border-neutral-700/80 relative">
                
                {/* Hardware Side Buttons */}
                <div className="absolute -left-[5px] top-22 w-1 h-7 bg-neutral-700 rounded-l-md" />
                <div className="absolute -left-[5px] top-32 w-1 h-9 bg-neutral-700 rounded-l-md" />
                <div className="absolute -right-[5px] top-26 w-1 h-12 bg-neutral-700 rounded-r-md" />

                {/* Dynamic Island Notch */}
                <div className="w-22 h-4.5 rounded-full bg-black mx-auto mb-2 flex items-center justify-between px-2.5 z-30 relative shadow-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-800" />
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-900 border border-neutral-800" />
                </div>

                {/* Smartphone Screen Viewport */}
                <div className="rounded-[36px] bg-[#FAF8F5] overflow-hidden relative aspect-[9/18.2] flex flex-col justify-between border border-neutral-300 shadow-inner">
                  
                  {/* Camera Flash Overlay */}
                  <AnimatePresence>
                    {flash && (
                      <motion.div
                        initial={{ opacity: 0.95 }}
                        animate={{ opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 bg-white z-50 pointer-events-none"
                      />
                    )}
                  </AnimatePresence>

                  {/* Camera Top HUD */}
                  <div className="pt-2 px-3.5 pb-1.5 flex items-center justify-between text-[10px] bg-neutral-900 text-white z-20">
                    <div className="flex items-center gap-1.5 font-medium">
                      <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
                      <span className="font-semibold text-xs tracking-wide">Plato Menu Scanner</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-lime-500 text-black text-[9px] font-bold">
                      {isScanning ? "Scanning..." : "Active"}
                    </span>
                  </div>

                  {/* Viewfinder Center: Authentic Printed Paper Menu */}
                  <div className="relative flex-1 flex flex-col justify-between p-3.5 bg-[#FAF8F5] select-none text-neutral-900 overflow-hidden">
                    
                    {/* Menu Header */}
                    <div className="text-center pb-2 border-b border-neutral-300">
                      <p className="font-serif italic text-[9px] text-neutral-500 tracking-wider">
                        ESTD. 2021 • FRESH & FAST
                      </p>
                      <h3 className="font-serif text-xs tracking-widest font-extrabold uppercase text-neutral-950 mt-0.5">
                        Metro Burger & Pizza Co.
                      </h3>
                      <p className="font-serif text-[8px] text-neutral-500 uppercase tracking-widest mt-0.5">
                        Burgers, Pizzas & Sides
                      </p>
                    </div>

                    {/* 3 Dishes on Paper */}
                    <div className="py-2 space-y-2.5 font-serif">
                      
                      {/* Dish 1 */}
                      <div className="p-2 rounded-lg bg-lime-400/15 border border-lime-500/50">
                        <div className="flex justify-between items-baseline font-bold text-xs text-neutral-950">
                          <span>Double Smash Cheeseburger</span>
                          <span className="font-mono text-xs font-bold">$11.99</span>
                        </div>
                        <p className="font-sans text-[9px] text-neutral-600 italic leading-snug mt-0.5">
                          Two smashed patties, American cheese, grilled onions, secret sauce
                        </p>
                      </div>

                      {/* Dish 2 */}
                      <div className="p-2 rounded-lg bg-lime-400/15 border border-lime-500/50">
                        <div className="flex justify-between items-baseline font-bold text-xs text-neutral-950">
                          <span>Loaded Cheese & Bacon Fries</span>
                          <span className="font-mono text-xs font-bold">$6.50</span>
                        </div>
                        <p className="font-sans text-[9px] text-neutral-600 italic leading-snug mt-0.5">
                          Crispy skin-on fries, warm cheddar cheese sauce, smoky bacon
                        </p>
                      </div>

                      {/* Dish 3 */}
                      <div className="p-2 rounded-lg bg-lime-400/15 border border-lime-500/50">
                        <div className="flex justify-between items-baseline font-bold text-xs text-neutral-950">
                          <span>14&quot; Pepperoni Feast Pizza</span>
                          <span className="font-mono text-xs font-bold">$16.99</span>
                        </div>
                        <p className="font-sans text-[9px] text-neutral-600 italic leading-snug mt-0.5">
                          Hand-tossed crust, double crispy pepperoni, mozzarella cheese
                        </p>
                      </div>

                    </div>

                    {/* Menu Footer */}
                    <div className="pt-1.5 border-t border-neutral-300 flex items-center justify-between text-[8px] text-neutral-500 font-serif italic">
                      <span>100% Fresh Angus Beef</span>
                      <span>Daily Made Dough</span>
                    </div>

                    {/* Moving Glowing Laser Scan Beam */}
                    <motion.div
                      initial={{ top: "-3%" }}
                      animate={{ top: ["-3%", "103%", "-3%"] }}
                      transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute left-1 right-1 h-0.5 bg-lime-400 shadow-[0_0_14px_#84cc16,0_0_24px_rgba(132,204,22,0.8)] z-30 pointer-events-none -translate-y-1/2"
                    >
                      {/* Soft Trailing Illumination Glow */}
                      <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-t from-lime-400/20 to-transparent pointer-events-none" />
                      <div className="absolute -bottom-6 left-0 right-0 h-6 bg-gradient-to-b from-lime-400/20 to-transparent pointer-events-none" />
                    </motion.div>

                    {/* Camera Corner Crop Reticles */}
                    <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-black pointer-events-none" />
                    <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-black pointer-events-none" />
                    <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-black pointer-events-none" />
                    <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-black pointer-events-none" />
                  </div>

                  {/* Camera Bottom Shutter Bar */}
                  <div className="p-2.5 bg-neutral-900 text-white z-20 flex items-center justify-between text-[10px]">
                    <span className="text-neutral-400 font-mono text-[9px] bg-neutral-800 px-2 py-0.5 rounded">
                      1x Camera
                    </span>

                    {/* Shutter Button */}
                    <button
                      onClick={handleRetakeScan}
                      className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center p-0.5 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                      aria-label="Capture scan"
                    >
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                        <Camera className="w-4 h-4 text-black" />
                      </div>
                    </button>

                    <span className="text-lime-400 font-bold font-mono text-[9px]">
                      3 Items
                    </span>
                  </div>

                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
