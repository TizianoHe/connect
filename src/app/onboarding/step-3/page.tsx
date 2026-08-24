import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StepIndicator } from "@/components/onboarding/StepIndicator";
import { Step3DetailsForm } from "@/components/onboarding/Step3DetailsForm";

export const metadata = { title: "Step 3 — Details" };

export default async function OnboardingStep3() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: categories }, { data: existingServices }] =
    await Promise.all([
      supabase
        .from("sme_profiles")
        .select(
          "languages, booking_url, uid_number, wheelchair_accessible, opening_hours"
        )
        .eq("id", user.id)
        .single(),
      supabase.from("service_categories").select("*").order("sort_order"),
      supabase
        .from("sme_services")
        .select("id, category_id, title, description, price_from, price_currency")
        .eq("sme_id", user.id),
    ]);

  const openingHoursRaw = profile?.opening_hours as Record<string, string> | null;

  return (
    <div className="w-full max-w-lg">
      <div className="flex justify-center mb-10">
        <StepIndicator currentStep={3} />
      </div>
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
        <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Details</h1>
        <p className="text-sm text-neutral-500 mb-8">
          Alle Angaben auf dieser Seite sind optional.
        </p>
        <Step3DetailsForm
          userId={user.id}
          categories={categories ?? []}
          existingServices={existingServices ?? []}
          defaultValues={
            profile
              ? {
                  languages:
                    ((profile.languages as string[]) ?? []).filter((l) =>
                      ["de", "fr", "it", "en"].includes(l)
                    ) as ("de" | "fr" | "it" | "en")[],
                  booking_url: profile.booking_url ?? undefined,
                  uid_number: profile.uid_number ?? undefined,
                  wheelchair_accessible:
                    profile.wheelchair_accessible === true
                      ? "true"
                      : profile.wheelchair_accessible === false
                      ? "false"
                      : undefined,
                  opening_hours: openingHoursRaw ?? undefined,
                }
              : undefined
          }
        />
      </div>
    </div>
  );
}
