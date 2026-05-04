import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "muted" | "success";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full",
        {
          "bg-neutral-900 text-white": variant === "default",
          "bg-neutral-100 text-neutral-600": variant === "muted",
          "bg-emerald-100 text-emerald-700": variant === "success",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
