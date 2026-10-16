"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  UtensilsCrossed,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "./AuthContext";
import { logoutAction } from "@/app/actions/auth";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close user dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-3 sm:top-5 inset-x-0 z-40 px-3 sm:px-6 lg:px-8 pointer-events-none transition-all duration-300">
      <div className="max-w-6xl mx-auto pointer-events-auto">
        <div
          className={`relative rounded-2xl px-4 sm:px-6 py-2 transition-all duration-300 backdrop-blur-md bg-white/50 border border-neutral-200/50 ${
            scrolled
              ? "shadow-[0_10px_30px_rgba(0,0,0,0.08)] border-neutral-300/60"
              : "shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
          }`}
        >
          <div className="flex items-center justify-between h-12">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white relative shadow-sm group-hover:scale-105 transition-transform duration-200">
                <UtensilsCrossed className="w-4 h-4 text-white" />
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-lime-500 border border-white" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold tracking-tight text-black">Plato</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-lime-500" />
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-7">
              {[
                { href: "#features", label: "Features" },
                { href: "#ai-insights", label: "AI Insights" },
                { href: "#menu-scanner", label: "Menu Scanner" },
                { href: "#kds-system", label: "Kitchen View" },
                { href: "#integrations", label: "Integrations" },
                { href: "#pricing", label: "Pricing" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative py-1 text-sm font-medium text-neutral-700 hover:text-black transition-colors group"
                >
                  <span>{item.label}</span>
                  <span className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-lime-500 rounded-full scale-x-0 origin-left transition-transform duration-200 ease-out group-hover:scale-x-100" />
                </Link>
              ))}
            </nav>

            {/* Action Buttons / User Menu */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated && user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2.5 p-1 pl-2 pr-3 rounded-xl border border-neutral-200/80 bg-white/80 hover:bg-white text-xs font-semibold text-neutral-800 shadow-2xs transition-all cursor-pointer"
                  >
                    <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[11px] font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="max-w-[120px] truncate">{user.name}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-neutral-200 shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-3 py-2 border-b border-neutral-100">
                        <p className="text-xs font-bold text-neutral-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-neutral-500 truncate">{user.email}</p>
                        <div className="mt-1 flex items-center gap-1 text-[10px] text-lime-700 font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-lime-500" />
                          <span>{user.provider === "google" ? "Google Connected" : "Email Account"}</span>
                        </div>
                      </div>

                      <div className="py-1">
                        <Link
                          href="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-neutral-700 hover:text-black hover:bg-neutral-50 transition-colors"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5 text-neutral-500" />
                          <span>Restaurant Dashboard</span>
                        </Link>
                      </div>

                      <div className="pt-1 border-t border-neutral-100">
                        <form action={logoutAction}>
                          <button
                            type="submit"
                            onClick={() => setUserDropdownOpen(false)}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Sign Out</span>
                          </button>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="btn-animate px-3.5 py-1.5 text-sm font-medium text-neutral-700 hover:text-black transition-colors cursor-pointer rounded-lg"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    className="btn-animate-dark inline-flex items-center justify-center px-4 sm:px-5 py-2 rounded-xl bg-black text-white text-sm font-medium shadow-sm hover:bg-neutral-800 cursor-pointer"
                  >
                    <span>Sign Up</span>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              {!isAuthenticated ? (
                <Link
                  href="/signup"
                  className="btn-animate-dark px-3.5 py-1.5 rounded-xl bg-black text-white text-xs font-medium cursor-pointer"
                >
                  Sign Up
                </Link>
              ) : (
                <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800 mr-1">
                  <span className="w-2 h-2 rounded-full bg-lime-500" />
                  <span className="max-w-[70px] truncate">{user?.name.split(" ")[0]}</span>
                </div>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 rounded-lg text-neutral-700 hover:text-black hover:bg-black/5"
                aria-label="Toggle navigation"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 p-4 rounded-2xl bg-white/50 backdrop-blur-xl border border-neutral-200/50 shadow-xl space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            {isAuthenticated && user && (
              <div className="p-3 mb-2 rounded-xl bg-white/70 border border-neutral-200/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-black">{user.name}</p>
                    <p className="text-[11px] text-neutral-500 truncate">{user.email}</p>
                  </div>
                </div>
              </div>
            )}

            <Link
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-base font-medium text-neutral-800 hover:text-black hover:bg-white/60 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#ai-insights"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-base font-medium text-neutral-800 hover:text-black hover:bg-white/60 transition-colors"
            >
              AI Insights
            </Link>
            <Link
              href="#menu-scanner"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-base font-medium text-neutral-800 hover:text-black hover:bg-white/60 transition-colors"
            >
              AI Menu Scanner
            </Link>
            <Link
              href="#kds-system"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-base font-medium text-neutral-800 hover:text-black hover:bg-white/60 transition-colors"
            >
              Kitchen View
            </Link>
            <Link
              href="#integrations"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-base font-medium text-neutral-800 hover:text-black hover:bg-white/60 transition-colors"
            >
              Integrations
            </Link>
            <Link
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-base font-medium text-neutral-800 hover:text-black hover:bg-white/60 transition-colors"
            >
              Pricing
            </Link>

            <div className="pt-2 border-t border-neutral-200/40 flex flex-col gap-2">
              {isAuthenticated ? (
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="w-full text-center py-2.5 rounded-xl bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition-colors cursor-pointer"
                  >
                    Sign Out
                  </button>
                </form>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-animate w-full text-center py-2.5 rounded-xl text-sm font-medium text-neutral-800 hover:bg-white/60 transition-colors cursor-pointer"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-animate-dark w-full text-center py-2.5 rounded-xl bg-black text-white text-sm font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    Get Started Free
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
