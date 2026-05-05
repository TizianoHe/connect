import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ProfileCompletenessCard } from "@/components/dashboard/ProfileCompletenessCard";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Pencil, Plus } from "lucide-react";

export const metadata = { title: "Dashboard — Spotted" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("sme_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/onboarding/step-1");

  const { count: serviceCount } = await supabase
    .from("sme_services")
    .select("*", { count: "exact", head: true })
    .eq("sme_id", user.id);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-semibold text-neutral-900">
            {profile.business_name}
          </h1>
          <Badge variant={profile.is_published ? "success" : "muted"}>
            {profile.is_published ? "Published" : "Draft"}
          </Badge>
        </div>
        <p className="text-sm text-neutral-500">
          Manage your business profile and track your visibility.
        </p>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Services listed", value: serviceCount ?? 0 },
          {
            label: "Member since",
            value: new Date(profile.created_at).toLocaleDateString("en-GB", {
              month: "short",
              year: "numeric",
            }),
          },
          { label: "Profile views", value: "—" },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-2xl border border-neutral-200 px-5 py-4">
            <p className="text-2xl font-semibold text-neutral-900">{value}</p>
            <p className="text-xs text-neutral-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProfileCompletenessCard
          profile={profile}
          serviceCount={serviceCount ?? 0}
        />

        {/* Quick actions */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <h2 className="font-semibold text-neutral-900 mb-4">Quick actions</h2>
          <div className="flex flex-col gap-2">
            {[
              {
                label: "Edit profile",
                description: "Update your business information",
                href: "/onboarding/step-1",
                icon: Pencil,
                active: true,
              },
              {
                label: "Add services",
                description: "List more services you offer",
                href: "/onboarding/step-2",
                icon: Plus,
                active: true,
              },
              {
                label: "Preview public listing",
                description: "See how clients see you",
                href: `/sme/${user.id}`,
                icon: ExternalLink,
                active: true,
              },
            ].map(({ label, description, href, icon: Icon, active }) => (
              <Link
                key={label}
                href={href}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl border transition-colors ${
                  active
                    ? "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                    : "border-neutral-100 opacity-40 cursor-not-allowed pointer-events-none"
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center flex-shrink-0">
                  <Icon size={15} className="text-neutral-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-900">{label}</p>
                  <p className="text-xs text-neutral-500">{description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
