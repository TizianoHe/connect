"use client";

import { useCallback, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ServiceCategory } from "@/types";

export function BrowseFilters({ categories }: { categories: ServiceCategory[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const search = searchParams.get("search") ?? "";
  const categoryId = searchParams.get("category") ?? "";

  const setParam = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(searchParams.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      startTransition(() => {
        router.push(`${pathname}?${next.toString()}`, { scroll: false });
      });
    },
    [router, pathname, searchParams]
  );

  return (
    <div className={cn("flex flex-col gap-3", isPending && "opacity-50 pointer-events-none")}>
      {/* Search input */}
      <div className="relative">
        <Search
          size={14}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
        />
        <input
          type="search"
          defaultValue={search}
          placeholder="Search businesses..."
          onChange={(e) => setParam("search", e.target.value)}
          className="w-full h-10 pl-9 pr-4 rounded-xl border border-neutral-200 bg-white text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 hover:border-neutral-300 transition-colors"
        />
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setParam("category", "")}
          className={cn(
            "whitespace-nowrap shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
            !categoryId
              ? "bg-neutral-900 text-white border-neutral-900"
              : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400"
          )}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setParam("category", cat.id === categoryId ? "" : cat.id)}
            className={cn(
              "whitespace-nowrap shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
              cat.id === categoryId
                ? "bg-neutral-900 text-white border-neutral-900"
                : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
