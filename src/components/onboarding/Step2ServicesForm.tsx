"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { step2Schema, type Step2FormData } from "@/lib/validations/profile";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CURRENCIES } from "@/lib/constants";
import type { ServiceCategory } from "@/types";

interface Step2ServicesFormProps {
  userId: string;
  categories: ServiceCategory[];
  defaultSelectedIds?: string[];
}

export function Step2ServicesForm({
  userId,
  categories,
  defaultSelectedIds = [],
}: Step2ServicesFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>(defaultSelectedIds);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const [servicesError, setServicesError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Step2FormData>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      selected_category_ids: defaultSelectedIds,
      services: [],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "services" });

  function toggleCategory(categoryId: string) {
    setSelectedIds((prev) => {
      const next = prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : prev.length < 5
        ? [...prev, categoryId]
        : prev;
      setValue("selected_category_ids", next, { shouldValidate: true });
      return next;
    });
  }

  function addService(categoryId: string) {
    setServicesError(null);
    append({
      category_id: categoryId,
      title: "",
      description: "",
      price_from: "",
      price_currency: "CHF",
    });
    setExpandedIndex(fields.length);
  }

  const onSubmit: SubmitHandler<Step2FormData> = async (data) => {
    setServicesError(null);
    if (fields.length === 0) {
      setServicesError("Add at least one service before continuing.");
      return;
    }
    setServerError(null);
    const supabase = createClient();

    await supabase.from("sme_services").delete().eq("sme_id", userId);

    if (data.services.length > 0) {
      const { error: servicesError } = await supabase.from("sme_services").insert(
        data.services.map((s) => ({
          sme_id: userId,
          category_id: s.category_id,
          title: s.title,
          description: s.description || null,
          price_from: s.price_from ? Number(s.price_from) : null,
          price_currency: s.price_currency,
        }))
      );
      if (servicesError) {
        setServerError(servicesError.message);
        return;
      }
    }

    const { error: profileError } = await supabase
      .from("sme_profiles")
      .update({ onboarding_step: 3 })
      .eq("id", userId);

    if (profileError) {
      setServerError(profileError.message);
      return;
    }

    router.push("/onboarding/step-3");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {/* Category selection */}
      <div>
        <p className="text-sm font-medium text-neutral-700 mb-3">
          Select categories{" "}
          <span className="font-normal text-neutral-400">(up to 5)</span>
        </p>
        <div className="grid grid-cols-2 gap-2">
          {categories.map((cat) => {
            const isSelected = selectedIds.includes(cat.id);
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
        {errors.selected_category_ids && (
          <p className="text-xs text-red-500 mt-2">
            {errors.selected_category_ids.message}
          </p>
        )}
      </div>

      {/* Service entries */}
      {selectedIds.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-neutral-700">Your services</p>
            <button
              type="button"
              onClick={() => addService(selectedIds[0])}
              className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900"
            >
              <Plus size={12} /> Add service
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {fields.map((field, index) => {
              const category = categories.find(
                (c) => c.id === field.category_id
              );
              const isExpanded = expandedIndex === index;

              return (
                <div
                  key={field.id}
                  className="border border-neutral-200 rounded-xl overflow-hidden"
                >
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
                      <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                          <label className="text-xs font-medium text-neutral-600 block mb-1">
                            Category
                          </label>
                          <select
                            className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                            {...register(`services.${index}.category_id`)}
                          >
                            {selectedIds.map((id) => {
                              const cat = categories.find((c) => c.id === id);
                              return cat ? (
                                <option key={id} value={id}>
                                  {cat.name}
                                </option>
                              ) : null;
                            })}
                          </select>
                        </div>
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
                              <option key={c} value={c}>
                                {c}
                              </option>
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
          {fields.length === 0 && (
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => addService(selectedIds[0])}
                className={cn(
                  "w-full border-2 border-dashed rounded-xl py-6 text-sm transition-colors flex items-center justify-center gap-2",
                  servicesError
                    ? "border-red-300 text-red-500 hover:border-red-400"
                    : "border-neutral-200 text-neutral-400 hover:border-neutral-300 hover:text-neutral-600"
                )}
              >
                <Plus size={14} /> Add your first service
              </button>
              {servicesError && (
                <p className="text-xs text-red-500">{servicesError}</p>
              )}
            </div>
          )}
        </div>
      )}

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
