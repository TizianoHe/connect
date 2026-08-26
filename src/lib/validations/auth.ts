import { z } from "zod";

export const signupSchema = z
  .object({
    fullName: z.string().min(2, "Der Name muss mindestens 2 Zeichen lang sein."),
    email: z.string().email("Bitte geben Sie eine gültige E-Mail-Adresse ein."),
    password: z
      .string()
      .min(8, "Das Passwort muss mindestens 8 Zeichen lang sein."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Die Passwörter stimmen nicht überein.",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Bitte geben Sie eine gültige E-Mail-Adresse ein."),
  password: z.string().min(1, "Bitte geben Sie Ihr Passwort ein."),
});

export type SignupFormData = z.infer<typeof signupSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
