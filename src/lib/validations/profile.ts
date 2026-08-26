import { z } from "zod";

export const step1Schema = z.object({
  business_name: z
    .string()
    .min(2, "Der Firmenname muss mindestens 2 Zeichen lang sein.")
    .max(100, "Der Firmenname darf höchstens 100 Zeichen lang sein."),
  tagline: z
    .string()
    .max(120, "Der Kurzbeschrieb darf höchstens 120 Zeichen lang sein.")
    .optional()
    .or(z.literal("")),
  description: z
    .string()
    .min(20, "Bitte schreiben Sie mindestens 20 Zeichen.")
    .max(1000, "Die Beschreibung darf höchstens 1000 Zeichen lang sein."),
  website_url: z
    .string()
    .url("Bitte geben Sie eine gültige Adresse ein, zum Beispiel https://ihrefirma.ch")
    .optional()
    .or(z.literal("")),
  positioning_line: z
    .string()
    .max(200, "Höchstens 200 Zeichen.")
    .optional()
    .or(z.literal("")),
  best_suited_for: z
    .string()
    .max(500, "Höchstens 500 Zeichen.")
    .optional()
    .or(z.literal("")),
  how_they_work: z
    .string()
    .max(500, "Höchstens 500 Zeichen.")
    .optional()
    .or(z.literal("")),
  clients_appreciate: z
    .string()
    .max(500, "Höchstens 500 Zeichen.")
    .optional()
    .or(z.literal("")),
  team_size: z
    .enum(["solo", "2-5", "6-20", "21-50", "50+"])
    .optional()
    .or(z.literal("")),
});

export const step2ServiceSchema = z.object({
  category_id: z.string().uuid(),
  title: z.string().min(2, "Bitte geben Sie der Leistung einen Titel."),
  description: z.string().optional().or(z.literal("")),
  price_from: z.string().optional(),
  price_currency: z.string(),
});

export const step2Schema = z.object({
  selected_category_ids: z
    .array(z.string().uuid())
    .min(1, "Bitte wählen Sie mindestens eine Kategorie.")
    .max(5, "Sie können bis zu 5 Kategorien wählen."),
  services: z.array(step2ServiceSchema),
});

export const step3Schema = z.object({
  location_city: z.string().min(1, "Bitte geben Sie den Ort an."),
  location_country: z.string().min(2).max(2),
  email_public: z
    .string()
    .email("Bitte geben Sie eine gültige E-Mail-Adresse ein.")
    .optional()
    .or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
});

export type Step1FormData = z.infer<typeof step1Schema>;
export type Step2FormData = z.infer<typeof step2Schema>;
export type Step3FormData = z.infer<typeof step3Schema>;
