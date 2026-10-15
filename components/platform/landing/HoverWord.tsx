"use client";

import React from "react";

interface HoverLineProps {
  children: React.ReactNode;
  className?: string;
  underlineColor?: string;
}

export function HoverLine({
  children,
  className = "",
  underlineColor = "bg-lime-500",
}: HoverLineProps) {
  return (
    <span className={`relative inline-block align-baseline group/hl cursor-default ${className}`}>
      {/* Invisible hit area covering the word/line and extending down to the underline to eliminate flicker */}
      <span
        className="absolute -inset-x-1 top-0 -bottom-[0.25em] pointer-events-auto"
        aria-hidden="true"
      />
      {/* Visible line text */}
      <span className="relative z-10">{children}</span>
      {/* Line underline: pure slide in from left, balanced vertical position */}
      <span
        className={`absolute inset-x-0 -bottom-[0.16em] sm:-bottom-[0.18em] h-[0.08em] min-h-[3px] max-h-[4.5px] ${underlineColor} rounded-full origin-left scale-x-0 group-hover/hl:scale-x-100 transition-transform duration-300 ease-out pointer-events-none transform-gpu will-change-transform`}
      />
    </span>
  );
}

interface HoverLinesProps {
  lines: string[];
  className?: string;
  underlineColor?: string;
}

export function HoverLines({
  lines,
  className = "",
  underlineColor = "bg-lime-500",
}: HoverLinesProps) {
  return (
    <>
      {lines.map((line, idx) => (
        <span
          key={idx}
          className={`block ${idx < lines.length - 1 ? "pb-2 sm:pb-3.5" : ""}`}
        >
          <HoverLine className={className} underlineColor={underlineColor}>
            {line}
          </HoverLine>
        </span>
      ))}
    </>
  );
}

// Backward-compatible exports
export const HoverWord = HoverLine;

export function HoverSentence({
  text,
  className = "",
  underlineColor = "bg-lime-500",
}: {
  text: string;
  className?: string;
  underlineColor?: string;
}) {
  return (
    <HoverLine className={className} underlineColor={underlineColor}>
      {text}
    </HoverLine>
  );
}
