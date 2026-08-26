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
        label="Firmenname"
        placeholder="Muster Schreinerei AG"
        error={errors.business_name?.message}
        {...register("business_name")}
      />
      <div>
        <Input
          id="tagline"
          label="Kurzbeschrieb"
          placeholder="Ein Satz, der Ihr Unternehmen auf den Punkt bringt"
          hint="Höchstens 120 Zeichen. Erscheint auf Ihrer Karte in der Übersicht."
          error={errors.tagline?.message}
          {...register("tagline")}
        />
        <p className="text-right text-xs text-neutral-400 mt-1">
          {taglineValue.length}/120
        </p>
      </div>
      <Textarea
        id="description"
        label="Beschreibung"
        placeholder="Was macht Ihr Unternehmen aus, worauf sind Sie spezialisiert und mit wem arbeiten Sie zusammen?"
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
        placeholder="https://ihrefirma.ch"
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
        label="Was macht Ihr Unternehmen, in einem Satz?"
        placeholder="Architekturbüro für kleine Wohnungssanierungen in der Ostschweiz."
        hint='A specific, concrete description. Avoid marketing speak.'
        rows={2}
        characterCount={positioningValue.length}
        maxCharacters={200}
        error={errors.positioning_line?.message}
        {...register("positioning_line")}
      />

      <Textarea
        id="best_suited_for"
        label="Für welche Kundschaft passen Sie besonders gut?"
        placeholder="Kleine Betriebe und Selbstständige, die …"
        hint="Seien Sie ehrlich, für wen Sie wirklich passen. Konkretes schafft Vertrauen."
        rows={3}
        characterCount={bestSuitedValue.length}
        maxCharacters={500}
        error={errors.best_suited_for?.message}
        {...register("best_suited_for")}
      />

      <Textarea
        id="how_they_work"
        label="Wie läuft die Zusammenarbeit normalerweise ab?"
        placeholder="Wir beginnen mit einem Gespräch, danach …"
        hint="Ablauf, Kommunikation, Tempo. Womit kann Ihre Kundschaft rechnen?"
        rows={3}
        characterCount={howTheyWorkValue.length}
        maxCharacters={500}
        error={errors.how_they_work?.message}
        {...register("how_they_work")}
      />

      <Textarea
        id="clients_appreciate"
        label="Was schätzen Ihre Kundinnen und Kunden an Ihnen?"
        placeholder="Oft hören wir, dass wir …"
        hint="In Ihren eigenen Worten. Keine Floskeln."
        rows={3}
        characterCount={clientsAppreciateValue.length}
        maxCharacters={500}
        error={errors.clients_appreciate?.message}
        {...register("clients_appreciate")}
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="team_size" className="text-sm font-medium text-neutral-700">
          Wie viele Personen arbeiten bei Ihnen?
        </label>
        <select
          id="team_size"
          className="w-full rounded-xl border px-4 py-2.5 text-sm text-neutral-900 bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent border-neutral-200 hover:border-neutral-300 appearance-none"
          {...register("team_size")}
        >
          <option value="">Bitte wählen …</option>
          <option value="solo">Eine Person</option>
          <option value="2-5">2-5</option>
          <option value="6-20">6-20</option>
          <option value="21-50">21-50</option>
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
          Weiter
        </Button>
      </div>
    </form>
  );
}
