import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";
import { OPERATOR } from "@/lib/legal";

export const metadata = {
  title: "Nutzungsbedingungen",
  description:
    "Bedingungen für die Nutzung von Spotted und für die Aufnahme eines Unternehmens.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Nutzungsbedingungen"
      intro="Diese Bedingungen regeln die Nutzung von Spotted sowie die Aufnahme und Darstellung von Unternehmen auf der Plattform."
    >
      <LegalSection heading="1. Geltungsbereich">
        <p>
          Betreiberin der Plattform ist {OPERATOR.legalName}. Diese Bedingungen
          gelten für alle Besucherinnen und Besucher der Website sowie für
          Unternehmen, die ein Profil erstellen. Mit der Registrierung
          akzeptieren Sie diese Bedingungen.
        </p>
      </LegalSection>

      <LegalSection heading="2. Was Spotted ist und was nicht">
        <p>
          Spotted ist ein Verzeichnis von Unternehmen mit geprüften Profilen.
          Wir prüfen jedes eingereichte Profil, bevor es veröffentlicht wird.
          Diese Prüfung betrifft Vollständigkeit, Verständlichkeit und
          Plausibilität der Angaben.
        </p>
        <p>
          Spotted vermittelt keine Verträge und wird nicht Partei von
          Vereinbarungen zwischen Nutzerinnen, Nutzern und aufgeführten
          Unternehmen. Die Aufnahme ist keine Zusicherung von Qualität,
          Verfügbarkeit oder Eignung für einen bestimmten Zweck.
        </p>
      </LegalSection>

      <LegalSection heading="3. Benutzerkonto">
        <p>
          Für die Erstellung eines Unternehmensprofils ist ein Konto
          erforderlich. Sie sind verpflichtet, wahrheitsgetreue Angaben zu
          machen, Ihre Zugangsdaten vertraulich zu behandeln und uns über eine
          unbefugte Nutzung Ihres Kontos zu informieren.
        </p>
        <p>
          Sie können Ihr Konto jederzeit löschen. Wenden Sie sich dafür an{" "}
          <a
            href={`mailto:${OPERATOR.email}`}
            className="text-neutral-900 underline underline-offset-2 hover:no-underline"
          >
            {OPERATOR.email}
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection heading="4. Inhalte der Unternehmen">
        <p>
          Für die Inhalte eines Unternehmensprofils ist ausschliesslich das
          jeweilige Unternehmen verantwortlich. Sie sichern zu, dass Sie über
          die erforderlichen Rechte an den hochgeladenen Texten, Logos und Fotos
          verfügen und dass die Angaben nicht irreführend sind.
        </p>
        <p>
          Sie räumen uns das nicht ausschliessliche, räumlich unbeschränkte
          Recht ein, diese Inhalte zum Zweck der Darstellung auf Spotted zu
          nutzen. Dieses Recht endet mit der Löschung des Profils.
        </p>
      </LegalSection>

      <LegalSection heading="5. Aufnahme, Ablehnung und Entfernung">
        <p>
          Es besteht kein Anspruch auf Aufnahme. Wir können die
          Veröffentlichung eines Profils ohne Angabe von Gründen ablehnen oder
          ein veröffentlichtes Profil wieder entfernen, insbesondere wenn
          Angaben unrichtig sind, Rechte Dritter verletzt werden oder das
          Unternehmen nicht mehr aktiv ist.
        </p>
      </LegalSection>

      <LegalSection heading="6. Unzulässige Nutzung">
        <p>
          Untersagt sind insbesondere das automatisierte Auslesen von Inhalten,
          das systematische Kopieren der Einträge, Versuche, Sicherheitsmassnahmen
          zu umgehen, sowie jede Nutzung, die den Betrieb der Plattform
          beeinträchtigt.
        </p>
      </LegalSection>

      <LegalSection heading="7. Kosten">
        <p>
          Die Aufnahme eines Unternehmens ist derzeit kostenlos. Sollten künftig
          kostenpflichtige Leistungen eingeführt werden, werden bestehende
          Nutzerinnen und Nutzer vorgängig informiert; kostenpflichtige
          Leistungen setzen eine ausdrückliche Zustimmung voraus.
        </p>
      </LegalSection>

      <LegalSection heading="8. Verfügbarkeit und Haftung">
        <p>
          Wir bemühen uns um einen zuverlässigen Betrieb, schulden aber keine
          bestimmte Verfügbarkeit. Wartungsarbeiten und Störungen können zu
          Unterbrüchen führen.
        </p>
        <p>
          Die Haftung für leichte Fahrlässigkeit ist im gesetzlich zulässigen
          Rahmen ausgeschlossen. Für Schäden aus der Nutzung von Angaben Dritter
          oder aus Verträgen mit aufgeführten Unternehmen wird keine Haftung
          übernommen.
        </p>
      </LegalSection>

      <LegalSection heading="9. Änderungen dieser Bedingungen">
        <p>
          Wir können diese Bedingungen anpassen. Über wesentliche Änderungen
          informieren wir registrierte Nutzerinnen und Nutzer per E-Mail. Die
          fortgesetzte Nutzung nach Inkrafttreten gilt als Zustimmung.
        </p>
      </LegalSection>

      <LegalSection heading="10. Anwendbares Recht und Gerichtsstand">
        <p>
          Es gilt ausschliesslich schweizerisches Recht unter Ausschluss der
          Kollisionsnormen und des UN-Kaufrechts. Gerichtsstand ist{" "}
          {OPERATOR.city}, Schweiz, soweit nicht zwingende gesetzliche
          Bestimmungen einen anderen Gerichtsstand vorsehen.
        </p>
        <p>
          Angaben zum Betreiber finden Sie im{" "}
          <Link
            href="/imprint"
            className="text-neutral-900 underline underline-offset-2 hover:no-underline"
          >
            Impressum
          </Link>
          , Informationen zur Datenbearbeitung in der{" "}
          <Link
            href="/privacy"
            className="text-neutral-900 underline underline-offset-2 hover:no-underline"
          >
            Datenschutzerklärung
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
