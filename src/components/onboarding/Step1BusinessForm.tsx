"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { step1Schema, type Step1FormData } from "@/lib/validations/profile";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EUROPEAN_COUNTRIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { ServiceCategory } from "@/types";

interface Step1BusinessFormProps {
  userId: string;
  categories: ServiceCategory[];
  defaultValues?: Partial<Step1FormData>;
}

export function Step1BusinessForm({
  userId,
  categories,
  defaultValues,
}: Step1BusinessFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
    defaultValues?.category_ids ?? []
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      location_country: "CH",
      ...defaultValues,
      category_ids: defaultValues?.category_ids ?? [],
    },
  });

  const locationType = watch("location_type");
  const serviceAreaValue = watch("service_area") ?? "";

  function toggleCategory(id: string) {
    setSelectedCategoryIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length < 5
        ? [...prev, id]
        : prev;
      setValue("category_ids", next, { shouldValidate: true });
      return next;
    });
  }

  async function onSubmit(data: Step1FormData) {
    setServerError(null);
    const supabase = createClient();

    const { error } = await supabase.from("sme_profiles").upsert({
      id: userId,
      business_name: data.business_name,
      category_ids: data.category_ids,
      location_city: data.location_city,
      location_country: data.location_country,
      location_type: data.location_type,
      service_area: data.location_type === "service_area" ? (data.service_area || null) : null,
      phone: data.phone || null,
      email_public: data.email_public || null,
      website_url: data.website_url || null,
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {/* Business name */}
      <Input
        id="business_name"
        label="Business name"
        placeholder="Muster GmbH"
        error={errors.business_name?.message}
        {...register("business_name")}
      />

      {/* Categories */}
      <div>
        <p className="text-sm font-medium text-neutral-700 mb-1.5">
          Categories{" "}
          <span className="font-normal text-neutral-400">(up to 5)</span>
        </p>
        <p className="text-xs text-neutral-400 mb-3">
          Choose the areas your business operates in. Clients filter by these.
        </p>
        <div className="grid grid-cols-2 gap-2">
          {categories.map((cat) => {
            const isSelected = selectedCategoryIds.includes(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggleCategory(cat.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium text-left transition-all",
                  isSelected
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
                )}
              >
                <span className="truncate">{cat.name}</span>
              </button>
            );
          })}
        </div>
        {errors.category_ids && (
          <p className="text-xs text-red-500 mt-2">
            {errors.category_ids.message}
          </p>
        )}
      </div>

      {/* Location */}
      <div className="border-t border-neutral-100 pt-5">
        <p className="text-sm font-medium text-neutral-700 mb-4">Location</p>
        <div className="flex flex-col gap-4">
          <Input
            id="location_city"
            label="City"
            placeholder="Zürich"
            error={errors.location_city?.message}
            {...register("location_city")}
          />
          <div>
            <label
              htmlFor="location_country"
              className="text-sm font-medium text-neutral-700 block mb-1.5"
            >
              Country
            </label>
            <select
              id="location_country"
              className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 appearance-none bg-white"
              {...register("location_country")}
            >
              {EUROPEAN_COUNTRIES.map(({ code, name }) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Location type */}
          <div>
            <p className="text-sm font-medium text-neutral-700 mb-1.5">
              Kommen Kunden zu Ihnen, oder gehen Sie zu Kunden?
            </p>
            <div className="flex gap-3">
              <label
                className={cn(
                  "flex-1 border rounded-xl px-4 py-3 cursor-pointer text-sm transition-all",
                  locationType === "physical"
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-200 text-neutral-700 hover:border-neutral-400"
                )}
              >
                <input
                  type="radio"
                  value="physical"
                  className="sr-only"
                  {...register("location_type")}
                />
                <span className="font-medium block">Kunden kommen zu uns</span>
                <span className={cn("text-xs", locationType === "physical" ? "text-neutral-300" : "text-neutral-400")}>
                  Festes Lokal, Atelier, Büro
                </span>
              </label>
              <label
                className={cn(
                  "flex-1 border rounded-xl px-4 py-3 cursor-pointer text-sm transition-all",
                  locationType === "service_area"
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-200 text-neutral-700 hover:border-neutral-400"
                )}
              >
                <input
                  type="radio"
                  value="service_area"
                  className="sr-only"
                  {...register("location_type")}
                />
                <span className="font-medium block">Wir kommen zu Kunden</span>
                <span className={cn("text-xs", locationType === "service_area" ? "text-neutral-300" : "text-neutral-400")}>
                  Mobiler Dienst, Beratung vor Ort
                </span>
              </label>
            </div>
            {errors.location_type && (
              <p className="text-xs text-red-500 mt-1.5">
                {errors.location_type.message}
              </p>
            )}
          </div>

          {/* Service area (conditional) */}
          {locationType === "service_area" && (
            <div>
              <Input
                id="service_area"
                label="Einzugsgebiet"
                placeholder="St. Gallen und Umgebung"
                hint="Beschreiben Sie, in welchem Gebiet Sie tätig sind."
                error={errors.service_area?.message}
                {...register("service_area")}
              />
              <p className="text-right text-xs text-neutral-400 mt-1">
                {serviceAreaValue.length}/200
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Contact */}
      <div className="border-t border-neutral-100 pt-5">
        <p className="text-sm font-medium text-neutral-700 mb-1">
          Contact information{" "}
          <span className="font-normal text-neutral-400">(shown on your profile)</span>
        </p>
        <p className="text-xs text-neutral-400 mb-4">At least one channel is required.</p>
        <div className="flex flex-col gap-4">
          <Input
            id="email_public"
            label="Public email"
            type="email"
            placeholder="hello@yourcompany.com"
            hint="Can differ from your login email"
            error={errors.email_public?.message}
            {...register("email_public")}
          />
          <Input
            id="phone"
            label="Phone number"
            type="tel"
            placeholder="+41 79 123 45 67"
            error={errors.phone?.message}
            {...register("phone")}
          />
          <Input
            id="website_url"
            label="Website"
            type="url"
            placeholder="https://yourcompany.com"
            error={errors.website_url?.message}
            {...register("website_url")}
          />
        </div>
        {/* Contact group error (shown on phone field via schema) */}
        {errors.phone?.message?.includes("least one") && (
          <p className="text-xs text-red-500 mt-2">{errors.phone.message}</p>
        )}
      </div>

      {/* Team size */}
      <div className="border-t border-neutral-100 pt-5">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="team_size"
            className="text-sm font-medium text-neutral-700"
          >
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
