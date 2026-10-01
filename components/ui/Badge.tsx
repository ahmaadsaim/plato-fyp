import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "accent" | "surface" | "success" | "outline";
  size?: "sm" | "md";
  className?: string;
}

export function Badge({
  children,
  variant = "primary",
  size = "sm",
  className = "",
}: BadgeProps) {
  const sizeClasses = {
    sm: "px-2.5 py-0.5 text-xs font-semibold",
    md: "px-3 py-1 text-xs font-bold tracking-wide",
  }[size];

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: "var(--theme-color-primary, #E05A2B)",
      color: "var(--theme-color-badge-text, #FFFFFF)",
    },
    accent: {
      backgroundColor: "var(--theme-color-accent-bg, #2A2016)",
      color: "var(--theme-color-accent, #F59E0B)",
      border: "1px solid rgba(245, 158, 11, 0.3)",
    },
    surface: {
      backgroundColor: "var(--theme-color-surface-hover, #272C38)",
      color: "var(--theme-color-text, #F8FAFC)",
      border: "1px solid var(--theme-color-border, #2E3646)",
    },
    success: {
      backgroundColor: "rgba(52, 211, 153, 0.15)",
      color: "#34D399",
      border: "1px solid rgba(52, 211, 153, 0.3)",
    },
    outline: {
      backgroundColor: "transparent",
      color: "var(--theme-color-muted-text, #94A3B8)",
      border: "1px solid var(--theme-color-border, #2E3646)",
    },
  };

  return (
    <span
      className={`inline-flex items-center gap-1 uppercase tracking-wider ${sizeClasses} ${className}`}
      style={{
        borderRadius: "var(--theme-radius-full, 9999px)",
        ...variantStyles[variant],
      }}
    >
      {children}
    </span>
  );
}
