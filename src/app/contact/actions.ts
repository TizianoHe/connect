"use server";

import { createClient } from "@/lib/supabase/server";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const user_type = (formData.get("user_type") as string | null)?.trim() || null;
  const subject = (formData.get("subject") as string | null)?.trim() ?? "";
  const message = (formData.get("message") as string | null)?.trim() ?? "";

  if (!name || !email || !subject || !message) {
    return { status: "error", message: "Bitte füllen Sie alle Pflichtfelder aus." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: "error", message: "Bitte geben Sie eine gültige E-Mail-Adresse ein." };
  }

  if (message.length < 10) {
    return { status: "error", message: "Die Nachricht muss mindestens 10 Zeichen lang sein." };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("contact_submissions").insert({
    name,
    email,
    user_type,
    subject,
    message,
  });

  if (error) {
    console.error("Contact form submission error:", error);
    return {
      status: "error",
      message: "Da ist etwas schiefgelaufen. Bitte versuchen Sie es erneut oder schreiben Sie uns direkt eine E-Mail.",
    };
  }

  return { status: "success", message: "" };
}
