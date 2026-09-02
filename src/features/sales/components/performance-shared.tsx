"use client";

import {
  UserPlus,
  CalendarCheck,
  Truck,
  Calendar,
  BarChart3,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import type {
  PerformancePeriod,
  PerformanceTotals,
  PerformanceTrendData,
  TrendBucket,
} from "../types/performance-types";

/** Shared period-filter options — matches the CRM owner dashboard exactly. */
export const PERIOD_OPTIONS = [
  { key: "this_month", label: "This Month" },
  { key: "last_month", label: "Last Month" },
  { key: "last_3_months", label: "Last 3 Months" },
  { key: "this_year", label: "This Year" },
  { key: "all_time", label: "All Time" },
] as const;

export type PeriodKey = (typeof PERIOD_OPTIONS)[number]["key"];

export const SERIES_COLORS = {
  enquiries: "#6366f1", // indigo-500
  bookings: "#10b981", // emerald-500
  deliveries: "#a855f7", // purple-500
};

export function formatXAxisLabel(key: string, bucket: TrendBucket): string {
  if (!key) return "";

  if (bucket === "day") {
    // "2026-09-01" -> "1 Sep"
    const [y, m, d] = key.split("-").map(Number);
    if (!y || !m || !d) return key;
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  }

  if (bucket === "week") {
    // "2026-08-31" -> "Wk of 31 Aug"
    const [y, m, d] = key.split("-").map(Number);
    if (!y || !m || !d) return key;
    const date = new Date(y, m - 1, d);
    const shortDate = date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    return `Wk of ${shortDate}`;
  }

  if (bucket === "month") {
    // "2026-09" -> "Sep '26"
    const [y, m] = key.split("-").map(Number);
    if (!y || !m) return key;
    const date = new Date(y, m - 1, 1);
    return date.toLocaleDateString("en-IN", { month: "short", year: "2-digit" }).replace(" ", " '");
  }

  if (bucket === "year") {
    return key;
  }

  return key;
}

export function formatTooltipTitle(key: string, bucket: TrendBucket): string {
  if (!key) return "";

  if (bucket === "day") {
    // "2026-09-01" -> "1 September 2026"
    const [y, m, d] = key.split("-").map(Number);
    if (!y || !m || !d) return key;
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  }

  if (bucket === "week") {
    // "2026-08-31" -> "Week of 31 August 2026"
    const [y, m, d] = key.split("-").map(Number);
    if (!y || !m || !d) return key;
    const date = new Date(y, m - 1, d);
    const longDate = date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
    return `Week of ${longDate}`;
  }

  if (bucket === "month") {
    // "2026-09" -> "September 2026"
    const [y, m] = key.split("-").map(Number);
    if (!y || !m) return key;
    const date = new Date(y, m - 1, 1);
    return date.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  }

  if (bucket === "year") {
    return key;
  }

  return key;
}

export function formatMonthLabel(month: string) {
  return formatXAxisLabel(month, "month");
}

export function resolvePeriodDateLabel(period?: PerformancePeriod | null) {
  if (!period) return "";
  if (!period.from || !period.to) return period.label ?? "";
  const fromStr = new Date(period.from).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const toStr = new Date(period.to).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return `${fromStr} – ${toStr}`;
}

export function PerformanceErrorState({
  message = "Failed to load sales performance data",
  onRetry,
}: {
  message?: string;
  onRetry: () => void;
}) {
  return (
    <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 sm:p-5 font-sans select-none text-rose-600 space-y-3">
      <div className="flex items-center gap-2">
        <AlertCircle className="h-4.5 w-4.5 shrink-0" />
        <h3 className="text-xs sm:text-sm font-bold">{message}</h3>
      </div>
      <p className="text-xs text-rose-600/80">
        An error occurred while fetching performance stats. Please check your
        connection and try again.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors cursor-pointer"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        <span>Retry</span>
      </button>
    </div>
  );
}

export function PerformanceLoadingState() {
  return (
    <div className="space-y-4 font-sans select-none animate-pulse">
      <div className="h-14 w-full rounded-xl bg-inset" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-24 rounded-xl border border-line/50 bg-card p-3 space-y-2"
          >
            <div className="h-3 w-20 rounded bg-inset" />
            <div className="h-7 w-12 rounded bg-inset" />
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-line/50 bg-card p-4 space-y-3">
        <div className="h-5 w-44 rounded bg-inset" />
        <div className="h-64 rounded-md bg-inset w-full" />
      </div>
    </div>
  );
}

export function PerformanceDateBadge({
  label,
}: {
  label: string;
}) {
  if (!label) return null;
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-inset border border-line/50 text-[11px] font-mono font-medium text-ink-subtle shrink-0">
      <Calendar className="h-3 w-3 text-accent" />
      <span>{label}</span>
    </div>
  );
}

