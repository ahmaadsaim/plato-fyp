"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import {
  Home,
  Store,
  Settings,
  Utensils,
  Palette,
  Clock,
  Globe,
  Search,
  ExternalLink,
  Plus,
  LogOut,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Sliders,
  Trash2,
} from "lucide-react";
import type { User } from "@/lib/auth";
import type { Tenant } from "@/lib/tenant";
import { logoutAction } from "@/app/actions/auth";
import { createTenantAction } from "@/app/actions/tenant";
import { StoreSwitcher } from "./StoreSwitcher";
import { NewRestaurantOnboarding } from "./NewRestaurantOnboarding";
import { RestaurantListCard } from "./RestaurantListCard";
import { GeneralSettingsView } from "./GeneralSettingsView";
import { RestaurantMenuCustomizationView } from "./RestaurantMenuCustomizationView";
import { RestaurantThemeCustomizationView } from "./RestaurantThemeCustomizationView";
import { RestaurantDetailsView } from "./RestaurantDetailsView";
import { DeleteRestaurantModal } from "./DeleteRestaurantModal";

export type DashboardTab =
  | "home"
  | "my-restaurants"
  | "general-settings"
  | "restaurant-menu"
  | "restaurant-theme"
  | "restaurant-details";

interface DashboardViewProps {
  user: User;
  initialTenants: Tenant[];
  platformDomain: string;
  platformProtocol: "http" | "https";
}

