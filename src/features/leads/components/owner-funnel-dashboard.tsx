"use client";

import { useState } from "react";
import {
  Trophy,
  XCircle,
  Percent,
  FolderOpen,
  UserPlus,
  Filter,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Calendar,
  BarChart3,
  ChevronDown,
} from "lucide-react";
import { useDashboardFunnel } from "../hooks/use-dashboard-funnel";
import type { LeadStage } from "../types/lead-types";

interface StageConfig {
  key: LeadStage;
  stepNumber: string;
  label: string;
  isTerminal: boolean;
  barColor: string;
  badgeBg: string;
  textColor: string;
}

// MANDATE: STAGE_CONFIGS MUST REMAIN IN STRICT JOURNEY ORDER (New -> Contacted -> Test Drive -> Discussion -> Won -> Lost)
// DO NOT SORT BY COUNT!
const STAGE_CONFIGS: StageConfig[] = [
  {
    key: "new",
    stepNumber: "01",
    label: "New Enquiries",
    isTerminal: false,
    barColor: "bg-blue-600 dark:bg-blue-500",
    badgeBg: "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400",
    textColor: "text-blue-600 dark:text-blue-400",
  },
  {
    key: "contacted",
    stepNumber: "02",
    label: "Contacted & Qualified",
    isTerminal: false,
    barColor: "bg-indigo-600 dark:bg-indigo-500",
    badgeBg: "bg-indigo-500/10 border-indigo-500/20 text-indigo-600 dark:text-indigo-400",
    textColor: "text-indigo-600 dark:text-indigo-400",
  },
  {
    key: "test_drive",
    stepNumber: "03",
    label: "Test Drive Scheduled",
    isTerminal: false,
    barColor: "bg-purple-600 dark:bg-purple-500",
    badgeBg: "bg-purple-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400",
    textColor: "text-purple-600 dark:text-purple-400",
  },
  {
    key: "discussion",
    stepNumber: "04",
    label: "Price Discussion / Offer",
    isTerminal: false,
    barColor: "bg-amber-500 dark:bg-amber-400",
    badgeBg: "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400",
    textColor: "text-amber-600 dark:text-amber-400",
  },
  {
    key: "won",
    stepNumber: "05",
    label: "Won (Closed Deal)",
    isTerminal: true,
    barColor: "bg-emerald-600 dark:bg-emerald-500",
    badgeBg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
    textColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    key: "lost",
    stepNumber: "06",
    label: "Lost / Closed",
    isTerminal: true,
    barColor: "bg-rose-600 dark:bg-rose-500",
    badgeBg: "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400",
    textColor: "text-rose-600 dark:text-rose-400",
  },
];

const PERIOD_OPTIONS = [
  { key: "this_month", label: "This Month" },
  { key: "last_month", label: "Last Month" },
  { key: "last_3_months", label: "Last 3 Months" },
  { key: "this_year", label: "This Year" },
  { key: "all_time", label: "All Time" },
] as const;

type PeriodKey = (typeof PERIOD_OPTIONS)[number]["key"];

