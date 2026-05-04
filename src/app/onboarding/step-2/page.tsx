import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StepIndicator } from "@/components/onboarding/StepIndicator";
import { Step2ServicesForm } from "@/components/onboarding/Step2ServicesForm";

export const metadata = { title: "Step 2 — Services" };

export default async function OnboardingStep2() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: categories }, { data: existingServices }] = await Promise.all([
    supabase
      .from("service_categories")
      .select("*")
      .order("sort_order"),
    supabase
      .from("sme_services")
      .select("category_id")
      .eq("sme_id", user.id),
  ]);

  const defaultSelectedIds = [
    ...new Set(existingServices?.map((s) => s.category_id) ?? []),
  ];

  return (
    <div className="w-full max-w-lg">
      <div className="flex justify-center mb-10">
        <StepIndicator currentStep={2} />
      </div>
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
        <h1 className="text-2xl font-semibold text-neutral-900 mb-1">
          What services do you offer?
        </h1>
        <p className="text-sm text-neutral-500 mb-8">
          Select categories and add individual services. Clients will filter by these.
        </p>
        <Step2ServicesForm
          userId={user.id}
          categories={categories ?? []}
          defaultSelectedIds={defaultSelectedIds}
        />
      </div>
    </div>
  );
}
