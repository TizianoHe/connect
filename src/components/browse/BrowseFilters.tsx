"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ServiceCategory } from "@/types";

interface BrowseFiltersProps {
  categories: ServiceCategory[];
}

export function BrowseFilters({ categories }: BrowseFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const search = searchParams.get("search") ?? "";
  const categoryId = searchParams.get("category") ?? "";
  const location = searchParams.get("location") ?? "";

  const hasFilters = !!(search || categoryId || location);

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [router, pathname, searchParams]
  );

  function clearAll() {
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  }

  return (
    <div className={cn("flex flex-col gap-4", isPending && "opacity-70 pointer-events-none transition-opacity")}>
      {/* Search + location row */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
          />
          <input
            type="search"
            defaultValue={search}
            placeholder="Search businesses..."
            onChange={(e) => updateParam("search", e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-white text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 hover:border-neutral-300 transition-colors"
          />
        </div>
        <div className="relative">
          <SlidersHorizontal
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
          />
          <input
            type="text"
            defaultValue={location}
            placeholder="City or country"
            onChange={(e) => updateParam("location", e.target.value)}
            className="w-48 pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-white text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 hover:border-neutral-300 transition-colors"
          />
        </div>
      </div>

      {/* Category chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => updateParam("category", "")}
          className={cn(
            "flex-shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all",
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
            onClick={() =>
              updateParam("category", cat.id === categoryId ? "" : cat.id)
            }
            className={cn(
              "flex-shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all",
              cat.id === categoryId
                ? "bg-neutral-900 text-white border-neutral-900"
                : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Clear filters */}
      {hasFilters && (
        <div className="flex justify-end">
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900"
          >
            <X size={13} />
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
