import { ContentPage, type ContentSection } from "@/components/shared/ContentPage";

export const metadata = {
  title: "Über uns",
  description:
    "Warum es Spotted gibt: damit auch kleinere Schweizer Unternehmen online gefunden werden.",
};

/**
 * Order matters here. "Was Spotted ist" comes first because a business owner
 * opening this page on a phone wants to know what this is and what it costs,
 * not a market analysis. The analysis follows for anyone who keeps reading.
 */
const SECTIONS: ContentSection[] = [
  {
    heading: "Was Spotted ist",
    paragraphs: [
      "Spotted ist eine Plattform, auf der Schweizer KMU zeigen, wer sie sind, was sie anbieten und wie man sie erreicht. Kundinnen und Kunden suchen nach Kategorie und Ort und nehmen direkt Kontakt auf.",
      "Jedes Profil wird geprüft, bevor es online geht. Wir schauen, ob verständlich ist, was das Unternehmen macht, und ob die Angaben stimmen können. Das ist keine Bewertung der Qualität. Es sorgt dafür, dass hier keine leeren oder irreführenden Einträge stehen.",
      "Spotted ist keine Werbeplattform und kein Marktplatz. Wer hier oben steht, hat nicht dafür bezahlt.",
    ],
  },
  {
    heading: "Wofür wir das machen",
    paragraphs: [
      "Viele kleine Unternehmen bekommen ihre Kundschaft über Mundpropaganda. Das funktioniert gut, hört aber dort auf, wo der Bekanntenkreis aufhört. Online sichtbar zu werden kostet heute Zeit, Geld oder beides.",
      "Spotted soll diesen Unternehmen einen Ort geben, an dem sie gefunden werden, ohne ein Werbebudget zu brauchen. Ein gutes Unternehmen sollte auffindbar sein, weil es gute Arbeit macht, nicht weil es am meisten für Anzeigen ausgibt.",
    ],
  },
  {
    heading: "Was sich verändert hat",
    paragraphs: [
      "Ein gutes lokales Unternehmen online zu finden ist schwieriger geworden, nicht einfacher. Sichtbarkeit wird heute weitgehend gekauft oder für Algorithmen optimiert.",
      "Die Folge: Die Druckerei in Familienbesitz, die Treuhänderin um die Ecke, der Fotograf zwei Strassen weiter verschwinden hinter Unternehmen, die das System besser bespielen. Wenn Sichtbarkeit Optimierung stärker belohnt als Vertrauen, werden gute Unternehmen unauffindbar.",
    ],
  },
  {
    heading: "Wo wir stehen",
    paragraphs: [
      "Spotted startet in St. Gallen und befindet sich im Aufbau. Solange wir aufbauen, ist die Aufnahme kostenlos.",
      "Hinter Spotted steht Tiziano, Student in St. Gallen.",
    ],
  },
];

export default function AboutPage() {
  return (
    <ContentPage
      title="Über Spotted"
      intro="Damit auch kleinere Schweizer Unternehmen online gefunden werden."
      sections={SECTIONS}
    />
  );
}
