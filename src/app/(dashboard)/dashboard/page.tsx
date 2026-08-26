import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getProfileCompleteness } from "@/lib/profile-validation";
import { ProfileCompletenessCard } from "@/components/dashboard/ProfileCompletenessCard";
import { PhotosManager } from "@/components/dashboard/PhotosManager";
import { SubmitForReviewButton } from "@/components/dashboard/SubmitForReviewButton";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Pencil, Plus, AlertTriangle, Clock, CheckCircle2, EyeOff, Circle } from "lucide-react";

export const metadata = { title: "Dashboard" };

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

  const { isComplete, missingItems } = getProfileCompleteness(
    { business_name: profile.business_name, description: profile.description, location_city: profile.location_city },
    serviceCount ?? 0,
    hasPhoto
  );

  const statusBadgeVariant =
    status === "published" ? "success" :
    status === "pending_review" ? "muted" :
    status === "rejected" ? "muted" : "muted";

  const statusLabel =
    status === "published" ? "Veröffentlicht" :
    status === "pending_review" ? "In Prüfung" :
    status === "rejected" ? "Änderungen nötig" :
    status === "unpublished" ? "Offline" : "Entwurf";

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
          Hier verwalten Sie Ihr Profil und sehen, wie es auf Spotted erscheint.
        </p>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Erfasste Leistungen", value: serviceCount ?? 0 },
          {
            label: "Dabei seit",
            value: new Date(profile.created_at).toLocaleDateString("de-CH", {
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
            <p className="font-medium text-neutral-900 text-sm">Ihr Profil wird geprüft</p>
            <p className="text-sm text-neutral-500 mt-0.5">
              Wir schauen es uns in Kürze an. Bis dahin ist es nicht öffentlich sichtbar.
            </p>
          </div>
        </div>
      )}

      {status === "published" && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4 flex items-start gap-3">
          <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-emerald-900 text-sm">Ihr Profil ist online</p>
            <p className="text-sm text-emerald-700 mt-0.5">
              Interessentinnen und Interessenten finden Sie jetzt und können Sie direkt kontaktieren.
            </p>
          </div>
          <Link
            href={`/sme/${user.id}`}
            className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 hover:text-emerald-900 flex-shrink-0"
          >
            Profil ansehen <ExternalLink size={12} />
          </Link>
        </div>
      )}

      {status === "rejected" && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-start gap-3">
          <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-amber-900 text-sm">Vor der Veröffentlichung sind Änderungen nötig</p>
            {profile.rejection_reason && (
              <p className="text-sm text-amber-800 mt-1.5 leading-relaxed">
                {profile.rejection_reason}
              </p>
            )}
            <p className="text-xs text-amber-600 mt-2">
              Passen Sie Ihr Profil an und reichen Sie es erneut ein.
            </p>
          </div>
        </div>
      )}

      {status === "unpublished" && (
        <div className="bg-neutral-50 border border-neutral-200 rounded-2xl px-5 py-4 flex items-start gap-3">
          <EyeOff size={18} className="text-neutral-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-neutral-900 text-sm">Ihr Profil ist offline</p>
            <p className="text-sm text-neutral-500 mt-0.5">
              Passen Sie es an und reichen Sie es erneut ein, damit es wieder online geht.
            </p>
          </div>
        </div>
      )}

      {/* ── Missing items banner (draft or rejected/unpublished + incomplete) ── */}
      {(status === "draft" || status === "rejected" || status === "unpublished") && !isComplete && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
          <p className="font-medium text-amber-900 text-sm mb-1">Ihr Profil ist fast fertig</p>
          <p className="text-sm text-amber-700 mb-3">
            Das fehlt noch, bevor Sie es einreichen können:
          </p>
          <ul className="flex flex-col gap-2">
            {missingItems.map((item) => (
              <li key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Circle size={12} className="text-amber-400 flex-shrink-0" />
                  <span className="text-sm text-amber-800">{item.label}</span>
                </div>
                <Link
                  href={item.href}
                  className="text-xs font-medium text-amber-900 hover:underline flex-shrink-0"
                >
                  Ergänzen →
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Submit for review ────────────────────────────────────────────────── */}
      {status === "draft" && isComplete && (
        <div className="bg-white border border-neutral-200 rounded-2xl px-5 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="font-medium text-neutral-900 text-sm">Bereit zum Einreichen</p>
            <p className="text-sm text-neutral-500 mt-0.5">
              Ihr Profil ist vollständig. Reichen Sie es ein, wir schauen es uns in Kürze an.
            </p>
          </div>
          <SubmitForReviewButton userId={user.id} />
        </div>
      )}

      {(status === "rejected" || status === "unpublished") && isComplete && (
        <div className="flex items-center gap-3">
          <SubmitForReviewButton
            userId={user.id}
            label={status === "rejected" ? "Erneut einreichen" : "Zur Prüfung einreichen"}
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
            <h2 className="font-semibold text-neutral-900 mb-4">Schnellzugriff</h2>
            <div className="flex flex-col gap-2">
              {[
                {
                  label: "Profil bearbeiten",
                  description: "Angaben zu Ihrem Unternehmen ändern",
                  href: "/onboarding/step-1",
                  icon: Pencil,
                },
                {
                  label: "Leistungen ergänzen",
                  description: "Weitere Leistungen erfassen",
                  href: "/onboarding/step-2",
                  icon: Plus,
                },
                {
                  label: "Öffentliches Profil ansehen",
                  description: "So sehen Suchende Ihr Unternehmen",
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
