"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    setServerError(null);
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setServerError("E-Mail-Adresse oder Passwort stimmt nicht. Bitte versuchen Sie es erneut.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
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
      <div className="relative">
        <Input
          id="password"
          label="Passwort"
          type={showPassword ? "text" : "password"}
          placeholder="Ihr Passwort"
          autoComplete="current-password"
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

      <div className="flex justify-end">
        <Link href="/forgot-password" className="text-sm text-neutral-500 hover:text-neutral-700">
          Passwort vergessen?
        </Link>
      </div>

      {serverError && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {serverError}
        </p>
      )}

      <Button type="submit" size="lg" loading={isSubmitting} className="w-full">
        Anmelden
      </Button>

      <p className="text-center text-sm text-neutral-500">
        Noch kein Konto?{" "}
        <Link href="/signup" className="text-neutral-900 font-medium hover:underline">
          Jetzt erstellen
        </Link>
      </p>
    </form>
  );
}
