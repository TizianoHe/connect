export const ONBOARDING_STEPS = [
  { step: 1, label: "Basics" },
  { step: 2, label: "Services" },
  { step: 3, label: "Location" },
  { step: 4, label: "Photo" },
] as const;

export const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5 MB
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const CURRENCIES = ["CHF", "EUR", "USD", "GBP"] as const;

export const EUROPEAN_COUNTRIES = [
  { code: "CH", name: "Switzerland" },
  { code: "DE", name: "Germany" },
  { code: "AT", name: "Austria" },
  { code: "FR", name: "France" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "NL", name: "Netherlands" },
  { code: "BE", name: "Belgium" },
  { code: "SE", name: "Sweden" },
  { code: "NO", name: "Norway" },
  { code: "DK", name: "Denmark" },
  { code: "FI", name: "Finland" },
  { code: "PL", name: "Poland" },
  { code: "CZ", name: "Czech Republic" },
  { code: "PT", name: "Portugal" },
  { code: "HU", name: "Hungary" },
  { code: "RO", name: "Romania" },
  { code: "GR", name: "Greece" },
  { code: "SK", name: "Slovakia" },
  { code: "LU", name: "Luxembourg" },
  { code: "IE", name: "Ireland" },
  { code: "HR", name: "Croatia" },
  { code: "SI", name: "Slovenia" },
  { code: "BG", name: "Bulgaria" },
  { code: "LT", name: "Lithuania" },
  { code: "LV", name: "Latvia" },
  { code: "EE", name: "Estonia" },
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
] as const;
