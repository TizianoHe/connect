import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StepIndicator } from "@/components/onboarding/StepIndicator";
import { Step5ReviewSubmit } from "@/components/onboarding/Step5ReviewSubmit";

export const metadata = { title: "Step 5 — Bewerbung einreichen" };

export default async function OnboardingStep5() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("sme_profiles")
    .select(
      "business_name, positioning_line, location_city, location_country, team_size, phone, email_public, website_url, avatar_url, category_ids"
    )
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/onboarding/step-1");

  const categoryIds = (profile.category_ids as string[]) ?? [];

  const [{ data: categories }, { data: photos }] = await Promise.all([
    categoryIds.length > 0
      ? supabase.from("service_categories").select("id, name").in("id", categoryIds)
      : { data: [] },
    supabase
      .from("sme_photos")
      .select("id")
      .eq("sme_profile_id", user.id),
  ]);

  const categoryNames = (categories ?? []).map((c) => c.name);
  const photoCount = photos?.length ?? 0;

  return (
    <div className="w-full max-w-lg">
      <div className="flex justify-center mb-10">
        <StepIndicator currentStep={5} />
      </div>
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
        <h1 className="text-2xl font-semibold text-neutral-900 mb-1">
          Bewerbung prüfen
        </h1>
        <p className="text-sm text-neutral-500 mb-8">
          Überprüfen Sie Ihre Angaben und reichen Sie Ihre Bewerbung ein.
        </p>
        <Step5ReviewSubmit
          userId={user.id}
          profile={{
            business_name: profile.business_name,
            positioning_line: profile.positioning_line,
            location_city: profile.location_city,
            location_country: profile.location_country,
            team_size: profile.team_size,
            phone: profile.phone,
            email_public: profile.email_public,
            website_url: profile.website_url,
            avatar_url: profile.avatar_url,
          }}
          categoryNames={categoryNames}
          photoCount={photoCount}
        />
      </div>
    </div>
  );
}
