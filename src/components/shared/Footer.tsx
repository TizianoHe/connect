import Link from "next/link";
import { Logo } from "@/components/shared/Logo";

export function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-100 font-sans">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">

          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Logo size="h-14" />
            <p className="text-sm text-neutral-600 leading-relaxed">
              Schweizer KMU finden. Jedes Profil wird geprüft, bevor es online
              geht.
            </p>
            <p className="text-xs text-neutral-400">Gemacht in St. Gallen</p>
          </div>

          {/* Entdecken */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400 mb-4">Entdecken</p>
            <ul className="flex flex-col gap-3">
              <li>
                <Link href="/browse" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
                  Unternehmen entdecken
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
                  Unternehmen vorstellen
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
                  So funktioniert es
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
                  Preise
                </Link>
              </li>
            </ul>
          </div>

          {/* Über uns */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400 mb-4">Über uns</p>
            <ul className="flex flex-col gap-3">
              <li>
                <Link href="/about" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
                  Über Spotted
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          {/* Rechtliches */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400 mb-4">Rechtliches</p>
            <ul className="flex flex-col gap-3">
              <li>
                <Link href="/privacy" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
                  Nutzungsbedingungen
                </Link>
              </li>
              <li>
                <Link href="/imprint" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
                  Impressum
                </Link>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom strip */}
      <div className="border-t border-neutral-100">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <p className="text-xs text-neutral-400">
            © {new Date().getFullYear()} Spotted. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  );
}
