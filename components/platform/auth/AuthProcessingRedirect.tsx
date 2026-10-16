"use client";

import { useEffect } from "react";
import { ProcessingScreen } from "@/components/ui/ProcessingScreen";
import { MIN_AUTH_PROCESSING_MS } from "@/lib/processing";

export function AuthProcessingRedirect({
  title,
  description,
  destination,
}: {
  title: string;
  description: string;
  destination: "/" | "/dashboard";
}) {
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      window.location.replace(destination);
    }, MIN_AUTH_PROCESSING_MS);

    return () => window.clearTimeout(timeoutId);
  }, [destination]);

  return <ProcessingScreen title={title} description={description} />;
}