/** The 3 KPI cards (Enquiries / Bookings / Deliveries) — shared by owner + staff views. */
export function PerformanceKpiCards({
  totals,
}: {
  totals: PerformanceTotals;
}) {
  const cards = [
    {
      key: "enquiries",
      label: "Enquiries",
      value: totals.enquiries,
      icon: UserPlus,
      color:
        "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
      subtitle: "Leads created in period",
    },
    {
      key: "bookings",
      label: "Bookings",
      value: totals.bookings,
      icon: CalendarCheck,
      color:
        "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      subtitle: "Prebooked in period",
    },
    {
      key: "deliveries",
      label: "Deliveries",
      value: totals.deliveries,
      icon: Truck,
      color:
        "text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20",
      subtitle: "Delivered in period",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 font-sans">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.key}
            className="flex flex-col justify-between rounded-xl p-3 sm:p-3.5 border border-line/60 bg-card hover:border-line transition-colors"
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] sm:text-[11px] font-semibold text-ink-muted truncate">
                {card.label}
              </span>
              <div
                className={`flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg border ${card.color} shrink-0`}
              >
                <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5 stroke-[2px]" />
              </div>
            </div>
            <div className="mt-2.5 space-y-0.5">
              <span className="font-heading text-xl sm:text-2xl font-bold tracking-tight block leading-none text-ink">
                {card.value}
              </span>
              <span className="text-[10px] block truncate text-ink-subtle">
                {card.subtitle}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** The adaptive recharts trend chart (enquiries/bookings/deliveries) — shared by owner + staff views. */
export function PerformanceTrendChart({
  trend,
}: {
  trend?: PerformanceTrendData | null;
}) {
  const bucket: TrendBucket = trend?.bucket ?? "month";
  const points = trend?.points ?? [];

  const chartData = points.map((p) => ({
    ...p,
    label: formatXAxisLabel(p.key, bucket),
  }));

  const trendHasActivity = points.some(
    (p) => p.enquiries > 0 || p.bookings > 0 || p.deliveries > 0
  );

  const bucketTitleMap: Record<TrendBucket, string> = {
    day: "Daily Trend",
    week: "Weekly Trend",
    month: "Monthly Trend",
    year: "Yearly Trend",
  };

  const bucketSubtitleMap: Record<TrendBucket, string> = {
    day: "Enquiries, bookings & deliveries by day",
    week: "Enquiries, bookings & deliveries by week",
    month: "Enquiries, bookings & deliveries by month",
    year: "Enquiries, bookings & deliveries by year",
  };

  return (
    <div className="rounded-xl border border-line/60 bg-card p-4 sm:p-6 space-y-4 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line/40 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10 border border-accent/20 text-accent shrink-0">
            <BarChart3 className="h-4 w-4 stroke-[2px]" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-ink font-heading leading-tight">
              {bucketTitleMap[bucket] ?? "Performance Trend"}
            </h3>
            <p className="text-[11px] text-ink-subtle">
              {bucketSubtitleMap[bucket] ?? "Enquiries, bookings & deliveries by period"}
            </p>
          </div>
        </div>
      </div>

      {points.length === 0 || !trendHasActivity ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 space-y-2 border border-dashed border-line/50 rounded-lg bg-inset/30">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-inset border border-line/60 text-ink-subtle">
            <BarChart3 className="h-4 w-4 text-accent" />
          </div>
          <p className="text-xs font-semibold text-ink-muted">No activity to chart</p>
          <p className="text-[11px] text-ink-subtle text-center max-w-xs">
            There are no enquiries, bookings, or deliveries recorded for this period.
          </p>
        </div>
      ) : (
        <div className="h-56 sm:h-64 w-full overflow-x-auto no-scrollbar">
          <div className="h-full min-w-[340px] sm:min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 8, right: 8, left: -22, bottom: 8 }}
                barGap={3}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--line, rgba(0,0,0,0.06))"
                  opacity={0.5}
                />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "var(--ink-subtle, #64748b)" }}
                  interval="preserveStartEnd"
                  minTickGap={12}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 10,
                    fill: "var(--ink-subtle, #64748b)",
                    fontFamily: "monospace",
                  }}
                  allowDecimals={false}
                />
                <Tooltip
                  labelFormatter={(_label, payload) => {
                    const originalKey = payload?.[0]?.payload?.key;
                    return formatTooltipTitle(originalKey ?? _label, bucket);
                  }}
                  contentStyle={{
                    borderRadius: 10,
                    border: "1px solid var(--line, rgba(0,0,0,0.1))",
                    background: "var(--card, #fff)",
                    color: "var(--ink, #000)",
                    fontSize: 11,
                    fontFamily: "inherit",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                  cursor={{ fill: "rgba(44, 122, 255, 0.04)" }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 11, fontWeight: 600 }}
                  iconType="circle"
                  iconSize={8}
                />
                <Bar
                  dataKey="enquiries"
                  name="Enquiries"
                  fill={SERIES_COLORS.enquiries}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={20}
                />
                <Bar
                  dataKey="bookings"
                  name="Bookings"
                  fill={SERIES_COLORS.bookings}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={20}
                />
                <Bar
                  dataKey="deliveries"
                  name="Deliveries"
                  fill={SERIES_COLORS.deliveries}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

