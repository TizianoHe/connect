import { cn } from "@/lib/utils";
import { forwardRef, TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
  hint?: string;
  characterCount?: number;
  maxCharacters?: number;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { className, error, label, hint, id, characterCount, maxCharacters, ...props },
    ref
  ) => {
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
        <textarea
          ref={ref}
          id={id}
          className={cn(
            "w-full rounded-xl border px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 bg-white transition-colors resize-none",
            "focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent",
            error
              ? "border-red-400 focus:ring-red-500"
              : "border-neutral-200 hover:border-neutral-300",
            className
          )}
          {...props}
        />
        <div className="flex justify-between items-center">
          <div>
            {hint && !error && (
              <p className="text-xs text-neutral-500">{hint}</p>
            )}
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
          {maxCharacters !== undefined && characterCount !== undefined && (
            <p
              className={cn(
                "text-xs",
                characterCount > maxCharacters
                  ? "text-red-500"
                  : "text-neutral-400"
              )}
            >
              {characterCount}/{maxCharacters}
            </p>
          )}
        </div>
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
