"use client";

import React, { type ButtonHTMLAttributes, type AnchorHTMLAttributes } from "react";

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
  // Base classes with dynamic theme token variables
  const sizeClasses = {
    sm: "px-3.5 py-1.5 text-xs font-medium gap-1.5",
    md: "px-5 py-2.5 text-sm font-semibold gap-2",
    lg: "px-7 py-3.5 text-base font-bold gap-2.5",
  }[size];

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: "var(--theme-color-primary, #E05A2B)",
      color: "var(--theme-color-text, #FFFFFF)",
      boxShadow: "var(--theme-shadow-floating, 0 10px 20px -5px rgba(224, 90, 43, 0.3))",
    },
    secondary: {
      backgroundColor: "var(--theme-color-surface-card, #1E222B)",
      color: "var(--theme-color-text, #F8FAFC)",
      border: "1px solid var(--theme-color-border, #2E3646)",
    },
    outline: {
      backgroundColor: "transparent",
      color: "var(--theme-color-text, #F8FAFC)",
      border: "1.5px solid var(--theme-color-border, #2E3646)",
    },
    ghost: {
      backgroundColor: "transparent",
      color: "var(--theme-color-muted-text, #94A3B8)",
    },
  };

  const dynamicRadius: React.CSSProperties = {
    borderRadius: "var(--theme-radius-medium, 0.75rem)",
    ...variantStyles[variant],
  };

  const sharedClasses = `inline-flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95 select-none hover:opacity-95 ${
    fullWidth ? "w-full" : ""
  } ${sizeClasses} ${className}`;

  if ("href" in props && props.href) {
    return (
      <a
        className={sharedClasses}
        style={dynamicRadius}
        {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      className={sharedClasses}
      style={dynamicRadius}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