export function OwnerFunnelDashboard() {
  const [period, setPeriod] = useState<PeriodKey>("this_month");
  const { data, isLoading, isError, refetch } = useDashboardFunnel(period);

  const formatPeriodDateLabel = () => {
    if (!data?.period) return "";
    if (data.period.period === "all_time") return "All Time";
    if (!data.period.from || !data.period.to) return "";

    const fromDate = new Date(data.period.from);
    const toDate = new Date(data.period.to);

    const fromStr = fromDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const toStr = toDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    return `${fromStr} – ${toStr}`;
  };

  const resolvedDateLabel = formatPeriodDateLabel();

  const periodTitleSuffix =
    period === "this_month"
      ? "this month"
      : period === "last_month"
      ? "last month"
      : period === "last_3_months"
      ? "last 3 months"
      : period === "this_year"
      ? "this year"
      : "all time";

  if (isLoading) {
    return (
      <div className="space-y-4 font-sans select-none animate-pulse">
        <div className="h-9 w-full max-w-sm rounded-lg bg-inset" />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-xl border border-line/50 bg-card p-3 space-y-2"
            >
              <div className="h-3 w-16 rounded bg-inset" />
              <div className="h-6 w-10 rounded bg-inset" />
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-line/50 bg-card p-4 space-y-3">
          <div className="h-5 w-44 rounded bg-inset" />
          <div className="space-y-3 pt-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-9 rounded-md bg-inset w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 sm:p-5 font-sans select-none text-rose-600 space-y-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4.5 w-4.5 shrink-0" />
          <h3 className="text-xs sm:text-sm font-bold">Failed to load CRM Funnel data</h3>
        </div>
        <p className="text-xs text-rose-600/80">
          An error occurred while fetching funnel stats. Please check your connection and try again.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  const funnel = data?.funnel ?? {
    new: 0,
    contacted: 0,
    test_drive: 0,
    discussion: 0,
    won: 0,
    lost: 0,
  };

  const metrics = data?.metrics ?? {
    new_in_period: 0,
    won_in_period: 0,
    lost_in_period: 0,
    conversion_rate: 0,
    total_open: 0,
  };

  const conversionPct =
    typeof metrics.conversion_rate === "number"
      ? `${(metrics.conversion_rate * 100).toFixed(0)}%`
      : "0%";

  const maxStageCount = Math.max(
    funnel.new,
    funnel.contacted,
    funnel.test_drive,
    funnel.discussion,
    funnel.won,
    funnel.lost,
    1
  );

  const conversionCards = [
    {
      label: "New Leads",
      value: metrics.new_in_period,
      icon: UserPlus,
      color: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
      subtitle: `Created in ${periodTitleSuffix}`,
      isLive: false,
    },
    {
      label: "Won Deals",
      value: metrics.won_in_period,
      icon: Trophy,
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      subtitle: `Closed won in ${periodTitleSuffix}`,
      isLive: false,
    },
    {
      label: "Lost Leads",
      value: metrics.lost_in_period,
      icon: XCircle,
      color: "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20",
      subtitle: `Closed lost in ${periodTitleSuffix}`,
      isLive: false,
    },
    {
      label: "Conversion Rate",
      value: conversionPct,
      icon: Percent,
      color: "text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20",
      subtitle: "Won / (Won + Lost)",
      isLive: false,
    },
    {
      label: "Total Open Leads",
      value: metrics.total_open,
      icon: FolderOpen,
      color: "text-accent bg-accent/10 border-accent/20",
      subtitle: "Active pipeline right now",
      isLive: true,
    },
  ];

  return (
    <div className="space-y-4 font-sans select-none">
      {/* ------------------------------------------------------------- */}
      {/* PERIOD SELECTOR DROPDOWN & DATE RANGE HEADER BAR              */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-card p-2.5 sm:p-3 rounded-xl border border-line/60">
        {/* Period Dropdown Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-ink-subtle text-xs font-semibold shrink-0">
            <Filter className="h-3.5 w-3.5 text-accent" />
            <span>Period Filter:</span>
          </div>
          <div className="relative">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as PeriodKey)}
              className="appearance-none bg-inset border border-line/60 text-ink text-xs font-bold rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:border-accent cursor-pointer transition-colors"
            >
              {PERIOD_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-subtle" />
          </div>
        </div>

        {/* Resolved Date Range Badge */}
        {resolvedDateLabel && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-inset border border-line/50 text-[11px] font-mono font-medium text-ink-subtle shrink-0">
            <Calendar className="h-3 w-3 text-accent" />
            <span>{resolvedDateLabel}</span>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. MINIMALIST BENTO METRIC CARDS GRID (RESPONSIVE 2/3/5 COLS) */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
        {conversionCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`flex flex-col justify-between rounded-xl border bg-card p-3 sm:p-3.5 transition-colors ${
                card.isLive
                  ? "border-emerald-500/40 bg-emerald-500/5"
                  : "border-line/60 hover:border-line"
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-1 min-w-0">
                  <span className="text-[10px] sm:text-[11px] font-semibold text-ink-muted truncate">
                    {card.label}
                  </span>
                  {card.isLive && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shrink-0">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live
                    </span>
                  )}
                </div>
                <div
                  className={`flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg border ${card.color} shrink-0`}
                >
                  <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5 stroke-[2px]" />
                </div>
              </div>

              <div className="mt-2.5 space-y-0.5">
                <span className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-ink block leading-none">
                  {card.value}
                </span>
                <span className="text-[10px] text-ink-subtle block truncate">
                  {card.subtitle}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. MINIMALIST HORIZONTAL BAR FUNNEL CHART (FULLY RESPONSIVE) */}
      {/* ------------------------------------------------------------- */}
      <div className="rounded-xl border border-line/60 bg-card p-4 sm:p-5 space-y-4">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line/40 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10 border border-accent/20 text-accent shrink-0">
              <BarChart3 className="h-4 w-4 stroke-[2px]" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-ink font-heading leading-tight">
                Dealership Sales Funnel
              </h3>
              <p className="text-[11px] text-ink-subtle">
                Stage progression ({resolvedDateLabel || periodTitleSuffix})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-medium">
            <span className="flex items-center gap-1 text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-md">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              Active (4)
            </span>
            <span className="flex items-center gap-1 text-ink-muted bg-inset border border-line/60 px-2 py-0.5 rounded-md">
              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
              Closed (2)
            </span>
          </div>
        </div>

        {/* Empty State Banner when no leads in selected period */}
        {metrics.new_in_period === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center space-y-1.5 select-none">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-inset text-ink-subtle mb-1">
              <Filter className="h-5 w-5 stroke-[1.5px]" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-ink">No Leads Created in This Period</h4>
            <p className="text-[11px] text-ink-subtle max-w-xs">
              No new customer leads were recorded in {periodTitleSuffix}. Try selecting a different period above.
            </p>
          </div>
        ) : (
          /* Minimalist Horizontal Bar Stack Chart */
          <div className="space-y-3 pt-0.5">
            <div className="space-y-2.5">
              {STAGE_CONFIGS.map((config) => {
                const count = funnel[config.key] ?? 0;
                const barWidthPct =
                  count > 0 ? Math.max((count / maxStageCount) * 100, 3) : 0;
                const shareOfPeriodPct =
                  metrics.new_in_period > 0
                    ? Math.round((count / metrics.new_in_period) * 100)
                    : 0;

                return (
                  <div key={config.key} className="space-y-1">
                    {/* Stage Label & Details Row */}
                    <div className="flex items-center justify-between text-xs gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-mono text-[10px] text-ink-subtle shrink-0">
                          {config.stepNumber}
                        </span>

                        <span
                          className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded border shrink-0 ${config.badgeBg}`}
                        >
                          {config.isTerminal ? "Closed" : "Active"}
                        </span>

                        <span className="font-semibold text-ink font-sans text-xs truncate">
                          {config.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 font-mono shrink-0">
                        <span className="text-[10px] text-ink-subtle hidden sm:inline">
                          {shareOfPeriodPct}%
                        </span>
                        <span
                          className={`text-[11px] font-bold px-2 py-0.2 rounded bg-inset border border-line/60 ${config.textColor}`}
                        >
                          {count}
                        </span>
                      </div>
                    </div>

                    {/* Clean Minimalist Horizontal Bar */}
                    <div className="relative h-4 sm:h-5 w-full rounded-md bg-inset overflow-hidden border border-line/30">
                      <div
                        className={`h-full rounded-md ${config.barColor} transition-all duration-300 ease-out`}
                        style={{ width: `${barWidthPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Chart Axis Labels */}
            <div className="flex justify-between text-[10px] font-mono text-ink-subtle px-1 pt-2 border-t border-line/40">
              <span>0</span>
              <span>{Math.round(maxStageCount * 0.5)}</span>
              <span className="font-bold text-ink">{maxStageCount} max</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
