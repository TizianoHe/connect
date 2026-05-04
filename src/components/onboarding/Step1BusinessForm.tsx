"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { step1Schema, type Step1FormData } from "@/lib/validations/profile";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Step1BusinessFormProps {
  userId: string;
  defaultValues?: Partial<Step1FormData>;
}

export function Step1BusinessForm({ userId, defaultValues }: Step1BusinessFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    defaultValues,
  });

  const descriptionValue = watch("description") ?? "";
  const taglineValue = watch("tagline") ?? "";

  async function onSubmit(data: Step1FormData) {
    setServerError(null);
    const supabase = createClient();

    const { error } = await supabase.from("sme_profiles").upsert({
      id: userId,
      business_name: data.business_name,
      tagline: data.tagline || null,
      description: data.description,
      website_url: data.website_url || null,
      onboarding_step: 2,
    });

    if (error) {
      setServerError(error.message);
      return;
    }

    router.push("/onboarding/step-2");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <Input
        id="business_name"
        label="Business name"
        placeholder="Acme Design Studio"
        error={errors.business_name?.message}
        {...register("business_name")}
      />
      <div>
        <Input
          id="tagline"
          label="Tagline"
          placeholder="One sentence that sells your business"
          hint="Max 120 characters. Shown on your listing card."
          error={errors.tagline?.message}
          {...register("tagline")}
        />
        <p className="text-right text-xs text-neutral-400 mt-1">
          {taglineValue.length}/120
        </p>
      </div>
      <Textarea
        id="description"
        label="Description"
        placeholder="Tell potential clients what makes your business unique, what you specialise in, and who you work with..."
        rows={5}
        characterCount={descriptionValue.length}
        maxCharacters={1000}
        error={errors.description?.message}
        {...register("description")}
      />
      <Input
        id="website_url"
        label="Website"
        type="url"
        placeholder="https://yourcompany.com"
        error={errors.website_url?.message}
        {...register("website_url")}
      />

      {serverError && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {serverError}
        </p>
      )}

      <div className="flex justify-end pt-2">
        <Button type="submit" size="lg" loading={isSubmitting}>
          Continue
        </Button>
      </div>
    </form>
  );
}
