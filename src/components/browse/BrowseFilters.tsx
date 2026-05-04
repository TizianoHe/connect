"use client";

import { useState, useRef, useEffect, useCallback, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, SlidersHorizontal, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ServiceCategory } from "@/types";

const PRICE_OPTIONS = [
  { label: "Any price", value: "" },
  { label: "Under CHF 100", value: "under100" },
  { label: "CHF 100–500", value: "100-500" },
  { label: "CHF 500–1k", value: "500-1000" },
  { label: "Over CHF 1k", value: "over1000" },
];

export function BrowseFilters({ categories }: { categories: ServiceCategory[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const search = searchParams.get("search") ?? "";
  const categoryId = searchParams.get("category") ?? "";
  const location = searchParams.get("location") ?? "";
  const sort = searchParams.get("sort") ?? "";
  const price = searchParams.get("price") ?? "";

  const isPanelActive = !!(location || price || sort);

  useEffect(() => {
    if (!isOpen) return;
    function onMouseDown(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [router, pathname, searchParams]
  );

  function clearPanelFilters() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("location");
    params.delete("price");
    params.delete("sort");
    startTransition(() => {
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        isPending && "opacity-60 pointer-events-none transition-opacity"
      )}
    >
      {/* Row 1: search + Filters button */}
      <div className="flex gap-2">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
          />
          <input
            type="search"
            defaultValue={search}
            placeholder="Search businesses…"
            onChange={(e) => updateParam("search", e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-neutral-200 bg-white text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 hover:border-neutral-300 transition-colors"
          />
        </div>

        {/* Filters button + panel */}
        <div ref={panelRef} className="relative flex-shrink-0">
          <button
            onClick={() => setIsOpen((v) => !v)}
            className={cn(
              "flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-medium transition-all",
              isOpen || isPanelActive
                ? "bg-neutral-900 text-white border-neutral-900"
                : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400"
            )}
          >
            <SlidersHorizontal size={14} />
            Filters
            {isPanelActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
            )}
          </button>

          {/* Mobile backdrop */}
          {isOpen && (
            <div
              className="sm:hidden fixed inset-0 bg-black/30 z-40"
              onClick={() => setIsOpen(false)}
            />
          )}

          {isOpen && (
            <div
              className={cn(
                "z-50 bg-white border border-neutral-200 shadow-2xl",
                // Mobile: bottom sheet
                "fixed bottom-0 left-0 right-0 rounded-t-2xl p-6",
                // Desktop: absolute dropdown below button, right-aligned, fixed width
                "sm:absolute sm:bottom-auto sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:w-[340px] sm:rounded-2xl sm:p-5"
              )}
            >
              {/* Mobile drag handle */}
              <div className="sm:hidden flex justify-center mb-4">
                <div className="w-10 h-1 bg-neutral-200 rounded-full" />
              </div>

              {/* Mobile close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="sm:hidden absolute top-4 right-4 p-1 text-neutral-400 hover:text-neutral-900"
              >
                <X size={18} />
              </button>

              {/* Location */}
              <div className="mb-5">
                <label className="block text-xs font-semibold text-neutral-700 mb-2 uppercase tracking-wide">
                  Location
                </label>
                <input
                  key={location}
                  type="text"
                  defaultValue={location}
                  placeholder="City or country"
                  onChange={(e) => updateParam("location", e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 hover:border-neutral-300 transition-colors"
                />
              </div>

              {/* Price range */}
              <div className="mb-5">
                <label className="block text-xs font-semibold text-neutral-700 mb-2 uppercase tracking-wide">
                  Price range
                </label>
                <div className="flex flex-wrap gap-2">
                  {PRICE_OPTIONS.map(({ label, value }) => (
                    <button
                      key={value}
                      onClick={() => updateParam("price", value)}
                      className={cn(
                        "whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                        price === value || (value === "" && !price)
                          ? "bg-neutral-900 text-white border-neutral-900"
                          : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort by */}
              <div className="mb-5">
                <label className="block text-xs font-semibold text-neutral-700 mb-2 uppercase tracking-wide">
                  Sort by
                </label>
                <div className="relative">
                  <ChevronDown
                    size={13}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                  />
                  <select
                    value={sort}
                    onChange={(e) => updateParam("sort", e.target.value)}
                    className="appearance-none w-full pl-3.5 pr-8 py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-900 hover:border-neutral-300 transition-colors cursor-pointer"
                  >
                    <option value="">Newest first</option>
                    <option value="alpha">A–Z</option>
                    <option value="updated">Recently updated</option>
                  </select>
                </div>
              </div>

              {/* Panel footer */}
              <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                <button
                  onClick={clearPanelFilters}
                  className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 px-4 py-1.5 rounded-lg transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Row 2: category chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => updateParam("category", "")}
          className={cn(
            "whitespace-nowrap flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
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
            onClick={() => updateParam("category", cat.id === categoryId ? "" : cat.id)}
            className={cn(
              "whitespace-nowrap flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
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
