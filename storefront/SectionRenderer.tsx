"use client";

import React, { Component, type ReactNode } from "react";
import type {
  SectionConfig,
  ThemeTokens,
  RestaurantData,
  ProductData,
  CategoryData,
} from "@/lib/theme/types";
import { getSectionComponent, getRegisteredSectionTypes } from "./sectionRegistry";

interface SectionRendererProps {
  section: SectionConfig;
  theme: ThemeTokens;
  restaurant: RestaurantData;
  products: ProductData[];
  categories: CategoryData[];
  index?: number;
}

interface SectionErrorBoundaryProps {
  sectionId: string;
  sectionType: string;
  children: ReactNode;
}

interface SectionErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class SectionErrorBoundary extends Component<
  SectionErrorBoundaryProps,
  SectionErrorBoundaryState
> {
  constructor(props: SectionErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): SectionErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(
      `[SectionRenderer] Error rendering section '${this.props.sectionId}' (${this.props.sectionType}):`,
      error,
      errorInfo
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto my-6 max-w-4xl p-6 rounded-2xl border border-rose-800/60 bg-rose-950/40 text-rose-200">
          <div className="flex items-center gap-2 mb-2 font-bold text-sm text-rose-300">
            <span>⚠️</span>
            <span>Section Render Error: {this.props.sectionType} (#{this.props.sectionId})</span>
          </div>
          <p className="text-xs text-rose-300/80 font-mono">
            {this.state.error?.message || "An unexpected error occurred in this section."}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * SectionRenderer dynamically resolves and mounts the matching React component
 * for a section in layout.json with error boundary isolation.
 */
export function SectionRenderer({
  section,
  theme,
  restaurant,
  products,
  categories,
  index,
}: SectionRendererProps) {
  const sectionComponent = getSectionComponent(section.type);

  if (!sectionComponent) {
    const supported = getRegisteredSectionTypes().join(", ");
    return (
      <div className="mx-auto my-6 max-w-4xl p-6 rounded-2xl border border-amber-600/50 bg-amber-950/30 text-amber-200">
        <div className="flex items-center gap-2 mb-2 font-bold text-sm text-amber-300">
          <span>⚠️</span>
          <span>Unknown Section Type: &quot;{section.type}&quot;</span>
        </div>
        <p className="text-xs text-amber-200/90 leading-relaxed mb-2">
          Section ID <code>#{section.id}</code> could not be rendered because type &quot;{section.type}&quot; is not registered.
        </p>
        <p className="text-[11px] text-zinc-400">
          Supported types: <span className="font-mono text-amber-300/80">{supported}</span>
        </p>
      </div>
    );
  }

  return (
    <SectionErrorBoundary sectionId={section.id} sectionType={section.type}>
      {React.createElement(sectionComponent, {
        id: section.id,
        settings: section.settings || {},
        theme,
        restaurant,
        products,
        categories,
        index,
      })}
    </SectionErrorBoundary>
  );
}
