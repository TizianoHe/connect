import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StepIndicator } from "@/components/onboarding/StepIndicator";
import { Step1BusinessForm } from "@/components/onboarding/Step1BusinessForm";

export const metadata = { title: "Step 1 — Business basics" };

export default async function OnboardingStep1() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("sme_profiles")
    .select("business_name, tagline, description, website_url, positioning_line, best_suited_for, how_they_work, clients_appreciate, team_size")
    .eq("id", user.id)
    .single();

  return (
    <div className="w-full max-w-lg">
      <div className="flex justify-center mb-10">
        <StepIndicator currentStep={1} />
      </div>
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
        <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Tell us about your business</h1>
        <p className="text-sm text-neutral-500 mb-8">
          This information appears on your public profile.
        </p>
        <Step1BusinessForm
          userId={user.id}
          defaultValues={profile ? {
            business_name: profile.business_name,
            tagline: profile.tagline ?? undefined,
            description: profile.description ?? undefined,
            website_url: profile.website_url ?? undefined,
            positioning_line: profile.positioning_line ?? undefined,
            best_suited_for: profile.best_suited_for ?? undefined,
            how_they_work: profile.how_they_work ?? undefined,
            clients_appreciate: profile.clients_appreciate ?? undefined,
            team_size: (profile.team_size as "solo" | "2-5" | "6-20" | "21-50" | "50+" | undefined) ?? undefined,
          } : undefined}
        />
      </div>
    </div>
  );
}
