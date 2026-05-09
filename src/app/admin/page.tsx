import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Logo } from "@/components/shared/Logo";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin — Spotted" };

interface AdminPageProps {
  searchParams: Promise<{ tab?: string }>;
}

const TABS = [
  { key: "pending", label: "Pending review", status: "pending_review" },
  { key: "published", label: "Published", status: "published" },
  { key: "rejected", label: "Rejected", status: "rejected" },
  { key: "all", label: "All", status: null },
];

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) redirect("/dashboard");

  const { tab = "pending" } = await searchParams;
  const activeTab = TABS.find((t) => t.key === tab) ?? TABS[0];

  let query = supabase
    .from("sme_profiles")
    .select("id, business_name, status, submitted_at, reviewed_at")
    .order("submitted_at", { ascending: false, nullsFirst: false });

  if (activeTab.status) {
    query = query.eq("status", activeTab.status);
  }

  const { data: profiles } = await query;

  const { data: allProfiles } = await supabase
    .from("sme_profiles")
    .select("status");

  const counts: Record<string, number> = {
    pending: 0,
    published: 0,
    rejected: 0,
    all: 0,
  };
  for (const p of allProfiles ?? []) {
    counts.all++;
    if (p.status === "pending_review") counts.pending++;
    else if (p.status === "published") counts.published++;
    else if (p.status === "rejected") counts.rejected++;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b border-neutral-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />
          <span className="text-xs font-medium bg-neutral-900 text-white px-2.5 py-1 rounded-full">
            Admin
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold text-neutral-900 mb-6">Profile review</h1>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-neutral-100 p-1 rounded-xl w-fit">
          {TABS.map(({ key, label }) => (
            <Link
              key={key}
              href={`/admin?tab=${key}`}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab.key === key
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              {label}
              <span className={`text-xs tabular-nums ${activeTab.key === key ? "text-neutral-500" : "text-neutral-400"}`}>
                {counts[key]}
              </span>
            </Link>
          ))}
        </div>

        {/* Profile list */}
        {!profiles || profiles.length === 0 ? (
          <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
            <p className="text-neutral-500 text-sm">No profiles in this category.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {profiles.map((p) => (
              <Link
                key={p.id}
                href={`/admin/${p.id}`}
                className="bg-white rounded-2xl border border-neutral-200 px-5 py-4 flex items-center justify-between hover:border-neutral-300 transition-colors group"
              >
                <div>
                  <p className="font-medium text-neutral-900">{p.business_name}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {p.submitted_at
                      ? `Submitted ${new Date(p.submitted_at).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}`
                      : "Not yet submitted"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      p.status === "pending_review"
                        ? "bg-neutral-900 text-white"
                        : p.status === "published"
                        ? "bg-emerald-100 text-emerald-700"
                        : p.status === "rejected"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-neutral-100 text-neutral-600"
                    }`}
                  >
                    {p.status === "pending_review"
                      ? "Under review"
                      : p.status === "published"
                      ? "Published"
                      : p.status === "rejected"
                      ? "Rejected"
                      : p.status === "unpublished"
                      ? "Unpublished"
                      : "Draft"}
                  </span>
                  <span className="text-neutral-300 group-hover:text-neutral-500 transition-colors">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
