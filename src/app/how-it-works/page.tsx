import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/shared/Footer";
import { SiteHeader } from "@/components/shared/SiteHeader";

export const metadata = {
  title: "So funktioniert es — Spotted",
  description:
    "Vom Profil über die persönliche Prüfung bis zur direkten Anfrage — wie Spotted für Unternehmen und für Suchende funktioniert.",
};

/**
 * The numbering here is load-bearing: both columns describe an actual sequence
 * a person moves through, so the order carries information. It is not
 * decoration.
 */
const FOR_BUSINESSES = [
  {
    title: "Profil erstellen",
    body: "Kostenlos registrieren und zeigen, was Sie tun, für wen und wie Sie arbeiten. Keine Vorlagen, kein Marketingsprech — eine klare Darstellung Ihrer Arbeit.",
  },
  {
    title: "Persönliche Prüfung",
    body: "Wir schauen uns jedes eingereichte Profil an, bevor es online geht. Geprüft wird auf Klarheit und Substanz, nicht auf Hochglanz.",
  },
  {
    title: "Direkte Anfragen erhalten",
    body: "Wer mit Ihnen arbeiten will, meldet sich direkt bei Ihnen. Kein Zwischenhändler, keine Provision, kein Algorithmus, der entscheidet, wer gesehen wird.",
  },
];

const FOR_CLIENTS = [
  {
    title: "Auswahl durchsuchen",
    body: "Nach Kategorie, Ort oder Stichwort suchen und Schweizer Unternehmen in Ihrer Nähe entdecken.",
  },
  {
    title: "Echte Profile lesen",
    body: "Jedes Profil zeigt, was ein Unternehmen tut, worin es besonders gut ist und wie es arbeitet — damit Sie einschätzen können, ob es passt.",
  },
  {
    title: "Direkt Kontakt aufnehmen",
    body: "Sie schreiben dem Unternehmen direkt aus dem Profil heraus. Keine Gebote, keine Auktionen, keine Plattformgebühren.",
  },
];

function StepList({ steps }: { steps: { title: string; body: string }[] }) {
  return (
    <ol className="flex flex-col gap-7">
      {steps.map(({ title, body }, i) => (
        <li key={title} className="grid grid-cols-[1.75rem_1fr] gap-x-3">
          <span className="text-sm text-accent tabular-nums pt-0.5">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div>
            <p className="text-lg text-neutral-900 mb-1">{title}</p>
            <p className="text-sm text-neutral-600 leading-relaxed">{body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <SiteHeader />

      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-accent transition-colors mb-10 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Zurück zur Startseite
        </Link>

        <h1 className="text-4xl text-neutral-900 tracking-tight mb-4">
          So funktioniert es
        </h1>
        <p className="text-lg text-neutral-600 leading-relaxed mb-14 max-w-2xl">
          Zwei Seiten, ein Ablauf: Unternehmen stellen sich vor und werden
          geprüft, Suchende finden sie und melden sich direkt.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-16">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400 mb-7">
              Für Unternehmen
            </h2>
            <StepList steps={FOR_BUSINESSES} />
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400 mb-7">
              Für Suchende
            </h2>
            <StepList steps={FOR_CLIENTS} />
          </div>
        </div>

        {/*
          This block used to restate the three steps above it and close on "the
          goal is a list you can trust", which is a slogan rather than
          information. Naming what gets turned away is the only thing on this
          page a reader cannot guess, and it is what makes the curation claim
          checkable instead of asserted.
        */}
        <div className="mt-16 pt-10 border-t border-neutral-200 max-w-2xl">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">
            Was nicht aufgenommen wird
          </h2>
          <p className="text-neutral-600 leading-relaxed">
            Profile, die aus Schlagworten bestehen und nach dem Lesen nicht
            klarer sind als vorher. Unternehmen, die auf eine Anfrage nicht
            reagieren. Angaben, die sich nicht überprüfen lassen. Und alle, die
            fragen, was ein besserer Platz kostet.
          </p>
          <p className="text-neutral-600 leading-relaxed mt-4">
            Eine Auswahl ist genau so viel wert wie das, was nicht drinsteht.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
