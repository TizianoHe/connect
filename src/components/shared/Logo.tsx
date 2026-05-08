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
        height={30}
        width={45}
        priority
      />
    </Link>
  );
}
