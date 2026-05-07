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
  const positioningValue = watch("positioning_line") ?? "";
  const bestSuitedValue = watch("best_suited_for") ?? "";
  const howTheyWorkValue = watch("how_they_work") ?? "";
  const clientsAppreciateValue = watch("clients_appreciate") ?? "";

  async function onSubmit(data: Step1FormData) {
    setServerError(null);
    const supabase = createClient();

    const { error } = await supabase.from("sme_profiles").upsert({
      id: userId,
      business_name: data.business_name,
      tagline: data.tagline || null,
      description: data.description,
      website_url: data.website_url || null,
      positioning_line: data.positioning_line || null,
      best_suited_for: data.best_suited_for || null,
      how_they_work: data.how_they_work || null,
      clients_appreciate: data.clients_appreciate || null,
      team_size: data.team_size || null,
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

      {/* Divider */}
      <div className="border-t border-neutral-100 pt-2">
        <p className="text-xs text-neutral-400 mb-5">
          The fields below are optional but help clients understand if you&apos;re the right fit.
        </p>
      </div>

      <Textarea
        id="positioning_line"
        label="In one sentence, what is your business?"
        placeholder="Architecture studio focused on small residential renovations in Eastern Switzerland."
        hint='A specific, concrete description. Avoid marketing speak.'
        rows={2}
        characterCount={positioningValue.length}
        maxCharacters={200}
        error={errors.positioning_line?.message}
        {...register("positioning_line")}
      />

      <Textarea
        id="best_suited_for"
        label="What kind of clients are you best suited for?"
        placeholder="Small businesses and solo founders who need..."
        hint="Be honest about who you serve well. Specificity builds trust."
        rows={3}
        characterCount={bestSuitedValue.length}
        maxCharacters={500}
        error={errors.best_suited_for?.message}
        {...register("best_suited_for")}
      />

      <Textarea
        id="how_they_work"
        label="How do you usually work with clients?"
        placeholder="We start with a scoping call, then..."
        hint="Process, communication style, project rhythm. What can clients expect?"
        rows={3}
        characterCount={howTheyWorkValue.length}
        maxCharacters={500}
        error={errors.how_they_work?.message}
        {...register("how_they_work")}
      />

      <Textarea
        id="clients_appreciate"
        label="What do clients usually appreciate about working with you?"
        placeholder="Clients often mention that we..."
        hint="In your own words. No generic claims."
        rows={3}
        characterCount={clientsAppreciateValue.length}
        maxCharacters={500}
        error={errors.clients_appreciate?.message}
        {...register("clients_appreciate")}
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="team_size" className="text-sm font-medium text-neutral-700">
          How many people are in your team?
        </label>
        <select
          id="team_size"
          className="w-full rounded-xl border px-4 py-2.5 text-sm text-neutral-900 bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent border-neutral-200 hover:border-neutral-300 appearance-none"
          {...register("team_size")}
        >
          <option value="">Select...</option>
          <option value="solo">Just me</option>
          <option value="2-5">2–5</option>
          <option value="6-20">6–20</option>
          <option value="21-50">21–50</option>
          <option value="50+">50+</option>
        </select>
        {errors.team_size && (
          <p className="text-xs text-red-500">{errors.team_size.message}</p>
        )}
      </div>

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
