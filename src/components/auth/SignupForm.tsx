"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { signupSchema, type SignupFormData } from "@/lib/validations/auth";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  /**
   * The address is kept after submitting so the confirmation mail can be sent
   * again without making the person fill the form a second time. Signing up
   * twice does not help: it burns the hourly send quota and can lock them out
   * for the rest of the hour.
   */
  const [signedUpEmail, setSignedUpEmail] = useState("");
  const [resendState, setResendState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [resendError, setResendError] = useState<string | null>(null);
  /** Seconds until the button is usable again, to stop rapid repeat sends. */
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  async function handleResend() {
    if (cooldown > 0 || resendState === "sending") return;
    setResendState("sending");
    setResendError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: signedUpEmail,
      options: { emailRedirectTo: `${window.location.origin}/auth-callback` },
    });

    if (error) {
      setResendState("error");
      setResendError(
        error.message.toLowerCase().includes("rate")
          ? "Zu viele Anfragen. Bitte warten Sie eine Stunde und versuchen Sie es dann erneut."
          : error.message
      );
      return;
    }

    setResendState("sent");
    setCooldown(60);
  }

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

    const { data: result, error } = await supabase.auth.signUp({
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

    /**
     * Supabase does not report an existing address as an error. It returns a
     * user object with an empty `identities` array and sends nothing, so the
     * form used to show "check your email" for a mail that never arrives. That
     * silence is deliberate on their side: an error here would let anyone test
     * which addresses are registered. On a directory whose profiles publish a
     * contact address anyway, that protection buys little, and the confusion it
     * causes is real, so this says plainly what happened.
     */
    if (result.user && result.user.identities?.length === 0) {
      setAlreadyRegistered(true);
      return;
    }

    setSignedUpEmail(data.email);
    setSubmitted(true);
  }

  if (alreadyRegistered) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={22} className="text-amber-600" />
        </div>
        <h2 className="text-xl font-semibold text-neutral-900 mb-2">
          Für diese Adresse gibt es bereits ein Konto
        </h2>
        <p className="text-neutral-500 text-sm">
          Melden Sie sich mit Ihrem bestehenden Passwort an. Wenn Sie es nicht
          mehr wissen, setzen Sie es zurück.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/login">
            <Button size="sm" className="w-full sm:w-auto">Anmelden</Button>
          </Link>
          <Link href="/forgot-password">
            <Button variant="secondary" size="sm" className="w-full sm:w-auto">
              Passwort zurücksetzen
            </Button>
          </Link>
        </div>
      </div>
    );
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
          Wir haben einen Bestätigungslink an{" "}
          <span className="font-medium text-neutral-700">{signedUpEmail}</span>{" "}
          geschickt. Klicken Sie darauf, um Ihr Konto zu aktivieren und Ihr
          Profil anzulegen.
        </p>
        <p className="text-neutral-400 text-xs mt-3">
          Schauen Sie auch im Spam-Ordner nach. Die Zustellung kann ein paar
          Minuten dauern.
        </p>

        <div className="mt-6 flex flex-col items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            loading={resendState === "sending"}
            disabled={cooldown > 0}
            onClick={handleResend}
          >
            {cooldown > 0
              ? `Erneut senden in ${cooldown}s`
              : "E-Mail erneut senden"}
          </Button>

          {resendState === "sent" && (
            <p className="text-xs text-emerald-600">
              Die E-Mail wurde erneut verschickt.
            </p>
          )}
          {resendState === "error" && resendError && (
            <p className="text-xs text-red-500 max-w-xs">{resendError}</p>
          )}

          <p className="text-xs text-neutral-400 mt-1">
            Falsche Adresse eingegeben?{" "}
            <Link href="/signup" className="text-neutral-700 hover:underline">
              Nochmal von vorn
            </Link>
          </p>
        </div>
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
      <Input
        id="password"
        label="Passwort"
        type={showPassword ? "text" : "password"}
        placeholder="Mindestens 8 Zeichen"
        autoComplete="new-password"
        error={errors.password?.message}
        trailing={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Passwort verbergen" : "Passwort anzeigen"}
            className="text-neutral-400 hover:text-neutral-600 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        }
        {...register("password")}
      />
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
