import { Suspense } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { BrowseFilters } from "@/components/browse/BrowseFilters";
import { SMECard, type SMECardData } from "@/components/browse/SMECard";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Browse businesses — Connect" };

interface BrowsePageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    location?: string;
  }>;
}

async function BrowseContent({
  search,
  categoryId,
  location,
}: {
  search: string;
  categoryId: string;
  location: string;
}) {
  const supabase = await createClient();

  // If category filter active, get matching SME ids first
  let categoryFilteredIds: string[] | null = null;
  if (categoryId) {
    const { data } = await supabase
      .from("sme_services")
      .select("sme_id")
      .eq("category_id", categoryId);
    categoryFilteredIds = [...new Set(data?.map((r) => r.sme_id) ?? [])];
    if (categoryFilteredIds.length === 0) {
      return <EmptyState />;
    }
  }

  let query = supabase
    .from("sme_profiles")
    .select(
      `id, business_name, tagline, avatar_url, location_city, location_country,
       sme_services(category_id, service_categories(id, name))`
    )
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (search) {
    query = query.or(
      `business_name.ilike.%${search}%,tagline.ilike.%${search}%`
    );
  }
  if (location) {
    query = query.or(
      `location_city.ilike.%${location}%,location_country.ilike.%${location}%`
    );
  }
  if (categoryFilteredIds) {
    query = query.in("id", categoryFilteredIds);
  }

  const { data: profiles } = await query;

  if (!profiles || profiles.length === 0) {
    return <EmptyState />;
  }

  // Shape data for cards — deduplicate categories per SME
  const cards: SMECardData[] = profiles.map((p) => {
    const seen = new Set<string>();
    const categories: { id: string; name: string }[] = [];
    for (const svc of p.sme_services ?? []) {
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
    <>
      <p className="text-sm text-neutral-500 mb-6">
        {cards.length} {cards.length === 1 ? "business" : "businesses"} found
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((sme) => (
          <SMECard key={sme.id} sme={sme} />
        ))}
      </div>
    </>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mb-4">
        <svg
          className="w-7 h-7 text-neutral-400"
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
      <h3 className="font-semibold text-neutral-900 mb-1">No businesses found</h3>
      <p className="text-sm text-neutral-500">
        Try adjusting your search or clearing filters.
      </p>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-neutral-200 animate-pulse">
      <div className="aspect-[4/3] bg-neutral-100" />
      <div className="p-5 flex flex-col gap-3">
        <div className="h-4 bg-neutral-100 rounded-lg w-3/4" />
        <div className="h-3 bg-neutral-100 rounded-lg w-1/2" />
        <div className="flex gap-2">
          <div className="h-5 bg-neutral-100 rounded-full w-20" />
          <div className="h-5 bg-neutral-100 rounded-full w-16" />
        </div>
      </div>
    </div>
  );
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const params = await searchParams;
  const search = params.search ?? "";
  const categoryId = params.category ?? "";
  const location = params.location ?? "";

  const supabase = await createClient();
  const [{ data: categories }, { data: { user } = { user: null } }] =
    await Promise.all([
      supabase.from("service_categories").select("*").order("sort_order"),
      supabase.auth.getUser(),
    ]);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Nav */}
      <header className="bg-white border-b border-neutral-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
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

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-neutral-900">
            Find a service provider
          </h1>
          <p className="text-neutral-500 mt-1">
            Browse verified local businesses and connect directly.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <Suspense fallback={null}>
            <BrowseFilters categories={categories ?? []} />
          </Suspense>
        </div>

        {/* Grid */}
        <Suspense
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          }
        >
          <BrowseContent
            search={search}
            categoryId={categoryId}
            location={location}
          />
        </Suspense>
      </main>
    </div>
  );
}
