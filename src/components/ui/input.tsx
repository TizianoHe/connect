import { cn } from "@/lib/utils";
import { forwardRef, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  hint?: string;
  /**
   * Control rendered inside the field on the right, e.g. the show-password eye.
   *
   * It belongs here rather than in the form, because a caller can only position
   * it against the whole labelled group and has to guess an offset for the
   * label height. Every password field used `top-8`, which sat about 7px above
   * the middle of the input. Anchored to the input itself, it is centred by
   * construction and stays centred if the label wraps.
   */
  trailing?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, hint, id, trailing, ...props }, ref) => {
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
        <div className="relative">
          <input
            ref={ref}
            id={id}
            className={cn(
              "w-full rounded-xl border px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 bg-white transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent",
              error
                ? "border-red-400 focus:ring-red-500"
                : "border-neutral-200 hover:border-neutral-300",
              /* Keep the value clear of the control instead of running under it. */
              trailing && "pr-11",
              className
            )}
            {...props}
          />
          {trailing && (
            <div className="absolute inset-y-0 right-3 flex items-center">
              {trailing}
            </div>
          )}
        </div>
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
