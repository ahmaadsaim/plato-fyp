"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  Store,
  Clock,
  Palette,
  Rocket,
  Check,
  Copy,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  Globe,
  MapPin,
  Phone,
  Utensils,
  Pipette,
  Sparkles,
  UploadCloud,
  Image as ImageIcon,
  X,
  Type,
  Zap,
  CheckCircle2,
} from "lucide-react";
import type { Tenant } from "@/lib/tenant";
import {
  createTenantAction,
  saveTenantCustomizationAction,
  getTenantCustomizationAction,
} from "@/app/actions/tenant";
import { OnboardingStepItem } from "./OnboardingStepItem";

interface TenantOnboardingGuideProps {
  tenants: Tenant[];
  activeTenant: Tenant | null;
  onTenantCreated: (tenant: Tenant) => void;
  platformDomain: string;
  platformProtocol: string;
}

export function TenantOnboardingGuide({
  tenants,
  activeTenant,
  onTenantCreated,
  platformDomain,
  platformProtocol,
}: TenantOnboardingGuideProps) {
  const hasTenant = tenants.length > 0;

  const [activeStep, setActiveStep] = useState<number>(hasTenant ? 2 : 1);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({
    1: hasTenant,
    2: false,
    3: false,
    4: false,
  });

  // Step 1 Form State
  const [restaurantName, setRestaurantName] = useState("");
  const [currency, setCurrency] = useState("$ USD");
  const [logo, setLogo] = useState<string>("");
  const [step1Error, setStep1Error] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Step 2 Form State (Brand & Operating Details)
  const [cuisine, setCuisine] = useState("Artisanal Pizza & Italian");
  const [phone, setPhone] = useState("+1 (555) 234-5678");
  const [address, setAddress] = useState("104 Culinary Blvd, Suite A");
  const [hours, setHours] = useState("Mon - Sun: 11:00 AM - 10:00 PM");

  // Step 3 Form State (Plato Default Customization Suite)
  const [selectedTheme, setSelectedTheme] = useState("modern");
  const [heroHeadline, setHeroHeadline] = useState("Handcrafted Flavors Delivered Fresh");
  const [primaryColor, setPrimaryColor] = useState("#84CC16"); // Solid Lime Green
  const [secondaryColor, setSecondaryColor] = useState("#18181B"); // Solid Dark Zinc
  const [buttonColor, setButtonColor] = useState("#84CC16"); // Action button background
  const [buttonTextColor, setButtonTextColor] = useState("#000000"); // Action button text
  const [cardColor, setCardColor] = useState("#FFFFFF"); // Card surfaces
  const [backgroundColor, setBackgroundColor] = useState("#F8FAFC"); // Main page background
  const [textColor, setTextColor] = useState("#09090B"); // Headings & body text
  const [fontStyle, setFontStyle] = useState<"sans" | "serif" | "display" | "geometric">("sans");
  const [animationOption, setAnimationOption] = useState<"smooth" | "energetic" | "minimal">("smooth");

  // Step 4 State
  const [copied, setCopied] = useState(false);

  // Active Storefront URL
  const currentSlug =
    activeTenant?.slug ||
    (restaurantName ? restaurantName.toLowerCase().replace(/[^a-z0-9]/g, "-") : "my-restaurant");
  const storeUrl = `${platformProtocol}://${currentSlug}.${platformDomain}`;

  // Load existing customizations if tenant selected
  useEffect(() => {
    if (activeTenant?.slug) {
      getTenantCustomizationAction(activeTenant.slug).then((res) => {
        if (res.success && res.data) {
          if (res.data.logo) setLogo(res.data.logo);
          if (res.data.name) setRestaurantName(res.data.name);
          if (res.data.cuisine) setCuisine(res.data.cuisine);
          if (res.data.phone) setPhone(res.data.phone);
          if (res.data.address) setAddress(res.data.address);
          if (res.data.hours) setHours(res.data.hours);
          if (res.data.headline) setHeroHeadline(res.data.headline);
          if (res.data.primaryColor) setPrimaryColor(res.data.primaryColor);
          if (res.data.secondaryColor) setSecondaryColor(res.data.secondaryColor);
          if (res.data.buttonColor) setButtonColor(res.data.buttonColor);
          if (res.data.buttonTextColor) setButtonTextColor(res.data.buttonTextColor);
          if (res.data.cardColor) setCardColor(res.data.cardColor);
          if (res.data.backgroundColor) setBackgroundColor(res.data.backgroundColor);
          if (res.data.textColor) setTextColor(res.data.textColor);
          if (res.data.fontStyle) setFontStyle(res.data.fontStyle as any);
          if (res.data.animationOption) setAnimationOption(res.data.animationOption as any);
        }
      });
    }
  }, [activeTenant?.slug]);

  // Handle Logo File Upload (reads as base64 Data URL)
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert("Logo file size must be less than 3MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setLogo(dataUrl);
      if (activeTenant?.slug) {
        saveTenantCustomizationAction(activeTenant.slug, {
          name: restaurantName || activeTenant.name,
          logo: dataUrl,
          currency,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Compute completed count (Total 4 steps)
  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / 4) * 100);

  // Handle Step 1 Creation
  const handleCreateRestaurant = (e: React.FormEvent) => {
    e.preventDefault();
    setStep1Error(null);

    const formData = new FormData();
    formData.append("name", restaurantName);

    startTransition(async () => {
      const result = await createTenantAction(null, formData);
      if (result.error) {
        setStep1Error(result.error);
      } else if (result.tenant) {
        const newT: Tenant = {
          id: result.tenant.id,
          user_id: "",
          name: result.tenant.name,
          slug: result.tenant.slug,
          created_at: new Date().toISOString(),
        };

        // Persist logo if uploaded during onboarding
        if (logo) {
          await saveTenantCustomizationAction(newT.slug, {
            name: newT.name,
            logo,
            currency,
          });
        }

        onTenantCreated(newT);
        setCompletedSteps((prev) => ({ ...prev, 1: true }));
        setActiveStep(2);
      }
    });
  };

  const handleCompleteStep = (stepNumber: number, nextStep?: number) => {
    setCompletedSteps((prev) => ({ ...prev, [stepNumber]: true }));

    // Persist tenant profile customizations (including logo)
    if (stepNumber === 2) {
      saveTenantCustomizationAction(currentSlug, {
        name: restaurantName || activeTenant?.name,
        logo,
        currency,
        cuisine,
        phone,
        address,
        hours,
      });
    }

    // Persist storefront palette & theme customizations (including logo & Plato Default tokens)
    if (stepNumber === 3) {
      saveTenantCustomizationAction(currentSlug, {
        name: restaurantName || activeTenant?.name,
        logo,
        currency,
        cuisine,
        phone,
        address,
        hours,
        headline: heroHeadline,
        primaryColor,
        secondaryColor,
        buttonColor,
        buttonTextColor,
        cardColor,
        backgroundColor,
        textColor,
        fontStyle,
        animationOption,
        theme: selectedTheme,
      });
    }

    if (nextStep) {
      setActiveStep(nextStep);
    }
  };

  const handleCopyUrl = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(storeUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Curated theme style presets
  const themePresets = [
    {
      name: "Plato Lime",
      badge: "Clean Light",
      primary: "#84CC16",
      secondary: "#18181B",
      button: "#84CC16",
      buttonText: "#000000",
      card: "#FFFFFF",
      bg: "#F8FAFC",
      text: "#09090B",
      font: "sans" as const,
      anim: "smooth" as const,
    },
    {
      name: "Warm Amber",
      badge: "Bistro Dark",
      primary: "#F59E0B",
      secondary: "#1F2937",
      button: "#F59E0B",
      buttonText: "#000000",
      card: "#1E222B",
      bg: "#0D0F12",
      text: "#F8FAFC",
      font: "serif" as const,
      anim: "smooth" as const,
    },
    {
      name: "Crimson Craft",
      badge: "Vibrant Bold",
      primary: "#EF4444",
      secondary: "#0F172A",
      button: "#EF4444",
      buttonText: "#FFFFFF",
      card: "#FFFFFF",
      bg: "#FFF1F2",
      text: "#0F172A",
      font: "display" as const,
      anim: "energetic" as const,
    },
    {
      name: "Emerald Garden",
      badge: "Artisanal",
      primary: "#10B981",
      secondary: "#064E3B",
      button: "#10B981",
      buttonText: "#FFFFFF",
      card: "#FFFFFF",
      bg: "#F0FDF4",
      text: "#064E3B",
      font: "geometric" as const,
      anim: "smooth" as const,
    },
    {
      name: "Midnight Modern",
      badge: "Minimal Dark",
      primary: "#38BDF8",
      secondary: "#09090B",
      button: "#38BDF8",
      buttonText: "#000000",
      card: "#18181B",
      bg: "#09090B",
      text: "#F4F4F5",
      font: "sans" as const,
      anim: "minimal" as const,
    },
  ];

  return (
    <div className="w-full rounded-2xl border border-zinc-200 bg-white p-5 sm:p-7 shadow-xs space-y-6">
      {/* Header & Progress Indicator (Shopify Light Theme Style) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-lime-500 text-black">
                Setup guide
              </span>
              <span className="text-xs text-zinc-400">•</span>
              <span className="text-xs text-zinc-600 font-mono font-medium">
                {completedCount} of 4 tasks completed
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 mt-1">
              Set up your restaurant store
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Configure your restaurant identity, operating schedule, and custom storefront palette.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-lime-700 bg-lime-50 border border-lime-200 px-2.5 py-1 rounded-md">
              {progressPercent}% Complete
            </span>
          </div>
        </div>

        {/* Solid Lime Progress Bar (NO GRADIENTS) */}
        <div className="w-full h-2 rounded-full bg-zinc-100 border border-zinc-200 overflow-hidden">
          <div
            className="h-full bg-lime-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Accordion Steps List */}
      <div className="space-y-3 pt-1">
        {/* STEP 1: Restaurant Identity & Subdomain */}
        <OnboardingStepItem
          stepNumber={1}
          title="Restaurant Identity & Subdomain"
          description="Name your restaurant and claim your dedicated subdomain on the Plato platform."
          estimatedTime="1 min"
          isCompleted={completedSteps[1]}
          isOpen={activeStep === 1}
          onToggle={() => setActiveStep(activeStep === 1 ? 0 : 1)}
          icon={<Store className="w-4 h-4 text-zinc-600" />}
        >
          {completedSteps[1] && activeTenant ? (
            <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-lime-500" />
                  <span className="text-xs font-semibold text-zinc-900">Active Tenant Configured</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-lime-100 border border-lime-300 text-lime-800 font-bold">
                  Ready
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-zinc-500 block text-[11px]">Restaurant Name</span>
                  <span className="text-zinc-900 font-semibold">{activeTenant.name}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[11px]">Subdomain</span>
                  <span className="text-lime-700 font-mono font-medium">
                    {activeTenant.slug}.{platformDomain}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 pt-2 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="px-3 py-1.5 rounded-lg bg-lime-500 hover:bg-lime-400 text-black font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <span>Continue to Step 2</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCreateRestaurant} className="space-y-4">
              {step1Error && (
                <div className="p-3 text-xs rounded-lg bg-red-50 border border-red-200 text-red-700">
                  {step1Error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label htmlFor="onboarding-name" className="block text-xs font-medium text-zinc-700 mb-1.5">
                    Restaurant Name <span className="text-lime-600">*</span>
                  </label>
                  <input
                    id="onboarding-name"
                    type="text"
                    required
                    value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                    placeholder="e.g. Hearth & Stone Pizzeria"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-zinc-300 text-zinc-900 placeholder-zinc-400 text-xs focus:outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-500 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="onboarding-currency" className="block text-xs font-medium text-zinc-700 mb-1.5">
                    Store Currency
                  </label>
                  <select
                    id="onboarding-currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-white border border-zinc-300 text-zinc-900 text-xs focus:outline-none focus:border-lime-500 transition-colors cursor-pointer"
                  >
                    <option value="$ USD">$ USD (US Dollar)</option>
                    <option value="€ EUR">€ EUR (Euro)</option>
                    <option value="£ GBP">£ GBP (British Pound)</option>
                    <option value="₨ PKR">₨ PKR (Pakistani Rupee)</option>
                    <option value="C$ CAD">C$ CAD (Canadian Dollar)</option>
                  </select>
                </div>
              </div>

              {/* Restaurant Logo Upload */}
              <div className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-800 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-lime-600" />
                    <span>Restaurant Brand Logo</span>
                  </label>
                  <span className="text-[10px] text-zinc-500 font-mono">PNG, JPG, SVG, WebP up to 3MB</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3.5">
                  {/* Logo Preview Square */}
                  <div className="w-16 h-16 rounded-xl border-2 border-dashed border-zinc-300 bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-2xs relative group">
                    {logo ? (
                      <>
                        <img src={logo} alt="Restaurant Logo" className="w-full h-full object-contain p-1" />
                        <button
                          type="button"
                          onClick={() => setLogo("")}
                          className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          title="Remove logo"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <div className="text-center p-1">
                        <UploadCloud className="w-4 h-4 text-zinc-400 mx-auto mb-0.5" />
                        <span className="text-[9px] text-zinc-400 font-medium block">Upload</span>
                      </div>
                    )}
                  </div>

                  {/* Upload button and Quick Select */}
                  <div className="flex-1 w-full space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="px-3 py-1.5 rounded-lg bg-white border border-zinc-300 hover:border-zinc-400 text-xs font-semibold text-zinc-800 cursor-pointer shadow-2xs inline-flex items-center gap-1.5 transition-colors">
                        <UploadCloud className="w-3.5 h-3.5 text-lime-600" />
                        <span>{logo ? "Replace Logo" : "Upload Logo Image"}</span>
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
                          className="text-xs text-red-600 hover:text-red-700 font-semibold px-2 py-1 cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] text-zinc-500 font-medium">Or quick pick:</span>
                      {[
                        { label: "🍕 Pizza", url: "/holy-buns-logo.png" },
                        { label: "🍔 Burger", url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=120&h=120&q=80" },
                        { label: "🍣 Sushi", url: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=120&h=120&q=80" },
                        { label: "☕ Cafe", url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=120&h=120&q=80" },
                      ].map((sample) => (
                        <button
                          key={sample.label}
                          type="button"
                          onClick={() => setLogo(sample.url)}
                          className="px-2 py-0.5 rounded-md bg-white hover:bg-zinc-100 border border-zinc-200 text-[10px] font-medium text-zinc-700 transition-colors shadow-2xs cursor-pointer"
                        >
                          {sample.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Subdomain Preview Banner */}
              <div className="p-3 rounded-lg border border-zinc-200 bg-zinc-50 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-zinc-600">
                  <Globe className="w-4 h-4 text-lime-600" />
                  <span>Public Store URL:</span>
                  <span className="text-lime-700 font-mono font-semibold">
                    {storeUrl}
                  </span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono hidden sm:inline">
                  Subdomain Isolation
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-zinc-500">
                  Creates tenant routing and dedicated storefront instance
                </span>
                <button
                  type="submit"
                  disabled={isPending || !restaurantName.trim()}
                  className="px-4 py-2 rounded-lg bg-lime-500 hover:bg-lime-400 text-black font-bold text-xs transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  {isPending ? "Creating Tenant..." : "Save & Create Subdomain"}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </OnboardingStepItem>

        {/* STEP 2: Brand Profile & Operating Details */}
        <OnboardingStepItem
          stepNumber={2}
          title="Brand Profile & Operating Details"
          description="Specify your cuisine specialty, contact hotline, physical address, and operating schedule."
          estimatedTime="2 min"
          isCompleted={completedSteps[2]}
          isOpen={activeStep === 2}
          onToggle={() => setActiveStep(activeStep === 2 ? 0 : 2)}
          icon={<Clock className="w-4 h-4 text-zinc-600" />}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5 flex items-center gap-1">
                  <Utensils className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Cuisine Specialty</span>
                </label>
                <input
                  type="text"
                  value={cuisine}
                  onChange={(e) => setCuisine(e.target.value)}
                  placeholder="e.g. Wood-Fired Pizza & Craft Drinks"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-zinc-300 text-zinc-900 text-xs focus:outline-none focus:border-lime-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Contact Phone</span>
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-zinc-300 text-zinc-900 text-xs focus:outline-none focus:border-lime-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Pickup Location / Street Address</span>
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Food Street, Downtown"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-zinc-300 text-zinc-900 text-xs focus:outline-none focus:border-lime-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Operating Hours</span>
                </label>
                <input
                  type="text"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  placeholder="Mon - Sun: 11am - 10pm"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-zinc-300 text-zinc-900 text-xs focus:outline-none focus:border-lime-500 transition-colors"
                />
              </div>
            </div>

            {/* Logo in Step 2 */}
            <div className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/80 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-xl border border-zinc-200 bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                  {logo ? (
                    <img src={logo} alt="Logo" className="w-full h-full object-contain p-1" />
                  ) : (
                    <UploadCloud className="w-5 h-5 text-zinc-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-zinc-900 block truncate">
                    {logo ? "Custom Logo Active" : "No Logo Uploaded"}
                  </span>
                  <span className="text-[11px] text-zinc-500 block truncate">
                    Used across storefront navbar, footer, and checkout
                  </span>
                </div>
              </div>

              <label className="px-3 py-1.5 rounded-lg bg-white border border-zinc-300 hover:border-zinc-400 text-xs font-semibold text-zinc-800 cursor-pointer shadow-2xs inline-flex items-center gap-1.5 transition-colors shrink-0">
                <UploadCloud className="w-3.5 h-3.5 text-lime-600" />
                <span>{logo ? "Replace" : "Upload"}</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-zinc-500">
                Shown automatically in your storefront navigation and footer
              </span>
              <button
                type="button"
                onClick={() => handleCompleteStep(2, 3)}
                className="px-4 py-2 rounded-lg bg-lime-500 hover:bg-lime-400 text-black font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <span>Save Profile & Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </OnboardingStepItem>

        {/* STEP 3: Storefront Customization (Plato Default) */}
        <OnboardingStepItem
          stepNumber={3}
          title="Storefront Customization (Plato Default)"
          description="Customize button colors, card styling, background, text, primary & secondary palettes, font styles, and interactive animation dynamics for your storefront."
          estimatedTime="2 min"
          isCompleted={completedSteps[3]}
          isOpen={activeStep === 3}
          onToggle={() => setActiveStep(activeStep === 3 ? 0 : 3)}
          icon={<Palette className="w-4 h-4 text-zinc-600" />}
        >
          <div className="space-y-6">
            {/* Quick Presets */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-zinc-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-lime-600" />
                  <span>Curated Style Presets</span>
                </label>
                <span className="text-[11px] text-zinc-400 font-mono">1-click complete styling</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {themePresets.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      setPrimaryColor(preset.primary);
                      setSecondaryColor(preset.secondary);
                      setButtonColor(preset.button);
                      setButtonTextColor(preset.buttonText);
                      setCardColor(preset.card);
                      setBackgroundColor(preset.bg);
                      setTextColor(preset.text);
                      setFontStyle(preset.font);
                      setAnimationOption(preset.anim);
                    }}
                    className="p-2.5 rounded-xl border border-zinc-200 hover:border-zinc-300 bg-zinc-50 hover:bg-white text-left transition-all cursor-pointer group shadow-2xs"
                  >
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <div
                        className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-2xs"
                        style={{ backgroundColor: preset.primary }}
                        title="Primary"
                      />
                      <div
                        className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-2xs"
                        style={{ backgroundColor: preset.button }}
                        title="Button"
                      />
                      <div
                        className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-2xs"
                        style={{ backgroundColor: preset.card }}
                        title="Card"
                      />
                    </div>
                    <span className="text-[11px] font-bold text-zinc-900 block truncate group-hover:text-black">
                      {preset.name}
                    </span>
                    <span className="text-[10px] text-zinc-400 block truncate font-medium">
                      {preset.badge}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 6-Color Pickers Grid */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-zinc-800 flex items-center gap-1.5">
                <Pipette className="w-3.5 h-3.5 text-zinc-500" />
                <span>Color Palette & Component Surfaces</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 rounded-xl border border-zinc-200 bg-zinc-50/70">
                {/* 1. Button Color */}
                <div className="space-y-1.5 bg-white p-3 rounded-lg border border-zinc-200/80 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-zinc-800">Button Color</label>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-zinc-400">Text:</span>
                      <button
                        type="button"
                        onClick={() => setButtonTextColor(buttonTextColor === "#FFFFFF" ? "#000000" : "#FFFFFF")}
                        className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-700 cursor-pointer"
                        title="Toggle button text contrast"
                      >
                        {buttonTextColor === "#FFFFFF" ? "White" : "Dark"}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={buttonColor}
                      onChange={(e) => setButtonColor(e.target.value)}
                      className="w-8 h-8 p-0.5 rounded-md border border-zinc-300 cursor-pointer bg-white shrink-0"
                    />
                    <input
                      type="text"
                      value={buttonColor}
                      onChange={(e) => setButtonColor(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-md bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs font-mono uppercase focus:outline-none focus:border-lime-500"
                    />
                  </div>
                </div>

                {/* 2. Card Color */}
                <div className="space-y-1.5 bg-white p-3 rounded-lg border border-zinc-200/80 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-zinc-800">Card Color</label>
                    <span className="text-[10px] text-zinc-400">Surfaces & Modals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={cardColor}
                      onChange={(e) => setCardColor(e.target.value)}
                      className="w-8 h-8 p-0.5 rounded-md border border-zinc-300 cursor-pointer bg-white shrink-0"
                    />
                    <input
                      type="text"
                      value={cardColor}
                      onChange={(e) => setCardColor(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-md bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs font-mono uppercase focus:outline-none focus:border-lime-500"
                    />
                  </div>
                </div>

                {/* 3. Background Color */}
                <div className="space-y-1.5 bg-white p-3 rounded-lg border border-zinc-200/80 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-zinc-800">Background Color</label>
                    <span className="text-[10px] text-zinc-400">Page Canvas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-8 h-8 p-0.5 rounded-md border border-zinc-300 cursor-pointer bg-white shrink-0"
                    />
                    <input
                      type="text"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-md bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs font-mono uppercase focus:outline-none focus:border-lime-500"
                    />
                  </div>
                </div>

                {/* 4. Text Color */}
                <div className="space-y-1.5 bg-white p-3 rounded-lg border border-zinc-200/80 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-zinc-800">Text Color</label>
                    <span className="text-[10px] text-zinc-400">Headings & Copy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-8 h-8 p-0.5 rounded-md border border-zinc-300 cursor-pointer bg-white shrink-0"
                    />
                    <input
                      type="text"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-md bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs font-mono uppercase focus:outline-none focus:border-lime-500"
                    />
                  </div>
                </div>

                {/* 5. Primary Color */}
                <div className="space-y-1.5 bg-white p-3 rounded-lg border border-zinc-200/80 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-zinc-800">Primary Color</label>
                    <span className="text-[10px] text-zinc-400">Accents & Badges</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-8 h-8 p-0.5 rounded-md border border-zinc-300 cursor-pointer bg-white shrink-0"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-md bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs font-mono uppercase focus:outline-none focus:border-lime-500"
                    />
                  </div>
                </div>

                {/* 6. Secondary Color */}
                <div className="space-y-1.5 bg-white p-3 rounded-lg border border-zinc-200/80 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-zinc-800">Secondary Color</label>
                    <span className="text-[10px] text-zinc-400">Header & Borders</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-8 h-8 p-0.5 rounded-md border border-zinc-300 cursor-pointer bg-white shrink-0"
                    />
                    <input
                      type="text"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-md bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs font-mono uppercase focus:outline-none focus:border-lime-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Typography Font Style */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-800 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-zinc-500" />
                <span>Font Style</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: "sans", title: "Modern Sans", desc: "Inter & Clean", sample: "Aa Bb Modern" },
                  { id: "serif", title: "Elegant Serif", desc: "Playfair & Artisanal", sample: "Aa Bb Elegant" },
                  { id: "display", title: "Bold Display", desc: "Outfit & High Energy", sample: "Aa Bb Punchy" },
                  { id: "geometric", title: "Sleek Geometric", desc: "Plus Jakarta Sans", sample: "Aa Bb Clean" },
                ].map((f) => {
                  const isSelected = fontStyle === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFontStyle(f.id as any)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer shadow-2xs ${
                        isSelected
                          ? "border-lime-500 bg-lime-50/50 ring-2 ring-lime-500/20"
                          : "border-zinc-200 hover:border-zinc-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-zinc-900">{f.title}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-lime-600" />}
                      </div>
                      <span className="text-[11px] text-zinc-400 block mb-1">{f.desc}</span>
                      <span
                        className="text-xs font-medium text-zinc-700 block"
                        style={{
                          fontFamily:
                            f.id === "serif"
                              ? "Georgia, serif"
                              : f.id === "display"
                              ? "'Outfit', sans-serif"
                              : f.id === "geometric"
                              ? "'Plus Jakarta Sans', sans-serif"
                              : "inherit",
                        }}
                      >
                        {f.sample}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Animation Dynamics */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-800 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-lime-600" />
                <span>Animation Dynamics</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  {
                    id: "smooth",
                    title: "Subtle & Smooth",
                    badge: "Recommended",
                    desc: "Gentle 300ms easing, soft lifts, smooth scroll animations.",
                  },
                  {
                    id: "energetic",
                    title: "Bouncy & Energetic",
                    badge: "Playful",
                    desc: "Pop keyframes, springy scale-up hovers, lively entrances.",
                  },
                  {
                    id: "minimal",
                    title: "Clean & Instant",
                    badge: "Performance",
                    desc: "Zero or minimal transitions, instant response, high performance.",
                  },
                ].map((a) => {
                  const isSelected = animationOption === a.id;
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => setAnimationOption(a.id as any)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer shadow-2xs ${
                        isSelected
                          ? "border-lime-500 bg-lime-50/50 ring-2 ring-lime-500/20"
                          : "border-zinc-200 hover:border-zinc-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-zinc-900">{a.title}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-lime-600" />}
                      </div>
                      <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-zinc-100 text-zinc-600 mb-1">
                        {a.badge}
                      </span>
                      <p className="text-[11px] text-zinc-500 leading-snug">{a.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Interactive Preview Card */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-zinc-800">
                  Live Storefront Component Preview
                </span>
                <span className="text-[11px] text-zinc-400 font-mono">
                  Theme: Plato Default
                </span>
              </div>
              <div
                className="p-6 rounded-2xl border transition-colors shadow-2xs"
                style={{
                  backgroundColor,
                  borderColor: "rgba(0,0,0,0.08)",
                }}
              >
                <div
                  className={`p-4 sm:p-5 rounded-xl border transition-all ${
                    animationOption === "energetic"
                      ? "hover:scale-[1.03] active:scale-[0.98]"
                      : animationOption === "minimal"
                      ? ""
                      : "hover:-translate-y-1 hover:shadow-md"
                  }`}
                  style={{
                    backgroundColor: cardColor,
                    borderColor: "rgba(0,0,0,0.1)",
                    fontFamily:
                      fontStyle === "serif"
                        ? "Georgia, serif"
                        : fontStyle === "display"
                        ? "'Outfit', sans-serif"
                        : fontStyle === "geometric"
                        ? "'Plus Jakarta Sans', sans-serif"
                        : "inherit",
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block"
                          style={{
                            backgroundColor: primaryColor,
                            color: buttonTextColor,
                          }}
                        >
                          Featured Dish
                        </span>
                        <span
                          className="px-2 py-0.5 rounded-md text-[10px] font-semibold"
                          style={{
                            backgroundColor: secondaryColor,
                            color: "#FFFFFF",
                          }}
                        >
                          Signature
                        </span>
                      </div>
                      <h4
                        className="text-base sm:text-lg font-bold tracking-tight mt-1"
                        style={{ color: textColor }}
                      >
                        Artisan Truffle & Wild Herb Burger
                      </h4>
                      <p
                        className="text-xs max-w-md line-clamp-2"
                        style={{ color: textColor, opacity: 0.7 }}
                      >
                        Smash angus beef, black garlic emulsion, aged white cheddar, and toasted brioche.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                      <span className="text-base sm:text-lg font-black font-mono" style={{ color: primaryColor }}>
                        $14.50
                      </span>
                      <button
                        type="button"
                        className={`px-4 py-2 rounded-lg font-bold text-xs shadow-xs transition-opacity hover:opacity-90 cursor-pointer ${
                          animationOption === "energetic" ? "animate-pulse" : ""
                        }`}
                        style={{
                          backgroundColor: buttonColor,
                          color: buttonTextColor,
                        }}
                      >
                        Add To Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Headline Input */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                  Storefront Theme Template <span className="text-[10px] font-mono text-lime-700 font-semibold">[PLATO DEFAULT]</span>
                </label>
                <div className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-800 text-xs font-semibold flex items-center justify-between">
                  <span>Plato Default Theme</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-lime-100 text-lime-800 border border-lime-300">
                    Active
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                  Hero Banner Headline
                </label>
                <input
                  type="text"
                  value={heroHeadline}
                  onChange={(e) => setHeroHeadline(e.target.value)}
                  placeholder="e.g. Handcrafted Flavors Delivered Fresh"
                  className="w-full px-3 py-2 rounded-lg bg-white border border-zinc-300 text-zinc-900 text-xs focus:outline-none focus:border-lime-500 transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <a
                href={`/?tenant=${currentSlug}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-lime-700 hover:text-lime-800 font-semibold flex items-center gap-1 underline"
              >
                <span>Preview Plato Default Storefront</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                type="button"
                onClick={() => handleCompleteStep(3, 4)}
                className="px-4 py-2 rounded-lg bg-lime-500 hover:bg-lime-400 text-black font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <span>Save Theme & Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </OnboardingStepItem>

        {/* STEP 4: Launch Storefront & Review */}
        <OnboardingStepItem
          stepNumber={4}
          title="Review & Launch Public Storefront"
          description="Verify your domain routing, test your live restaurant site, and share with customers."
          estimatedTime="1 min"
          isCompleted={completedSteps[4]}
          isOpen={activeStep === 4}
          onToggle={() => setActiveStep(activeStep === 4 ? 0 : 4)}
          icon={<Rocket className="w-4 h-4 text-zinc-600" />}
        >
          <div className="space-y-4">
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-lime-600" />
                  <span>Storefront Status: Ready for Traffic</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-lime-100 border border-lime-300 text-lime-800 font-bold">
                  LIVE
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-zinc-200">
                <div className="truncate pr-3">
                  <span className="text-[10px] text-zinc-500 block font-mono">Storefront Subdomain</span>
                  <span className="text-xs font-mono font-bold text-zinc-900 truncate">
                    {storeUrl}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="px-3 py-1.5 rounded-lg border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer flex-shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-lime-600" />
                      <span className="text-lime-700 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Your storefront is routed by Plato hostname isolation. Modern browsers route{" "}
                <code>*.localhost</code> directly to your local instance. No login is required for customers visiting this link.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleCompleteStep(4)}
                className={`px-4 py-2 rounded-lg font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                  completedSteps[4]
                    ? "bg-zinc-100 text-zinc-600 border border-zinc-200"
                    : "bg-lime-500 hover:bg-lime-400 text-black shadow-xs"
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>{completedSteps[4] ? "Onboarding Completed" : "Mark Setup Completed"}</span>
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={`/?tenant=${currentSlug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 rounded-lg border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-800 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  title="Direct preview with current template and custom colors"
                >
                  <span>Instant Preview</span>
                  <ExternalLink className="w-3.5 h-3.5 text-lime-700" />
                </a>

                <a
                  href={storeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-black text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>Launch Restaurant Storefront</span>
                  <ExternalLink className="w-3.5 h-3.5 text-lime-400" />
                </a>
              </div>
            </div>
          </div>
        </OnboardingStepItem>
      </div>
    </div>
  );
}
