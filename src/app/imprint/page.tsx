import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";
import { OPERATOR } from "@/lib/legal";

export const metadata = {
  title: "Impressum",
  description:
    "Angaben zum Betreiber von Spotted gemäss Art. 3 Abs. 1 lit. s UWG.",
};

export default function ImprintPage() {
  return (
    <LegalPage
      title="Impressum"
      intro="Angaben zum Betreiber dieser Website gemäss Art. 3 Abs. 1 lit. s des Bundesgesetzes gegen den unlauteren Wettbewerb (UWG)."
    >
      <LegalSection heading="Verantwortlich für den Inhalt">
        <address className="not-italic">
          <span className="block font-medium text-neutral-900">
            {OPERATOR.legalName}
          </span>
          {OPERATOR.legalForm && <span className="block">{OPERATOR.legalForm}</span>}
          <span className="block">{OPERATOR.street}</span>
          <span className="block">
            {OPERATOR.postalCode} {OPERATOR.city}
          </span>
          <span className="block">{OPERATOR.country}</span>
        </address>
      </LegalSection>

      <LegalSection heading="Kontakt">
        <p>
          E-Mail:{" "}
          <a
            href={`mailto:${OPERATOR.email}`}
            className="text-neutral-900 underline underline-offset-2 hover:no-underline"
          >
            {OPERATOR.email}
          </a>
        </p>
        {OPERATOR.phone && <p>Telefon: {OPERATOR.phone}</p>}
        <p>
          Für Anfragen steht auch das{" "}
          <Link
            href="/contact"
            className="text-neutral-900 underline underline-offset-2 hover:no-underline"
          >
            Kontaktformular
          </Link>{" "}
          zur Verfügung.
        </p>
      </LegalSection>

      {OPERATOR.uid && (
        <LegalSection heading="Handelsregister">
          <p>Unternehmens-Identifikationsnummer (UID): {OPERATOR.uid}</p>
        </LegalSection>
      )}

      <LegalSection heading="Haftungsausschluss">
        <p>
          Die Inhalte dieser Website werden mit Sorgfalt erstellt. Für die
          Richtigkeit, Vollständigkeit und Aktualität der Angaben zu den
          aufgeführten Unternehmen wird keine Gewähr übernommen. Die Angaben zu
          einem Unternehmen stammen vom jeweiligen Unternehmen selbst.
        </p>
        <p>
          Spotted prüft aufgenommene Unternehmen vor der Veröffentlichung
          redaktionell. Diese Prüfung ist keine Zusicherung bestimmter
          Eigenschaften und begründet kein Vertragsverhältnis zwischen Spotted
          und den Nutzerinnen und Nutzern dieser Website.
        </p>
      </LegalSection>

      <LegalSection heading="Haftung für Links">
        <p>
          Diese Website enthält Links zu Websites Dritter. Für deren Inhalte ist
          ausschliesslich der jeweilige Anbieter verantwortlich. Zum Zeitpunkt
          der Verlinkung waren keine Rechtsverstösse erkennbar.
        </p>
      </LegalSection>

      <LegalSection heading="Urheberrecht">
        <p>
          Die auf dieser Website veröffentlichten Inhalte, Texte und
          Illustrationen sind urheberrechtlich geschützt. Jede Verwendung
          ausserhalb der Grenzen des Urheberrechts bedarf der vorherigen
          schriftlichen Zustimmung.
        </p>
      </LegalSection>

      <LegalSection heading="Datenschutz">
        <p>
          Informationen zur Bearbeitung von Personendaten finden Sie in der{" "}
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
