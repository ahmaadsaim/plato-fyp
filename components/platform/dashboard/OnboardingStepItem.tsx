"use client";

import React from "react";
import { CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";

interface OnboardingStepItemProps {
  stepNumber: number;
  title: string;
  description: string;
  estimatedTime?: string;
  isCompleted: boolean;
  isOpen: boolean;
  onToggle: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export function OnboardingStepItem({
  stepNumber,
  title,
  description,
  estimatedTime,
  isCompleted,
  isOpen,
  onToggle,
  icon,
  children,
}: OnboardingStepItemProps) {
  return (
    <div
      className={`rounded-xl border transition-all ${
        isOpen
          ? "border-lime-600 bg-white shadow-sm ring-1 ring-lime-500/20"
          : isCompleted
          ? "border-zinc-200 bg-zinc-50/70 hover:border-zinc-300"
          : "border-zinc-200 bg-white hover:border-zinc-300 shadow-xs"
      }`}
    >
      {/* Header Button */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left cursor-pointer select-none"
      >
        <div className="flex items-center gap-3.5 min-w-0 pr-4">
          {/* Status Icon */}
          <div className="flex-shrink-0">
            {isCompleted ? (
              <div className="w-6 h-6 rounded-full bg-lime-500 flex items-center justify-center text-black shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-black stroke-[2.5]" />
              </div>
            ) : (
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-mono font-bold ${
                  isOpen
                    ? "border-lime-600 text-lime-700 bg-lime-50"
                    : "border-zinc-300 text-zinc-500 bg-zinc-100"
                }`}
              >
                {stepNumber}
              </div>
            )}
          </div>

          {/* Title & Preview */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-zinc-600">{icon}</span>
              <h3
                className={`text-sm font-semibold truncate ${
                  isCompleted ? "text-zinc-400 line-through decoration-zinc-300" : "text-zinc-900"
                }`}
              >
                {title}
              </h3>
              {estimatedTime && !isCompleted && (
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-100 border border-zinc-200 text-zinc-600 font-medium">
                  {estimatedTime}
                </span>
              )}
            </div>
            {!isOpen && (
              <p className="text-xs text-zinc-500 truncate mt-0.5">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Accordion Toggle Icon */}
        <div className="flex items-center gap-2 flex-shrink-0 text-zinc-400">
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-lime-600" />
          ) : (
            <ChevronDown className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600" />
          )}
        </div>
      </button>

      {/* Accordion Content Body */}
      {isOpen && (
        <div className="px-4 pb-5 pt-2 border-t border-zinc-100">
          <p className="text-xs text-zinc-600 mb-4 leading-relaxed">
            {description}
          </p>
          <div>{children}</div>
        </div>
      )}
    </div>
  );
}
