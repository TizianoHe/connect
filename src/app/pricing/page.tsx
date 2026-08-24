import { ContentPage, type ContentSection } from "@/components/shared/ContentPage";

export const metadata = {
  title: "Preise — Spotted",
  description:
    "Die Aufnahme bei Spotted ist während der Aufbauphase kostenlos. Keine Provisionen, keine bezahlten Platzierungen.",
};

const SECTIONS: ContentSection[] = [
  {
    heading: "Kostenlos während der Aufbauphase",
    paragraphs: [
      "Spotted befindet sich im Aufbau, und die Aufnahme eines Unternehmens ist vollständig kostenlos. Keine Gebühren, keine Provisionen und keine bezahlten Platzierungen, die andere Unternehmen nach hinten schieben.",
    ],
  },
  {
    heading: "Was später dazukommen kann",
    paragraphs: [
      "Zu einem späteren Zeitpunkt kann Spotted optionale Abonnements für Unternehmen einführen, die zusätzliche Funktionen möchten. Preise werden frühzeitig kommuniziert, und Änderungen werden allen bestehenden Nutzerinnen und Nutzern angekündigt, bevor sie in Kraft treten.",
      "Kostenpflichtige Leistungen setzen immer eine ausdrückliche Zustimmung voraus. Niemand wird automatisch in ein Abonnement überführt.",
    ],
  },
  {
    heading: "Was immer kostenlos bleibt",
    paragraphs: [
      "Das Durchsuchen von Spotted bleibt für Kundinnen und Kunden dauerhaft kostenlos. Es wird keine versteckten Gebühren geben, keine Bezahlschranken und kein System, bei dem man für den Kontakt zu einem Unternehmen bezahlen muss.",
    ],
  },
];

export default function PricingPage() {
  return (
    <ContentPage
      title="Preise"
      intro="Kurz gesagt: Die Aufnahme kostet derzeit nichts, und Suchen kostet nie etwas."
      sections={SECTIONS}
    />
  );
}