export function DashboardView({
  user,
  initialTenants,
  platformDomain,
  platformProtocol,
}: DashboardViewProps) {
  const [tenants, setTenants] = useState<Tenant[]>(initialTenants);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(
    initialTenants.length > 0 ? initialTenants[0] : null
  );

  // Active navigation view state
  const [activeTab, setActiveTab] = useState<DashboardTab>("home");

  // Track which restaurant accordions are expanded in the sidebar
  const [expandedTenants, setExpandedTenants] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    if (initialTenants.length > 0) {
      init[initialTenants[0].id] = true;
    }
    return init;
  });

  // Inline Quick Create Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [newTenantThemeId, setNewTenantThemeId] = useState("modern");
  const [createError, setCreateError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Delete Restaurant Modal State
  const [tenantToDelete, setTenantToDelete] = useState<Tenant | null>(null);

  const handleDeleteSuccess = (deletedTenant: Tenant) => {
    const remaining = tenants.filter((t) => t.id !== deletedTenant.id);
    setTenants(remaining);
    if (selectedTenant?.id === deletedTenant.id) {
      setSelectedTenant(remaining.length > 0 ? remaining[0] : null);
      setActiveTab(remaining.length > 0 ? "my-restaurants" : "home");
    }
    setTenantToDelete(null);
  };

  const toggleTenantExpand = (id: string) => {
    setExpandedTenants((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSelectRestaurantTab = (
    tenant: Tenant,
    tab: "restaurant-menu" | "restaurant-theme" | "restaurant-details"
  ) => {
    setSelectedTenant(tenant);
    setActiveTab(tab);
    setExpandedTenants((prev) => ({
      ...prev,
      [tenant.id]: true,
    }));
  };

  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);

    const formData = new FormData();
    formData.append("name", nameInput);
    formData.append("themeId", newTenantThemeId);

    startTransition(async () => {
      const result = await createTenantAction(null, formData);
      if (result.error) {
        setCreateError(result.error);
      } else if (result.tenant) {
        const newT: Tenant = {
          id: result.tenant.id,
          user_id: user.id,
          name: result.tenant.name,
          slug: result.tenant.slug,
          theme_id: newTenantThemeId,
          theme_source: "LOCAL",
          created_at: new Date().toISOString(),
        };
        setTenants((prev) => [newT, ...prev.filter((t) => t.id !== newT.id)]);
        setSelectedTenant(newT);
        setExpandedTenants((prev) => ({ ...prev, [newT.id]: true }));
        setNameInput("");
        setShowCreateModal(false);
      }
    });
  };

  const handleTenantCreatedFromGuide = (newTenant: Tenant) => {
    setTenants((prev) => [newTenant, ...prev.filter((t) => t.id !== newTenant.id)]);
    setSelectedTenant(newTenant);
    setExpandedTenants((prev) => ({ ...prev, [newTenant.id]: true }));
  };

  const handleUpdateTenantName = (newName: string) => {
    if (!selectedTenant) return;
    const updated = { ...selectedTenant, name: newName };
    setSelectedTenant(updated);
    setTenants((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  // Active storefront preview URL
  const activeUrl = selectedTenant
    ? `${platformProtocol}://${selectedTenant.slug}.${platformDomain}`
    : null;

  return (
    <div className="min-h-screen bg-[#F6F6F7] text-zinc-900 flex flex-col font-sans selection:bg-lime-500 selection:text-black">
      {/* Top App Command Bar (Shopify Polaris Header) */}
      <header className="sticky top-0 z-40 w-full h-14 border-b border-zinc-200 bg-white px-4 flex items-center justify-between gap-4 shadow-2xs">
        {/* Left: Brand & Store Switcher */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab("home")}
            className="flex items-center gap-2 pr-2 cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-lime-500 text-black flex items-center justify-center font-black text-sm shadow-2xs">
              P
            </div>
            <span className="font-extrabold text-sm tracking-tight text-zinc-900 hidden sm:inline">
              PLATO
            </span>
          </button>

          <div className="hidden sm:block h-5 w-[1px] bg-zinc-200" />

          {/* Store Switcher */}
          <StoreSwitcher
            tenants={tenants}
            selectedTenant={selectedTenant}
            onSelectTenant={(t) => {
              setSelectedTenant(t);
              if (t) {
                setExpandedTenants((prev) => ({ ...prev, [t.id]: true }));
              }
            }}
            onOpenCreate={() => setShowCreateModal(true)}
            platformDomain={platformDomain}
            platformProtocol={platformProtocol}
          />
        </div>

        {/* Center: Search Command Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search dishes, settings, restaurants... (⌘K)"
              className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-lime-500 focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Right: Actions, Store Link & User */}
        <div className="flex items-center gap-2 sm:gap-3">
          {activeUrl ? (
            <a
              href={activeUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-zinc-200 hover:border-zinc-300 text-xs font-semibold text-zinc-800 transition-colors shadow-2xs"
            >
              <span className="hidden sm:inline">Live Store</span>
              <ExternalLink className="w-3.5 h-3.5 text-lime-700" />
            </a>
          ) : (
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-lime-500 hover:bg-lime-400 text-black font-bold text-xs transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-3 h-3" />
              <span>Add Store</span>
            </button>
          )}

          <div className="h-5 w-[1px] bg-zinc-200 hidden sm:block" />

          {/* User Profile & Logout */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-800 uppercase">
              {user.name ? user.name[0] : "U"}
            </div>
            <div className="hidden lg:block text-left text-xs leading-none">
              <p className="font-semibold text-zinc-900">{user.name}</p>
              <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{user.email}</p>
            </div>

            <form action={logoutAction}>
              <button
                type="submit"
                title="Log out"
                className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 border border-transparent hover:border-zinc-200 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Layout Container (Sidebar + Content Workspace) */}
      <div className="flex-1 flex w-full">
        {/* Left Sidebar Panel */}
        <aside className="w-64 flex-shrink-0 border-r border-zinc-200 bg-white p-3 hidden md:flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            {/* Top Permanent Group: Home, My restaurants, General Settings */}
            <div>
              <div className="px-3 py-1 mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-mono">
                  Platform
                </span>
              </div>
              <nav className="space-y-1">
                {/* 1. Home */}
                <button
                  type="button"
                  onClick={() => setActiveTab("home")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    activeTab === "home"
                      ? "bg-zinc-100 text-zinc-900 border border-zinc-200 shadow-2xs"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Home className={`w-4 h-4 ${activeTab === "home" ? "text-lime-700" : ""}`} />
                    <span>Home</span>
                  </div>
                  {activeTab === "home" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-lime-500" />
                  )}
                </button>

                {/* 2. My restaurants */}
                <button
                  type="button"
                  onClick={() => setActiveTab("my-restaurants")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    activeTab === "my-restaurants"
                      ? "bg-zinc-100 text-zinc-900 border border-zinc-200 shadow-2xs"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Store className={`w-4 h-4 ${activeTab === "my-restaurants" ? "text-lime-700" : ""}`} />
                    <span>My restaurants</span>
                  </div>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-zinc-100 border border-zinc-200 text-zinc-700 font-semibold">
                    {tenants.length}
                  </span>
                </button>

                {/* 3. General Settings */}
                <button
                  type="button"
                  onClick={() => setActiveTab("general-settings")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    activeTab === "general-settings"
                      ? "bg-zinc-100 text-zinc-900 border border-zinc-200 shadow-2xs"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Settings className={`w-4 h-4 ${activeTab === "general-settings" ? "text-lime-700" : ""}`} />
                    <span>General Settings</span>
                  </div>
                  {activeTab === "general-settings" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-lime-500" />
                  )}
                </button>
              </nav>
            </div>

            {/* Visual Separator & Restaurants Section */}
            <div className="pt-3 border-t border-zinc-200">
              <div className="flex items-center justify-between px-3 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-mono">
                  Restaurants
                </span>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(true)}
                  title="Create new restaurant"
                  className="p-1 rounded hover:bg-zinc-100 text-zinc-400 hover:text-zinc-800 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {tenants.length === 0 ? (
                <div className="p-3 text-center rounded-xl bg-zinc-50 border border-dashed border-zinc-200 space-y-1.5">
                  <p className="text-[11px] text-zinc-500 font-medium">No restaurants yet</p>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-lime-700 hover:text-lime-800 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Create Restaurant</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {tenants.map((tenant) => {
                    const isSelected = selectedTenant?.id === tenant.id;
                    const isExpanded = !!expandedTenants[tenant.id];
                    const tenantUrl = `${platformProtocol}://${tenant.slug}.${platformDomain}`;

                    return (
                      <div
                        key={tenant.id}
                        className="rounded-xl overflow-hidden transition-colors"
                      >
                        {/* Restaurant Accordion Item */}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedTenant(tenant);
                            toggleTenantExpand(tenant.id);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-2 text-left rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-zinc-100/90 text-zinc-900 border border-zinc-200/80"
                              : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900"
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div
                              className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black uppercase flex-shrink-0 ${
                                isSelected
                                  ? "bg-lime-500 text-black shadow-2xs"
                                  : "bg-zinc-200 text-zinc-700"
                              }`}
                            >
                              {tenant.name[0] || "R"}
                            </div>
                            <span className="truncate">{tenant.name}</span>
                          </div>

                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {isSelected && (
                              <span
                                className="w-1.5 h-1.5 rounded-full bg-lime-500 animate-pulse"
                                title="Selected Restaurant"
                              />
                            )}
                            <ChevronDown
                              className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${
                                isExpanded ? "rotate-0" : "-rotate-90"
                              }`}
                            />
                          </div>
                        </button>

                        {/* Restaurant Specific Sub-Tabs (separated below the top three) */}
                        {isExpanded && (
                          <div className="pl-4 pr-1 py-1 space-y-0.5 border-l-2 border-lime-500/40 ml-4 my-1">
                            {/* 1. Menu Customization */}
                            <button
                              type="button"
                              onClick={() =>
                                handleSelectRestaurantTab(tenant, "restaurant-menu")
                              }
                              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                                activeTab === "restaurant-menu" && isSelected
                                  ? "bg-lime-50 text-lime-950 font-bold border border-lime-200 shadow-2xs"
                                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/70"
                              }`}
                            >
                              <Utensils
                                className={`w-3.5 h-3.5 flex-shrink-0 ${
                                  activeTab === "restaurant-menu" && isSelected
                                    ? "text-lime-700"
                                    : "text-zinc-400"
                                }`}
                              />
                              <span className="truncate">Menu Customization</span>
                            </button>

                            {/* 2. Theme Customization */}
                            <button
                              type="button"
                              onClick={() =>
                                handleSelectRestaurantTab(tenant, "restaurant-theme")
                              }
                              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                                activeTab === "restaurant-theme" && isSelected
                                  ? "bg-lime-50 text-lime-950 font-bold border border-lime-200 shadow-2xs"
                                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/70"
                              }`}
                            >
                              <Palette
                                className={`w-3.5 h-3.5 flex-shrink-0 ${
                                  activeTab === "restaurant-theme" && isSelected
                                    ? "text-lime-700"
                                    : "text-zinc-400"
                                }`}
                              />
                              <span className="truncate">Theme & Design</span>
                            </button>

                            {/* 3. Restaurant Details */}
                            <button
                              type="button"
                              onClick={() =>
                                handleSelectRestaurantTab(tenant, "restaurant-details")
                              }
                              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                                activeTab === "restaurant-details" && isSelected
                                  ? "bg-lime-50 text-lime-950 font-bold border border-lime-200 shadow-2xs"
                                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/70"
                              }`}
                            >
                              <Clock
                                className={`w-3.5 h-3.5 flex-shrink-0 ${
                                  activeTab === "restaurant-details" && isSelected
                                    ? "text-lime-700"
                                    : "text-zinc-400"
                                }`}
                              />
                              <span className="truncate">Store Details</span>
                            </button>

                            {/* 4. Live Storefront Link */}
                            <a
                              href={tenantUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/70 transition-colors"
                            >
                              <div className="flex items-center gap-2 truncate">
                                <Globe className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                                <span className="truncate">Live Storefront</span>
                              </div>
                              <ExternalLink className="w-3 h-3 text-zinc-400 flex-shrink-0" />
                            </a>

                            {/* 5. Delete Restaurant Action */}
                            <button
                              type="button"
                              onClick={() => setTenantToDelete(tenant)}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                              <span className="truncate">Delete Restaurant</span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Bottom: Active Store Domain Card */}
          <div className="p-3 rounded-xl border border-zinc-200 bg-zinc-50 space-y-2 mt-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 font-mono">
                Active Storefront
              </span>
              <span className="flex items-center gap-1 text-[10px] font-mono text-lime-700 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-lime-500 animate-pulse" />
                Live
              </span>
            </div>

            <p className="text-xs font-mono font-medium text-zinc-900 truncate">
              {selectedTenant
                ? `${selectedTenant.slug}.${platformDomain}`
                : `setup.${platformDomain}`}
            </p>

            {activeUrl && (
              <a
                href={activeUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-1.5 px-2 rounded-lg bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-800 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
              >
                <span>View Storefront</span>
                <ExternalLink className="w-3 h-3 text-lime-700" />
              </a>
            )}
          </div>
        </aside>

        {/* Center Workspace Content */}
        <main className="flex-1 bg-[#F6F6F7] p-4 sm:p-8 max-w-5xl mx-auto space-y-8 overflow-y-auto">
          {/* TAB 1: HOME */}
          {activeTab === "home" && (
            <div className="space-y-8">
              {/* Welcome Merchant Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-lime-500 text-black">
                      MERCHANT PORTAL
                    </span>
                    <span className="text-xs text-zinc-400 font-mono">•</span>
                    <span className="text-xs text-zinc-600 font-mono">
                      Multi-Tenant Platform
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
                    Welcome back, {user.name}
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-600 mt-1">
                    Onboard new restaurants here. To customize existing restaurants, use their dedicated tabs in the sidebar.
                  </p>
                </div>

                {/* Quick Metrics */}
                <div className="flex items-center gap-3">
                  <div className="px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white text-left shadow-2xs">
                    <span className="text-[10px] text-zinc-500 font-mono block uppercase">
                      Connected Stores
                    </span>
                    <span className="text-base font-bold text-zinc-900 font-mono">
                      {tenants.length}
                    </span>
                  </div>

                  <div className="px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white text-left shadow-2xs">
                    <span className="text-[10px] text-zinc-500 font-mono block uppercase">
                      Platform Status
                    </span>
                    <span className="text-base font-bold text-lime-700 font-mono">
                      Online
                    </span>
                  </div>
                </div>
              </div>

              {/* Informational Callout: Existing Stores */}
              {tenants.length > 0 && (
                <div className="p-4 rounded-2xl bg-zinc-100/80 border border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-lime-700 shadow-2xs font-bold text-xs flex-shrink-0">
                      {tenants.length}
                    </div>
                    <div>
                      <p className="font-bold text-zinc-900">
                        {tenants.length} Restaurant{tenants.length > 1 ? "s" : ""} Already Active
                      </p>
                      <p className="text-zinc-500 text-[11px] mt-0.5">
                        Customize menus, theme styling, or store hours for your existing restaurants using the dedicated restaurant tabs in the side panel.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab("my-restaurants")}
                    className="px-3 py-1.5 rounded-lg border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-800 font-semibold text-xs transition-colors self-start sm:self-auto cursor-pointer shadow-2xs flex items-center gap-1.5 flex-shrink-0"
                  >
                    <span>View My Restaurants</span>
                    <ArrowRight className="w-3 h-3 text-zinc-500" />
                  </button>
                </div>
              )}

              {/* Sole Primary Feature: New Restaurant Onboarding */}
              <NewRestaurantOnboarding
                onTenantCreated={handleTenantCreatedFromGuide}
                onNavigateToTab={handleSelectRestaurantTab}
                platformDomain={platformDomain}
                platformProtocol={platformProtocol}
                existingTenantsCount={tenants.length}
              />
            </div>
          )}

          {/* TAB 2: MY RESTAURANTS */}
          {activeTab === "my-restaurants" && (
            <div className="space-y-6">
              <div className="border-b border-zinc-200 pb-5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-lime-500 text-black">
                    PORTFOLIO
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">•</span>
                  <span className="text-xs text-zinc-500 font-mono">
                    All Connected Brands
                  </span>
                </div>
                <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900">
                  My Restaurants
                </h2>
                <p className="text-xs sm:text-sm text-zinc-600 mt-1">
                  View and manage all restaurant storefronts configured under your account.
                </p>
              </div>

              <RestaurantListCard
                tenants={tenants}
                onOpenCreate={() => setShowCreateModal(true)}
                platformDomain={platformDomain}
                platformProtocol={platformProtocol}
                onNavigateToTab={handleSelectRestaurantTab}
                onRequestDelete={(t) => setTenantToDelete(t)}
              />
            </div>
          )}

          {/* TAB 3: GENERAL SETTINGS */}
          {activeTab === "general-settings" && (
            <GeneralSettingsView
              user={user}
              platformDomain={platformDomain}
              platformProtocol={platformProtocol}
              totalRestaurants={tenants.length}
            />
          )}

          {/* TAB 4: RESTAURANT MENU CUSTOMIZATION */}
          {activeTab === "restaurant-menu" && (
            <>
              {selectedTenant ? (
                <RestaurantMenuCustomizationView
                  tenant={selectedTenant}
                  allTenants={tenants}
                  onSelectTenant={(t) => setSelectedTenant(t)}
                  platformDomain={platformDomain}
                  platformProtocol={platformProtocol}
                />
              ) : (
                <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center space-y-3">
                  <p className="text-sm font-semibold text-zinc-800">
                    No restaurant selected
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-2 rounded-lg bg-lime-500 text-black font-bold text-xs"
                  >
                    Create a Restaurant First
                  </button>
                </div>
              )}
            </>
          )}

          {/* TAB 5: RESTAURANT THEME CUSTOMIZATION */}
          {activeTab === "restaurant-theme" && (
            <>
              {selectedTenant ? (
                <RestaurantThemeCustomizationView
                  tenant={selectedTenant}
                  platformDomain={platformDomain}
                  platformProtocol={platformProtocol}
                />
              ) : (
                <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center space-y-3">
                  <p className="text-sm font-semibold text-zinc-800">
                    No restaurant selected
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-2 rounded-lg bg-lime-500 text-black font-bold text-xs"
                  >
                    Create a Restaurant First
                  </button>
                </div>
              )}
            </>
          )}

          {/* TAB 6: RESTAURANT DETAILS & HOURS */}
          {activeTab === "restaurant-details" && (
            <>
              {selectedTenant ? (
                <RestaurantDetailsView
                  key={selectedTenant.id}
                  tenant={selectedTenant}
                  platformDomain={platformDomain}
                  platformProtocol={platformProtocol}
                  onUpdateTenantName={handleUpdateTenantName}
                  onRequestDelete={() => setTenantToDelete(selectedTenant)}
                />
              ) : (
                <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center space-y-3">
                  <p className="text-sm font-semibold text-zinc-800">
                    No restaurant selected
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-2 rounded-lg bg-lime-500 text-black font-bold text-xs"
                  >
                    Create a Restaurant First
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Quick Create Restaurant Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-lime-600" />
                <h3 className="text-sm font-bold text-zinc-900">Create New Restaurant</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-xs text-zinc-400 hover:text-zinc-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {createError && (
              <div className="p-3 text-xs rounded-lg bg-red-50 border border-red-200 text-red-700">
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateTenant} className="space-y-4">
              <div>
                <label
                  htmlFor="modal-restaurant-name"
                  className="block text-xs font-medium text-zinc-700 mb-1.5"
                >
                  Restaurant Name <span className="text-lime-600">*</span>
                </label>
                <input
                  id="modal-restaurant-name"
                  type="text"
                  required
                  autoFocus
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="e.g. Bella Roma Kitchen"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-zinc-300 text-zinc-900 placeholder-zinc-400 text-xs focus:outline-none focus:border-lime-500 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="modal-tenant-theme" className="block text-xs font-medium text-zinc-700 mb-1.5">
                  Theme / Template
                </label>
                <select
                  id="modal-tenant-theme"
                  value={newTenantThemeId}
                  onChange={(e) => setNewTenantThemeId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-zinc-300 text-zinc-900 text-xs focus:outline-none focus:border-lime-500 transition-colors"
                >
                  <option value="modern">Modern</option>
                  <option value="burger-craft">Burger Craft</option>
                  <option value="pizza-artisan">Pizza Artisan</option>
                  <option value="plato-lime">Plato Lime</option>
                  <option value="dark-modern">Dark Modern</option>
                  <option value="warm-bistro">Warm Bistro</option>
                  <option value="terracotta">Terracotta</option>
                </select>
              </div>

              {nameInput.trim() && (
                <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 flex items-center gap-2">
                  <span className="text-zinc-500">Subdomain:</span>
                  <span className="text-lime-700 font-mono font-semibold truncate">
                    {nameInput.toLowerCase().replace(/[^a-z0-9]/g, "-")}.{platformDomain}
                  </span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-zinc-300 bg-white text-xs text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending || !nameInput.trim()}
                  className="px-4 py-1.5 rounded-lg bg-lime-500 hover:bg-lime-400 text-black font-bold text-xs transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {isPending ? "Creating..." : "Create Restaurant"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password-Protected Delete Restaurant Modal */}
      {tenantToDelete && (
        <DeleteRestaurantModal
          tenant={tenantToDelete}
          platformDomain={platformDomain}
          onClose={() => setTenantToDelete(null)}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
}
