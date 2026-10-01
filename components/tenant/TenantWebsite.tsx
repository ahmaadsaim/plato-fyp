"use client";

import React from "react";
import type { Tenant } from "@/lib/tenant";
import type { StoreConfig } from "@/template/types/store";
import { StoreProvider } from "@/template/context/StoreContext";
import Header from "@/template/components/header";
import HeroBanner from "@/template/components/hero-banner";
import MenuCategories from "@/template/components/menu-categories";
import ProductsGrid from "@/template/components/products-grid";
import Footer from "@/template/components/footer";
import CartSidebar from "@/template/components/cart-sidebar";
import DemoStoreSwitcher from "@/template/components/demo-store-switcher";

interface TenantWebsiteProps {
  tenant: Tenant;
  initialConfig: StoreConfig;
}

export function TenantWebsite({ initialConfig }: TenantWebsiteProps) {
  const pageBg = initialConfig.metadata?.theme?.backgroundColor || '#FFFFFF';
  const textColor = initialConfig.metadata?.theme?.textColor || '#09090B';

  return (
    <StoreProvider key={`${initialConfig.storeId}-${initialConfig.metadata?.theme?.name || ''}`} initialConfig={initialConfig}>
      <div 
        style={{
          backgroundColor: pageBg,
          color: textColor,
          fontFamily: 'var(--brand-font-family, inherit)',
        }}
        className="min-h-screen font-sans antialiased selection:bg-[var(--brand-primary)] selection:text-black transition-colors duration-300"
      >
        <Header />
        <div className="animate-in fade-in duration-700">
          <HeroBanner />
        </div>
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          <MenuCategories />
        </div>
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <ProductsGrid />
        </div>
        <Footer />
        <CartSidebar />
        <DemoStoreSwitcher />
      </div>
    </StoreProvider>
  );
}

