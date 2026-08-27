"use client";

import { useState, useEffect, useRef } from "react";
import { useInfiniteBookings } from "../hooks/use-bookings";
import { BookingCard } from "./booking-card";
import {
  CalendarCheck,
  CalendarX,
  Loader2,
  AlertTriangle,
  Flame,
  CheckCircle2,
} from "lucide-react";

type BookingSubtab = "active" | "closed";

export function BookingList() {
  const [activeTab, setActiveTab] = useState<BookingSubtab>("active");

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteBookings({
    status: activeTab,
  });

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

  const bookings = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <div className="space-y-4 font-sans select-none">
      {/* 1. Header Subtabs Bar */}
      <div className="border-b border-line/60 pb-3">
        <div className="flex h-9 items-center gap-1 overflow-x-auto rounded-lg bg-inset p-1 border border-line/40 w-full sm:w-fit no-scrollbar shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("active")}
            className={`flex-1 sm:flex-initial h-full text-center rounded-md px-4 flex items-center justify-center gap-2 text-xs font-bold tracking-tight transition-all duration-200 cursor-pointer whitespace-nowrap ${
              activeTab === "active"
                ? "bg-accent text-inverse shadow-xs font-bold"
                : "text-ink-muted hover:text-ink hover:bg-card/50 font-medium"
            }`}
          >
            <Flame className="h-3.5 w-3.5 shrink-0" />
            <span>Active Bookings</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("closed")}
            className={`flex-1 sm:flex-initial h-full text-center rounded-md px-4 flex items-center justify-center gap-2 text-xs font-bold tracking-tight transition-all duration-200 cursor-pointer whitespace-nowrap ${
              activeTab === "closed"
                ? "bg-slate-700 text-white dark:bg-slate-800 shadow-xs font-bold"
                : "text-ink-muted hover:text-ink hover:bg-card/50 font-medium"
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
            <span>Closed Bookings</span>
          </button>
        </div>
      </div>

      {/* 2. Loading State (Skeletons) */}
      {isLoading && (
        <div className="rounded-2xl border border-line bg-card overflow-hidden divide-y divide-line/60 shadow-xs">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="p-4 space-y-3 lg:space-y-0 flex flex-col lg:flex-row lg:items-center justify-between gap-4 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-inset rounded-xl" />
                <div className="space-y-1.5">
                  <div className="h-4 w-28 bg-inset rounded-md" />
                  <div className="h-3 w-20 bg-inset rounded-md" />
                </div>
              </div>
              <div className="h-4 w-32 bg-inset rounded-md" />
              <div className="h-4 w-40 bg-inset rounded-md" />
              <div className="h-8 w-48 bg-inset rounded-lg" />
            </div>
          ))}
        </div>
      )}

      {/* 3. Error State */}
      {isError && !isLoading && (
        <div className="rounded-xl border border-dashed border-rose-500/30 bg-rose-500/5 p-8 text-center space-y-3">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-ink font-sans">
              Failed to load bookings
            </h3>
            <p className="text-xs text-ink-subtle">
              An error occurred while communicating with the server.
            </p>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-line text-xs font-semibold text-ink hover:bg-inset transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* 4. Empty State */}
      {!isLoading && !isError && bookings.length === 0 && (
        <div className="rounded-xl border border-dashed border-line bg-inset p-8 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-card border border-line text-ink-subtle">
            {activeTab === "active" ? (
              <CalendarCheck className="h-6 w-6 stroke-[1.8]" />
            ) : (
              <CalendarX className="h-6 w-6 stroke-[1.8]" />
            )}
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-ink font-sans">
              {activeTab === "active"
                ? "No active bookings yet"
                : "No closed bookings yet"}
            </h3>
            <p className="text-xs text-ink-subtle max-w-sm mx-auto">
              {activeTab === "active"
                ? "When leads are closed as won and prebooked, their booking records will appear in this list."
                : "Completed sales and cancelled vehicle bookings will be listed here."}
            </p>
          </div>
        </div>
      )}

      {/* 5. Bookings List View */}
      {!isLoading && !isError && bookings.length > 0 && (
        <div className="rounded-2xl border border-line bg-card overflow-hidden divide-y divide-line/60 shadow-xs">
          {bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              activeTab={activeTab}
            />
          ))}
        </div>
      )}

      {/* 6. Infinite Scroll Trigger / Loader */}
      <div ref={sentinelRef} className="py-4 text-center">
        {isFetchingNextPage && (
          <div className="inline-flex items-center gap-2 text-xs font-medium text-ink-muted">
            <Loader2 className="h-4 w-4 animate-spin text-accent" />
            <span>Loading more bookings...</span>
          </div>
        )}
        {!hasNextPage && bookings.length > 0 && !isLoading && (
          <p className="text-xs text-ink-subtle">All bookings loaded</p>
        )}
      </div>
    </div>
  );
}
