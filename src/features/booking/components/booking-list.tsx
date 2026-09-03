"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useInfiniteBookings } from "../hooks/use-bookings";
import { BookingCard, MobileBookingCard } from "./booking-card";
import type { BookingTab } from "../types/booking-types";
import {
  getRcTransferBadgeConfig,
  getBalanceOverdueBadgeConfig,
} from "../utils/booking-status-map";
import {
  CalendarX,
  Loader2,
  AlertTriangle,
  Flame,
  Truck,
  CheckCircle2,
  Search,
  IndianRupee,
  PiggyBank,
  Clock,
  RotateCcw,
  FileText,
  X,
} from "lucide-react";

function formatCurrency(num: number): string {
  if (num >= 100000) {
    return `₹${(num / 100000).toFixed(2)}L`;
  }
  return `₹${num.toLocaleString("en-IN")}`;
}

interface BookingListProps {
  basePath?: string;
  role?: string;
}

export function BookingList({
  basePath = "/staff/booking",
  role,
}: BookingListProps = {}) {
  const isOwner = role === "owner" || basePath.startsWith("/owner");
  const [selectedTab, setSelectedTab] = useState<BookingTab>("prebooked");
  const [searchQuery, setSearchQuery] = useState("");

  // Derived state during render: staff cannot access completed tab
  const activeTab: BookingTab =
    !isOwner && selectedTab === "completed" ? "prebooked" : selectedTab;

  const setActiveTab = (tab: BookingTab) => {
    setSelectedTab(tab);
  };

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteBookings({
    tab: activeTab,
    role,
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
    let retainedSum = 0;
    let refundedSum = 0;
    let rcOverdueCount = 0;
    let balanceOverdueCount = 0;

    allBookings.forEach((b) => {
      agreedSum += Number(b.agreed_price || 0);
      paidSum += Number(b.amount_paid || 0);
      balanceSum += Number(b.balance_due || 0);
      retainedSum += Number(b.amount_retained || 0);
      refundedSum += Number(b.refunded_total || 0);

      if (b.status === "delivered") {
        const rcInfo = getRcTransferBadgeConfig(
          b.car?.delivered_at,
          b.updated_at
        );
        if (rcInfo.isOverdue) {
          rcOverdueCount++;
        }
      }

      const balInfo = getBalanceOverdueBadgeConfig(
        b.status,
        b.prebooked_at,
        b.balance_due_days,
        b.balance_due
      );
      if (balInfo?.isOverdue) {
        balanceOverdueCount++;
      }
    });

    return {
      count: allBookings.length,
      agreedSum,
      paidSum,
      balanceSum,
      retainedSum,
      refundedSum,
      rcOverdueCount,
      balanceOverdueCount,
    };
  }, [allBookings]);

  return (
    <div className="space-y-5 font-sans select-none">
      {/* 1. KPI Executive Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {/* Card 1: Count */}
        <div className="rounded-2xl border border-line bg-card p-3 sm:p-4 space-y-1">
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-ink-subtle uppercase tracking-wider">
            <span>
              {activeTab === "prebooked"
                ? "Prebooked"
                : activeTab === "delivered"
                ? "RC Pending"
                : activeTab === "completed"
                ? "Completed"
                : "Cancelled"}
            </span>
            {activeTab === "prebooked" ? (
              <Flame className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-accent" />
            ) : activeTab === "delivered" ? (
              <Truck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-500" />
            ) : activeTab === "completed" ? (
              <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-500" />
            ) : (
              <CalendarX className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-rose-500" />
            )}
          </div>
          <div className="text-lg sm:text-2xl font-bold font-mono text-ink">
            {kpiStats.count}
          </div>
        </div>

        {/* Card 2: Total Value */}
        <div className="rounded-2xl border border-line bg-card p-3 sm:p-4 space-y-1">
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-ink-subtle uppercase tracking-wider">
            <span>
              {activeTab === "completed" ? "Total Sales Value" : "Total Agreed"}
            </span>
            <IndianRupee className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-accent" />
          </div>
          <div className="text-lg sm:text-2xl font-bold font-mono text-ink truncate">
            {formatCurrency(kpiStats.agreedSum)}
          </div>
        </div>

        {activeTab === "prebooked" ? (
          <>
            {/* Card 3: Advances Collected */}
            <div
              className="rounded-2xl border-0 p-3 sm:p-4 space-y-1"
              style={{ backgroundColor: "#d8f1b7" }}
            >
              <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-emerald-900 uppercase tracking-wider">
                <span>Advance Paid</span>
                <PiggyBank className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-800" />
              </div>
              <div className="text-lg sm:text-2xl font-bold font-mono text-emerald-950 truncate">
                {formatCurrency(kpiStats.paidSum)}
              </div>
            </div>

            {/* Card 4: Outstanding Balance */}
            <div
              className="rounded-2xl border-0 p-3 sm:p-4 space-y-1"
              style={{ backgroundColor: "#fae9cf" }}
            >
              <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-amber-900 uppercase tracking-wider">
                <span>Pending Balance</span>
                <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-800" />
              </div>
              <div className="text-lg sm:text-2xl font-bold font-mono text-amber-950 truncate">
                {formatCurrency(kpiStats.balanceSum)}
              </div>
              {kpiStats.balanceOverdueCount > 0 && (
                <div className="text-[10px] font-bold text-amber-900 font-sans truncate">
                  {kpiStats.balanceOverdueCount} balance overdue
                </div>
              )}
            </div>
          </>
        ) : activeTab === "delivered" ? (
          <>
            {/* Card 3: Total Paid / Collected */}
            <div
              className="rounded-2xl border-0 p-3 sm:p-4 space-y-1"
              style={{ backgroundColor: "#d8f1b7" }}
            >
              <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-emerald-900 uppercase tracking-wider">
                <span>Total Collected</span>
                <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-800" />
              </div>
              <div className="text-lg sm:text-2xl font-bold font-mono text-emerald-950 truncate">
                {formatCurrency(kpiStats.paidSum)}
              </div>
            </div>

            {/* Card 4: RC Pending / Overdue Status */}
            <div
              className="rounded-2xl border-0 p-3 sm:p-4 space-y-1 transition-colors"
              style={{
                backgroundColor:
                  kpiStats.rcOverdueCount > 0 ? "#fae9cf" : "#e0f2fe",
              }}
            >
              <div
                className={`flex items-center justify-between text-[10px] sm:text-[11px] font-bold uppercase tracking-wider ${
                  kpiStats.rcOverdueCount > 0
                    ? "text-amber-900"
                    : "text-sky-900"
                }`}
              >
                <span>RC Transfer</span>
                {kpiStats.rcOverdueCount > 0 ? (
                  <AlertTriangle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-800" />
                ) : (
                  <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-sky-800" />
                )}
              </div>
              <div
                className={`text-sm sm:text-base font-bold font-sans truncate mt-1 ${
                  kpiStats.rcOverdueCount > 0
                    ? "text-amber-950"
                    : "text-sky-950"
                }`}
              >
                {kpiStats.rcOverdueCount > 0
                  ? `${kpiStats.count} awaiting · ${kpiStats.rcOverdueCount} overdue`
                  : `${kpiStats.count} awaiting RC`}
              </div>
            </div>
          </>
        ) : activeTab === "completed" ? (
          <>
            {/* Card 3: Total Collected */}
            <div
              className="rounded-2xl border-0 p-3 sm:p-4 space-y-1"
              style={{ backgroundColor: "#d8f1b7" }}
            >
              <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-emerald-900 uppercase tracking-wider">
                <span>Total Collected</span>
                <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-800" />
              </div>
              <div className="text-lg sm:text-2xl font-bold font-mono text-emerald-950 truncate">
                {formatCurrency(kpiStats.paidSum)}
              </div>
            </div>

            {/* Card 4: Fully Closed Status */}
            <div className="rounded-2xl border border-line bg-inset p-3 sm:p-4 space-y-1">
              <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-ink-subtle uppercase tracking-wider">
                <span>Status</span>
                <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="text-sm sm:text-base font-bold font-sans text-ink truncate mt-1">
                Fully Closed
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Card 3: Total Retained (Cancelled Tab) */}
            <div
              className="rounded-2xl border-0 p-3 sm:p-4 space-y-1"
              style={{ backgroundColor: "#fddede" }}
            >
              <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-rose-900 uppercase tracking-wider">
                <span>Total Retained</span>
                <AlertTriangle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-rose-800" />
              </div>
              <div className="text-lg sm:text-2xl font-bold font-mono text-rose-950 truncate">
                {formatCurrency(kpiStats.retainedSum)}
              </div>
            </div>

            {/* Card 4: Total Refunded (Cancelled Tab) */}
            <div
              className="rounded-2xl border-0 p-3 sm:p-4 space-y-1"
              style={{ backgroundColor: "#e0f2fe" }}
            >
              <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-sky-900 uppercase tracking-wider">
                <span>Total Refunded</span>
                <RotateCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-sky-800" />
              </div>
              <div className="text-lg sm:text-2xl font-bold font-mono text-sky-950 truncate">
                {formatCurrency(kpiStats.refundedSum)}
              </div>
            </div>
          </>
        )}
      </div>

      {/* 2. Controls & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-line/60 pb-3">
        {/* Status Subtabs (Grid on Mobile, Flex on Desktop to perfectly fit viewport) */}
        <div
          className={`grid ${
            isOwner ? "grid-cols-4" : "grid-cols-3"
          } sm:flex h-9 items-center gap-1 rounded-xl bg-inset p-1 border border-line/40 w-full sm:w-fit shrink-0`}
        >
          <button
            type="button"
            onClick={() => {
              setActiveTab("prebooked");
              setSearchQuery("");
            }}
            className={`h-full text-center rounded-lg px-1.5 sm:px-3.5 flex items-center justify-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-bold tracking-tight transition-all duration-200 cursor-pointer whitespace-nowrap ${
              activeTab === "prebooked"
                ? "bg-accent text-inverse shadow-xs font-bold"
                : "text-ink-muted hover:text-ink hover:bg-card/50 font-medium"
            }`}
          >
            <Flame className="h-3.5 w-3.5 shrink-0" />
            <span>Prebooked</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("delivered");
              setSearchQuery("");
            }}
            className={`h-full text-center rounded-lg px-1.5 sm:px-3.5 flex items-center justify-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-bold tracking-tight transition-all duration-200 cursor-pointer whitespace-nowrap ${
              activeTab === "delivered"
                ? "bg-purple-600 text-white dark:bg-purple-500 shadow-xs font-bold"
                : "text-ink-muted hover:text-ink hover:bg-card/50 font-medium"
            }`}
          >
            <Truck className="h-3.5 w-3.5 shrink-0" />
            <span>RC Pending</span>
          </button>

          {isOwner && (
            <button
              type="button"
              onClick={() => {
                setActiveTab("completed");
                setSearchQuery("");
              }}
              className={`h-full text-center rounded-lg px-1 sm:px-3.5 flex items-center justify-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-bold tracking-tight transition-all duration-200 cursor-pointer whitespace-nowrap ${
                activeTab === "completed"
                  ? "bg-emerald-700 text-white dark:bg-emerald-600 shadow-xs font-bold"
                  : "text-ink-muted hover:text-ink hover:bg-card/50 font-medium"
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
              <span>Completed</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setActiveTab("cancelled");
              setSearchQuery("");
            }}
            className={`h-full text-center rounded-lg px-1.5 sm:px-3.5 flex items-center justify-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-bold tracking-tight transition-all duration-200 cursor-pointer whitespace-nowrap ${
              activeTab === "cancelled"
                ? "bg-slate-700 text-white dark:bg-slate-800 shadow-xs font-bold"
                : "text-ink-muted hover:text-ink hover:bg-card/50 font-medium"
            }`}
          >
            <CalendarX className="h-3.5 w-3.5 shrink-0" />
            <span>Cancelled</span>
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

      {/* 3. DESKTOP DATA TABLE VIEW (hidden md:block) */}
      <div className="hidden md:block rounded-2xl border border-line bg-card overflow-hidden shadow-xs">
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
                    basePath={basePath}
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
              <h3 className="text-sm font-bold text-ink">
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

        {/* Empty State */}
        {!isLoading && !isError && filteredBookings.length === 0 && (
          <div className="p-8 text-center space-y-3 bg-inset/30">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-card border border-line text-ink-subtle">
              {activeTab === "prebooked" ? (
                <Flame className="h-6 w-6 text-accent" />
              ) : activeTab === "delivered" ? (
                <Truck className="h-6 w-6 text-purple-500" />
              ) : activeTab === "completed" ? (
                <CheckCircle2 className="h-6 w-6 text-emerald-500" />
              ) : (
                <CalendarX className="h-6 w-6 text-rose-500" />
              )}
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-ink">
                {searchQuery
                  ? "No matching bookings found"
                  : activeTab === "prebooked"
                  ? "No prebooked bookings yet"
                  : activeTab === "delivered"
                  ? "No RC-pending bookings yet"
                  : activeTab === "completed"
                  ? "No completed sales yet"
                  : "No cancelled bookings yet"}
              </h3>
              <p className="text-xs text-ink-subtle max-w-sm mx-auto">
                {searchQuery
                  ? `No records match "${searchQuery}". Try clearing the search term.`
                  : activeTab === "prebooked"
                  ? "When leads are closed as won and prebooked, their booking records will appear in this table."
                  : activeTab === "delivered"
                  ? "Vehicles that have been delivered to customers awaiting RC transfer will be listed here."
                  : activeTab === "completed"
                  ? "Sales that have completed RC transfer and full closure will be listed here."
                  : "Cancelled vehicle bookings and refund details will be listed here."}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 4. MOBILE NATIVE CARD STACK VIEW (block md:hidden) */}
      <div className="block md:hidden space-y-3">
        {/* Mobile Skeletons Loading State */}
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-line bg-card p-4 space-y-3 animate-pulse"
            >
              <div className="flex items-center justify-between">
                <div className="h-4 w-20 bg-inset rounded" />
                <div className="h-4 w-16 bg-inset rounded" />
              </div>
              <div className="h-12 w-full bg-inset rounded-xl" />
              <div className="h-8 w-full bg-inset rounded" />
            </div>
          ))}

        {/* Mobile Data Cards */}
        {!isLoading &&
          !isError &&
          filteredBookings.length > 0 &&
          filteredBookings.map((booking) => (
            <MobileBookingCard
              key={booking.id}
              booking={booking}
              activeTab={activeTab}
              basePath={basePath}
            />
          ))}

        {/* Mobile Empty State */}
        {!isLoading && !isError && filteredBookings.length === 0 && (
          <div className="rounded-2xl border border-dashed border-line bg-inset/40 p-6 text-center space-y-3">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-card border border-line text-ink-subtle">
              {activeTab === "prebooked" ? (
                <Flame className="h-5 w-5 text-accent" />
              ) : activeTab === "delivered" ? (
                <Truck className="h-5 w-5 text-purple-500" />
              ) : activeTab === "completed" ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              ) : (
                <CalendarX className="h-5 w-5 text-rose-500" />
              )}
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-ink">
                {searchQuery ? "No matching bookings" : "No bookings found"}
              </h3>
              <p className="text-[11px] text-ink-subtle">
                {searchQuery
                  ? `No records match "${searchQuery}"`
                  : "No booking records available for this tab."}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 5. Infinite Scroll Trigger / Footer */}
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
