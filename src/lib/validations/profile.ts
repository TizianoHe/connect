import { z } from "zod";

// ── Step 1: Business facts (Tier 1 required) ─────────────────────────────────

export const step1Schema = z
  .object({
    business_name: z
      .string()
      .min(2, "Business name must be at least 2 characters")
      .max(100, "Business name must be 100 characters or fewer"),
    category_ids: z
      .array(z.string().uuid())
      .min(1, "Select at least one category")
      .max(5, "You can select up to 5 categories"),
    location_city: z.string().min(1, "City is required"),
    location_country: z.string().min(2).max(2),
    location_type: z.enum(["physical", "service_area"], {
      error: "Please select a location type",
    }),
    service_area: z
      .string()
      .max(200, "Must be 200 characters or fewer")
      .optional()
      .or(z.literal("")),
    phone: z.string().optional().or(z.literal("")),
    email_public: z
      .string()
      .email("Invalid email address")
      .optional()
      .or(z.literal("")),
    website_url: z
      .string()
      .url("Please enter a valid URL (e.g. https://example.com)")
      .optional()
      .or(z.literal("")),
    team_size: z
      .string()
      .min(1, "Please select a team size"),
  })
  .superRefine((data, ctx) => {
    if (data.location_type === "service_area" && !data.service_area?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please describe your service area",
        path: ["service_area"],
      });
    }
    const hasContact =
      !!data.phone?.trim() ||
      !!data.email_public?.trim() ||
      !!data.website_url?.trim();
    if (!hasContact) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Please provide at least one contact channel (phone, email, or website)",
        path: ["phone"],
      });
    }
  });

// ── Step 2: Story (positioning_line required, Tier 2 optional) ────────────────

export const step2Schema = z.object({
  positioning_line: z
    .string()
    .min(10, "Please write at least 10 characters")
    .max(200, "Must be 200 characters or fewer"),
  best_suited_for: z
    .string()
    .max(500, "Must be 500 characters or fewer")
    .optional()
    .or(z.literal("")),
  how_they_work: z
    .string()
    .max(500, "Must be 500 characters or fewer")
    .optional()
    .or(z.literal("")),
  clients_appreciate: z
    .string()
    .max(500, "Must be 500 characters or fewer")
    .optional()
    .or(z.literal("")),
});

// ── Step 3: Details (all optional Tier 3) ────────────────────────────────────

export const step3ServiceSchema = z.object({
  category_id: z.string().uuid(),
  title: z.string().min(2, "Service title is required"),
  description: z.string().optional().or(z.literal("")),
  price_from: z.string().optional(),
  price_currency: z.string(),
});

export const step3Schema = z.object({
  services: z.array(step3ServiceSchema).optional(),
  languages: z.array(z.enum(["de", "fr", "it", "en"])).optional(),
  booking_url: z
    .string()
    .url("Please enter a valid URL (e.g. https://example.com)")
    .optional()
    .or(z.literal("")),
  uid_number: z
    .string()
    .max(20, "Must be 20 characters or fewer")
    .optional()
    .or(z.literal("")),
  wheelchair_accessible: z
    .enum(["", "true", "false"])
    .optional(),
  opening_hours: z
    .object({
      mon: z.string().optional(),
      tue: z.string().optional(),
      wed: z.string().optional(),
      thu: z.string().optional(),
      fri: z.string().optional(),
      sat: z.string().optional(),
      sun: z.string().optional(),
    })
    .optional(),
});

export type Step1FormData = z.infer<typeof step1Schema>;
export type Step2FormData = z.infer<typeof step2Schema>;
export type Step3FormData = z.infer<typeof step3Schema>;
