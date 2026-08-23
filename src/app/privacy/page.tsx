import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";
import { OPERATOR, PROCESSORS } from "@/lib/legal";

export const metadata = {
  title: "Datenschutzerklärung — Spotted",
  description:
    "Wie Spotted Personendaten bearbeitet — nach schweizerischem Datenschutzgesetz (DSG).",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Datenschutzerklärung"
      intro="Diese Erklärung beschreibt, welche Personendaten Spotted bearbeitet, zu welchem Zweck und welche Rechte Ihnen zustehen. Sie richtet sich nach dem revidierten Schweizer Datenschutzgesetz (DSG) und, soweit anwendbar, nach der europäischen Datenschutz-Grundverordnung (DSGVO)."
    >
      <LegalSection heading="1. Verantwortliche Stelle">
        <address className="not-italic">
          <span className="block font-medium text-neutral-900">
            {OPERATOR.legalName}
          </span>
          <span className="block">{OPERATOR.street}</span>
          <span className="block">
            {OPERATOR.postalCode} {OPERATOR.city}
          </span>
          <span className="block">{OPERATOR.country}</span>
        </address>
        <p>
          E-Mail:{" "}
          <a
            href={`mailto:${OPERATOR.email}`}
            className="text-neutral-900 underline underline-offset-2 hover:no-underline"
          >
            {OPERATOR.email}
          </a>
        </p>
        <p>
          Es besteht keine gesetzliche Pflicht zur Bezeichnung einer
          Datenschutzberaterin oder eines Datenschutzberaters. Anfragen richten
          Sie bitte an die oben genannte Adresse.
        </p>
      </LegalSection>

      <LegalSection heading="2. Welche Daten wir bearbeiten">
        <p>
          <span className="font-medium text-neutral-900">Benutzerkonto.</span>{" "}
          Bei der Registrierung erfassen wir Ihre E-Mail-Adresse und ein
          Passwort. Das Passwort wird ausschliesslich als kryptografischer
          Hash gespeichert und ist für uns nicht lesbar.
        </p>
        <p>
          <span className="font-medium text-neutral-900">Unternehmensprofil.</span>{" "}
          Wenn Sie ein Unternehmen eintragen, bearbeiten wir die von Ihnen
          erfassten Angaben: Firmenname, Kurzbeschreibung, ausführliche
          Beschreibung, Positionierung, Zielgruppe, Arbeitsweise, Teamgrösse,
          Website, öffentliche E-Mail-Adresse, Telefonnummer, Ort und Land,
          Dienstleistungen samt Preisangaben sowie Logo und Fotos.
        </p>
        <p>
          <span className="font-medium text-neutral-900">Kontaktformular.</span>{" "}
          Über das Kontaktformular übermittelte Angaben — Name, E-Mail-Adresse,
          Rolle, Betreff und Nachricht — werden zur Bearbeitung Ihrer Anfrage
          gespeichert.
        </p>
        <p>
          <span className="font-medium text-neutral-900">Technische Daten.</span>{" "}
          Beim Aufruf der Website fallen serverseitige Protokolldaten an:
          IP-Adresse, Zeitpunkt des Zugriffs, aufgerufene Seite, übermittelte
          Datenmenge, Browsertyp und Betriebssystem. Diese Daten werden zur
          Sicherstellung des Betriebs und zur Abwehr von Missbrauch bearbeitet.
        </p>
      </LegalSection>

      <LegalSection heading="3. Zweck und Rechtsgrundlage">
        <p>
          Wir bearbeiten Personendaten, um Benutzerkonten zu führen,
          Unternehmensprofile redaktionell zu prüfen und zu veröffentlichen,
          Anfragen zu beantworten, die Website sicher zu betreiben und
          gesetzliche Pflichten zu erfüllen.
        </p>
        <p>
          Die Bearbeitung stützt sich auf die Erfüllung des
          Nutzungsverhältnisses, auf Ihre Einwilligung, soweit Sie Daten
          freiwillig zur Veröffentlichung bereitstellen, sowie auf unser
          überwiegendes berechtigtes Interesse am sicheren und funktionsfähigen
          Betrieb der Plattform.
        </p>
        <p>
          Angaben in einem Unternehmensprofil sind nach der Freigabe öffentlich
          abrufbar. Erfassen Sie dort nur Informationen, die Sie öffentlich
          zeigen möchten.
        </p>
      </LegalSection>

      <LegalSection heading="4. Bekanntgabe an Dritte">
        <p>
          Wir verkaufen keine Personendaten. Zur Erbringung unserer Leistungen
          setzen wir folgende Auftragsbearbeiter ein, die vertraglich zur
          Vertraulichkeit und zur Einhaltung des Datenschutzrechts verpflichtet
          sind:
        </p>
        <ul className="flex flex-col gap-3 mt-1">
          {PROCESSORS.map((p) => (
            <li
              key={p.name}
              className="border-l-2 border-neutral-200 pl-4 py-0.5"
            >
              <span className="block font-medium text-neutral-900">{p.name}</span>
              <span className="block">{p.purpose}</span>
              <span className="block text-neutral-400 text-sm mt-0.5">
                Standort: {p.location}
              </span>
            </li>
          ))}
        </ul>
      </LegalSection>

      <LegalSection heading="5. Bekanntgabe ins Ausland">
        <p>
          Einzelne der oben genannten Dienstleister bearbeiten Daten ausserhalb
          der Schweiz, namentlich in den Vereinigten Staaten. Die Bekanntgabe
          erfolgt gestützt auf Standardvertragsklauseln beziehungsweise auf die
          Teilnahme des Anbieters am Swiss–U.S. Data Privacy Framework. Trotz
          dieser Massnahmen kann ein dem schweizerischen Recht gleichwertiger
          Schutz im Ausland nicht in jedem Fall garantiert werden.
        </p>
      </LegalSection>

      <LegalSection heading="6. Cookies und Tracking">
        <p>
          Spotted setzt ausschliesslich technisch notwendige Cookies ein. Diese
          dienen dazu, Ihre Anmeldung während einer Sitzung aufrechtzuerhalten.
          Ohne sie funktioniert der geschützte Bereich nicht.
        </p>
        <p>
          Wir verwenden keine Analyse-, Werbe- oder Tracking-Dienste und binden
          keine Inhalte Dritter ein, die Ihr Verhalten über Websites hinweg
          verfolgen. Schriften werden lokal von unserem Server ausgeliefert; es
          erfolgt dadurch keine Verbindung zu externen Schriftanbietern.
        </p>
      </LegalSection>

      <LegalSection heading="7. Aufbewahrung">
        <p>
          Kontodaten und Profilangaben bewahren wir auf, solange Ihr Konto
          besteht. Nach einer Löschung des Kontos werden die zugehörigen Daten
          entfernt, soweit keine gesetzlichen Aufbewahrungspflichten
          entgegenstehen. Anfragen über das Kontaktformular löschen wir, sobald
          sie abschliessend bearbeitet sind. Serverprotokolle werden nach kurzer
          Zeit automatisch überschrieben.
        </p>
      </LegalSection>

      <LegalSection heading="8. Datensicherheit">
        <p>
          Die Website wird ausschliesslich verschlüsselt über HTTPS
          ausgeliefert. Der Zugriff auf Daten in der Datenbank ist durch
          zeilenbasierte Zugriffsregeln beschränkt, sodass Nutzerinnen und
          Nutzer nur auf die sie betreffenden Datensätze zugreifen können.
          Passwörter werden nur als Hash gespeichert.
        </p>
      </LegalSection>

      <LegalSection heading="9. Ihre Rechte">
        <p>
          Sie haben im Rahmen des anwendbaren Rechts das Recht auf Auskunft über
          die von uns bearbeiteten Personendaten, auf Berichtigung unrichtiger
          Daten, auf Löschung, auf Einschränkung der Bearbeitung, auf
          Herausgabe oder Übertragung Ihrer Daten sowie das Recht, eine
          Einwilligung jederzeit zu widerrufen.
        </p>
        <p>
          Wenden Sie sich dafür an{" "}
          <a
            href={`mailto:${OPERATOR.email}`}
            className="text-neutral-900 underline underline-offset-2 hover:no-underline"
          >
            {OPERATOR.email}
          </a>
          . Zur Wahrung Ihrer Sicherheit können wir einen Identitätsnachweis
          verlangen.
        </p>
        <p>
          Ihnen steht zudem das Recht zu, sich beim Eidgenössischen
          Datenschutz- und Öffentlichkeitsbeauftragten (EDÖB) zu beschweren.
        </p>
      </LegalSection>

      <LegalSection heading="10. Änderungen">
        <p>
          Wir können diese Datenschutzerklärung jederzeit anpassen. Massgebend
          ist die jeweils auf dieser Seite veröffentlichte Fassung. Die Angaben
          zum Betreiber finden Sie im{" "}
          <Link
            href="/imprint"
            className="text-neutral-900 underline underline-offset-2 hover:no-underline"
          >
            Impressum
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
