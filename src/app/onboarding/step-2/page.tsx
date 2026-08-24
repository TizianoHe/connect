import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StepIndicator } from "@/components/onboarding/StepIndicator";
import { Step2StoryForm } from "@/components/onboarding/Step2StoryForm";

export const metadata = { title: "Step 2 — Story" };

export default async function OnboardingStep2() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("sme_profiles")
    .select("positioning_line, best_suited_for, how_they_work, clients_appreciate")
    .eq("id", user.id)
    .single();

  return (
    <div className="w-full max-w-lg">
      <div className="flex justify-center mb-10">
        <StepIndicator currentStep={2} />
      </div>
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
        <h1 className="text-2xl font-semibold text-neutral-900 mb-1">
          Ihre Geschichte
        </h1>
        <p className="text-sm text-neutral-500 mb-8">
          Helfen Sie Kunden zu verstehen, wer Sie sind und für wen Sie arbeiten.
        </p>
        <Step2StoryForm
          userId={user.id}
          defaultValues={
            profile
              ? {
                  positioning_line: profile.positioning_line ?? undefined,
                  best_suited_for: profile.best_suited_for ?? undefined,
                  how_they_work: profile.how_they_work ?? undefined,
                  clients_appreciate: profile.clients_appreciate ?? undefined,
                }
              : undefined
          }
        />
      </div>
    </div>
  );
}
