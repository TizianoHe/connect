import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/shared/Footer";
import { SiteHeader } from "@/components/shared/SiteHeader";

export interface ContentSection {
  heading: string;
  paragraphs: string[];
}

interface ContentPageProps {
  title: string;
  /** Lead paragraph under the title. */
  intro?: string;
  sections: ContentSection[];
  /** Optional block rendered after the sections — a CTA, a table, a form. */
  children?: React.ReactNode;
}

/**
 * Shell for the editorial pages: Über Spotted, Preise, So funktioniert es.
 *
 * These three used to carry their own copy of the header, back-link and
 * footer. That duplication is exactly why some pages kept English labels long
 * after others were translated — the copy lived in four places, so it only ever
 * got fixed in one.
 */
export function ContentPage({ title, intro, sections, children }: ContentPageProps) {
  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <SiteHeader />

      <main className="flex-1 w-full max-w-2xl mx-auto px-6 py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-accent transition-colors mb-10 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Zurück zur Startseite
        </Link>

        <h1 className="text-4xl text-neutral-900 tracking-tight mb-4">{title}</h1>

        {intro && (
          <p className="text-lg text-neutral-600 leading-relaxed mb-14">{intro}</p>
        )}

        <div className="flex flex-col gap-12">
          {sections.map(({ heading, paragraphs }) => (
            <section key={heading}>
              <h2 className="text-2xl text-neutral-900 mb-4">{heading}</h2>
              <div className="flex flex-col gap-4">
                {paragraphs.map((text) => (
                  <p
                    key={text.slice(0, 40)}
                    className="text-neutral-600 leading-relaxed"
                  >
                    {text}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {children}
      </main>

      <Footer />
    </div>
  );
}
