"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

type PageState = "loading" | "ready" | "success" | "invalid";

export function ResetPasswordForm() {
  const [pageState, setPageState] = useState<PageState>("loading");
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setPageState("ready");
      } else if (event === "SIGNED_IN") {
        // already handled by PASSWORD_RECOVERY or normal session
      }
    });

    // Also check if there's already a session (e.g. hash already consumed)
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setPageState("ready");
      } else {
        // Give Supabase a moment to parse the hash fragment before declaring invalid
        setTimeout(() => {
          setPageState((prev) => (prev === "loading" ? "invalid" : prev));
        }, 1500);
      }
    });
  }, []);

  async function onSubmit(data: FormData) {
    setServerError(null);
    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({ password: data.password });

    if (error) {
      if (error.message.toLowerCase().includes("expired") || error.message.toLowerCase().includes("invalid")) {
        setServerError("Reset link expired. Please request a new one.");
      } else {
        setServerError(error.message);
      }
      return;
    }

    setPageState("success");
    setTimeout(() => router.push("/login"), 3000);
  }

  if (pageState === "loading") {
    return (
      <div className="text-center py-8">
        <div className="w-6 h-6 border-2 border-neutral-300 border-t-neutral-700 rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (pageState === "invalid") {
    return (
      <div className="text-center py-4">
        <p className="text-neutral-700 text-sm mb-4">
          This page requires a valid reset link. If you need to reset your password, request a new link.
        </p>
        <Link href="/forgot-password" className="text-sm text-neutral-900 font-medium hover:underline">
          Request a new reset link
        </Link>
      </div>
    );
  }

  if (pageState === "success") {
    return (
      <div className="text-center py-4">
        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-neutral-700 text-sm mb-6">
          Password updated. You can now log in with your new password.
        </p>
        <Link href="/login">
          <Button size="lg">Go to login</Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="relative">
        <Input
          id="password"
          label="New password"
          type={showPassword ? "text" : "password"}
          placeholder="Min. 8 characters"
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
        label="Confirm new password"
        type={showPassword ? "text" : "password"}
        placeholder="Repeat password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      {serverError && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {serverError}{" "}
          {serverError.includes("expired") && (
            <Link href="/forgot-password" className="underline">
              Request a new link
            </Link>
          )}
        </p>
      )}

      <Button type="submit" size="lg" loading={isSubmitting} className="w-full">
        Update password
      </Button>

      <p className="text-center text-sm text-neutral-500">
        <Link href="/login" className="text-neutral-900 font-medium hover:underline">
          Back to login
        </Link>
      </p>
    </form>
  );
}
