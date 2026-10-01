"use client";

import React, { useState, useTransition } from "react";
import {
  Store,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Plus,
  UploadCloud,
  Image as ImageIcon,
  X,
  Clock,
  Phone,
  MapPin,
  Utensils,
  Palette,
  Sparkles,
} from "lucide-react";
import type { Tenant } from "@/lib/tenant";
import {
  createTenantAction,
  saveTenantCustomizationAction,
} from "@/app/actions/tenant";

interface NewRestaurantOnboardingProps {
  onTenantCreated: (tenant: Tenant) => void;
  onNavigateToTab: (
    tenant: Tenant,
    tab: "restaurant-menu" | "restaurant-theme" | "restaurant-details"
  ) => void;
  platformDomain: string;
  platformProtocol: string;
  existingTenantsCount: number;
}

export function NewRestaurantOnboarding({
  onTenantCreated,
  onNavigateToTab,
  platformDomain,
  platformProtocol,
  existingTenantsCount,
}: NewRestaurantOnboardingProps) {
  // Step in the new restaurant onboarding: 1 = Basic Info, 2 = Operating & Contact, 3 = Completed
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State (Always fresh for new restaurant)
  const [restaurantName, setRestaurantName] = useState("");
  const [currency, setCurrency] = useState("$ USD");
  const [logo, setLogo] = useState<string>("");
  const [cuisine, setCuisine] = useState("Artisanal Pizza & Italian");
  const [phone, setPhone] = useState("+1 (555) 234-5678");
  const [address, setAddress] = useState("104 Culinary Blvd, Suite A");
  const [hours, setHours] = useState("Mon - Sun: 11:00 AM - 10:00 PM");

  const [createdTenant, setCreatedTenant] = useState<Tenant | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      alert("Logo file size must be less than 3MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setLogo(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Step 1 -> Step 2
  const handleProceedToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurantName.trim()) {
      setError("Please enter a restaurant name.");
      return;
    }
    setError(null);
    setStep(2);
  };

  // Step 2 -> Submit and create new tenant
  const handleCreateRestaurant = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.append("name", restaurantName);

    startTransition(async () => {
      const result = await createTenantAction(null, formData);
      if (result.error) {
        setError(result.error);
        return;
      }

      if (result.tenant) {
        const newT: Tenant = {
          id: result.tenant.id,
          user_id: "",
          name: result.tenant.name,
          slug: result.tenant.slug,
          created_at: new Date().toISOString(),
        };

        // Save initial details
        await saveTenantCustomizationAction(newT.slug, {
          name: newT.name,
          logo: logo || undefined,
          currency,
          cuisine,
          phone,
          address,
          hours,
        });

        onTenantCreated(newT);
        setCreatedTenant(newT);
        setStep(3);
      }
    });
  };

  // Reset form to onboard another restaurant
  const handleResetForNew = () => {
    setRestaurantName("");
    setLogo("");
    setCuisine("Artisanal Pizza & Italian");
    setPhone("+1 (555) 234-5678");
    setAddress("104 Culinary Blvd, Suite A");
    setHours("Mon - Sun: 11:00 AM - 10:00 PM");
    setCurrency("$ USD");
    setCreatedTenant(null);
    setStep(1);
    setError(null);
  };

  const previewSlug = restaurantName
    ? restaurantName.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-")
    : "my-restaurant";
  const previewUrl = `${platformProtocol}://${previewSlug}.${platformDomain}`;

  return (
    <div className="w-full rounded-2xl border border-zinc-200 bg-white p-5 sm:p-7 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-lime-500 text-black uppercase font-mono">
              ONBOARDING WIZARD
            </span>
            <span className="text-xs text-zinc-400 font-mono">•</span>
            <span className="text-xs text-zinc-600">Register New Store</span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-zinc-900 tracking-tight flex items-center gap-2">
            <Store className="w-5 h-5 text-lime-600" />
            <span>Onboard a New Restaurant</span>
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Launch a new multi-tenant restaurant instance with isolated routing and custom branding.
          </p>
        </div>

        {/* Stepper indicator */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex items-center justify-center w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all ${
                step === s
                  ? "bg-lime-500 text-black shadow-xs ring-2 ring-lime-500/20"
                  : step > s
                  ? "bg-lime-100 text-lime-800"
                  : "bg-zinc-100 text-zinc-400"
              }`}
            >
              {step > s ? "✓" : s}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-3 text-xs rounded-xl bg-red-50 border border-red-200 text-red-700">
          {error}
        </div>
      )}

      {/* STEP 1: Basic Information */}
      {step === 1 && (
        <form onSubmit={handleProceedToStep2} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Restaurant Name <span className="text-lime-600">*</span>
              </label>
              <input
                type="text"
                required
                autoFocus
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                placeholder="e.g. Hearth & Stone Pizzeria"
                className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 text-xs focus:outline-none focus:border-lime-500 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs focus:outline-none focus:border-lime-500 focus:bg-white transition-colors"
              >
                <option value="$ USD">$ USD - United States Dollar</option>
                <option value="Rs. PKR">Rs. PKR - Pakistani Rupee</option>
                <option value="€ EUR">€ EUR - Euro</option>
                <option value="£ GBP">£ GBP - British Pound</option>
                <option value="AED">AED - Emirati Dirham</option>
              </select>
            </div>
          </div>

          {/* Subdomain Preview */}
          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between text-xs gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase text-zinc-400 block">
                Assigned Store Subdomain
              </span>
              <span className="font-mono font-semibold text-lime-700 text-xs truncate mt-0.5 block">
                {previewUrl}
              </span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-lime-100 text-lime-800 border border-lime-200 flex-shrink-0">
              ISOLATED TENANT
            </span>
          </div>

          {/* Logo Upload */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-zinc-700 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-lime-600" />
                <span>Restaurant Brand Logo (Optional)</span>
              </span>
              <span className="text-[10px] text-zinc-400">PNG, JPG, SVG up to 3MB</span>
            </label>

            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs relative group">
                {logo ? (
                  <>
                    <img
                      src={logo}
                      alt="Logo preview"
                      className="w-full h-full object-contain p-1"
                    />
                    <button
                      type="button"
                      onClick={() => setLogo("")}
                      className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <UploadCloud className="w-5 h-5 text-zinc-400" />
                )}
              </div>

              <div className="flex-1 space-y-1">
                <label className="px-3 py-1.5 rounded-lg bg-white border border-zinc-300 hover:border-zinc-400 text-xs font-semibold text-zinc-800 cursor-pointer shadow-2xs inline-flex items-center gap-1.5 transition-colors">
                  <UploadCloud className="w-3.5 h-3.5 text-lime-600" />
                  <span>{logo ? "Replace Logo" : "Upload Brand Logo"}</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
                {logo && (
                  <button
                    type="button"
                    onClick={() => setLogo("")}
                    className="text-xs text-red-600 hover:text-red-700 font-medium ml-2 cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={!restaurantName.trim()}
              className="px-5 py-2.5 rounded-lg bg-lime-500 hover:bg-lime-400 text-black font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
            >
              <span>Next: Contact & Operating Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      )}

      {/* STEP 2: Contact & Operating Details */}
      {step === 2 && (
        <form onSubmit={handleCreateRestaurant} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Cuisine Specialty
              </label>
              <input
                type="text"
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                placeholder="e.g. Artisanal Pizza, Burgers, Mexican Cantina"
                className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs focus:outline-none focus:border-lime-500 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Phone Number / WhatsApp
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 234-5678"
                className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs focus:outline-none focus:border-lime-500 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Operating Schedule
              </label>
              <input
                type="text"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="Mon - Sun: 11:00 AM - 10:00 PM"
                className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs focus:outline-none focus:border-lime-500 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Store Location / Street Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="104 Culinary Blvd, Suite A"
                className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs focus:outline-none focus:border-lime-500 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-lime-50/50 border border-lime-200 flex items-start gap-2.5 text-xs text-lime-900">
            <Sparkles className="w-4 h-4 text-lime-700 flex-shrink-0 mt-0.5" />
            <p>
              Once created, your restaurant will be immediately accessible on its dedicated subdomain.
              You can customize its full menu, pricing, and theme styling from its dedicated tabs in the sidebar.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2 rounded-lg border border-zinc-300 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer"
            >
              Back
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2.5 rounded-lg bg-lime-500 hover:bg-lime-400 text-black font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Store className="w-4 h-4" />
              <span>{isPending ? "Creating Restaurant..." : "Launch Restaurant Instance"}</span>
            </button>
          </div>
        </form>
      )}

      {/* STEP 3: Onboarding Complete & Launchpad */}
      {step === 3 && createdTenant && (
        <div className="p-5 sm:p-6 rounded-2xl bg-zinc-50 border border-zinc-200 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-lime-500 text-black flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-zinc-900">
              {createdTenant.name} is Onboarded!
            </h3>
            <p className="text-xs text-zinc-500 font-mono mt-1">
              {platformProtocol}://{createdTenant.slug}.{platformDomain}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-zinc-200 max-w-md mx-auto text-left text-xs space-y-2">
            <div className="flex items-center justify-between text-zinc-700">
              <span>Cuisine:</span>
              <strong className="text-zinc-900">{cuisine}</strong>
            </div>
            <div className="flex items-center justify-between text-zinc-700">
              <span>Currency:</span>
              <strong className="text-zinc-900">{currency}</strong>
            </div>
            <div className="flex items-center justify-between text-zinc-700">
              <span>Status:</span>
              <span className="px-1.5 py-0.2 rounded font-mono font-bold text-[10px] bg-lime-100 text-lime-800">
                ACTIVE MULTI-TENANT
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
            <a
              href={`${platformProtocol}://${createdTenant.slug}.${platformDomain}`}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-lime-500 hover:bg-lime-400 text-black font-bold text-xs transition-colors inline-flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>Visit Live Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              type="button"
              onClick={() => onNavigateToTab(createdTenant, "restaurant-menu")}
              className="w-full sm:w-auto px-4 py-2 rounded-lg border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-800 font-bold text-xs transition-colors inline-flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Utensils className="w-3.5 h-3.5 text-lime-700" />
              <span>Customize Menu</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateToTab(createdTenant, "restaurant-theme")}
              className="w-full sm:w-auto px-4 py-2 rounded-lg border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-800 font-bold text-xs transition-colors inline-flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Palette className="w-3.5 h-3.5 text-lime-700" />
              <span>Theme Studio</span>
            </button>

            <button
              type="button"
              onClick={handleResetForNew}
              className="w-full sm:w-auto px-3 py-2 rounded-lg text-zinc-500 hover:text-zinc-900 text-xs font-semibold cursor-pointer"
            >
              + Onboard Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
