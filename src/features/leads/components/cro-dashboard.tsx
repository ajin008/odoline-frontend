"use client";

import Link from "next/link";
import {
  AlertTriangle,
  Snowflake,
  Flame,
  FolderOpen,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { useCroAtRisk } from "../hooks/use-cro-at-risk";
import { ClockInWidget } from "@/src/features/attendance/components/clock-in-widget";

export function CroDashboard() {
  const { data, isLoading, isError, refetch, isRefetching } = useCroAtRisk();

  const overdueCount = data?.overdue_followups ?? 0;
  const coldCount = data?.going_cold ?? 0;
  const hotNoFuCount = data?.hot_no_followup ?? 0;
  const totalActiveCount = data?.total_active ?? 0;

  const totalAtRisk = overdueCount + coldCount + hotNoFuCount;

  return (
    <div className="w-full space-y-4 sm:space-y-6 font-sans select-none px-0.5 sm:px-0">
      {/* 1. Header Section */}
      <div className="flex flex-row items-center justify-between gap-3 border-b border-line/60 pb-3 sm:pb-4">
        <div className="space-y-0.5 sm:space-y-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider bg-accent/15 border border-accent/30 text-accent">
              <ShieldCheck className="h-3 w-3 stroke-[2.5px] shrink-0" />
              <span className="truncate">Follow-up Dashboard</span>
            </span>
          </div>
          <h1 className="font-heading text-lg sm:text-2xl font-bold tracking-tight text-ink truncate">
            Leads That Need Attention
          </h1>
          <p className="text-[11px] sm:text-xs text-ink-muted font-medium line-clamp-1 sm:line-clamp-none">
            Leads across all salespeople that haven&lsquo;t been followed up —
            so customers don&lsquo;t get forgotten.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isLoading || isRefetching}
          className="inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-card border border-line hover:border-line/80 text-ink-subtle hover:text-ink text-xs font-semibold shadow-xs active:scale-95 transition-all cursor-pointer shrink-0 disabled:opacity-50"
          aria-label="Refresh status"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${
              isRefetching ? "animate-spin text-accent" : ""
            }`}
          />
          <span className="hidden sm:inline">
            {isRefetching ? "Refreshing…" : "Refresh Status"}
          </span>
        </button>
      </div>

      {/* 2. Main Dashboard Layout (Golden 2:1 Split Ratio) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* Left Column: 2x2 Matrix of At-Risk KPI Cards */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4.5 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-36 sm:h-40 rounded-xl sm:rounded-2xl border border-line bg-card/60 p-4 sm:p-5 space-y-3"
                >
                  <div className="h-3 sm:h-4 w-16 sm:w-24 bg-inset rounded" />
                  <div className="h-6 sm:h-8 w-12 sm:w-16 bg-inset rounded" />
                  <div className="h-2.5 sm:h-3 w-24 sm:w-32 bg-inset rounded" />
                </div>
              ))}
            </div>
          ) : isError ? (
            /* Error Banner */
            <div className="rounded-xl sm:rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 sm:p-5 text-rose-600 space-y-3 font-sans">
              <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
                <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                <span>Failed to load lead status</span>
              </div>
              <p className="text-xs text-rose-600/80">
                An error occurred while loading lead data. Check your connection
                and try again.
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 active:scale-95 transition-all cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Retry</span>
              </button>
            </div>
          ) : (
            /* At-Risk KPI Cards Grid (Perfect 2x2 Matrix inside col-span-2) */
            <div className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-2 gap-3 sm:gap-4.5">
                {/* Row 1, Card 1: Overdue Follow-ups */}
                <Link
                  href="/staff/follow-ups?bucket=overdue"
                  className="group relative flex flex-col justify-between rounded-xl sm:rounded-2xl border border-rose-500/30 bg-rose-500/5 dark:bg-rose-500/10 p-3.5 sm:p-5 shadow-xs hover:shadow-bento hover:border-rose-500/60 active:scale-[0.98] transition-all cursor-pointer min-h-[130px] sm:min-h-[155px]"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase text-rose-600 dark:text-rose-400 truncate">
                      Overdue
                    </span>
                    <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg sm:rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/25 shrink-0">
                      <AlertTriangle className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[2.25px]" />
                    </div>
                  </div>

                  <div className="my-1 sm:my-2">
                    <span className="font-heading text-2xl sm:text-4xl font-extrabold tracking-tight text-rose-600 dark:text-rose-400 block leading-none">
                      {overdueCount}
                    </span>
                    <p className="text-[10px] sm:text-xs text-ink-subtle mt-1 sm:mt-2 leading-tight sm:leading-relaxed line-clamp-1 sm:line-clamp-none">
                      Follow-ups missed today or earlier.
                    </p>
                  </div>

                  <div className="pt-1.5 sm:pt-2.5 border-t border-rose-500/15 flex items-center justify-between text-[10px] sm:text-xs font-bold text-rose-600 dark:text-rose-400 group-hover:translate-x-0.5 transition-transform">
                    <span className="truncate">View Overdue</span>
                    <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                  </div>
                </Link>

                {/* Row 1, Card 2: Going Cold (14+ Days) */}
                <Link
                  href="/staff/leads?status=active"
                  className="group relative flex flex-col justify-between rounded-xl sm:rounded-2xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10 p-3.5 sm:p-5 shadow-xs hover:shadow-bento hover:border-amber-500/60 active:scale-[0.98] transition-all cursor-pointer min-h-[130px] sm:min-h-[155px]"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase text-amber-600 dark:text-amber-400 truncate">
                      Going Cold (14d+)
                    </span>
                    <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg sm:rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25 shrink-0">
                      <Snowflake className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[2.25px]" />
                    </div>
                  </div>

                  <div className="my-1 sm:my-2">
                    <span className="font-heading text-2xl sm:text-4xl font-extrabold tracking-tight text-amber-600 dark:text-amber-400 block leading-none">
                      {coldCount}
                    </span>
                    <p className="text-[10px] sm:text-xs text-ink-subtle mt-1 sm:mt-2 leading-tight sm:leading-relaxed line-clamp-1 sm:line-clamp-none">
                      No calls logged in 14+ days.
                    </p>
                  </div>

                  <div className="pt-1.5 sm:pt-2.5 border-t border-amber-500/15 flex items-center justify-between text-[10px] sm:text-xs font-bold text-amber-600 dark:text-amber-400 group-hover:translate-x-0.5 transition-transform">
                    <span className="truncate">View Active</span>
                    <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                  </div>
                </Link>

                {/* Row 2, Card 3: Hot Leads w/ No Follow-up */}
                <Link
                  href="/staff/leads?status=active&priority=hot"
                  className="group relative flex flex-col justify-between rounded-xl sm:rounded-2xl border border-orange-500/30 bg-orange-500/5 dark:bg-orange-500/10 p-3.5 sm:p-5 shadow-xs hover:shadow-bento hover:border-orange-500/60 active:scale-[0.98] transition-all cursor-pointer min-h-[130px] sm:min-h-[155px]"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase text-orange-600 dark:text-orange-400 truncate">
                      Hot w/ No FU
                    </span>
                    <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg sm:rounded-xl bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/25 shrink-0">
                      <Flame className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[2.25px]" />
                    </div>
                  </div>

                  <div className="my-1 sm:my-2">
                    <span className="font-heading text-2xl sm:text-4xl font-extrabold tracking-tight text-orange-600 dark:text-orange-400 block leading-none">
                      {hotNoFuCount}
                    </span>
                    <p className="text-[10px] sm:text-xs text-ink-subtle mt-1 sm:mt-2 leading-tight sm:leading-relaxed line-clamp-1 sm:line-clamp-none">
                      Hot leads with no next date set.
                    </p>
                  </div>

                  <div className="pt-1.5 sm:pt-2.5 border-t border-orange-500/15 flex items-center justify-between text-[10px] sm:text-xs font-bold text-orange-600 dark:text-orange-400 group-hover:translate-x-0.5 transition-transform">
                    <span className="truncate">View Hot</span>
                    <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                  </div>
                </Link>

                {/* Row 2, Card 4: Active Leads */}
                <Link
                  href="/staff/leads?status=active"
                  className="group relative flex flex-col justify-between rounded-xl sm:rounded-2xl border border-accent/30 bg-accent/5 p-3.5 sm:p-5 shadow-xs hover:border-accent/60 active:scale-[0.98] transition-all cursor-pointer min-h-[130px] sm:min-h-[155px]"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase text-accent truncate">
                      Active Leads
                    </span>
                    <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg sm:rounded-xl bg-accent/15 text-accent border border-accent/25 shrink-0">
                      <FolderOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[2.25px]" />
                    </div>
                  </div>

                  <div className="my-1 sm:my-2">
                    <span className="font-heading text-2xl sm:text-4xl font-extrabold tracking-tight text-ink block leading-none">
                      {totalActiveCount}
                    </span>
                    <p className="text-[10px] sm:text-xs text-ink-subtle mt-1 sm:mt-2 leading-tight sm:leading-relaxed line-clamp-1 sm:line-clamp-none">
                      All active showroom leads.
                    </p>
                  </div>

                  <div className="pt-1.5 sm:pt-2.5 border-t border-accent/15 flex items-center justify-between text-[10px] sm:text-xs font-bold text-accent group-hover:translate-x-0.5 transition-transform">
                    <span className="truncate">View All</span>
                    <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                  </div>
                </Link>
              </div>

              {/* Zero At-Risk Banner / Celebration State */}
              {totalAtRisk === 0 && (
                <div className="rounded-xl sm:rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 sm:p-6 text-center space-y-2 select-none">
                  <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 mx-auto border border-emerald-500/30">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2.25px]" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-ink">
                    All Leads Up to Date 🎉
                  </h3>
                  <p className="text-[11px] sm:text-xs text-ink-subtle max-w-sm mx-auto leading-relaxed">
                    Great job! All active leads have recent follow-ups and calls
                    logged across the team.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side Column (Shift Attendance Clock-In Widget) */}
        <div className="lg:col-span-1">
          <ClockInWidget />
        </div>
      </div>
    </div>
  );
}
