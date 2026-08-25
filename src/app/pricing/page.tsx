import { ContentPage, type ContentSection } from "@/components/shared/ContentPage";

export const metadata = {
  title: "Preise",
  description:
    "Solange Spotted aufgebaut wird, ist die Aufnahme kostenlos. Suchen ist immer kostenlos.",
};

/**
 * "Womit Spotted Geld verdient" comes before the free-tier details on purpose.
 * A free platform with no visible business model makes a careful business owner
 * suspicious, and those are exactly the people this page has to convince.
 *
 * Deliberately no promise that early businesses stay free forever. That would
 * be unretractable once published, and the pricing model is not decided yet.
 */
const SECTIONS: ContentSection[] = [
  {
    heading: "Womit Spotted Geld verdient",
    paragraphs: [
      "Im Moment gar nichts. Spotted ist ein Projekt neben dem Studium, und die laufenden Kosten sind gering.",
      "Später wird es einen Abo-Plan geben. Bevor sich etwas ändert, steht es hier auf dieser Seite, und niemand wird automatisch in ein Abonnement überführt.",
      "Für bessere Platzierungen wird es nie ein Angebot geben. Wer hier weiter oben steht, hat nicht dafür bezahlt.",
    ],
  },
  {
    heading: "Kostenlos während der Aufbauphase",
    paragraphs: [
      "Solange Spotted aufgebaut wird, kostet die Aufnahme nichts. Keine Gebühren, keine Provisionen, keine bezahlten Platzierungen.",
      "Wer früh dabei ist, wenn hier noch wenig los ist, soll dafür nicht auch noch zahlen.",
    ],
  },
  {
    heading: "Für Suchende immer kostenlos",
    paragraphs: [
      "Spotted zu durchsuchen und ein Unternehmen zu kontaktieren bleibt dauerhaft kostenlos. Es wird keine versteckten Gebühren geben, keine Bezahlschranken und kein System, bei dem man für den Kontakt zu einem Unternehmen bezahlen muss.",
    ],
  },
];

export default function PricingPage() {
  return (
    <ContentPage
      title="Preise"
      intro="Solange wir aufbauen, kostet die Aufnahme nichts. Suchen kostet nie etwas."
      sections={SECTIONS}
    />
  );
}
