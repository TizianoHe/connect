import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  href?: string;
}

export function Logo({ className, href = "/" }: LogoProps) {
  return (
    <Link href={href} className={cn("inline-flex items-center", className)}>
      <Image
        src="/spotted-logo.png"
        alt="Spotted"
        height={56}
        width={259}
        className="h-14 w-auto"
        priority
      />
    </Link>
  );
}
