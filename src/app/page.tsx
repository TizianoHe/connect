import Link from "next/link";
import Image from "next/image";
import { Search, ShieldCheck, Sparkles, HandCoins, MapPin } from "lucide-react";
import { Footer } from "@/components/shared/Footer";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { Button } from "@/components/ui/button";
import { createPublicClient } from "@/lib/supabase/public";
import { SMECard, type SMECardData } from "@/components/browse/SMECard";

/**
 * Everything here is public and identical for every visitor, so the page is
 * rendered once and refreshed on a schedule rather than rebuilt per request.
 */
export const revalidate = 300;

const TRUST = [
  {
    icon: ShieldCheck,
    title: "Persönlich geprüft",
    body: "Jedes Unternehmen wird angeschaut, bevor es aufgenommen wird.",
  },
  {
    icon: Sparkles,
    title: "Kuratiert, nicht vollständig",
    body: "Wir führen nicht alle. Wir führen die, die man kennen sollte.",
  },
  {
    icon: HandCoins,
    title: "Keine Provisionen",
    body: "Sie arbeiten direkt mit Ihren Kundinnen und Kunden.",
  },
  {
    icon: MapPin,
    title: "Aus der Ostschweiz",
    body: "Gestartet in St. Gallen, mit Unternehmen aus der Region.",
  },
];

