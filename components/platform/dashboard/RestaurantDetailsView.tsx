"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  Store,
  MapPin,
  Phone,
  Clock,
  Globe,
  DollarSign,
  Check,
  Save,
  ExternalLink,
  Trash2,
} from "lucide-react";
import type { Tenant } from "@/lib/tenant";
import {
  saveTenantCustomizationAction,
  getTenantCustomizationAction,
} from "@/app/actions/tenant";

interface RestaurantDetailsViewProps {
  tenant: Tenant;
  platformDomain: string;
  platformProtocol: string;
  onUpdateTenantName?: (newName: string) => void;
  onRequestDelete?: () => void;
}

export function RestaurantDetailsView({
  tenant,
  platformDomain,
  platformProtocol,
  onUpdateTenantName,
  onRequestDelete,
}: RestaurantDetailsViewProps) {
  const [name, setName] = useState(tenant.name);
  const [cuisine, setCuisine] = useState("Artisanal Pizza & Italian");
  const [phone, setPhone] = useState("+1 (555) 234-5678");
  const [address, setAddress] = useState("104 Culinary Blvd, Suite A");
  const [hours, setHours] = useState("Mon - Sun: 11:00 AM - 10:00 PM");
  const [currency, setCurrency] = useState("$ USD");

  const [isPending, startTransition] = useTransition();
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setName(tenant.name);
    if (tenant?.slug) {
      getTenantCustomizationAction(tenant.slug).then((res) => {
        if (res.success && res.data) {
          if (res.data.name) setName(res.data.name);
          if (res.data.cuisine) setCuisine(res.data.cuisine);
          if (res.data.phone) setPhone(res.data.phone);
          if (res.data.address) setAddress(res.data.address);
          if (res.data.hours) setHours(res.data.hours);
          if (res.data.currency) setCurrency(res.data.currency);
        }
      });
    }
  }, [tenant?.slug, tenant.name]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await saveTenantCustomizationAction(tenant.slug, {
        name,
        cuisine,
        phone,
        address,
        hours,
        currency,
      });
      if (onUpdateTenantName) onUpdateTenantName(name);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    });
  };

  const storeUrl = `${platformProtocol}://${tenant.slug}.${platformDomain}`;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-lime-500 text-black uppercase font-mono">
              STORE INFORMATION
            </span>
            <span className="text-xs text-zinc-400 font-mono">•</span>
            <span className="text-xs font-semibold text-zinc-700">
              {tenant.name}
            </span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900">
            Restaurant Details & Hours
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 mt-1">
            Update your public restaurant contact details, operational hours, and address.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={storeUrl}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-800 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <span>Live Store</span>
            <ExternalLink className="w-3.5 h-3.5 text-lime-700" />
          </a>

          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="px-4 py-1.5 rounded-lg bg-lime-500 hover:bg-lime-400 text-black font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
          >
            {isPending ? (
              <span>Saving...</span>
            ) : saveSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Details</span>
              </>
            )}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Core Identity */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-100">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900">Store Profile</h3>
              <p className="text-xs text-zinc-500">Public restaurant branding and domain</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                Restaurant Display Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-lime-500 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                Subdomain Slug
              </label>
              <input
                type="text"
                disabled
                value={tenant.slug}
                className="w-full px-3.5 py-2 rounded-lg bg-zinc-100 border border-zinc-200 text-xs text-zinc-500 font-mono cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                Cuisine Specialty
              </label>
              <input
                type="text"
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                placeholder="e.g. Artisanal Pizza, Smash Burgers, Japanese"
                className="w-full px-3.5 py-2 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-lime-500 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                Menu Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-lime-500 focus:bg-white transition-colors"
              >
                <option value="$ USD">$ USD - United States Dollar</option>
                <option value="Rs. PKR">Rs. PKR - Pakistani Rupee</option>
                <option value="€ EUR">€ EUR - Euro</option>
                <option value="£ GBP">£ GBP - British Pound</option>
                <option value="AED">AED - Emirati Dirham</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contact & Hours */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-100">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900">Contact & Operating Schedule</h3>
              <p className="text-xs text-zinc-500">Displayed on footer and store details header</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                Phone / WhatsApp
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 234-5678"
                className="w-full px-3.5 py-2 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-lime-500 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                Operating Hours
              </label>
              <input
                type="text"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="Mon - Sun: 11:00 AM - 10:00 PM"
                className="w-full px-3.5 py-2 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-lime-500 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1.5">
              Physical Street Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="104 Culinary Blvd, Suite A"
              className="w-full px-3.5 py-2 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-lime-500 focus:bg-white transition-colors"
            />
          </div>
        </div>
      </form>

      {/* Danger Zone: Delete Restaurant */}
      {onRequestDelete && (
        <div className="rounded-2xl border border-red-200 bg-red-50/40 p-5 sm:p-6 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-bold text-red-900 flex items-center gap-1.5">
                <Trash2 className="w-4 h-4 text-red-600" />
                <span>Delete Restaurant</span>
              </h4>
              <p className="text-xs text-red-700/80 mt-0.5">
                Permanently delete this restaurant, its catalog, and custom domain settings. Password confirmation will be required.
              </p>
            </div>
            <button
              type="button"
              onClick={onRequestDelete}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Restaurant</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
