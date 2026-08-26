import { Suspense } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { BrowseFilters } from "@/components/browse/BrowseFilters";
import { SMECard, type SMECardData } from "@/components/browse/SMECard";
import { Footer } from "@/components/shared/Footer";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Unternehmen entdecken",
  description: "Schweizer KMU mit geprüften Profilen nach Kategorie und Ort durchsuchen.",
};

interface BrowsePageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
  }>;
}

async function BrowseContent({
  search,
  categoryId,
}: {
  search: string;
  categoryId: string;
}) {
  const supabase = await createClient();
  const hasFilters = !!(search || categoryId);

  // ── Category pre-filter ──────────────────────────────────────────────────
  let filteredIds: string[] | null = null;
  if (categoryId) {
    const { data } = await supabase
      .from("sme_services")
      .select("sme_id")
      .eq("category_id", categoryId);
    filteredIds = [...new Set(data?.map((r) => r.sme_id) ?? [])];
    if (filteredIds.length === 0) {
      return <EmptyState hasFilters />;
    }
  }

  // ── Main query ───────────────────────────────────────────────────────────
  let query = supabase
    .from("sme_profiles")
    .select(
      `id, business_name, tagline, description, avatar_url, location_city, location_country,
       sme_services(category_id, service_categories(id, name)),
       sme_photos(photo_url, is_primary)`
    )
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (search) {
    query = query.or(
      `business_name.ilike.%${search}%,tagline.ilike.%${search}%`
    );
  }
  if (filteredIds) {
    query = query.in("id", filteredIds);
  }

  const { data: profiles } = await query;
  if (!profiles || profiles.length === 0) {
    return <EmptyState hasFilters={hasFilters} />;
  }

  // ── Shape data ───────────────────────────────────────────────────────────
  const cards: SMECardData[] = profiles.map((p) => {
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
      description: p.description,
      avatar_url: primaryPhotoUrl,
      location_city: p.location_city,
      location_country: p.location_country,
      categories,
      service_count: (p.sme_services ?? []).length,
    };
  });

  const n = cards.length;
  const countLabel = `${n} Unternehmen`;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-neutral-500">{countLabel}</p>
        {hasFilters && (
          <Link
            href="/browse"
            className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            Filter zurücksetzen
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((sme) => (
          <SMECard key={sme.id} sme={sme} />
        ))}
      </div>
    </>
  );
}

function EmptyState({ hasFilters = false }: { hasFilters?: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 bg-neutral-100 rounded-2xl flex items-center justify-center mb-4">
        <svg
          className="w-6 h-6 text-neutral-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <h3 className="text-lg text-neutral-900 mb-1">Nichts gefunden</h3>
      <p className="text-sm text-neutral-500 mb-5">
        {hasFilters
          ? "Zu diesen Filtern gibt es noch keine Treffer."
          : "Wir bauen gerade auf. Schauen Sie bald wieder vorbei."}
      </p>
      {hasFilters && (
        <Link href="/browse">
          <Button variant="secondary" size="sm">Filter zurücksetzen</Button>
        </Link>
      )}
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-4 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-16 h-16 flex-shrink-0 bg-neutral-100 rounded-xl" />
        <div className="flex-1 flex flex-col gap-1.5 pt-0.5">
          <div className="h-3.5 bg-neutral-100 rounded-lg w-3/4" />
          <div className="h-3 bg-neutral-100 rounded-lg w-1/2" />
          <div className="h-3 bg-neutral-100 rounded-lg w-4/5 mt-0.5" />
          <div className="flex gap-1.5 mt-1">
            <div className="h-5 bg-neutral-100 rounded-full w-16" />
            <div className="h-5 bg-neutral-100 rounded-full w-14" />
          </div>
          <div className="h-3 bg-neutral-100 rounded-lg w-2/5 mt-0.5" />
        </div>
      </div>
    </div>
  );
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const params = await searchParams;
  const search = params.search ?? "";
  const categoryId = params.category ?? "";

  const supabase = await createClient();
  const [{ data: categories }, { data: { user } = { user: null } }] =
    await Promise.all([
      supabase.from("service_categories").select("*").order("sort_order"),
      supabase.auth.getUser(),
    ]);

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <SiteHeader
        signedIn={!!user}
        width="max-w-7xl"
        className="sticky top-0 z-10"
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        {/* Page title */}
        <div className="mb-5">
          <h1 className="text-3xl text-neutral-900 tracking-tight">
            Unternehmen
          </h1>
        </div>

        {/* Filters */}
        <div className="mb-4">
          <Suspense fallback={null}>
            <BrowseFilters categories={categories ?? []} />
          </Suspense>
        </div>

        {/* Grid */}
        <Suspense
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          }
        >
          <BrowseContent search={search} categoryId={categoryId} />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
