import { z } from "zod";

export const step1Schema = z.object({
  business_name: z
    .string()
    .min(2, "Business name must be at least 2 characters")
    .max(100, "Business name must be 100 characters or fewer"),
  tagline: z
    .string()
    .max(120, "Tagline must be 120 characters or fewer")
    .optional()
    .or(z.literal("")),
  description: z
    .string()
    .min(20, "Please write at least 20 characters")
    .max(1000, "Description must be 1000 characters or fewer"),
  website_url: z
    .string()
    .url("Please enter a valid URL (e.g. https://example.com)")
    .optional()
    .or(z.literal("")),
});

export const step2ServiceSchema = z.object({
  category_id: z.string().uuid(),
  title: z.string().min(2, "Service title is required"),
  description: z.string().optional().or(z.literal("")),
  price_from: z.string().optional(),
  price_currency: z.string(),
});

export const step2Schema = z.object({
  selected_category_ids: z
    .array(z.string().uuid())
    .min(1, "Select at least one service category")
    .max(5, "You can select up to 5 categories"),
  services: z.array(step2ServiceSchema),
});

export const step3Schema = z.object({
  location_city: z.string().min(1, "City is required"),
  location_country: z.string().min(2).max(2),
  email_public: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
});

export type Step1FormData = z.infer<typeof step1Schema>;
export type Step2FormData = z.infer<typeof step2Schema>;
export type Step3FormData = z.infer<typeof step3Schema>;
