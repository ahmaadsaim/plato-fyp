"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { HoverLines } from "./HoverWord";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-16 sm:pt-28 md:pt-32 md:pb-24">
      {/* Background Soft Pastel Gradient Blobs (Pale Lime & Warm Pastel Peach/Amber) */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden select-none">
        <div
          className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[900px] h-[550px] rounded-full blur-3xl opacity-40 mix-blend-multiply"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(217, 249, 157, 0.5) 0%, rgba(254, 243, 199, 0.45) 45%, rgba(255, 255, 255, 0) 75%)",
          }}
        />
        <div
          className="absolute top-[5%] -left-[10%] w-[500px] h-[450px] rounded-full blur-3xl opacity-35"
          style={{
            background:
              "radial-gradient(circle, rgba(236, 252, 203, 0.6) 0%, rgba(255, 255, 255, 0) 70%)",
          }}
        />
        <div
          className="absolute top-[8%] -right-[10%] w-[550px] h-[450px] rounded-full blur-3xl opacity-35"
          style={{
            background:
              "radial-gradient(circle, rgba(254, 215, 170, 0.45) 0%, rgba(254, 243, 199, 0.3) 50%, rgba(255, 255, 255, 0) 75%)",
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Eyebrow Tag */}
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xs sm:text-sm font-bold uppercase tracking-widest text-lime-600 mb-6"
        >
          The All-in-One Restaurant System
        </motion.p>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-black max-w-4xl mx-auto leading-[1.12]"
        >
          <HoverLines lines={["Restaurant operations,", "simplified."]} />
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto font-normal leading-relaxed"
        >
          Launch your restaurant system in under 2 minutes. Scan paper menus to instantly build your register and online store, run seamlessly online or offline, and forecast daily sales automatically.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4"
        >
          <Link
            href="/signup"
            className="btn-animate-dark w-full sm:w-auto inline-flex items-center justify-center px-9 py-3.5 rounded-full bg-black text-white text-base font-semibold shadow-md hover:bg-neutral-900 cursor-pointer"
          >
            <span>Get Started Free</span>
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 text-xs text-neutral-500 font-medium"
        >
          Instant menu scanner • Live sales forecasting • 100% offline protection
        </motion.p>
      </div>
    </section>
  );
}
