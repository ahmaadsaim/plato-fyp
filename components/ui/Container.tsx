import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function Container({ children, className = "", id }: ContainerProps) {
  return (
    <div
      id={id}
      className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${className}`}
      style={{
        maxWidth: "var(--theme-layout-max-width, 1280px)",
      }}
    >
      {children}
    </div>
  );
}
