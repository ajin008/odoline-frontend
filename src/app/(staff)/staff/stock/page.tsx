"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useInfiniteStaffStock } from "@/src/features/cars/hooks/use-infinite-cars";
import { StaffCarCard } from "@/src/features/cars/components/staff-car-card";
import { StaffStockFilters } from "@/src/features/cars/components/staff-stock-filters";
import { Car, Loader2, RefreshCw } from "lucide-react";

export default function StaffStockPage() {
  const [search, setSearch] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);

  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleResetFilters = useCallback(() => {
    setSearch("");
    setFuelType("");
    setMinPrice(undefined);
    setMaxPrice(undefined);
  }, []);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteStaffStock({
    sort: "newest",
    search,
    fuel_type: fuelType,
    min_price: minPrice,
    max_price: maxPrice,
  });

  // Automatic Infinite Scroll Sentinel Observer
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1, rootMargin: "200px" }
    );

    observer.observe(sentinel);

    return () => {
      observer.unobserve(sentinel);
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allItems = data?.pages.flatMap((page) => page.data) || [];

  return (
    <div className="w-full space-y-6 font-sans select-none">
      {/* Header Section */}
      <div className="flex items-center justify-between border-b border-line/60 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-ink font-sans">
            Showroom Car Stock
          </h1>
          <p className="text-xs text-ink-muted mt-0.5">
            Search and filter active showroom vehicles, asking prices, and vehicle specifications.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-ink-subtle bg-card border border-line rounded-lg hover:text-ink transition-colors cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5 stroke-[2px]" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Search & Filters Toolbar */}
      <StaffStockFilters
        search={search}
        onSearchChange={setSearch}
        fuelType={fuelType}
        onFuelTypeChange={setFuelType}
        minPrice={minPrice}
        onMinPriceChange={setMinPrice}
        maxPrice={maxPrice}
        onMaxPriceChange={setMaxPrice}
        onReset={handleResetFilters}
      />

      {/* Main Grid View */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-64 rounded-xl border border-line bg-card p-3.5 space-y-3 animate-pulse"
            >
              <div className="h-32 rounded-lg bg-inset" />
              <div className="h-4 w-2/3 rounded bg-inset" />
              <div className="h-3 w-1/3 rounded bg-inset" />
              <div className="h-5 w-1/2 rounded bg-inset mt-3" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50/50 p-8 text-center space-y-3">
          <p className="text-sm font-semibold text-red-600">
            Failed to load showroom stock.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-4 py-2 text-xs font-bold text-white bg-accent rounded-lg cursor-pointer"
          >
            Retry Loading
          </button>
        </div>
      ) : allItems.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line bg-inset/50 p-10 text-center space-y-3">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-card border border-line text-ink-subtle">
            <Car className="h-5 w-5 stroke-[1.75px]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-ink font-sans">
              No Vehicles Matching Search
            </h3>
            <p className="text-xs text-ink-subtle max-w-sm mx-auto">
              No vehicles found for the current search query or price filters. Try adjusting your filters or search terms.
            </p>
          </div>
          {search || fuelType || minPrice || maxPrice ? (
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-accent rounded-lg hover:bg-accent/90"
            >
              Clear All Filters
            </button>
          ) : null}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {allItems.map((car) => (
              <StaffCarCard key={car.id} car={car} />
            ))}
          </div>

          {/* Invisible Sentinel Element for Automatic Infinite Scroll */}
          <div
            ref={sentinelRef}
            className="h-4 w-full opacity-0 pointer-events-none"
          />

          {/* Loading More Indicator */}
          {isFetchingNextPage && (
            <div className="flex items-center justify-center py-6 gap-2 text-ink-subtle">
              <Loader2 className="h-4 w-4 animate-spin text-accent stroke-[2.5px]" />
              <span className="text-xs font-semibold font-sans">
                Loading more vehicles...
              </span>
            </div>
          )}

          {/* End of List State */}
          {!hasNextPage && allItems.length > 0 && (
            <div className="py-6 text-center text-xs font-medium text-ink-subtle font-sans border-t border-line/40 mt-4">
              You&apos;ve reached the end of the showroom stock.
            </div>
          )}
        </>
      )}
    </div>
  );
}
