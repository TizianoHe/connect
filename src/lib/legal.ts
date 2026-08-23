/**
 * Operator details for the legal pages (Impressum / Datenschutzerklärung).
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * FILL THIS IN BEFORE LAUNCH.
 * ─────────────────────────────────────────────────────────────────────────────
 * Art. 3 Abs. 1 lit. s UWG requires anyone operating a commercial website in
 * Switzerland to disclose their legal name, postal address and an electronic
 * means of contact. An Impressum with placeholder data is a legal defect, not a
 * cosmetic one.
 *
 * Every field below marked TODO must be replaced with real data. While any of
 * them still starts with "TODO", both legal pages render a visible draft
 * warning and `LEGAL_DETAILS_COMPLETE` is false — so the site tells you it is
 * not launch-ready instead of quietly shipping a broken Impressum.
 */

export const OPERATOR = {
  /** Legal name. A sole proprietorship uses the natural person's full name. */
  legalName: "TODO: Vor- und Nachname oder Firma",

  /**
   * Legal form, shown in the Impressum.
   * e.g. "Einzelunternehmen", "GmbH", "Einfache Gesellschaft".
   * Set to null if you are operating as a private individual.
   */
  legalForm: "TODO: Rechtsform" as string | null,

  street: "TODO: Strasse und Hausnummer",
  postalCode: "TODO: PLZ",
  city: "TODO: Ort",
  country: "Schweiz",

  email: "TODO: kontakt@spotted.ch",

  /** Optional. Leave as null if you do not want a public phone number. */
  phone: null as string | null,

  /**
   * Handelsregister / UID number, format "CHE-123.456.789".
   * Leave null if you are not entered in the commercial register — that is
   * normal for a sole proprietorship below CHF 100'000 annual revenue.
   */
  uid: null as string | null,

  /** Shown as "Stand: …" at the bottom of both legal pages. */
  lastUpdated: "TODO: Monat Jahr",
} as const;

/**
 * Third-party processors that receive personal data. Keep this in sync with
 * what the app actually uses — an incomplete list is the most common defect in
 * a Datenschutzerklärung.
 */
export const PROCESSORS = [
  {
    name: "Supabase",
    purpose:
      "Datenbank, Benutzerkonten und Datei-Speicher. Verarbeitet Konto-, Profil- und Kontaktdaten.",
    location: "EU (Frankfurt), Supabase Inc., USA als Muttergesellschaft",
  },
  {
    name: "Vercel",
    purpose:
      "Hosting und Auslieferung der Website. Verarbeitet technische Verbindungsdaten (Server-Logs).",
    location: "USA / globales CDN",
  },
  {
    name: "Resend",
    purpose:
      "Versand von System-E-Mails (Registrierung, Passwort-Zurücksetzung, Benachrichtigungen).",
    location: "USA",
  },
] as const;

/**
 * True once every TODO placeholder above has been replaced.
 * Used to show/hide the draft warning on the legal pages.
 */
export const LEGAL_DETAILS_COMPLETE = !Object.values(OPERATOR).some(
  (value) => typeof value === "string" && value.startsWith("TODO"),
);
