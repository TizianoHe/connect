import { cn } from "@/lib/utils";
import { forwardRef, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, hint, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-neutral-700"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "w-full rounded-xl border px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 bg-white transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent",
            error
              ? "border-red-400 focus:ring-red-500"
              : "border-neutral-200 hover:border-neutral-300",
            className
          )}
          {...props}
        />
        {hint && !error && (
          <p className="text-xs text-neutral-500">{hint}</p>
        )}
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
