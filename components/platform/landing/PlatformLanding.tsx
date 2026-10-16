"use client";

import React from "react";
import { User as AuthUser } from "@/lib/auth";
import { AuthProvider } from "./AuthContext";
import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import { SystemMockup } from "./SystemMockup";
import { TrustBand } from "./TrustBand";
import { BentoFeatures } from "./BentoFeatures";
import { MenuScanAnimation } from "./MenuScanAnimation";
import { ShowcaseModule } from "./ShowcaseModule";
import { KitchenDarkSection } from "./KitchenDarkSection";
import { IntegrationsSection } from "./IntegrationsSection";
import { PricingPlans } from "./PricingPlans";
import { RecapAndCta } from "./RecapAndCta";
import { Footer } from "./Footer";

interface PlatformLandingProps {
  user: AuthUser | null;
}

export function PlatformLanding({ user }: PlatformLandingProps) {
  const initialUser = user
    ? {
        name: user.name,
        email: user.email,
        provider: user.provider,
      }
    : null;

  return (
    <AuthProvider initialUser={initialUser}>
      <div className="min-h-screen bg-white text-neutral-900 flex flex-col selection:bg-lime-200 selection:text-black">
        <Navbar />
        <main className="flex-1">
          <Hero />
          <SystemMockup />
          <TrustBand />
          <BentoFeatures />
          <MenuScanAnimation />
          <ShowcaseModule />
          <KitchenDarkSection />
          <IntegrationsSection />
          <PricingPlans />
          <RecapAndCta />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
