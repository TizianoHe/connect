import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/shared/Footer";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { LEGAL_DETAILS_COMPLETE, OPERATOR } from "@/lib/legal";

interface LegalPageProps {
  title: string;
  /** Short lead paragraph shown under the title. */
  intro?: string;
  children: React.ReactNode;
}

/**
 * Shared shell for /imprint, /privacy and /terms.
 *
 * Renders a visible draft warning while `src/lib/legal.ts` still contains TODO
 * placeholders, so an incomplete Impressum cannot ship unnoticed.
 */
export function LegalPage({ title, intro, children }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <SiteHeader />

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors mb-10 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Zurück zur Startseite
        </Link>

        {!LEGAL_DETAILS_COMPLETE && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-10">
            <p className="text-sm font-semibold text-amber-800 mb-1">
              Entwurf, noch nicht startbereit
            </p>
            <p className="text-sm text-amber-700">
              Die Betreiberangaben in <code className="font-mono text-xs">src/lib/legal.ts</code>{" "}
              enthalten noch Platzhalter. Diese Warnung verschwindet automatisch,
              sobald alle Felder ausgefüllt sind.
            </p>
          </div>
        )}

        {/* German compound nouns like "Datenschutzerklärung" are wider than a
            320px content column at text-3xl and force the whole page to scroll
            sideways. Hyphenate and allow a hard break as a last resort. */}
        <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-900 mb-4 tracking-tight hyphens-auto break-words">
          {title}
        </h1>

        {intro && (
          <p className="text-neutral-500 leading-relaxed mb-12">{intro}</p>
        )}

        <div className="flex flex-col gap-10">{children}</div>

        <p className="text-xs text-neutral-400 mt-16 pt-8 border-t border-neutral-100">
          Stand: {OPERATOR.lastUpdated}
        </p>
      </main>

      <Footer />
    </div>
  );
}

/** A titled section within a legal page. */
export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-neutral-900 mb-3">{heading}</h2>
      <div className="flex flex-col gap-3 text-[15px] text-neutral-600 leading-relaxed">
        {children}
      </div>
    </section>
  );
}
