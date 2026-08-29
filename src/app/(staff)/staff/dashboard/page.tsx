"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTodayAttendance } from "@/src/features/attendance/hooks/use-attendance";
import { ClockInWidget } from "@/src/features/attendance/components/clock-in-widget";
import { useMe } from "@/src/features/auth/hooks/use-me";
import { CroDashboard } from "@/src/features/leads/components/cro-dashboard";
import { useMyAtRisk } from "@/src/features/leads/hooks/use-my-at-risk";
import { useInfiniteCars } from "@/src/features/cars/hooks/use-infinite-cars";
import {
  Car,
  CalendarCheck,
  ArrowRight,
  RefreshCw,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Calendar,
  Sparkles,
  Lock,
} from "lucide-react";

export default function StaffDashboardPage() {
  const { data: user } = useMe();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: attendanceData } = useTodayAttendance();
  const {
    data: myAtRisk,
    isLoading: isLoadingAtRisk,
    isRefetching,
    refetch,
  } = useMyAtRisk();

  const { data: carsData, isLoading: isLoadingCars } = useInfiniteCars({
    statuses: ["available"],
  });

  const availableCarsCount = carsData?.pages[0]?.data?.length ?? 0;

  const [greeting, setGreeting] = useState("");
  const [dateTimeStr, setDateTimeStr] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hour = now.getHours();

      if (hour < 12) setGreeting("Good Morning");
      else if (hour < 17) setGreeting("Good Afternoon");
      else setGreeting("Good Evening");

      const options: Intl.DateTimeFormatOptions = {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      };
      setDateTimeStr(now.toLocaleString("en-IN", options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // CRO role has its dedicated retention cockpit dashboard
  if (user?.role === "cro") {
    return <CroDashboard />;
  }

  const firstName = user?.name ? user.name.trim().split(" ")[0] : "there";
  const dueToday = myAtRisk?.due_today ?? 0;
  const overdueCount = myAtRisk?.overdue_followups ?? 0;
  const hotLeadsCount = myAtRisk?.hot_leads ?? 0;
  const totalTasks = dueToday + overdueCount;

  return (
    <div className="w-full space-y-5 font-sans select-none px-0.5 sm:px-0">
      {/* 1. Header Section */}
      <div className="flex flex-row items-center justify-between gap-3 border-b border-line/60 pb-4">
        <div className="space-y-1 min-w-0">
          <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-ink truncate">
            {greeting}, {firstName}! 👋
          </h1>
          <p className="text-xs text-ink-muted font-medium line-clamp-1 sm:line-clamp-none">
            {dateTimeStr} · Your personal sales task & follow-up command center.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isLoadingAtRisk || isRefetching}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-card border border-line hover:border-line/80 text-ink-subtle hover:text-ink text-xs font-semibold shadow-xs active:scale-95 transition-all cursor-pointer shrink-0 disabled:opacity-50"
          aria-label="Refresh tasks"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${
              isRefetching ? "animate-spin text-accent" : ""
            }`}
          />
          <span className="hidden sm:inline">
            {isRefetching ? "Refreshing…" : "Refresh Tasks"}
          </span>
        </button>
      </div>

      {/* 2. Main Dashboard Layout (Golden 2:1 Ratio Split) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* Left Column: My Day Action Tasks & Inventory Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section Title: My Tasks Today */}
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse shrink-0" />
              <h2 className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-ink-subtle truncate">
                My Action Items Today
              </h2>
            </div>
            {totalTasks > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-accent/10 border border-accent/20 text-accent whitespace-nowrap shrink-0">
                <span className="sm:hidden">{totalTasks} Pending</span>
                <span className="hidden sm:inline">
                  {totalTasks} Task{totalTasks === 1 ? "" : "s"} Needing Action
                </span>
              </span>
            )}
          </div>

          {/* Action Task & Key Metrics Cards (2x2 Matrix on Mobile, 3-col on Desktop) */}
          {isLoadingAtRisk ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4.5 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-32 sm:h-36 rounded-xl sm:rounded-2xl border border-line bg-card/60 p-3.5 sm:p-4 space-y-3"
                >
                  <div className="h-3.5 w-16 sm:w-20 bg-inset rounded" />
                  <div className="h-6 sm:h-8 w-10 sm:w-12 bg-inset rounded" />
                  <div className="h-3 w-20 sm:w-28 bg-inset rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4.5">
              {/* Task Card 1: Follow-ups Due Today */}
              <Link
                href="/staff/follow-ups?bucket=today"
                className="group relative flex flex-col justify-between rounded-xl sm:rounded-2xl border-0 p-3.5 sm:p-5 transition-all cursor-pointer min-h-[130px] sm:min-h-[155px] hover:opacity-95 active:scale-[0.98]"
                style={{ backgroundColor: "#cfdefb" }}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase text-blue-950/80 truncate">
                    Due Today
                  </span>
                  <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg sm:rounded-xl bg-blue-950/10 text-blue-950 shrink-0">
                    <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[2.25px]" />
                  </div>
                </div>

                <div className="my-1 sm:my-2">
                  <span className="font-heading text-2xl sm:text-4xl font-extrabold tracking-tight text-blue-950 block leading-none">
                    {dueToday}
                  </span>
                  <p className="text-[10px] sm:text-xs text-blue-900/70 mt-1 sm:mt-2 leading-tight sm:leading-relaxed line-clamp-1 sm:line-clamp-none font-medium">
                    Follow-ups scheduled for today.
                  </p>
                </div>

                <div className="pt-1.5 sm:pt-2.5 border-t border-blue-950/15 flex items-center justify-between text-[10px] sm:text-xs font-bold text-blue-950 group-hover:translate-x-0.5 transition-transform">
                  <span className="truncate">View Due Today</span>
                  <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                </div>
              </Link>

              {/* Task Card 2: Overdue Follow-ups */}
              <Link
                href="/staff/follow-ups?bucket=overdue"
                className="group relative flex flex-col justify-between rounded-xl sm:rounded-2xl border-0 p-3.5 sm:p-5 transition-all cursor-pointer min-h-[130px] sm:min-h-[155px] hover:opacity-95 active:scale-[0.98]"
                style={{ backgroundColor: "#f2b5ba" }}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase text-rose-950/80 truncate">
                    Overdue
                  </span>
                  <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg sm:rounded-xl bg-rose-950/10 text-rose-900 shrink-0">
                    <AlertTriangle className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[2.25px]" />
                  </div>
                </div>

                <div className="my-1 sm:my-2">
                  <span className="font-heading text-2xl sm:text-4xl font-extrabold tracking-tight text-rose-950 block leading-none">
                    {overdueCount}
                  </span>
                  <p className="text-[10px] sm:text-xs text-rose-900/70 mt-1 sm:mt-2 leading-tight sm:leading-relaxed line-clamp-1 sm:line-clamp-none font-medium">
                    Missed follow-ups past due.
                  </p>
                </div>

                <div className="pt-1.5 sm:pt-2.5 border-t border-rose-950/15 flex items-center justify-between text-[10px] sm:text-xs font-bold text-rose-950 group-hover:translate-x-0.5 transition-transform">
                  <span className="truncate">View Overdue</span>
                  <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                </div>
              </Link>

              {/* Task Card 3: My Hot Leads */}
              <Link
                href="/staff/leads?priority=hot"
                className="group relative flex flex-col justify-between rounded-xl sm:rounded-2xl border-0 p-3.5 sm:p-5 transition-all cursor-pointer min-h-[130px] sm:min-h-[155px] hover:opacity-95 active:scale-[0.98]"
                style={{ backgroundColor: "#fae9cf" }}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase text-amber-950/80 truncate">
                    My Hot Leads
                  </span>
                  <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg sm:rounded-xl bg-amber-950/10 text-amber-900 shrink-0">
                    <Flame className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[2.25px]" />
                  </div>
                </div>

                <div className="my-1 sm:my-2">
                  <span className="font-heading text-2xl sm:text-4xl font-extrabold tracking-tight text-amber-950 block leading-none">
                    {hotLeadsCount}
                  </span>
                  <p className="text-[10px] sm:text-xs text-amber-900/70 mt-1 sm:mt-2 leading-tight sm:leading-relaxed line-clamp-1 sm:line-clamp-none font-medium">
                    Active Hot & Very Hot leads.
                  </p>
                </div>

                <div className="pt-1.5 sm:pt-2.5 border-t border-amber-950/15 flex items-center justify-between text-[10px] sm:text-xs font-bold text-amber-950 group-hover:translate-x-0.5 transition-transform">
                  <span className="truncate">View Hot Leads</span>
                  <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                </div>
              </Link>

              {/* Task Card 4: In-Stock Cars Count (Completes 2x2 Matrix on Mobile) */}
              <Link
                href="/staff/stock"
                className="group relative flex flex-col justify-between rounded-xl sm:rounded-2xl border border-line bg-card p-3.5 sm:p-5 shadow-xs hover:border-accent/40 active:scale-[0.98] transition-all cursor-pointer min-h-[130px] sm:min-h-[155px] sm:hidden"
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase text-ink-subtle truncate">
                    In-Stock Cars
                  </span>
                  <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg sm:rounded-xl bg-inset text-ink-subtle border border-line group-hover:text-accent group-hover:border-accent/30 transition-colors shrink-0">
                    <Car className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[2px]" />
                  </div>
                </div>

                <div className="my-1 sm:my-2">
                  <span className="font-heading text-2xl sm:text-4xl font-extrabold tracking-tight text-ink block leading-none">
                    {isLoadingCars ? "…" : availableCarsCount}
                  </span>
                  <p className="text-[10px] sm:text-xs text-ink-subtle mt-1 sm:mt-2 leading-tight sm:leading-relaxed line-clamp-1 sm:line-clamp-none">
                    Browse ready inventory.
                  </p>
                </div>

                <div className="pt-1.5 sm:pt-2.5 border-t border-line/60 flex items-center justify-between text-[10px] sm:text-xs font-bold text-accent group-hover:translate-x-0.5 transition-transform">
                  <span className="truncate">Browse Cars</span>
                  <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                </div>
              </Link>
            </div>
          )}

          {/* All Caught Up / Celebration State */}
          {!isLoadingAtRisk && totalTasks === 0 && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 text-center space-y-1.5 select-none">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 mx-auto border border-emerald-500/30">
                <CheckCircle2 className="h-4.5 w-4.5 stroke-[2.25px]" />
              </div>
              <h3 className="text-xs font-bold text-ink">
                All Caught Up for Today! 🎉
              </h3>
              <p className="text-[11px] text-ink-subtle max-w-xs mx-auto leading-relaxed">
                You have zero pending or overdue follow-ups due today. Great
                work!
              </p>
            </div>
          )}

          {/* Secondary Context Row: In-Stock Inventory (Tablet/Desktop) & Coming Soon Bookings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Card 1: In-Stock Cars Count (Desktop & Tablet view) */}
            <Link
              href="/staff/stock"
              className="hidden sm:flex group flex-col justify-between rounded-2xl border border-line bg-card p-5 shadow-xs hover:border-accent/40 active:scale-[0.98] transition-all cursor-pointer min-h-[145px]"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold tracking-wider uppercase text-ink-subtle">
                  In-Stock Cars
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-inset text-ink-subtle border border-line group-hover:text-accent group-hover:border-accent/30 transition-colors shrink-0">
                  <Car className="h-4 w-4 stroke-[2px]" />
                </div>
              </div>

              <div className="my-3">
                <div className="flex items-baseline gap-2">
                  <span className="font-heading text-3xl font-extrabold tracking-tight text-ink block leading-none">
                    {isLoadingCars ? "…" : availableCarsCount}
                  </span>
                  <span className="text-xs font-semibold text-ink-subtle">
                    Vehicles Ready
                  </span>
                </div>
                <p className="text-xs text-ink-subtle mt-1.5 leading-relaxed">
                  Browse live inventory to match customer budgets.
                </p>
              </div>

              <div className="pt-2.5 border-t border-line/60 flex items-center justify-between text-xs font-bold text-accent group-hover:translate-x-0.5 transition-transform">
                <span>Browse Inventory</span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0" />
              </div>
            </Link>

            {/* Card 2: Bookings — Customer Tokens (COMING SOON PLACEHOLDER) */}
            <div className="flex flex-col justify-between rounded-xl sm:rounded-2xl border border-dashed border-line/80 bg-card/40 p-3.5 sm:p-5 opacity-85 select-none relative overflow-hidden min-h-[130px] sm:min-h-[145px]">
              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase text-ink-subtle truncate">
                    Bookings
                  </span>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    <Sparkles className="h-2.5 w-2.5 shrink-0" />
                    Coming Soon
                  </span>
                </div>
                <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg sm:rounded-xl bg-inset/50 text-ink-subtle/60 border border-line/50 shrink-0">
                  <CalendarCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[2px]" />
                </div>
              </div>

              <div className="my-1.5 sm:my-3 space-y-0.5 sm:space-y-1">
                <h4 className="text-xs sm:text-sm font-bold text-ink font-sans flex items-center gap-1.5">
                  <span>Customer Tokens</span>
                  <Lock className="h-3 w-3 text-ink-subtle/70 shrink-0" />
                </h4>
                <p className="text-[10px] sm:text-xs text-ink-subtle leading-tight sm:leading-relaxed line-clamp-2 sm:line-clamp-none">
                  Advance booking tokens and deal closing workflows will launch
                  in the next release phase.
                </p>
              </div>

              <div className="pt-1.5 sm:pt-2.5 border-t border-line/40 flex items-center justify-between text-[10px] sm:text-xs font-medium text-ink-subtle/60">
                <span>Feature Preview</span>
                <span className="text-[9px] sm:text-[10px] font-mono">v4.1</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Column: Shift Attendance Widget */}
        <div className="lg:col-span-1">
          <ClockInWidget />
        </div>
      </div>
    </div>
  );
}
