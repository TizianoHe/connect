"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * `inverse` is the primary action on a dark field — solid ink is invisible
   * there, and tinting it would break the monochrome system.
   */
  variant?: "primary" | "secondary" | "ghost" | "destructive" | "inverse";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          // Pills throughout. In a monochrome system the only levers for
          // emphasis are fill and weight, so primary is solid ink and
          // secondary is a hairline outline.
          "inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:opacity-40 disabled:cursor-not-allowed",
          {
            "bg-neutral-900 text-white border border-transparent hover:bg-neutral-700 focus-visible:ring-neutral-900":
              variant === "primary",
            "bg-white text-neutral-900 border border-neutral-200 hover:border-neutral-400 focus-visible:ring-neutral-900":
              variant === "secondary",
            "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 focus-visible:ring-neutral-900":
              variant === "ghost",
            // The primary action on a dark field, where solid ink is invisible.
            "bg-white text-neutral-900 hover:bg-neutral-100 focus-visible:ring-white":
              variant === "inverse",
            // Quieter than primary on purpose: a destructive action should be
            // reachable, not the loudest thing on screen.
            "bg-white text-red-600 border border-red-200 hover:bg-red-50 focus-visible:ring-red-600":
              variant === "destructive",
          },
          {
            "text-[0.8125rem] px-3.5 py-2": size === "sm",
            "text-sm px-5 py-2.5": size === "md",
            "text-[0.9375rem] px-6 py-3": size === "lg",
          },
          className
        )}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
