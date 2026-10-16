"use client";

import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

type ProcessingScreenProps = {
  title: string;
  description: string;
  variant?: "page" | "overlay";
};

export function ProcessingScreen({
  title,
  description,
  variant = "page",
}: ProcessingScreenProps) {
  const portalContainer = useSyncExternalStore(
    () => () => {},
    () => document.body,
    () => null,
  );

  const content = (
    <div className="flex w-40 flex-col items-center gap-3 text-center">
      <div className="h-1 w-28 overflow-hidden rounded-full bg-neutral-400/30">
        <span className="processing-progress-bar block h-full w-2/5 rounded-full bg-lime-500" />
      </div>
      <p className="text-sm font-medium text-neutral-700">{title}</p>
      <span className="sr-only">{description}</span>
    </div>
  );

  if (variant === "overlay") {
    const overlay = (
      <div
        role="status"
        aria-live="polite"
        aria-busy="true"
        aria-label={title}
        className="fixed inset-0 z-[30] flex items-center justify-center bg-white/35 px-5 py-8 backdrop-blur-md"
      >
        {content}
      </div>
    );

    return portalContainer ? createPortal(overlay, portalContainer) : null;
  }

  return (
    <main
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={title}
      className="flex min-h-screen items-center justify-center bg-zinc-100 px-5 py-8"
    >
      {content}
    </main>
  );
}
