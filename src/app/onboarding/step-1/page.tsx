import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StepIndicator } from "@/components/onboarding/StepIndicator";
import { Step1BusinessForm } from "@/components/onboarding/Step1BusinessForm";

export const metadata = { title: "Step 1 — Business" };

export default async function OnboardingStep1() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: categories }] = await Promise.all([
    supabase
      .from("sme_profiles")
      .select(
        "business_name, category_ids, location_city, location_country, location_type, service_area, phone, email_public, website_url, team_size"
      )
      .eq("id", user.id)
      .single(),
    supabase
      .from("service_categories")
      .select("*")
      .order("sort_order"),
  ]);

  return (
    <div className="w-full max-w-lg">
      <div className="flex justify-center mb-10">
        <StepIndicator currentStep={1} />
      </div>
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
        <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Ihr Unternehmen</h1>
        <p className="text-sm text-neutral-500 mb-8">
          Diese Angaben erscheinen auf Ihrem öffentlichen Profil.
        </p>
        <Step1BusinessForm
          userId={user.id}
          categories={categories ?? []}
          defaultValues={
            profile
              ? {
                  business_name: profile.business_name,
                  category_ids: (profile.category_ids as string[]) ?? [],
                  location_city: profile.location_city ?? undefined,
                  location_country: profile.location_country,
                  location_type:
                    (profile.location_type as "physical" | "service_area") ??
                    undefined,
                  service_area: profile.service_area ?? undefined,
                  phone: profile.phone ?? undefined,
                  email_public: profile.email_public ?? undefined,
                  website_url: profile.website_url ?? undefined,
                  team_size: profile.team_size ?? undefined,
                }
              : undefined
          }
        />
      </div>
    </div>
  );
}
