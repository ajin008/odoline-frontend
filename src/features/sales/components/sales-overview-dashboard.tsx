"use client";

import { useMemo, useState } from "react";
import {
  UserPlus,
  CalendarCheck,
  Truck,
  Filter,
  Calendar,
  Users,
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
import { CustomSelect } from "@/src/components/ui/custom-select";
import {
  useSalesOverview,
  usePerformanceStaffList,
  useStaffPerformance,
} from "../hooks/use-sales-performance";

const PERIOD_OPTIONS = [
  { key: "this_month", label: "This Month" },
  { key: "last_month", label: "Last Month" },
  { key: "last_3_months", label: "Last 3 Months" },
  { key: "this_year", label: "This Year" },
  { key: "all_time", label: "All Time" },
] as const;

type PeriodKey = (typeof PERIOD_OPTIONS)[number]["key"];

const ALL_STAFF_VALUE = "__all__";

const SERIES_COLORS = {
  enquiries: "#6366f1", // indigo-500
  bookings: "#10b981", // emerald-500
  deliveries: "#a855f7", // purple-500
};

function formatMonthLabel(month: string) {
  // "2026-04" -> "Apr '26"
  const [year, m] = month.split("-");
  const date = new Date(Number(year), Number(m) - 1, 1);
  return date.toLocaleDateString("en-IN", { month: "short", year: "2-digit" }).replace(" ", " '");
}

export function SalesOverviewDashboard() {
  const [period, setPeriod] = useState<PeriodKey>("this_month");
  const [staffId, setStaffId] = useState<string>(ALL_STAFF_VALUE);

  const isStaffScoped = staffId !== ALL_STAFF_VALUE;

  const { data: staffList } = usePerformanceStaffList();

  const overviewQuery = useSalesOverview(!isStaffScoped ? period : undefined);
  const staffQuery = useStaffPerformance(
    isStaffScoped ? staffId : null,
    isStaffScoped ? period : undefined
  );

  const { data, isLoading, isError, refetch } = isStaffScoped
    ? staffQuery
    : overviewQuery;

  const staffOptions = useMemo(
    () => [
      { value: ALL_STAFF_VALUE, label: "All Staff (Dealership)" },
      ...(staffList ?? []).map((s) => ({ value: s.id, label: s.name })),
    ],
    [staffList]
  );

  const totals = data?.totals ?? { enquiries: 0, bookings: 0, deliveries: 0 };
  const trend = data?.trend ?? [];
  const staffName = data?.staff?.name;

  const chartData = trend.map((t) => ({
    ...t,
    monthLabel: formatMonthLabel(t.month),
  }));

  const hasActivity =
    totals.enquiries > 0 || totals.bookings > 0 || totals.deliveries > 0;
  const trendHasActivity = trend.some(
    (t) => t.enquiries > 0 || t.bookings > 0 || t.deliveries > 0
  );

  const resolvedDateLabel = (() => {
    if (!data?.period) return "";
    if (!data.period.from || !data.period.to) return data.period.label ?? "";
    const fromStr = new Date(data.period.from).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const toStr = new Date(data.period.to).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    return `${fromStr} – ${toStr}`;
  })();

  if (isError) {
    return (
      <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 sm:p-5 font-sans select-none text-rose-600 space-y-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4.5 w-4.5 shrink-0" />
          <h3 className="text-xs sm:text-sm font-bold">
            Failed to load sales performance data
          </h3>
        </div>
        <p className="text-xs text-rose-600/80">
          An error occurred while fetching performance stats. Please check
          your connection and try again.
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

  if (isLoading) {
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

  const kpiCards = [
    {
      key: "enquiries",
      label: "Enquiries",
      value: totals.enquiries,
      icon: UserPlus,
      color: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
      subtitle: "Leads created in period",
    },
    {
      key: "bookings",
      label: "Bookings",
      value: totals.bookings,
      icon: CalendarCheck,
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      subtitle: "Prebooked in period",
    },
    {
      key: "deliveries",
      label: "Deliveries",
      value: totals.deliveries,
      icon: Truck,
      color: "text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20",
      subtitle: "Delivered in period",
    },
  ];

  return (
    <div className="space-y-4 font-sans select-none">
      {/* ------------------------------------------------------------- */}
      {/* PERIOD + STAFF SELECTOR HEADER BAR                            */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-card p-2.5 sm:p-3 rounded-xl border border-line/60">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <CustomSelect
            options={PERIOD_OPTIONS.map((opt) => ({
              value: opt.key,
              label: opt.label,
            }))}
            value={period}
            onChange={(val) => setPeriod(val as PeriodKey)}
            icon={<Filter className="h-3.5 w-3.5 text-accent" />}
            labelPrefix="Period Filter:"
          />
          <CustomSelect
            options={staffOptions}
            value={staffId}
            onChange={(val) => setStaffId(val)}
            icon={<Users className="h-3.5 w-3.5 text-accent" />}
            labelPrefix="Staff:"
          />
        </div>

        {resolvedDateLabel && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-inset border border-line/50 text-[11px] font-mono font-medium text-ink-subtle shrink-0">
            <Calendar className="h-3 w-3 text-accent" />
            <span>{resolvedDateLabel}</span>
          </div>
        )}
      </div>

      {isStaffScoped && staffName && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20 text-xs font-bold text-accent">
          <Users className="h-3.5 w-3.5" />
          <span>Showing: {staffName}</span>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* KPI CARDS                                                     */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
        {kpiCards.map((card) => {
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

      {/* ------------------------------------------------------------- */}
      {/* RECHARTS 6-MONTH TREND CHART                                  */}
      {/* ------------------------------------------------------------- */}
      <div className="rounded-xl border border-line/60 bg-card p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line/40 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10 border border-accent/20 text-accent shrink-0">
              <BarChart3 className="h-4 w-4 stroke-[2px]" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-ink font-heading leading-tight">
                6-Month Trend
              </h3>
              <p className="text-[11px] text-ink-subtle">
                Enquiries, bookings &amp; deliveries by month
              </p>
            </div>
          </div>
        </div>

        {!trendHasActivity ? (
          <div className="space-y-3">
            <div className="h-56 sm:h-64 w-full opacity-40 pointer-events-none">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 8, left: -22, bottom: 8 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="var(--line, rgba(0,0,0,0.06))"
                  />
                  <XAxis
                    dataKey="monthLabel"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#64748b" }}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#64748b" }} allowDecimals={false} />
                  <Bar dataKey="enquiries" fill={SERIES_COLORS.enquiries} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="bookings" fill={SERIES_COLORS.bookings} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="deliveries" fill={SERIES_COLORS.deliveries} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-center text-[11px] text-ink-subtle">
              No activity in this period.
            </p>
          </div>
        ) : (
          <div className="h-56 sm:h-64 w-full overflow-x-auto no-scrollbar">
            <div className="h-full min-w-[340px] sm:min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 8, left: -22, bottom: 8 }} barGap={3}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="var(--line, rgba(0,0,0,0.06))"
                    opacity={0.5}
                  />
                  <XAxis
                    dataKey="monthLabel"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#64748b" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#64748b", fontFamily: "monospace" }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 10,
                      border: "1px solid var(--line, rgba(0,0,0,0.1))",
                      background: "var(--card, #fff)",
                      fontSize: 11,
                      fontFamily: "inherit",
                    }}
                    cursor={{ fill: "rgba(44, 122, 255, 0.04)" }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: 11, fontWeight: 600 }}
                    iconType="circle"
                    iconSize={8}
                  />
                  <Bar dataKey="enquiries" name="Enquiries" fill={SERIES_COLORS.enquiries} radius={[4, 4, 0, 0]} maxBarSize={20} />
                  <Bar dataKey="bookings" name="Bookings" fill={SERIES_COLORS.bookings} radius={[4, 4, 0, 0]} maxBarSize={20} />
                  <Bar dataKey="deliveries" name="Deliveries" fill={SERIES_COLORS.deliveries} radius={[4, 4, 0, 0]} maxBarSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {!hasActivity && (
        <p className="text-center text-[11px] text-ink-subtle -mt-1">
          No enquiries, bookings, or deliveries recorded in this period.
        </p>
      )}
    </div>
  );
}
