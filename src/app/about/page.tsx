import { ContentPage, type ContentSection } from "@/components/shared/ContentPage";

export const metadata = {
  title: "Über Spotted",
  description:
    "Warum es Spotted gibt: eine kuratierte Auswahl Schweizer KMU statt eines weiteren Verzeichnisses.",
};

const SECTIONS: ContentSection[] = [
  {
    heading: "Was sich verändert hat",
    paragraphs: [
      "Ein gutes lokales Unternehmen online zu finden ist schwieriger geworden, nicht einfacher. Sichtbarkeit im Netz wird heute weitgehend gekauft oder für Algorithmen optimiert. Alles sieht gleich aus.",
      "Die Folge: Die Druckerei in Familienbesitz, die Treuhänderin um die Ecke, der Fotograf zwei Strassen weiter verschwinden hinter Unternehmen, die das System einfach besser bespielen. Wenn Sichtbarkeit Optimierung stärker belohnt als Vertrauen, werden gute Unternehmen unauffindbar.",
    ],
  },
  {
    heading: "Was Spotted ist",
    paragraphs: [
      "Spotted ist eine kuratierte Auswahl von Schweizer KMU. Unternehmen zeigen hier, wer sie sind, was sie tun und wie man sie erreicht. Kundinnen und Kunden suchen nach Kategorie und Ort und nehmen direkt Kontakt auf.",
      "Spotted ist keine Werbeplattform, kein Marktplatz und kein System, das auf bezahlter Reichweite aufbaut. Es ist ein Ort, an dem sich Unternehmen einmal richtig vorstellen — mit ihren eigenen Worten.",
      "Jedes Profil wird vor der Veröffentlichung geprüft. Auf Klarheit und Substanz, nicht auf Marketingpolitur.",
    ],
  },
  {
    heading: "Woran wir glauben",
    paragraphs: [
      "Digitale Sichtbarkeit sollte die Qualität eines Unternehmens abbilden, nicht die Qualität seines Marketings. Ein gutes lokales Unternehmen sollte gefunden werden wegen seiner Arbeit, seines Rufs und des Vertrauens, das es schafft — nicht weil es am meisten Inhalte produziert oder am meisten für Anzeigen ausgibt.",
      "Und wir glauben, dass die Erschöpfung wächst: zu viele Optionen, zu viele geschliffene Empfehlungen, die sich alle gleich anfühlen. Die meisten Menschen suchen keine weitere Liste. Sie suchen Orientierung und Unternehmen, denen sie tatsächlich vertrauen können.",
    ],
  },
  {
    heading: "Wo wir stehen",
    paragraphs: [
      "Spotted startet in St. Gallen und befindet sich im Aufbau. In dieser Phase ist die Aufnahme kostenlos, während die Plattform gemeinsam mit den Unternehmen wächst, die sie nutzen.",
      "Gemacht von jemandem, der überzeugt ist, dass Schweizer KMU eine glaubwürdigere und menschlichere Art verdienen, entdeckt zu werden.",
    ],
  },
];

export default function AboutPage() {
  return (
    <ContentPage
      title="Über Spotted"
      intro="Unternehmen, die man kennen sollte — und warum es dafür etwas anderes braucht als ein Verzeichnis."
      sections={SECTIONS}
    />
  );
}
