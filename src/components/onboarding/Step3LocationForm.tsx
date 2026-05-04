"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { step3Schema, type Step3FormData } from "@/lib/validations/profile";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EUROPEAN_COUNTRIES } from "@/lib/constants";

interface Step3LocationFormProps {
  userId: string;
  defaultValues?: Partial<Step3FormData>;
  defaultEmail?: string;
}

export function Step3LocationForm({
  userId,
  defaultValues,
  defaultEmail,
}: Step3LocationFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Step3FormData>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      location_country: "CH",
      email_public: defaultEmail ?? "",
      ...defaultValues,
    },
  });

  async function onSubmit(data: Step3FormData) {
    setServerError(null);
    const supabase = createClient();

    const { error } = await supabase.from("sme_profiles").update({
      location_city: data.location_city,
      location_country: data.location_country,
      email_public: data.email_public || null,
      phone: data.phone || null,
      onboarding_step: 4,
    }).eq("id", userId);

    if (error) {
      setServerError(error.message);
      return;
    }

    router.push("/onboarding/step-4");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <Input
        id="location_city"
        label="City"
        placeholder="Zurich"
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
          className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
          {...register("location_country")}
        >
          {EUROPEAN_COUNTRIES.map(({ code, name }) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>
        {errors.location_country && (
          <p className="text-xs text-red-500 mt-1">
            {errors.location_country.message}
          </p>
        )}
      </div>

      <div className="border-t border-neutral-100 pt-5">
        <p className="text-sm font-medium text-neutral-700 mb-4">
          Contact information{" "}
          <span className="font-normal text-neutral-400">(shown on your profile)</span>
        </p>
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
