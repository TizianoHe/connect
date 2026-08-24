"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { step3Schema, type Step3FormData } from "@/lib/validations/profile";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CURRENCIES } from "@/lib/constants";
import type { ServiceCategory } from "@/types";

const DAYS = [
  { key: "mon", label: "Montag" },
  { key: "tue", label: "Dienstag" },
  { key: "wed", label: "Mittwoch" },
  { key: "thu", label: "Donnerstag" },
  { key: "fri", label: "Freitag" },
  { key: "sat", label: "Samstag" },
  { key: "sun", label: "Sonntag" },
] as const;

const LANGUAGE_OPTIONS = [
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" },
  { code: "it", label: "Italiano" },
  { code: "en", label: "English" },
] as const;

type DayKey = (typeof DAYS)[number]["key"];

interface Step3DetailsFormProps {
  userId: string;
  categories: ServiceCategory[];
  defaultValues?: Partial<Step3FormData>;
  existingServices?: {
    id: string;
    category_id: string;
    title: string;
    description: string | null;
    price_from: number | null;
    price_currency: string;
  }[];
}

export function Step3DetailsForm({
  userId,
  categories,
  defaultValues,
  existingServices = [],
}: Step3DetailsFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
    defaultValues?.languages ?? []
  );

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Step3FormData>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      services: existingServices.map((s) => ({
        category_id: s.category_id,
        title: s.title,
        description: s.description ?? "",
        price_from: s.price_from != null ? String(s.price_from) : "",
        price_currency: s.price_currency,
      })),
      languages: defaultValues?.languages ?? [],
      booking_url: defaultValues?.booking_url ?? "",
      uid_number: defaultValues?.uid_number ?? "",
      wheelchair_accessible: defaultValues?.wheelchair_accessible ?? "",
      opening_hours: defaultValues?.opening_hours ?? {},
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "services" });

  function addService() {
    append({
      category_id: categories[0]?.id ?? "",
      title: "",
      description: "",
      price_from: "",
      price_currency: "CHF",
    });
    setExpandedIndex(fields.length);
  }

  function toggleLanguage(code: string) {
    setSelectedLanguages((prev) => {
      const next = prev.includes(code)
        ? prev.filter((l) => l !== code)
        : [...prev, code];
      setValue("languages", next as ("de" | "fr" | "it" | "en")[], { shouldValidate: true });
      return next;
    });
  }

  const onSubmit: SubmitHandler<Step3FormData> = async (data) => {
    setServerError(null);
    const supabase = createClient();

    // Save/replace services
    await supabase.from("sme_services").delete().eq("sme_id", userId);
    if (data.services && data.services.length > 0) {
      const { error: svcErr } = await supabase.from("sme_services").insert(
        data.services.map((s) => ({
          sme_id: userId,
          category_id: s.category_id,
          title: s.title,
          description: s.description || null,
          price_from: s.price_from ? Number(s.price_from) : null,
          price_currency: s.price_currency,
        }))
      );
      if (svcErr) { setServerError(svcErr.message); return; }
    }

    // Build opening_hours: only include days with values
    const ohRaw = data.opening_hours ?? {};
    const openingHours: Record<string, string> = {};
    for (const { key } of DAYS) {
      const val = (ohRaw as Record<string, string | undefined>)[key]?.trim();
      if (val) openingHours[key] = val;
    }

    // wheelchair_accessible: "" → null, "true" → true, "false" → false
    let wheelchairAccessible: boolean | null = null;
    if (data.wheelchair_accessible === "true") wheelchairAccessible = true;
    if (data.wheelchair_accessible === "false") wheelchairAccessible = false;

    const { error: profileErr } = await supabase
      .from("sme_profiles")
      .update({
        languages: data.languages && data.languages.length > 0 ? data.languages : [],
        booking_url: data.booking_url || null,
        uid_number: data.uid_number || null,
        wheelchair_accessible: wheelchairAccessible,
        opening_hours: Object.keys(openingHours).length > 0 ? openingHours : null,
        onboarding_step: 4,
      })
      .eq("id", userId);

    if (profileErr) { setServerError(profileErr.message); return; }

    router.push("/onboarding/step-4");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {/* Services */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-medium text-neutral-700">Services</p>
          <button
            type="button"
            onClick={addService}
            className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900"
          >
            <Plus size={12} /> Add service
          </button>
        </div>
        <p className="text-xs text-neutral-400 mb-3">Optional. List specific services with prices.</p>
        {fields.length > 0 && (
          <div className="flex flex-col gap-2">
            {fields.map((field, index) => {
              const category = categories.find((c) => c.id === field.category_id);
              const isExpanded = expandedIndex === index;
              return (
                <div key={field.id} className="border border-neutral-200 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    className="w-full flex items-center justify-between px-4 py-3 bg-neutral-50 hover:bg-neutral-100 transition-colors"
                    onClick={() => setExpandedIndex(isExpanded ? null : index)}
                  >
                    <span className="text-sm font-medium text-neutral-700">
                      {field.title || `Service ${index + 1}`}
                      {category && (
                        <span className="ml-2 text-xs font-normal text-neutral-400">
                          · {category.name}
                        </span>
                      )}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          remove(index);
                          if (expandedIndex === index) setExpandedIndex(null);
                        }}
                        className="text-neutral-400 hover:text-red-500"
                      >
                        <Trash2 size={14} />
                      </button>
                      {isExpanded ? (
                        <ChevronUp size={14} className="text-neutral-400" />
                      ) : (
                        <ChevronDown size={14} className="text-neutral-400" />
                      )}
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="p-4 flex flex-col gap-4">
                      <div>
                        <label className="text-xs font-medium text-neutral-600 block mb-1">
                          Category
                        </label>
                        <select
                          className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                          {...register(`services.${index}.category_id`)}
                        >
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <Input
                        label="Service title"
                        placeholder="e.g. Brand identity design"
                        error={errors.services?.[index]?.title?.message}
                        {...register(`services.${index}.title`)}
                      />
                      <Textarea
                        label="Description"
                        placeholder="What's included in this service?"
                        rows={3}
                        {...register(`services.${index}.description`)}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          label="Starting price (optional)"
                          type="number"
                          placeholder="1500"
                          min={0}
                          {...register(`services.${index}.price_from`)}
                        />
                        <div>
                          <label className="text-sm font-medium text-neutral-700 block mb-1.5">
                            Currency
                          </label>
                          <select
                            className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                            {...register(`services.${index}.price_currency`)}
                          >
                            {CURRENCIES.map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {fields.length === 0 && (
          <button
            type="button"
            onClick={addService}
            className="w-full border-2 border-dashed border-neutral-200 rounded-xl py-5 text-sm text-neutral-400 hover:border-neutral-300 hover:text-neutral-600 transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={14} /> Add your first service
          </button>
        )}
      </div>

      {/* Languages */}
      <div className="border-t border-neutral-100 pt-5">
        <p className="text-sm font-medium text-neutral-700 mb-1">Languages</p>
        <p className="text-xs text-neutral-400 mb-3">
          Which languages can you work in? Optional.
        </p>
        <div className="flex gap-2 flex-wrap">
          {LANGUAGE_OPTIONS.map(({ code, label }) => {
            const isSelected = selectedLanguages.includes(code);
            return (
              <button
                key={code}
                type="button"
                onClick={() => toggleLanguage(code)}
                className={cn(
                  "px-4 py-2 rounded-xl border text-sm font-medium transition-all",
                  isSelected
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Booking URL */}
      <div className="border-t border-neutral-100 pt-5">
        <Input
          id="booking_url"
          label="Booking link"
          type="url"
          placeholder="https://calendly.com/yourname"
          hint="Optional — link to your own booking tool."
          error={errors.booking_url?.message}
          {...register("booking_url")}
        />
      </div>

      {/* UID number */}
      <Input
        id="uid_number"
        label="UID / Handelsregisternummer"
        placeholder="CHE-123.456.789"
        hint="Optional — hilft uns, Ihr Unternehmen schneller zu verifizieren."
        error={errors.uid_number?.message}
        {...register("uid_number")}
      />

      {/* Wheelchair accessible */}
      <div>
        <label
          htmlFor="wheelchair_accessible"
          className="text-sm font-medium text-neutral-700 block mb-1.5"
        >
          Rollstuhlzugang
        </label>
        <p className="text-xs text-neutral-400 mb-2">Optional.</p>
        <select
          id="wheelchair_accessible"
          className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 appearance-none bg-white"
          {...register("wheelchair_accessible")}
        >
          <option value="">Keine Angabe</option>
          <option value="true">Ja, rollstuhlgerecht</option>
          <option value="false">Nein</option>
        </select>
      </div>

      {/* Opening hours */}
      <div className="border-t border-neutral-100 pt-5">
        <p className="text-sm font-medium text-neutral-700 mb-1">Öffnungszeiten</p>
        <p className="text-xs text-neutral-400 mb-3">
          Optional. Format: 08:00-18:00. Leer lassen = geschlossen.
        </p>
        <div className="grid grid-cols-1 gap-2">
          {DAYS.map(({ key, label }) => (
            <div key={key} className="flex items-center gap-3">
              <span className="text-sm text-neutral-500 w-24 flex-shrink-0">{label}</span>
              <input
                type="text"
                placeholder="08:00-18:00"
                className="flex-1 rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                {...register(`opening_hours.${key as DayKey}`)}
              />
            </div>
          ))}
        </div>
      </div>

      {serverError && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {serverError}
        </p>
      )}

      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => router.push("/onboarding/step-2")}
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
