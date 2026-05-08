import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  href?: string;
  size?: string;
}

export function Logo({ className, href = "/", size = "h-12" }: LogoProps) {
  return (
    <Link href={href} className={cn("inline-flex items-center", className)}>
      <Image
        src="/spotted-logo.png"
        alt="Spotted"
        height={48}
        width={222}
        className={cn(size, "w-auto")}
        priority
      />
    </Link>
  );
}
