"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({
  email: z.string().email("Bitte geben Sie eine gültige E-Mail-Adresse ein."),
});
type FormData = z.infer<typeof schema>;

export function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setServerError(null);
    const supabase = createClient();

    /**
     * Through /auth-callback, not straight to /reset-password.
     *
     * createBrowserClient uses the PKCE flow, so the recovery link comes back
     * as `?code=...`. Nothing on /reset-password exchanged that code — the page
     * only listened for the PASSWORD_RECOVERY event, which belongs to the older
     * implicit flow and never fired. The form sat there for 1.5 seconds and
     * then declared the link invalid, for every reset. The callback redeems the
     * code server-side, writes the session cookie, and forwards.
     */
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/auth-callback?next=/reset-password`,
    });

    if (error) {
      setServerError("Da ist etwas schiefgelaufen. Bitte versuchen Sie es erneut.");
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="text-center py-4">
        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-neutral-700 text-sm mb-6">
          Falls zu dieser Adresse ein Konto besteht, erhalten Sie gleich einen Link zum Zurücksetzen. Schauen Sie auch im Spam-Ordner nach.
        </p>
        <Link href="/login" className="text-sm text-neutral-500 hover:text-neutral-700">
          Zurück zur Anmeldung
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        id="email"
        label="E-Mail"
        type="email"
        placeholder="name@firma.ch"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />

      {serverError && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {serverError}
        </p>
      )}

      <Button type="submit" size="lg" loading={isSubmitting} className="w-full">
        Link senden
      </Button>

      <p className="text-center text-sm text-neutral-500">
        <Link href="/login" className="text-neutral-900 font-medium hover:underline">
          Zurück zur Anmeldung
        </Link>
      </p>
    </form>
  );
}
