import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ProfileCompletenessCard } from "@/components/dashboard/ProfileCompletenessCard";
import { PhotosManager } from "@/components/dashboard/PhotosManager";
import { SubmitForReviewButton } from "@/components/dashboard/SubmitForReviewButton";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Pencil, Plus, AlertTriangle, Clock, CheckCircle2, EyeOff } from "lucide-react";

export const metadata = { title: "Dashboard — Spotted" };

const EDITABLE_STATUSES = ["draft", "rejected", "unpublished"];

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

  const { data: rawPhotos } = await supabase
    .from("sme_photos")
    .select("id, photo_url, is_primary, display_order")
    .eq("sme_profile_id", user.id)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });

  // One-time backfill: if the profile has avatar_url but no primary row in sme_photos,
  // insert one so the dashboard and public page both have a consistent source of truth.
  let photos = rawPhotos ?? [];
  const hasPrimary = photos.some((p) => p.is_primary);
  if (profile.avatar_url && !hasPrimary) {
    const { data: inserted } = await supabase
      .from("sme_photos")
      .insert({
        sme_profile_id: user.id,
        photo_url: profile.avatar_url,
        is_primary: true,
        display_order: 0,
      })
      .select("id, photo_url, is_primary, display_order")
      .single();
    if (inserted) photos = [inserted, ...photos];
  }

  const hasPhoto = photos.some((p) => p.is_primary);
  const status = profile.status as string;
  const isEditable = EDITABLE_STATUSES.includes(status);

  const step1Done = !!profile.business_name && !!profile.description;
  const step2Done = (serviceCount ?? 0) > 0;
  const step3Done = !!profile.location_city;
  const isReadyToSubmit = step1Done && step2Done && step3Done && hasPhoto;

  const statusBadgeVariant =
    status === "published" ? "success" :
    status === "pending_review" ? "muted" :
    status === "rejected" ? "muted" : "muted";

  const statusLabel =
    status === "published" ? "Published" :
    status === "pending_review" ? "Under review" :
    status === "rejected" ? "Changes needed" :
    status === "unpublished" ? "Unpublished" : "Draft";

  return (
    <div className="flex flex-col gap-8">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-semibold text-neutral-900">
            {profile.business_name}
          </h1>
          <Badge variant={statusBadgeVariant}>
            {statusLabel}
          </Badge>
        </div>
        <p className="text-sm text-neutral-500">
          Manage your business profile and track your visibility.
        </p>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Services listed", value: serviceCount ?? 0 },
          {
            label: "Member since",
            value: new Date(profile.created_at).toLocaleDateString("en-GB", {
              month: "short",
              year: "numeric",
            }),
          },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-2xl border border-neutral-200 px-5 py-4">
            <p className="text-2xl font-semibold text-neutral-900">{value}</p>
            <p className="text-xs text-neutral-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Status banners ───────────────────────────────────────────────────── */}

      {status === "pending_review" && (
        <div className="bg-neutral-50 border border-neutral-200 rounded-2xl px-5 py-4 flex items-start gap-3">
          <Clock size={18} className="text-neutral-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-neutral-900 text-sm">Your profile is under review</p>
            <p className="text-sm text-neutral-500 mt-0.5">
              We&apos;ll review it shortly. Your profile is not yet visible to the public.
            </p>
          </div>
        </div>
      )}

      {status === "published" && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4 flex items-start gap-3">
          <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-emerald-900 text-sm">Your profile is live on Spotted</p>
            <p className="text-sm text-emerald-700 mt-0.5">
              Clients can discover and contact you directly.
            </p>
          </div>
          <Link
            href={`/sme/${user.id}`}
            className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 hover:text-emerald-900 flex-shrink-0"
          >
            View profile <ExternalLink size={12} />
          </Link>
        </div>
      )}

      {status === "rejected" && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-start gap-3">
          <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-amber-900 text-sm">Changes needed before publication</p>
            {profile.rejection_reason && (
              <p className="text-sm text-amber-800 mt-1.5 leading-relaxed">
                {profile.rejection_reason}
              </p>
            )}
            <p className="text-xs text-amber-600 mt-2">
              Update your profile and resubmit for review.
            </p>
          </div>
        </div>
      )}

      {status === "unpublished" && (
        <div className="bg-neutral-50 border border-neutral-200 rounded-2xl px-5 py-4 flex items-start gap-3">
          <EyeOff size={18} className="text-neutral-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-neutral-900 text-sm">Your profile has been unpublished</p>
            <p className="text-sm text-neutral-500 mt-0.5">
              Update your profile and resubmit for review to go live again.
            </p>
          </div>
        </div>
      )}

      {/* ── Submit for review ────────────────────────────────────────────────── */}
      {status === "draft" && isReadyToSubmit && (
        <div className="bg-white border border-neutral-200 rounded-2xl px-5 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="font-medium text-neutral-900 text-sm">Ready to submit for review</p>
            <p className="text-sm text-neutral-500 mt-0.5">
              Your profile is complete. Submit it and we&apos;ll review it shortly.
            </p>
          </div>
          <SubmitForReviewButton userId={user.id} />
        </div>
      )}

      {(status === "rejected" || status === "unpublished") && (
        <div className="flex items-center gap-3">
          <SubmitForReviewButton
            userId={user.id}
            label={status === "rejected" ? "Resubmit for review" : "Submit for review"}
          />
        </div>
      )}

      {/* ── Completeness + Quick actions (editable states only) ──────────────── */}
      {isEditable && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfileCompletenessCard
            profile={profile}
            serviceCount={serviceCount ?? 0}
            hasPhoto={hasPhoto}
          />

          <div className="bg-white rounded-2xl border border-neutral-200 p-6">
            <h2 className="font-semibold text-neutral-900 mb-4">Quick actions</h2>
            <div className="flex flex-col gap-2">
              {[
                {
                  label: "Edit profile",
                  description: "Update your business information",
                  href: "/onboarding/step-1",
                  icon: Pencil,
                },
                {
                  label: "Add services",
                  description: "List more services you offer",
                  href: "/onboarding/step-2",
                  icon: Plus,
                },
                {
                  label: "Preview public listing",
                  description: "See how clients see you",
                  href: `/sme/${user.id}`,
                  icon: ExternalLink,
                },
              ].map(({ label, description, href, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition-colors"
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
      )}

      <PhotosManager userId={user.id} initialPhotos={photos} />
    </div>
  );
}
