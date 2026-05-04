import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Globe,
  Mail,
  Phone,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Logo } from "@/components/shared/Logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

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
      <span
        className="text-5xl font-semibold"
        style={{ color: `hsl(${hue}, 50%, 35%)` }}
      >
        {initials}
      </span>
    </div>
  );
}

export async function generateMetadata({ params }: ProfilePageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("sme_profiles")
    .select("business_name, tagline")
    .eq("id", id)
    .eq("is_published", true)
    .single();
  if (!data) return { title: "Business not found — Connect" };
  return {
    title: `${data.business_name} — Connect`,
    description: data.tagline ?? undefined,
  };
}

export default async function SMEProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("sme_profiles")
    .select(
      `*, sme_services(id, title, description, price_from, price_currency,
        service_categories(id, name))`
    )
    .eq("id", id)
    .eq("is_published", true)
    .single();

  if (!profile) notFound();

  // Group services by category
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

  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Nav */}
      <header className="bg-white border-b border-neutral-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-3">
            {user ? (
              <Link href="/dashboard">
                <Button variant="secondary" size="sm">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Sign in</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">List your business</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Back link */}
        <Link
          href="/browse"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 mb-8 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to browse
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left column: avatar + contact */}
          <div className="flex flex-col gap-5">
            {/* Avatar */}
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-neutral-100 shadow-sm">
              {profile.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={profile.business_name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority
                />
              ) : (
                <AvatarFallback name={profile.business_name} />
              )}
            </div>

            {/* Contact card */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-5 flex flex-col gap-3">
              <h2 className="text-sm font-semibold text-neutral-900">
                Contact
              </h2>
              <div className="flex flex-col gap-2.5">
                {profile.location_city && (
                  <div className="flex items-start gap-2.5 text-sm text-neutral-600">
                    <MapPin size={15} className="mt-0.5 flex-shrink-0 text-neutral-400" />
                    <span>
                      {[profile.location_city, profile.location_country]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </div>
                )}
                {profile.email_public && (
                  <a
                    href={`mailto:${profile.email_public}`}
                    className="flex items-start gap-2.5 text-sm text-neutral-600 hover:text-neutral-900 break-all"
                  >
                    <Mail size={15} className="mt-0.5 flex-shrink-0 text-neutral-400" />
                    <span>{profile.email_public}</span>
                  </a>
                )}
                {profile.phone && (
                  <a
                    href={`tel:${profile.phone}`}
                    className="flex items-center gap-2.5 text-sm text-neutral-600 hover:text-neutral-900"
                  >
                    <Phone size={15} className="flex-shrink-0 text-neutral-400" />
                    <span>{profile.phone}</span>
                  </a>
                )}
                {profile.website_url && (
                  <a
                    href={profile.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-sm text-neutral-600 hover:text-neutral-900"
                  >
                    <Globe size={15} className="flex-shrink-0 text-neutral-400" />
                    <span className="truncate">
                      {profile.website_url.replace(/^https?:\/\//, "")}
                    </span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right column: main content */}
          <div className="md:col-span-2 flex flex-col gap-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-semibold text-neutral-900">
                {profile.business_name}
              </h1>
              {profile.tagline && (
                <p className="text-lg text-neutral-500 mt-2">{profile.tagline}</p>
              )}
            </div>

            {/* Description */}
            {profile.description && (
              <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                <h2 className="text-sm font-semibold text-neutral-900 mb-3">
                  About
                </h2>
                <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-line">
                  {profile.description}
                </p>
              </div>
            )}

            {/* Services grouped by category */}
            {byCategory.size > 0 && (
              <div className="flex flex-col gap-4">
                <h2 className="text-sm font-semibold text-neutral-900">
                  Services
                </h2>
                {[...byCategory.entries()].map(
                  ([catId, { categoryName, services }]) => (
                    <div key={catId}>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="muted">{categoryName}</Badge>
                      </div>
                      <div className="flex flex-col gap-2">
                        {services.map((svc) => (
                          <div
                            key={svc.id}
                            className="bg-white rounded-xl border border-neutral-200 px-5 py-4 flex items-start justify-between gap-4"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-neutral-900 text-sm">
                                {svc.title}
                              </p>
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
                  )
                )}
              </div>
            )}

            {/* CTA */}
            {profile.email_public && (
              <div className="bg-neutral-900 rounded-2xl p-6 text-white flex items-center justify-between">
                <div>
                  <p className="font-semibold">Interested in working together?</p>
                  <p className="text-sm text-neutral-400 mt-0.5">
                    Reach out directly — no middleman.
                  </p>
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
        </div>
      </main>
    </div>
  );
}
