import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { SMECard, type SMECardData } from "@/components/browse/SMECard";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: rawProfiles } = await supabase
    .from("sme_profiles")
    .select(
      `id, business_name, tagline, avatar_url, location_city, location_country,
       sme_services(category_id, service_categories(id, name))`
    )
    .eq("is_published", true)
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
    return {
      id: p.id,
      business_name: p.business_name,
      tagline: p.tagline,
      avatar_url: p.avatar_url,
      location_city: p.location_city,
      location_country: p.location_country,
      categories,
    };
  });

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Nav */}
      <header className="border-b border-neutral-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">List your business</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center px-6 py-12 sm:py-16 text-center">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-neutral-100 text-neutral-600 text-sm px-4 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            Now in early access
          </div>
          <h1 className="text-5xl sm:text-6xl font-semibold text-neutral-900 tracking-tight leading-[1.1] mb-4">
            Be discovered for the work you do,
            <br />
            <span className="text-neutral-600 italic">not the ads you run.</span>
          </h1>
          <p className="text-lg text-neutral-500 mb-8 max-w-lg mx-auto leading-relaxed">
            Spotted is a directory of Swiss small businesses — built for clients who want clarity, and businesses that want to be found for the right reasons.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto px-8">
                List your business — it&apos;s free
              </Button>
            </Link>
            <Link href="/browse">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto px-8">
                Find a service
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="border-t border-neutral-100 py-16">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
          {[
            {
              title: "Build your profile",
              body: "Company name, description, services, location, and contact — all in one place.",
            },
            {
              title: "Get discovered",
              body: "Clients search and filter by service category and location to find the right fit.",
            },
            {
              title: "No commissions",
              body: "Connect directly with clients. We don't take a cut of your contracts.",
            },
          ].map(({ title, body }) => (
            <div key={title}>
              <h3 className="font-semibold text-neutral-900 mb-2">{title}</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured businesses — only shown when there are published profiles */}
      {featuredSMEs.length > 0 && (
        <section className="border-t border-neutral-100 py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-neutral-900">
                Recently joined
              </h2>
              <Link
                href="/browse"
                className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                View all →
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
      <section className="border-t border-neutral-100 py-16 px-6 bg-neutral-50">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-3">
            Ready to get found?
          </h2>
          <p className="text-neutral-500 mb-7 leading-relaxed">
            Join Spotted for free. Build your profile in minutes and start
            appearing in front of clients looking for exactly what you offer.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto px-8">
                List your business — it&apos;s free
              </Button>
            </Link>
            <Link href="/browse">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto px-8">
                Browse the directory
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
