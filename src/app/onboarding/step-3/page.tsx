import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StepIndicator } from "@/components/onboarding/StepIndicator";
import { Step3LocationForm } from "@/components/onboarding/Step3LocationForm";

export const metadata = { title: "Step 3 — Location & contact" };

export default async function OnboardingStep3() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("sme_profiles")
    .select("location_city, location_country, email_public, phone")
    .eq("id", user.id)
    .single();

  return (
    <div className="w-full max-w-lg">
      <div className="flex justify-center mb-10">
        <StepIndicator currentStep={3} />
      </div>
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
        <h1 className="text-2xl font-semibold text-neutral-900 mb-1">
          Where are you based?
        </h1>
        <p className="text-sm text-neutral-500 mb-8">
          Clients search by location, so make sure this is accurate.
        </p>
        <Step3LocationForm
          userId={user.id}
          defaultValues={profile ? {
            location_city: profile.location_city ?? undefined,
            location_country: profile.location_country,
            email_public: profile.email_public ?? undefined,
            phone: profile.phone ?? undefined,
          } : undefined}
          defaultEmail={user.email}
        />
      </div>
    </div>
  );
}
