import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SiteHeaderProps {
  /** Pass true when a session exists, to show the dashboard link instead. */
  signedIn?: boolean;
  /** Tailwind max-width class for the inner row, to match the page below it. */
  width?: string;
  className?: string;
}

/**
 * The public site header.
 *
 * Previously this markup was copy-pasted into every public page, which is why
 * the English labels survived in some places long after others were
 * translated. One component, one place to change.
 *
 * On narrow screens the sign-in link is dropped and the primary action takes a
 * shorter label — "Unternehmen vorstellen" is wide enough to wrap onto two
 * lines on a phone and crush the row, which it did before.
 */
export function SiteHeader({
  signedIn = false,
  width = "max-w-6xl",
  className,
}: SiteHeaderProps) {
  return (
    <header className={cn("border-b border-neutral-100 bg-white", className)}>
      <div
        className={cn(
          "mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3",
          width
        )}
      >
        <Logo />
        {signedIn ? (
          <Link href="/dashboard">
            <Button variant="secondary" size="sm">
              Dashboard
            </Button>
          </Link>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/login" className="hidden sm:block">
              <Button variant="ghost" size="sm">
                Anmelden
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="whitespace-nowrap">
                <span className="sm:hidden">Vorstellen</span>
                <span className="hidden sm:inline">Unternehmen vorstellen</span>
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
