"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { step2Schema, type Step2FormData } from "@/lib/validations/profile";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Step2StoryFormProps {
  userId: string;
  defaultValues?: Partial<Step2FormData>;
}

export function Step2StoryForm({ userId, defaultValues }: Step2StoryFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Step2FormData>({
    resolver: zodResolver(step2Schema),
    defaultValues,
  });

  const positioningValue = watch("positioning_line") ?? "";
  const bestSuitedValue = watch("best_suited_for") ?? "";
  const howTheyWorkValue = watch("how_they_work") ?? "";
  const clientsAppreciateValue = watch("clients_appreciate") ?? "";

  async function onSubmit(data: Step2FormData) {
    setServerError(null);
    const supabase = createClient();

    const { error } = await supabase
      .from("sme_profiles")
      .update({
        positioning_line: data.positioning_line,
        best_suited_for: data.best_suited_for || null,
        how_they_work: data.how_they_work || null,
        clients_appreciate: data.clients_appreciate || null,
        onboarding_step: 3,
      })
      .eq("id", userId);

    if (error) {
      setServerError(error.message);
      return;
    }

    router.push("/onboarding/step-3");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <Textarea
        id="positioning_line"
        label="In one sentence, what is your business?"
        placeholder="Architecture studio focused on small residential renovations in Eastern Switzerland."
        hint="A specific, concrete description. Avoid marketing speak. Required."
        rows={2}
        characterCount={positioningValue.length}
        maxCharacters={200}
        error={errors.positioning_line?.message}
        {...register("positioning_line")}
      />

      <div className="border-t border-neutral-100 pt-2">
        <p className="text-xs text-neutral-400 mb-5">
          The questions below are optional but strongly encouraged — they help clients decide if you&apos;re the right fit.
        </p>
      </div>

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

      {serverError && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {serverError}
        </p>
      )}

      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => router.push("/onboarding/step-1")}
          className="text-sm text-neutral-500 hover:text-neutral-900"
        >
          ← Back
        </button>
        <Button type="submit" size="lg" loading={isSubmitting}>
          Continue
        </Button>
      </div>
    </form>
  );
}
