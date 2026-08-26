import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StepIndicator } from "@/components/onboarding/StepIndicator";
import { Step4AvatarUpload } from "@/components/onboarding/Step4AvatarUpload";

export const metadata = { title: "Schritt 4: Foto" };

export default async function OnboardingStep4() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("sme_profiles")
    .select("business_name, avatar_url")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/onboarding/step-1");

  return (
    <div className="w-full max-w-lg">
      <div className="flex justify-center mb-10">
        <StepIndicator currentStep={4} />
      </div>
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
        <h1 className="text-2xl font-semibold text-neutral-900 mb-1">
          Logo oder Foto hinzufügen
        </h1>
        <p className="text-sm text-neutral-500 mb-8">
          Profile mit Bild werden deutlich häufiger angeklickt. JPEG, PNG oder WebP, bis 5 MB.
        </p>
        <Step4AvatarUpload
          userId={user.id}
          currentAvatarUrl={profile.avatar_url}
        />
      </div>
    </div>
  );
}
