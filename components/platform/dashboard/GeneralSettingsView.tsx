"use client";

import React, { useState } from "react";
import {
  User,
  Shield,
  Globe,
  Bell,
  Check,
  Save,
  Key,
  Lock,
  Layers,
  Store,
} from "lucide-react";
import type { User as UserType } from "@/lib/auth";

interface GeneralSettingsViewProps {
  user: UserType;
  platformDomain: string;
  platformProtocol: string;
  totalRestaurants: number;
}

export function GeneralSettingsView({
  user,
  platformDomain,
  platformProtocol,
  totalRestaurants,
}: GeneralSettingsViewProps) {
  const [name, setName] = useState(user.name || "");
  const [email] = useState(user.email || "");
  const [notifyOrders, setNotifyOrders] = useState(true);
  const [notifyDailyDigest, setNotifyDailyDigest] = useState(true);
  const [notifyOutOfStock, setNotifyOutOfStock] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="border-b border-zinc-200 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-lime-500 text-black">
            ACCOUNT & PLATFORM
          </span>
          <span className="text-xs text-zinc-400 font-mono">•</span>
          <span className="text-xs text-zinc-500 font-mono">Global Preferences</span>
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900">
          General Settings
        </h2>
        <p className="text-xs sm:text-sm text-zinc-600 mt-1">
          Configure your merchant profile, platform domain options, and notification controls.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Account Profile Card */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-100">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900">Merchant Profile</h3>
              <p className="text-xs text-zinc-500">Your account identity across all connected restaurants</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-lime-500 focus:bg-white transition-colors"
                placeholder="Merchant Name"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-3.5 py-2 rounded-lg bg-zinc-100 border border-zinc-200 text-xs text-zinc-500 cursor-not-allowed font-mono"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center gap-4 text-xs text-zinc-500 font-mono">
            <span className="flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-lime-600" />
              Connected Stores: <strong className="text-zinc-900">{totalRestaurants}</strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-lime-600" />
              Plan: <strong className="text-zinc-900">Merchant Pro</strong>
            </span>
          </div>
        </div>

        {/* Platform Domain Architecture Card */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-100">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900">Domain & Tenant Routing</h3>
              <p className="text-xs text-zinc-500">How your restaurants are mapped and accessed online</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between text-xs">
              <div>
                <p className="font-semibold text-zinc-900">Multi-Tenant Wildcard Domain</p>
                <p className="text-zinc-500 font-mono mt-0.5">
                  *.{platformDomain}
                </p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-lime-100 border border-lime-300 text-lime-800">
                ENABLED
              </span>
            </div>

            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between text-xs">
              <div>
                <p className="font-semibold text-zinc-900">Active Protocol</p>
                <p className="text-zinc-500 font-mono mt-0.5">
                  {platformProtocol.toUpperCase()} (Secure SSL)
                </p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-zinc-100 border border-zinc-200 text-zinc-700">
                ACTIVE
              </span>
            </div>
          </div>
        </div>

        {/* Notifications Card */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-100">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900">Notifications</h3>
              <p className="text-xs text-zinc-500">Stay updated on incoming orders and inventory status</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 transition-colors cursor-pointer">
              <div>
                <p className="text-xs font-semibold text-zinc-900">Instant Order Alerts</p>
                <p className="text-[11px] text-zinc-500">Send immediate email notifications when a new order is placed</p>
              </div>
              <input
                type="checkbox"
                checked={notifyOrders}
                onChange={(e) => setNotifyOrders(e.target.checked)}
                className="w-4 h-4 accent-lime-600 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 transition-colors cursor-pointer">
              <div>
                <p className="text-xs font-semibold text-zinc-900">Daily Sales Summary</p>
                <p className="text-[11px] text-zinc-500">Receive a daily digest of order volumes and revenue across stores</p>
              </div>
              <input
                type="checkbox"
                checked={notifyDailyDigest}
                onChange={(e) => setNotifyDailyDigest(e.target.checked)}
                className="w-4 h-4 accent-lime-600 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 transition-colors cursor-pointer">
              <div>
                <p className="text-xs font-semibold text-zinc-900">Out of Stock Alerts</p>
                <p className="text-[11px] text-zinc-500">Get notified when a menu item is toggled sold out or unavailable</p>
              </div>
              <input
                type="checkbox"
                checked={notifyOutOfStock}
                onChange={(e) => setNotifyOutOfStock(e.target.checked)}
                className="w-4 h-4 accent-lime-600 rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Submit bar */}
        <div className="flex items-center justify-between pt-2">
          {saveSuccess ? (
            <span className="flex items-center gap-1.5 text-xs text-lime-700 font-semibold">
              <Check className="w-4 h-4" />
              Settings updated successfully!
            </span>
          ) : (
            <span className="text-xs text-zinc-500">
              Changes will apply across all dashboard tabs.
            </span>
          )}

          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-lime-500 hover:bg-lime-400 text-black font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
