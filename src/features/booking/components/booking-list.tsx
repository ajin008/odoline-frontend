"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useInfiniteBookings } from "../hooks/use-bookings";
import { BookingCard } from "./booking-card";
import {
  CalendarCheck,
  CalendarX,
  Loader2,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Search,
  IndianRupee,
  Receipt,
  PiggyBank,
  Clock,
  X,
} from "lucide-react";

type BookingSubtab = "active" | "closed";

function formatCurrency(num: number): string {
  if (num >= 100000) {
    return `₹${(num / 100000).toFixed(2)}L`;
  }
  return `₹${num.toLocaleString("en-IN")}`;
}

export function BookingList() {
  const [activeTab, setActiveTab] = useState<BookingSubtab>("active");
  const [searchQuery, setSearchQuery] = useState("");

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

      return (
        bNum.includes(q) ||
        custName.includes(q) ||
        custPhone.includes(q) ||
        carMake.includes(q) ||
        carModel.includes(q) ||
        carReg.includes(q)
      );
    });
  }, [allBookings, searchQuery]);

  // KPI Summary calculations
  const kpiStats = useMemo(() => {
    let agreedSum = 0;
    let paidSum = 0;
    let balanceSum = 0;

    allBookings.forEach((b) => {
      agreedSum += Number(b.agreed_price || 0);
      paidSum += Number(b.amount_paid || 0);
      balanceSum += Number(b.balance_due || 0);
    });

    return {
      count: allBookings.length,
      agreedSum,
      paidSum,
      balanceSum,
    };
  }, [allBookings]);

  return (
    <div className="space-y-5 font-sans select-none">
      {/* 1. KPI Executive Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Count */}
        <div className="rounded-2xl border border-line bg-card p-3.5 sm:p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-[11px] font-bold text-ink-subtle uppercase tracking-wider">
            <span>{activeTab === "active" ? "Active Bookings" : "Closed Records"}</span>
            <Receipt className="h-4 w-4 text-accent" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-ink">
            {kpiStats.count}
          </div>
        </div>

        {/* Card 2: Total Agreed Value */}
        <div className="rounded-2xl border border-line bg-card p-3.5 sm:p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-[11px] font-bold text-ink-subtle uppercase tracking-wider">
            <span>Total Agreed Deals</span>
            <IndianRupee className="h-4 w-4 text-accent" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-ink">
            {formatCurrency(kpiStats.agreedSum)}
          </div>
        </div>

        {/* Card 3: Total Advances Collected */}
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-3.5 sm:p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            <span>Advance Collected</span>
            <PiggyBank className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {formatCurrency(kpiStats.paidSum)}
          </div>
        </div>

        {/* Card 4: Outstanding Balance */}
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-3.5 sm:p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            <span>Pending Balance</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
            {formatCurrency(kpiStats.balanceSum)}
          </div>
        </div>
      </div>

      {/* 2. Controls & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-line/60 pb-3">
        {/* Status Subtabs */}
        <div className="flex h-9 items-center gap-1 rounded-xl bg-inset p-1 border border-line/40 w-full sm:w-fit shrink-0">
          <button
            type="button"
            onClick={() => {
              setActiveTab("active");
              setSearchQuery("");
            }}
            className={`flex-1 sm:flex-initial h-full text-center rounded-lg px-4 flex items-center justify-center gap-2 text-xs font-bold tracking-tight transition-all duration-200 cursor-pointer whitespace-nowrap ${
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
            onClick={() => {
              setActiveTab("closed");
              setSearchQuery("");
            }}
            className={`flex-1 sm:flex-initial h-full text-center rounded-lg px-4 flex items-center justify-center gap-2 text-xs font-bold tracking-tight transition-all duration-200 cursor-pointer whitespace-nowrap ${
              activeTab === "closed"
                ? "bg-slate-700 text-white dark:bg-slate-800 shadow-xs font-bold"
                : "text-ink-muted hover:text-ink hover:bg-card/50 font-medium"
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
            <span>Closed Bookings</span>
          </button>
        </div>

        {/* Search Input Box */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-subtle" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search booking #, customer, car, reg..."
            className="w-full h-9 pl-9 pr-8 text-xs font-medium bg-card border border-line rounded-xl text-ink placeholder:text-ink-subtle focus:outline-none focus:border-accent transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 3. Data Table Container */}
      <div className="rounded-2xl border border-line bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-line/60 bg-inset/60 text-[11px] font-bold text-ink-subtle uppercase tracking-wider">
                <th className="py-3 px-4">Booking Ref</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Booked Vehicle</th>
                <th className="py-3 px-4">Financial Overview</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/40">
              {/* Skeletons Loading State */}
              {isLoading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-4">
                      <div className="h-4 w-20 bg-inset rounded" />
                    </td>
                    <td className="p-4">
                      <div className="h-4 w-28 bg-inset rounded" />
                    </td>
                    <td className="p-4">
                      <div className="h-4 w-32 bg-inset rounded" />
                    </td>
                    <td className="p-4">
                      <div className="h-4 w-40 bg-inset rounded" />
                    </td>
                    <td className="p-4">
                      <div className="h-4 w-16 bg-inset rounded" />
                    </td>
                    <td className="p-4 text-right">
                      <div className="h-4 w-6 bg-inset rounded ml-auto" />
                    </td>
                  </tr>
                ))}

              {/* Data Rows */}
              {!isLoading &&
                !isError &&
                filteredBookings.length > 0 &&
                filteredBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    activeTab={activeTab}
                  />
                ))}
            </tbody>
          </table>
        </div>

        {/* Error State */}
        {isError && !isLoading && (
          <div className="p-8 text-center space-y-3">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-ink">Failed to load bookings</h3>
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

        {/* Empty State */}
        {!isLoading && !isError && filteredBookings.length === 0 && (
          <div className="p-8 text-center space-y-3 bg-inset/30">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-card border border-line text-ink-subtle">
              {activeTab === "active" ? (
                <CalendarCheck className="h-6 w-6 stroke-[1.8]" />
              ) : (
                <CalendarX className="h-6 w-6 stroke-[1.8]" />
              )}
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-ink">
                {searchQuery
                  ? "No matching bookings found"
                  : activeTab === "active"
                  ? "No active bookings yet"
                  : "No closed bookings yet"}
              </h3>
              <p className="text-xs text-ink-subtle max-w-sm mx-auto">
                {searchQuery
                  ? `No records match "${searchQuery}". Try clearing the search term.`
                  : activeTab === "active"
                  ? "When leads are closed as won and prebooked, their booking records will appear in this table."
                  : "Completed sales and cancelled vehicle bookings will be listed here."}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 4. Infinite Scroll Trigger / Footer */}
      <div ref={sentinelRef} className="py-4 text-center">
        {isFetchingNextPage && (
          <div className="inline-flex items-center gap-2 text-xs font-medium text-ink-muted">
            <Loader2 className="h-4 w-4 animate-spin text-accent" />
            <span>Loading more bookings...</span>
          </div>
        )}
        {!hasNextPage && allBookings.length > 0 && !isLoading && (
          <p className="text-xs text-ink-subtle">
            All {allBookings.length} bookings loaded
          </p>
        )}
      </div>
    </div>
  );
}
