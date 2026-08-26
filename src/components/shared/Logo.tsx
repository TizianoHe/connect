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
      {/*
        Intrinsic size matches the file exactly. The source used to carry ~47 px
        of white padding on each side, so the wordmark rendered about 10 px
        right of its own box and never lined up with the text below it. The file
        is now cropped to the glyphs; these numbers must be updated with it.
      */}
      <Image
        src="/spotted-logo.png"
        alt="Spotted"
        height={205}
        width={947}
        className={cn(size, "w-auto")}
        priority
      />
    </Link>
  );
}