export default async function HomePage() {
  const supabase = createPublicClient();

  const [{ data: rawProfiles }, { data: categories }] = await Promise.all([
    supabase
      .from("sme_profiles")
      .select(
        `id, business_name, tagline, avatar_url, location_city, location_country,
         sme_services(category_id, service_categories(id, name)),
         sme_photos(photo_url, is_primary)`
      )
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(7),
    supabase.from("service_categories").select("id, name").order("sort_order").limit(6),
  ]);

  const featuredSMEs: SMECardData[] = (rawProfiles ?? []).map((p) => {
    const seen = new Set<string>();
    const cats: { id: string; name: string }[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const svc of (p.sme_services ?? []) as any[]) {
      const cat = svc.service_categories;
      if (cat && !seen.has(cat.id)) {
        seen.add(cat.id);
        cats.push({ id: cat.id, name: cat.name });
      }
    }
    const primaryPhotoUrl =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((p.sme_photos as any[]) ?? []).find((ph: any) => ph.is_primary)?.photo_url ??
      p.avatar_url;

    return {
      id: p.id,
      business_name: p.business_name,
      tagline: p.tagline,
      avatar_url: primaryPhotoUrl,
      location_city: p.location_city,
      location_country: p.location_country,
      categories: cats,
    };
  });

  const spotlight = featuredSMEs[0];

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <SiteHeader />

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="w-full max-w-6xl mx-auto px-6 pt-12 pb-16 sm:pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,25rem)] gap-12 lg:gap-16 items-start">
          <div>
            {/*
              text-wrap:normal overrides the global `balance` on headings. Balance
              re-flows lines to even out their length, which fights the deliberate
              break between the two sentences and produced a stray one-word line.
            */}
            <h1 className="text-[2.25rem] sm:text-5xl lg:text-[3.25rem] font-extrabold text-neutral-900 leading-[1.06] [text-wrap:normal]">
              Gefunden werden für Ihre Arbeit
              <span className="text-accent">.</span>
              <br />
              <span className="text-neutral-400">Nicht für Ihre Werbung.</span>
            </h1>

            <p className="text-lg text-neutral-600 mt-7 max-w-md leading-relaxed">
              Spotted ist kein Verzeichnis, sondern eine kuratierte Auswahl von
              Schweizer KMU — jedes einzelne persönlich geprüft.
            </p>

            <form
              action="/browse"
              className="mt-9 flex items-center gap-2 bg-white border border-neutral-200 rounded-2xl p-2 pl-4 max-w-lg focus-within:border-neutral-400 transition-colors"
            >
              <Search size={18} className="text-neutral-400 flex-shrink-0" />
              <input
                type="search"
                name="search"
                placeholder="Unternehmen, Dienstleistung oder Ort"
                aria-label="Auswahl durchsuchen"
                className="flex-1 min-w-0 bg-transparent text-[15px] text-neutral-900 placeholder:text-neutral-400 outline-none py-2"
              />
              <Button type="submit" size="sm" className="flex-shrink-0 px-4 py-2.5">
                Suchen
              </Button>
            </form>

            {(categories?.length ?? 0) > 0 && (
              <div className="mt-7">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-neutral-400 mb-3">
                  Wonach suchen Sie?
                </p>
                <div className="flex flex-wrap gap-2">
                  {categories?.map((c) => (
                    <Link
                      key={c.id}
                      href={`/browse?category=${c.id}`}
                      className="px-3.5 py-2 rounded-full border border-neutral-200 text-sm text-neutral-700 hover:border-accent hover:text-accent transition-colors"
                    >
                      {c.name}
                    </Link>
                  ))}
                  <Link
                    href="/browse"
                    className="px-3.5 py-2 rounded-full border border-neutral-200 text-sm text-neutral-500 hover:border-neutral-400 transition-colors"
                  >
                    Alle
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/*
            Spotlight: a real published business when one exists, otherwise an
            honest note about the selection being built. Never an empty grey
            rectangle, and never an invented listing — the whole promise of this
            site is that everything on it was actually checked.
          */}
          <aside className="w-full">
            {spotlight ? (
              <Link
                href={`/sme/${spotlight.id}`}
                className="block rounded-3xl overflow-hidden border border-neutral-200 bg-white hover:border-neutral-300 transition-colors group"
              >
                <div className="relative aspect-[4/3] bg-neutral-100">
                  {spotlight.avatar_url ? (
                    <Image
                      src={spotlight.avatar_url}
                      alt={spotlight.business_name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 25rem"
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-5xl font-extrabold text-neutral-300">
                        {spotlight.business_name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-accent mb-2">
                    Spotted
                  </p>
                  <p className="text-xl font-bold text-neutral-900 group-hover:text-accent transition-colors">
                    {spotlight.business_name}
                  </p>
                  {spotlight.location_city && (
                    <p className="text-sm text-neutral-500 mt-0.5">
                      {spotlight.location_city}
                    </p>
                  )}
                  {spotlight.tagline && (
                    <p className="text-sm text-neutral-600 mt-3 leading-relaxed">
                      {spotlight.tagline}
                    </p>
                  )}
                </div>
              </Link>
            ) : (
              <div className="rounded-3xl border border-neutral-200 bg-sand p-7">
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-accent mb-4">
                  Die Auswahl entsteht gerade
                </p>
                <p className="text-xl font-bold text-neutral-900 leading-snug mb-4">
                  Noch ist hier nichts zu sehen — und das ist Absicht.
                </p>
                <p className="text-sm text-neutral-600 leading-relaxed mb-6">
                  Wir nehmen die ersten Unternehmen einzeln auf und sprechen mit
                  jedem persönlich. Sobald die ersten Profile geprüft sind,
                  stehen sie hier.
                </p>
                <Link href="/signup">
                  <Button size="sm">Ihr Unternehmen vorstellen</Button>
                </Link>
              </div>
            )}
          </aside>
        </div>
      </section>

      {/* ── Neu in der Auswahl ──────────────────────────────────── */}
      {featuredSMEs.length > 1 && (
        <section className="w-full max-w-6xl mx-auto px-6 py-14 border-t border-neutral-100">
          <div className="flex items-end justify-between mb-7 gap-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
              Neu in der Auswahl<span className="text-accent">.</span>
            </h2>
            <Link
              href="/browse"
              className="text-sm text-accent hover:text-accent-dark transition-colors whitespace-nowrap"
            >
              Alle ansehen →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredSMEs.slice(1).map((sme) => (
              <SMECard key={sme.id} sme={sme} compact />
            ))}
          </div>
        </section>
      )}

      {/* ── For businesses ──────────────────────────────────────── */}
      <section className="bg-sand border-y border-neutral-100">
        <div className="w-full max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mb-4">
              Gehören Sie dazu<span className="text-accent">?</span>
            </h2>
            <p className="text-neutral-600 leading-relaxed max-w-md">
              Die Aufnahme ist kostenlos. Stellen Sie Ihr Unternehmen vor — wir
              melden uns für die persönliche Prüfung. Kein Ranking, keine
              bezahlten Plätze, keine Provision auf Ihre Aufträge.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 lg:justify-end">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto px-7">
                Unternehmen vorstellen
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto px-7">
                So funktioniert es
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Trust row ───────────────────────────────────────────── */}
      <section className="w-full max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {TRUST.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex gap-3.5">
              <Icon
                size={20}
                strokeWidth={1.75}
                className="text-accent flex-shrink-0 mt-0.5"
              />
              <div>
                <p className="font-bold text-neutral-900 text-[15px] mb-1">{title}</p>
                <p className="text-sm text-neutral-500 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
