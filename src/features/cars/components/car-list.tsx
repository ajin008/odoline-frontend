// features/cars/components/car-list.tsx
"use client";

import { useEffect, useRef } from "react";
import { useInfiniteCars } from "../hooks/use-infinite-cars";
import { CarCard } from "./car-card";
import { PackageOpen, SearchX, Loader2 } from "lucide-react";

export function CarList({
  statuses,
  sort,
  search,
}: {
  statuses?: string[];
  sort?: string;
  search?: string;
}) {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteCars({ statuses, sort, search });

  // Sentinel for the IntersectionObserver — when it scrolls into view, load
  // the next page. Guarded so we never fire while a fetch is already in
  // flight or once the last page has been reached.
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "400px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-[280px] animate-pulse rounded-2xl bg-inset border border-line"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 rounded-xl border border-danger/20 bg-state-danger-light">
        <p className="text-sm font-medium text-danger font-sans">
          Could not safely sync database status pools. Please check logs.
        </p>
      </div>
    );
  }

  const cars = data?.pages.flatMap((page) => page.data) ?? [];

  if (cars.length === 0) {
    if (search?.trim()) {
      return (
        <div className="rounded-2xl border border-dashed border-ink-subtle/30 bg-card p-12 text-center max-w-md mx-auto my-6 select-none">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-inset text-ink-subtle border border-line mx-auto mb-4">
            <SearchX className="h-5 w-5 stroke-[1.5px]" />
          </div>
          <p className="text-sm font-semibold text-ink font-sans tracking-tight">
            No car found
          </p>
          <p className="mt-1 text-xs text-ink-subtle font-sans">
            No results for &ldquo;{search}&rdquo;. Try a different make or
            model.
          </p>
        </div>
      );
    }

    return (
      <div className="rounded-2xl border border-dashed border-ink-subtle/30 bg-card p-12 text-center max-w-md mx-auto my-6 select-none">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-inset text-ink-subtle border border-line mx-auto mb-4">
          <PackageOpen className="h-5 w-5 stroke-[1.5px]" />
        </div>
        <p className="text-sm font-semibold text-ink font-sans tracking-tight">
          No cars registered here
        </p>
        <p className="mt-1 text-xs text-ink-subtle font-sans">
          New terminal arrivals added by managers will display inside this
          container category.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Shifted seamlessly into modern 4-column architectural layout */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>

      {/* Infinite-scroll sentinel + status row */}
      <div ref={sentinelRef} className="flex items-center justify-center py-8">
        {isFetchingNextPage ? (
          <div className="flex items-center gap-2 text-xs font-medium text-ink-subtle font-sans">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading more…
          </div>
        ) : !hasNextPage ? (
          <p className="text-[11px] font-mono uppercase tracking-widest text-ink-subtle">
            End of list
          </p>
        ) : null}
      </div>
    </div>
  );
}
