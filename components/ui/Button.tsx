"use client";

import React, { type ButtonHTMLAttributes, type AnchorHTMLAttributes } from "react";
import { TextureButton } from "@/components/ui/texture-button";

type ButtonBaseProps = {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  children: React.ReactNode;
  className?: string;
};

type ButtonAsButton = ButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsAnchor = ButtonBaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsAnchor;

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const textureVariant = variant === "primary" ? "primary" : variant === "secondary" ? "secondary" : "minimal";
  const textureSize = size === "md" ? "default" : size;
  const sharedClasses = `${fullWidth ? "w-full" : ""} ${className}`;
  const style: React.CSSProperties = {
    borderRadius: "var(--theme-radius-medium, 0.75rem)",
    ...(variant === "primary"
      ? {
          background: "var(--theme-color-primary, #E05A2B)",
          color: "var(--theme-color-text, #FFFFFF)",
          borderColor: "var(--theme-color-primary, #E05A2B)",
        }
      : variant === "secondary"
        ? {
            background: "var(--theme-color-surface-card, #1E222B)",
            color: "var(--theme-color-text, #F8FAFC)",
            borderColor: "var(--theme-color-border, #2E3646)",
          }
        : variant === "outline"
          ? {
              background: "transparent",
              color: "var(--theme-color-text, #F8FAFC)",
              borderColor: "var(--theme-color-border, #2E3646)",
            }
          : {
              background: "transparent",
              color: "var(--theme-color-muted-text, #94A3B8)",
              borderColor: "transparent",
            }),
  };

  if ("href" in props && props.href) {
    return (
      <TextureButton
        variant={textureVariant}
        size={textureSize}
        href={props.href}
        className={sharedClasses}
        style={style}
        {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >{children}</TextureButton>
    );
  }

  return (
    <TextureButton
      variant={textureVariant}
      size={textureSize}
      className={sharedClasses}
      style={style}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </TextureButton>
  );
}
