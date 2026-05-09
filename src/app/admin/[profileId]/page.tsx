import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, Globe, Phone, Users, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Logo } from "@/components/shared/Logo";
import { Badge } from "@/components/ui/badge";
import { AdminReviewPanel } from "@/components/admin/AdminReviewPanel";
import { PhotoGallery } from "@/components/sme/PhotoGallery";

export const dynamic = "force-dynamic";

interface AdminProfilePageProps {
  params: Promise<{ profileId: string }>;
}

const TEAM_SIZE_LABELS: Record<string, string> = {
  solo: "Just me",
  "2-5": "2–5 people",
  "6-20": "6–20 people",
  "21-50": "21–50 people",
  "50+": "50+ people",
};

function AvatarFallback({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  const hues = [210, 160, 280, 30, 340, 190];
  const hue = hues[name.charCodeAt(0) % hues.length];
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: `hsl(${hue}, 60%, 92%)` }}
    >
      <span className="text-3xl font-semibold" style={{ color: `hsl(${hue}, 50%, 35%)` }}>
        {initials}
      </span>
    </div>
  );
}

export default async function AdminProfilePage({ params }: AdminProfilePageProps) {
  const { profileId } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) redirect("/dashboard");

  const { data: profile } = await supabase
    .from("sme_profiles")
    .select(
      `*, sme_services(id, title, description, price_from, price_currency,
        service_categories(id, name)),
      sme_photos(id, photo_url, is_primary, display_order)`
    )
    .eq("id", profileId)
    .single();

  if (!profile) notFound();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawPhotos = (profile.sme_photos as any[]) ?? [];
  const primaryPhoto = rawPhotos.find((p: any) => p.is_primary);
  const heroImageUrl: string | null = primaryPhoto?.photo_url ?? profile.avatar_url;
  const galleryPhotos: { id: string; photo_url: string }[] = rawPhotos
    .filter((p: any) => !p.is_primary)
    .sort((a: any, b: any) => a.display_order - b.display_order);

  type Service = {
    id: string;
    title: string;
    description: string | null;
    price_from: number | null;
    price_currency: string;
    service_categories: { id: string; name: string } | null;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawServices = (profile.sme_services as any[]) as Service[];

  const byCategory = rawServices.reduce<
    Map<string, { categoryName: string; services: Service[] }>
  >((acc, svc) => {
    if (!svc.service_categories) return acc;
    const { id: catId, name: catName } = svc.service_categories;
    if (!acc.has(catId)) acc.set(catId, { categoryName: catName, services: [] });
    acc.get(catId)!.services.push(svc);
    return acc;
  }, new Map());

  const categoryNames = [...byCategory.values()].map((c) => c.categoryName);
  const location = [profile.location_city, profile.location_country].filter(Boolean).join(", ");

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b border-neutral-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />
          <span className="text-xs font-medium bg-neutral-900 text-white px-2.5 py-1 rounded-full">
            Admin
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 mb-8 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to admin
        </Link>

        <div className="flex flex-col gap-6">
          {/* Admin review panel */}
          <AdminReviewPanel
            profileId={profileId}
            profileStatus={profile.status}
            businessName={profile.business_name}
            rejectionReason={profile.rejection_reason}
            adminUserId={user.id}
          />

          {/* Hero */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6">
            <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start sm:gap-6">
              <div className="relative w-36 h-36 md:w-48 md:h-48 flex-shrink-0 rounded-xl overflow-hidden bg-neutral-100">
                {heroImageUrl ? (
                  <Image
                    src={heroImageUrl}
                    alt={profile.business_name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 144px, 192px"
                    priority
                  />
                ) : (
                  <AvatarFallback name={profile.business_name} />
                )}
              </div>
              <div className="flex-1 min-w-0 text-center sm:text-left sm:pt-1">
                <h1 className="text-2xl font-semibold text-neutral-900 leading-tight">
                  {profile.business_name}
                </h1>
                {profile.positioning_line && (
                  <p className="text-base text-neutral-500 mt-1.5 leading-snug">
                    {profile.positioning_line}
                  </p>
                )}
                {location && (
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-3 text-sm text-neutral-500">
                    <MapPin size={13} className="flex-shrink-0 text-neutral-400" />
                    <span>{location}</span>
                  </div>
                )}
                {categoryNames.length > 0 && (
                  <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 mt-3">
                    {categoryNames.map((name) => (
                      <Badge key={name} variant="muted">{name}</Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Metadata strip for admin reference */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-5">
            <p className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-3">Profile metadata</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-neutral-400">Profile ID</p>
                <p className="font-mono text-xs text-neutral-700 mt-0.5 break-all">{profileId}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400">Email (account)</p>
                <p className="text-neutral-700 mt-0.5">{profile.email_public ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400">Submitted</p>
                <p className="text-neutral-700 mt-0.5">
                  {profile.submitted_at
                    ? new Date(profile.submitted_at).toLocaleDateString("en-GB", {
                        day: "numeric", month: "short", year: "numeric",
                      })
                    : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-400">Last reviewed</p>
                <p className="text-neutral-700 mt-0.5">
                  {profile.reviewed_at
                    ? new Date(profile.reviewed_at).toLocaleDateString("en-GB", {
                        day: "numeric", month: "short", year: "numeric",
                      })
                    : "—"}
                </p>
              </div>
            </div>
          </div>

          {/* About */}
          {profile.description && (
            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <h2 className="text-sm font-semibold text-neutral-900 mb-3">About</h2>
              <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-line">
                {profile.description}
              </p>
            </div>
          )}

          {/* Best suited for */}
          {profile.best_suited_for && (
            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <h2 className="text-sm font-semibold text-neutral-900 mb-3">Best suited for</h2>
              <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-line">
                {profile.best_suited_for}
              </p>
            </div>
          )}

          {/* How we work */}
          {profile.how_they_work && (
            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <h2 className="text-sm font-semibold text-neutral-900 mb-3">How we work</h2>
              <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-line">
                {profile.how_they_work}
              </p>
            </div>
          )}

          {/* What clients appreciate */}
          {profile.clients_appreciate && (
            <div className="bg-neutral-50 rounded-2xl border border-neutral-100 p-6">
              <h2 className="text-sm font-semibold text-neutral-900 mb-3">What clients appreciate</h2>
              <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-line italic">
                {profile.clients_appreciate}
              </p>
            </div>
          )}

          {/* Photo gallery */}
          {galleryPhotos.length > 0 && (
            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <h2 className="text-sm font-semibold text-neutral-900 mb-4">Photos</h2>
              <PhotoGallery photos={galleryPhotos} />
            </div>
          )}

          {/* Services */}
          {byCategory.size > 0 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-sm font-semibold text-neutral-900">Services</h2>
              {[...byCategory.entries()].map(([catId, { categoryName, services }]) => (
                <div key={catId}>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="muted">{categoryName}</Badge>
                  </div>
                  <div className="flex flex-col gap-2">
                    {services.map((svc) => (
                      <div
                        key={svc.id}
                        className="bg-white rounded-xl border border-neutral-200 px-5 py-4 flex items-center justify-between gap-4"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-neutral-900 text-sm">{svc.title}</p>
                          {svc.description && (
                            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                              {svc.description}
                            </p>
                          )}
                        </div>
                        {svc.price_from != null && (
                          <div className="flex-shrink-0 text-right">
                            <p className="text-sm font-semibold text-neutral-900">
                              From {svc.price_currency}{" "}
                              {Number(svc.price_from).toLocaleString()}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Team + contact */}
          {(profile.team_size || location || profile.website_url || profile.phone) && (
            <div className="flex flex-wrap items-center gap-5 px-1">
              {profile.team_size && (
                <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                  <Users size={13} className="text-neutral-400" />
                  <span>{TEAM_SIZE_LABELS[profile.team_size] ?? profile.team_size}</span>
                </div>
              )}
              {location && (
                <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                  <MapPin size={13} className="text-neutral-400" />
                  <span>{location}</span>
                </div>
              )}
              {profile.website_url && (
                <a
                  href={profile.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900"
                >
                  <Globe size={13} className="text-neutral-400" />
                  <span>{profile.website_url.replace(/^https?:\/\//, "")}</span>
                </a>
              )}
              {profile.phone && (
                <a
                  href={`tel:${profile.phone}`}
                  className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900"
                >
                  <Phone size={13} className="text-neutral-400" />
                  <span>{profile.phone}</span>
                </a>
              )}
            </div>
          )}

          {/* Contact CTA */}
          {profile.email_public && (
            <div className="bg-neutral-900 rounded-2xl p-6 text-white flex items-center justify-between">
              <div>
                <p className="font-semibold">Interested in working together?</p>
                <p className="text-sm text-neutral-400 mt-0.5">Reach out directly — no middleman.</p>
              </div>
              <a
                href={`mailto:${profile.email_public}`}
                className="flex items-center gap-1.5 bg-white text-neutral-900 text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-neutral-100 transition-colors flex-shrink-0"
              >
                Contact <ChevronRight size={14} />
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
