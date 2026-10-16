"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { LoaderCircle } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { ProcessingScreen } from "@/components/ui/ProcessingScreen";
import { TextureButton } from "@/components/ui/texture-button";

function SignOutButton({
  children,
  className,
  size,
}: {
  children: ReactNode;
  className: string;
  size: "sm" | "default" | "lg" | "icon" | "icon-sm";
}) {
  const { pending } = useFormStatus();
  const compact = size === "icon" || size === "icon-sm";

  return (
    <TextureButton
      variant="destructive"
      size={size}
      type="submit"
      disabled={pending}
      aria-busy={pending}
      title={pending ? "Signing out" : undefined}
      aria-label={compact ? (pending ? "Signing out" : "Sign out") : undefined}
      className={className}
    >
      {pending ? (
        <span className="inline-flex items-center justify-center gap-2">
          <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />
          {!compact && <span>Signing out…</span>}
        </span>
      ) : (
        children
      )}
    </TextureButton>
  );
}

function SignOutProcessing() {
  const { pending } = useFormStatus();
  if (!pending) return null;

  return (
    <ProcessingScreen
      variant="overlay"
      title="Signing out"
      description="Your session is ending."
    />
  );
}

export function SignOutForm({
  children,
  className,
  size = "default",
}: {
  children: ReactNode;
  className: string;
  size?: "sm" | "default" | "lg" | "icon" | "icon-sm";
}) {
  return (
    <form action={logoutAction}>
      <SignOutButton className={className} size={size}>{children}</SignOutButton>
      <SignOutProcessing />
    </form>
  );
}
