import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/shared/Footer";
import { SiteHeader } from "@/components/shared/SiteHeader";

export const metadata = {
  title: "So funktioniert es",
  description:
    "Vom Profil über die Prüfung bis zur direkten Anfrage: wie Spotted für Unternehmen und für Suchende funktioniert.",
};

/**
 * The numbering here is load-bearing: both columns describe an actual sequence
 * a person moves through, so the order carries information. It is not
 * decoration.
 */
const FOR_BUSINESSES = [
  {
    title: "Profil erstellen",
    body: "Registrieren und eintragen, was Sie anbieten, für wen und wie man Sie erreicht. Solange wir aufbauen, kostet das nichts.",
  },
  {
    title: "Wir prüfen das Profil",
    body: "Jedes eingereichte Profil wird geprüft, bevor es online geht. Wir schauen, ob verständlich ist, was Sie anbieten, und ob die Angaben stimmen können.",
  },
  {
    title: "Direkte Anfragen erhalten",
    body: "Anfragen kommen direkt bei Ihnen an, nicht bei uns. Wir nehmen keine Provision auf Ihre Aufträge.",
  },
];

const FOR_CLIENTS = [
  {
    title: "Auswahl durchsuchen",
    body: "Nach Kategorie, Ort oder Stichwort suchen und Schweizer Unternehmen in Ihrer Nähe entdecken.",
  },
  {
    title: "Echte Profile lesen",
    body: "Jedes Profil zeigt, was ein Unternehmen anbietet und wie es arbeitet, damit Sie einschätzen können, ob es passt.",
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
          Unternehmen tragen sich ein, wir prüfen das Profil, danach ist es
          online und Anfragen kommen direkt an.
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
          Naming concretely what the check covers is the one thing on this page
          a reader cannot guess, and it is what makes "geprüft" mean something
          rather than being a label.
        */}
        <div className="mt-16 pt-10 border-t border-neutral-200 max-w-2xl">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">
            Was wir prüfen
          </h2>
          <p className="text-neutral-600 leading-relaxed">
            Ob aus dem Profil hervorgeht, was das Unternehmen tatsächlich
            anbietet. Ob Firmenname, Ort und Kontaktangaben zusammenpassen und
            erreichbar sind. Ob die Angaben plausibel sind.
          </p>
          <p className="text-neutral-600 leading-relaxed mt-4">
            Die Qualität der Arbeit bewerten wir nicht, das können wir nicht.
            Wir sorgen dafür, dass hier keine leeren oder irreführenden Einträge
            stehen.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
