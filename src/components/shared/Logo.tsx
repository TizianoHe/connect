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
      className={cn("inline-flex items-center gap-2 font-semibold text-neutral-900", className)}
    >
      <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center">
        <span className="text-white text-sm font-bold">C</span>
      </div>
      <span className="text-lg tracking-tight">connect</span>
    </Link>
  );
}
