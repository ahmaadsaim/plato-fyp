"use client";

import React from "react";

export function TrustBand() {
  const brands = [
    { name: "Smash & Bun", sub: "Burger Co." },
    { name: "Crust & Slice", sub: "Fast Pizza" },
    { name: "Golden Fryer", sub: "Fries & Shakes" },
    { name: "Metro Burgers", sub: "Fast Casual" },
    { name: "SliceHouse", sub: "Pizza Express" },
    { name: "Crispy Crave", sub: "Chicken & Fries" },
    { name: "Bun District", sub: "Smash Burgers" },
    { name: "FireCrust", sub: "Artisan Pizza" },
  ];

  return (
    <section className="py-12 border-y border-neutral-100 bg-white/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs sm:text-sm font-medium text-neutral-500 uppercase tracking-widest mb-8">
          Over 1,200+ burger joints, pizza shops, and fast-food chains run on Plato
        </p>

        {/* Logo Band Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6 sm:gap-8 items-center justify-items-center opacity-70 hover:opacity-100 transition-opacity duration-300">
          {brands.map((b, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center p-2 group transition-transform duration-200 hover:scale-105"
            >
              <span className="font-extrabold text-neutral-800 tracking-tight text-sm sm:text-base font-serif group-hover:text-black transition-colors">
                {b.name}
              </span>
              <span className="text-[10px] text-neutral-400 group-hover:text-lime-700 transition-colors uppercase tracking-wider font-sans">
                {b.sub}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
