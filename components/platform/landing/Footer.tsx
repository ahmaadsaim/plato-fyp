"use client";

import React from "react";
import Link from "next/link";
import { UtensilsCrossed, ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#090C15] border-t border-neutral-800/80 text-neutral-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-10 lg:gap-16">
          {/* Brand Info */}
          <div className="max-w-sm space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white relative shadow-xs group-hover:border-neutral-700 transition-all duration-200">
                <UtensilsCrossed className="w-4 h-4 text-white" />
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-lime-500" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold tracking-tight text-white">Plato</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-lime-500" />
              </div>
            </Link>

            <p className="text-sm text-neutral-400 leading-relaxed">
              The modern operating system for forward-thinking restaurants. Fast counter POS, kitchen display, and intelligent forecasting.
            </p>

            {/* Live Status Indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-800 text-xs font-medium text-neutral-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-500"></span>
              </span>
              <span>All systems operational (99.99%)</span>
            </div>
          </div>

          {/* Curated Navigation Columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12 w-full lg:w-auto">
            {/* Product */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white mb-3.5">
                Product
              </p>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link href="#features" className="hover:text-white transition-colors">
                    Cloud POS
                  </Link>
                </li>
                <li>
                  <Link href="#kds-system" className="hover:text-white transition-colors">
                    Kitchen Display
                  </Link>
                </li>
                <li>
                  <Link href="#features" className="hover:text-white transition-colors">
                    Online Ordering
                  </Link>
                </li>
                <li>
                  <Link href="#ai-insights" className="hover:text-white transition-colors">
                    Demand Forecasts
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white mb-3.5">
                Company
              </p>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link href="#about" className="hover:text-white transition-colors">
                    About Plato
                  </Link>
                </li>
                <li>
                  <Link href="#integrations" className="hover:text-white transition-colors">
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="hover:text-white transition-colors">
                    Contact Sales
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal & Trust */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white mb-3.5">
                Legal
              </p>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link href="#privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#terms" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#security" className="hover:text-white transition-colors">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Sub-Footer */}
        <div className="mt-12 pt-8 border-t border-neutral-800/70 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© 2026 Plato Technologies, Inc. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <Link href="#privacy" className="hover:text-neutral-300 transition-colors">
              Privacy
            </Link>
            <Link href="#terms" className="hover:text-neutral-300 transition-colors">
              Terms
            </Link>
            <Link href="#status" className="hover:text-neutral-300 transition-colors flex items-center gap-1">
              <span>System Status</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
