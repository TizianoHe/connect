"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { signupSchema, type SignupFormData } from "@/lib/validations/auth";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  async function onSubmit(data: SignupFormData) {
    setServerError(null);
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { full_name: data.fullName },
        emailRedirectTo: `${window.location.origin}/auth-callback`,
      },
    });

    if (error) {
      setServerError(error.message);
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-neutral-900 mb-2">Bitte bestätigen Sie Ihre E-Mail-Adresse</h2>
        <p className="text-neutral-500 text-sm">
          Wir haben Ihnen einen Bestätigungslink geschickt. Klicken Sie darauf, um Ihr Konto zu aktivieren und Ihr Profil anzulegen.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        id="fullName"
        label="Vor- und Nachname"
        placeholder="Maria Muster"
        autoComplete="name"
        error={errors.fullName?.message}
        {...register("fullName")}
      />
      <Input
        id="email"
        label="E-Mail"
        type="email"
        placeholder="name@firma.ch"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <div className="relative">
        <Input
          id="password"
          label="Passwort"
          type={showPassword ? "text" : "password"}
          placeholder="Mindestens 8 Zeichen"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-8 text-neutral-400 hover:text-neutral-600"
          tabIndex={-1}
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      <Input
        id="confirmPassword"
        label="Passwort bestätigen"
        type={showPassword ? "text" : "password"}
        placeholder="Passwort wiederholen"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      {serverError && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {serverError}
        </p>
      )}

      <Button type="submit" size="lg" loading={isSubmitting} className="mt-2 w-full">
        Konto erstellen
      </Button>

      <p className="text-center text-sm text-neutral-500">
        Sie haben bereits ein Konto?{" "}
        <Link href="/login" className="text-neutral-900 font-medium hover:underline">
          Anmelden
        </Link>
      </p>
    </form>
  );
}
