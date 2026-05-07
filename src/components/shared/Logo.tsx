import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  href?: string;
}

export function Logo({ className, href = "/" }: LogoProps) {
  return (
    <Link
      href={href}
      className={cn("inline-flex items-center gap-1.5 font-semibold text-neutral-900", className)}
    >
      <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true" focusable="false">
        <circle cx="4" cy="4" r="4" fill="currentColor" />
      </svg>
      <span className="text-lg tracking-tight">spotted</span>
    </Link>
  );
}
