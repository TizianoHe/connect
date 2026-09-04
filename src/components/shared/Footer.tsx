import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { SHELL_PADDING, SHELL_WIDTH } from "@/lib/layout";
import { cn } from "@/lib/utils";

interface FooterProps {
  /**
   * Must match the width the page above it uses, otherwise the footer starts
   * at a different left edge than the content. /browse passes max-w-7xl.
   */
  width?: string;
}

export function Footer({ width = SHELL_WIDTH }: FooterProps) {
  return (
    <footer className="bg-white border-t border-neutral-100 font-sans">
      <div className={cn("mx-auto py-16", width, SHELL_PADDING)}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">

          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Logo size="h-14" />
            <p className="text-sm text-neutral-600 leading-relaxed">
              Schweizer KMU finden. Jedes Profil wird geprüft, bevor es online
              geht.
            </p>
            <p className="text-xs text-neutral-500">Gemacht in St. Gallen</p>
          </div>

          {/* Entdecken */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500 mb-4">Entdecken</p>
            <ul className="flex flex-col gap-0">
              <li>
                <Link href="/browse" className="block text-sm text-neutral-500 hover:text-neutral-900 transition-colors py-3">
                  Unternehmen entdecken
                </Link>
              </li>
              <li>
                <Link href="/signup" className="block text-sm text-neutral-500 hover:text-neutral-900 transition-colors py-3">
                  Unternehmen vorstellen
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="block text-sm text-neutral-500 hover:text-neutral-900 transition-colors py-3">
                  So funktioniert es
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="block text-sm text-neutral-500 hover:text-neutral-900 transition-colors py-3">
                  Preise
                </Link>
              </li>
            </ul>
          </div>

          {/* Über uns */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500 mb-4">Über uns</p>
            <ul className="flex flex-col gap-0">
              <li>
                <Link href="/about" className="block text-sm text-neutral-500 hover:text-neutral-900 transition-colors py-3">
                  Über Spotted
                </Link>
              </li>
              <li>
                <Link href="/contact" className="block text-sm text-neutral-500 hover:text-neutral-900 transition-colors py-3">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          {/* Rechtliches */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500 mb-4">Rechtliches</p>
            <ul className="flex flex-col gap-0">
              <li>
                <Link href="/privacy" className="block text-sm text-neutral-500 hover:text-neutral-900 transition-colors py-3">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link href="/terms" className="block text-sm text-neutral-500 hover:text-neutral-900 transition-colors py-3">
                  Nutzungsbedingungen
                </Link>
              </li>
              <li>
                <Link href="/imprint" className="block text-sm text-neutral-500 hover:text-neutral-900 transition-colors py-3">
                  Impressum
                </Link>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom strip */}
      <div className="border-t border-neutral-100">
        <div className={cn("mx-auto py-5", width, SHELL_PADDING)}>
          <p className="text-xs text-neutral-500">
            © {new Date().getFullYear()} Spotted. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  );
}
