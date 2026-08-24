import Link from "next/link";
import { Footer } from "@/components/shared/Footer";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { Button } from "@/components/ui/button";
import { createPublicClient } from "@/lib/supabase/public";
import { SMECard, type SMECardData } from "@/components/browse/SMECard";

/**
 * The featured list only ever shows published profiles, which are the same for
 * every visitor. Render it once and refresh every 5 minutes instead of hitting
 * Supabase on every page load.
 */
export const revalidate = 300;

export default async function HomePage() {
  const supabase = createPublicClient();

  const { data: rawProfiles } = await supabase
    .from("sme_profiles")
    .select(
      `id, business_name, tagline, avatar_url, location_city, location_country,
       sme_services(category_id, service_categories(id, name)),
       sme_photos(photo_url, is_primary)`
    )
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(4);

  const featuredSMEs: SMECardData[] = (rawProfiles ?? []).map((p) => {
    const seen = new Set<string>();
    const categories: { id: string; name: string }[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const svc of (p.sme_services ?? []) as any[]) {
      const cat = svc.service_categories;
      if (cat && !seen.has(cat.id)) {
        seen.add(cat.id);
        categories.push({ id: cat.id, name: cat.name });
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const primaryPhotoUrl = ((p.sme_photos as any[]) ?? []).find((ph: any) => ph.is_primary)?.photo_url ?? p.avatar_url;

    return {
      id: p.id,
      business_name: p.business_name,
      tagline: p.tagline,
      avatar_url: primaryPhotoUrl,
      location_city: p.location_city,
      location_country: p.location_country,
      categories,
    };
  });

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <SiteHeader />

      {/* Hero */}
      <section className="flex flex-col items-center px-6 py-16 sm:py-24 text-center">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.14em] text-swiss mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-swiss inline-block" />
            Aufnahme läuft
          </div>
          <h1 className="text-4xl sm:text-6xl text-neutral-900 tracking-tight leading-[1.08] mb-6">
            Unternehmen, die man
            <br className="hidden sm:block" />{" "}
            <span className="italic">kennen sollte.</span>
          </h1>
          <p className="text-lg text-neutral-600 mb-9 max-w-xl mx-auto leading-relaxed">
            Spotted ist kein Verzeichnis. Es ist eine kuratierte Auswahl von
            Schweizer KMU — jedes einzelne persönlich geprüft, bevor es hier
            steht.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto px-8">
                Unternehmen vorstellen
              </Button>
            </Link>
            <Link href="/browse">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto px-8">
                Auswahl ansehen
              </Button>
            </Link>
          </div>
          <p className="font-sans text-xs text-neutral-400 mt-5">
            Jedes Profil wird vor der Veröffentlichung persönlich geprüft.
          </p>
        </div>
      </section>

      {/* Value props */}
      <section className="border-t border-neutral-100 py-16">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
          {[
            {
              title: "Persönlich geprüft",
              body: "Jedes Unternehmen wird angeschaut, bevor es aufgenommen wird. Keine automatischen Einträge, keine gekauften Plätze.",
            },
            {
              title: "Kuratiert, nicht vollständig",
              body: "Wir führen nicht alle Unternehmen. Wir führen die, die man kennen sollte — das ist der ganze Unterschied.",
            },
            {
              title: "Keine Provisionen",
              body: "Sie arbeiten direkt mit Ihren Kundinnen und Kunden. Wir nehmen keinen Anteil an Ihren Aufträgen.",
            },
          ].map(({ title, body }) => (
            <div key={title}>
              <h3 className="text-lg text-neutral-900 mb-2">{title}</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured businesses — only shown when there are published profiles */}
      {featuredSMEs.length > 0 && (
        <section className="border-t border-neutral-100 py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl text-neutral-900">
                Neu in der Auswahl
              </h2>
              <Link
                href="/browse"
                className="font-sans text-sm text-neutral-500 hover:text-swiss transition-colors"
              >
                Alle ansehen →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredSMEs.map((sme) => (
                <SMECard key={sme.id} sme={sme} compact />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Closing CTA */}
      <section className="border-t border-neutral-100 py-20 px-6 bg-olive-soft">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-3xl text-neutral-900 mb-3">
            Gehören Sie dazu?
          </h2>
          <p className="text-neutral-600 mb-7 leading-relaxed">
            Die Aufnahme ist kostenlos. Stellen Sie Ihr Unternehmen vor — wir
            melden uns für die persönliche Prüfung.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto px-8">
                Unternehmen vorstellen
              </Button>
            </Link>
            <Link href="/browse">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto px-8">
                Auswahl ansehen
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
