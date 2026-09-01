"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { useInfiniteBookings } from "@/src/features/booking/hooks/use-bookings";
import { formatIndianNumber } from "@/src/lib/formatters";
import {
  Search,
  CheckCircle2,
  Receipt,
  User,
  Car as CarIcon,
  Calendar,
  Loader2,
  ArrowUpRight,
} from "lucide-react";

function formatClosedDate(dateStr?: string | null): string {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "N/A";
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function CompletedSalesList() {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteBookings({
    tab: "completed",
    role: "owner",
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

  const allBookings = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) ?? [];
  }, [data]);

  // Client-side search filtering
  const filteredBookings = useMemo(() => {
    if (!searchQuery.trim()) return allBookings;
    const q = searchQuery.toLowerCase().trim();
    return allBookings.filter((b) => {
      const bNum = b.booking_number?.toLowerCase() || "";
      const custName = b.customer?.name?.toLowerCase() || "";
      const custPhone = b.customer?.phone || "";
      const carMake = b.car?.make?.toLowerCase() || "";
      const carModel = b.car?.model?.toLowerCase() || "";
      const carReg = b.car?.reg_number?.toLowerCase() || "";
      const repName = b.rep?.name?.toLowerCase() || "";

      return (
        bNum.includes(q) ||
        custName.includes(q) ||
        custPhone.includes(q) ||
        carMake.includes(q) ||
        carModel.includes(q) ||
        carReg.includes(q) ||
        repName.includes(q)
      );
    });
  }, [allBookings, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 rounded-2xl bg-card border border-line p-8">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
        <p className="text-xs font-semibold text-ink-subtle">
          Loading completed sales records...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl bg-rose-500/10 border border-rose-500/20 p-6 text-center space-y-2">
        <p className="text-sm font-bold text-rose-600 dark:text-rose-400">
          Failed to load completed sales records
        </p>
        <p className="text-xs text-ink-muted">
          Please check your connection and try again.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-5">
      {/* ------------------------------------------------------------- */}
      {/* SEARCH BAR & CONTROLS                                         */}
      {/* ------------------------------------------------------------- */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-subtle pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by booking #, customer, car make/model, reg number, or sales rep..."
          className="w-full rounded-xl bg-card border border-line pl-10 pr-16 py-2.5 text-xs font-medium text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-accent hover:text-accent/80 bg-accent/10 px-2.5 py-1 rounded-lg border border-accent/20 transition-colors cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* COMPLETED SALES RECORDS LIST                                  */}
      {/* ------------------------------------------------------------- */}
      {filteredBookings.length === 0 ? (
        <div className="rounded-2xl bg-card border border-line p-12 text-center space-y-3">
          <div className="h-12 w-12 rounded-full bg-inset border border-line flex items-center justify-center text-ink-subtle mx-auto">
            <Receipt className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-ink">
            {searchQuery
              ? "No matching sales records"
              : "No completed sales yet"}
          </h3>
          <p className="text-xs text-ink-muted max-w-sm mx-auto">
            {searchQuery
              ? `No completed sales matching "${searchQuery}". Try a different keyword.`
              : "Completed sales with finalized RC transfers will be listed here automatically."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBookings.map((booking) => {
            const car = booking.car;
            const customer = booking.customer;
            const rep = booking.rep;
            const saleValue = Number(
              booking.agreed_price || booking.amount_paid || 0
            );
            const collected = Number(booking.amount_paid || 0);
            const closedDate = formatClosedDate(
              car?.closed_at || booking.updated_at
            );

            const dossierHref = car?.id
              ? `/owner/sales/dossier/${car.id}`
              : `/owner/booking/${booking.id}`;

            return (
              <Link
                key={booking.id}
                href={dossierHref}
                className="group block rounded-xl bg-card border border-line/70 hover:border-accent/40 p-4 shadow-2xs hover:shadow-bento transition-all duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left Column: Booking #, Car, Customer */}
                  <div className="space-y-2 min-w-0 flex-1">
                    {/* Header line: Booking # & Status Badge */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-extrabold text-accent bg-accent/10 px-2 py-0.5 rounded-md border border-accent/20">
                        {booking.booking_number}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Closed &amp; Sold</span>
                      </span>
                      <span className="text-[11px] text-ink-subtle font-medium flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-ink-subtle/70" />
                        <span>Closed {closedDate}</span>
                      </span>
                    </div>

                    {/* Car details */}
                    <div className="flex items-center gap-2 text-sm font-bold text-ink">
                      <CarIcon className="h-4 w-4 text-ink-subtle shrink-0" />
                      <span className="truncate">
                        {car
                          ? `${car.year} ${car.make} ${car.model}`
                          : "Vehicle N/A"}
                      </span>
                      {car?.reg_number && (
                        <span className="text-xs font-mono font-semibold text-ink-subtle uppercase bg-inset px-1.5 py-0.5 rounded border border-line/60 shrink-0">
                          {car.reg_number}
                        </span>
                      )}
                    </div>

                    {/* Customer & Rep info */}
                    <div className="flex items-center gap-4 text-xs text-ink-muted flex-wrap">
                      <div className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5 text-ink-subtle shrink-0" />
                        <span className="font-semibold text-ink-subtle">
                          {customer?.name || "Customer N/A"}
                        </span>
                        {customer?.phone && (
                          <span className="font-mono text-ink-subtle/80">
                            ({customer.phone})
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-ink-subtle">
                        <span className="text-line">·</span>
                        <span>Sold by:</span>
                        <span className="font-semibold text-ink">
                          {rep?.name || "Unassigned"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Financials & Action Icon */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-line/40 shrink-0">
                    <div className="text-left sm:text-right space-y-0.5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-ink-subtle">
                        Sale Value
                      </div>
                      <div className="text-base font-extrabold font-mono text-ink">
                        ₹{formatIndianNumber(saleValue)}
                      </div>
                      <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center sm:justify-end gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Collected ₹{formatIndianNumber(collected)}</span>
                      </div>
                    </div>

                    <div className="h-8 w-8 rounded-lg bg-inset group-hover:bg-accent group-hover:text-inverse text-ink-subtle flex items-center justify-center transition-colors shrink-0">
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Sentinel element for infinite scroll */}
      <div ref={sentinelRef} className="h-4 w-full" />

      {/* Infinite Scroll loading indicator */}
      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-ink-subtle bg-card px-4 py-2 rounded-full border border-line shadow-2xs">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" />
            <span>Loading more sales records...</span>
          </div>
        </div>
      )}

      {!hasNextPage && allBookings.length > 0 && (
        <div className="text-center py-3 text-xs font-medium text-ink-subtle">
          All {allBookings.length} completed sales records loaded
        </div>
      )}
    </div>
  );
}
