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
  Calendar,
  BarChart3,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import { CustomSelect } from "@/src/components/ui/custom-select";
import { useDashboardFunnel } from "../hooks/use-dashboard-funnel";

const ACCENT_SHADES = [
  "#a78bfa", // violet-400
  "#8b5cf6", // violet-500
  "#7c3aed", // violet-600 (base accent)
  "#6d28d9", // violet-700
  "#5b21b6", // violet-800
  "#4c1d95", // violet-900
];

const PERIOD_OPTIONS = [
  { key: "this_month", label: "This Month" },
  { key: "last_month", label: "Last Month" },
  { key: "last_3_months", label: "Last 3 Months" },
  { key: "this_year", label: "This Year" },
  { key: "all_time", label: "All Time" },
] as const;

type PeriodKey = (typeof PERIOD_OPTIONS)[number]["key"];

interface ChartDataItem {
  name: string;
  fullLabel: string;
  count: number;
  share: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ChartDataItem;
  }>;
}

interface CustomBarLabelProps {
  x?: number;
  y?: number;
  width?: number;
  value?: number;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-xl border border-line bg-card/95 backdrop-blur-md px-3.5 py-2.5 shadow-xl text-xs font-sans space-y-1">
        <p className="font-bold text-ink text-xs">{data.fullLabel}</p>
        <div className="flex items-center gap-3 text-[11px] font-mono text-ink-subtle">
          <span>
            Leads: <strong className="text-ink font-bold">{data.count}</strong>
          </span>
          <span>
            Share: <strong className="text-ink font-bold">{data.share}%</strong>
          </span>
        </div>
      </div>
    );
  }
  return null;
}

interface CustomXAxisTickProps {
  x?: number;
  y?: number;
  payload?: {
    value: string;
  };
}

function CustomXAxisTick({ x = 0, y = 0, payload }: CustomXAxisTickProps) {
  if (!payload) return null;
  const val = payload.value;
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={10}
        textAnchor="middle"
        className="text-[9px] min-[390px]:text-[10px] sm:text-[11px] font-semibold font-sans fill-current text-ink-muted"
      >
        {val}
      </text>
    </g>
  );
}

function CustomBarLabel({
  x = 0,
  y = 0,
  width = 0,
  value,
}: CustomBarLabelProps) {
  if (value === undefined || value === null) return null;
  return (
    <text
      x={x + width / 2}
      y={y - 8}
      fill="currentColor"
      textAnchor="middle"
      className="font-mono text-xs font-bold text-ink fill-current"
    >
      {value}
    </text>
  );
}

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
          <div className="h-64 rounded-md bg-inset w-full" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 sm:p-5 font-sans select-none text-rose-600 space-y-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4.5 w-4.5 shrink-0" />
          <h3 className="text-xs sm:text-sm font-bold">
            Failed to load CRM Funnel data
          </h3>
        </div>
        <p className="text-xs text-rose-600/80">
          An error occurred while fetching funnel stats. Please check your
          connection and try again.
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

  const chartData = [
    {
      name: "New",
      fullLabel: "New Enquiries",
      count: funnel.new,
      share:
        metrics.new_in_period > 0
          ? Math.round((funnel.new / metrics.new_in_period) * 100)
          : 0,
    },
    {
      name: "Contacted",
      fullLabel: "Contacted & Qualified",
      count: funnel.contacted,
      share:
        metrics.new_in_period > 0
          ? Math.round((funnel.contacted / metrics.new_in_period) * 100)
          : 0,
    },
    {
      name: "Test Drive",
      fullLabel: "Test Drive Scheduled",
      count: funnel.test_drive,
      share:
        metrics.new_in_period > 0
          ? Math.round((funnel.test_drive / metrics.new_in_period) * 100)
          : 0,
    },
    {
      name: "Discussion",
      fullLabel: "Price Discussion / Offer",
      count: funnel.discussion,
      share:
        metrics.new_in_period > 0
          ? Math.round((funnel.discussion / metrics.new_in_period) * 100)
          : 0,
    },
    {
      name: "Won",
      fullLabel: "Won (Closed Deal)",
      count: funnel.won,
      share:
        metrics.new_in_period > 0
          ? Math.round((funnel.won / metrics.new_in_period) * 100)
          : 0,
    },
    {
      name: "Lost",
      fullLabel: "Lost / Closed",
      count: funnel.lost,
      share:
        metrics.new_in_period > 0
          ? Math.round((funnel.lost / metrics.new_in_period) * 100)
          : 0,
    },
  ];

  const conversionCards = [
    {
      label: "New Leads",
      value: metrics.new_in_period,
      icon: UserPlus,
      color:
        "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
      subtitle: `Created in ${periodTitleSuffix}`,
      isLive: false,
    },
    {
      label: "Won Deals",
      value: metrics.won_in_period,
      icon: Trophy,
      color:
        "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      subtitle: `Closed won in ${periodTitleSuffix}`,
      isLive: false,
    },
    {
      label: "Lost Leads",
      value: metrics.lost_in_period,
      icon: XCircle,
      color:
        "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20",
      subtitle: `Closed lost in ${periodTitleSuffix}`,
      isLive: false,
    },
    {
      label: "Conversion Rate",
      value: conversionPct,
      icon: Percent,
      color:
        "text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20",
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
        {/* Custom Period Dropdown Selector */}
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
      {/* 2. RECHARTS MINIMALIST STAGE DISTRIBUTION COLUMN CHART        */}
      {/* ------------------------------------------------------------- */}
      <div className="rounded-xl border border-line/60 bg-card p-4 sm:p-6 space-y-4">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line/40 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10 border border-accent/20 text-accent shrink-0">
              <BarChart3 className="h-4 w-4 stroke-[2px]" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-ink font-heading leading-tight">
                Stage Distribution
              </h3>
              <p className="text-[11px] text-ink-subtle">
                Stage progression ({resolvedDateLabel || periodTitleSuffix})
              </p>
            </div>
          </div>
        </div>

        {/* Empty State Banner when no leads in selected period */}
        {metrics.new_in_period === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-1.5 select-none">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-inset text-ink-subtle mb-1">
              <Filter className="h-5 w-5 stroke-[1.5px]" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-ink">
              No Leads Created in This Period
            </h4>
            <p className="text-[11px] text-ink-subtle max-w-xs">
              No new customer leads were recorded in {periodTitleSuffix}. Try
              selecting a different period above.
            </p>
          </div>
        ) : (
          /* Recharts Minimalist Column Chart */
          <div className="h-64 sm:h-72 w-full pt-4 overflow-x-auto no-scrollbar">
            <div className="h-full min-w-[340px] sm:min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 24, right: 8, left: -22, bottom: 8 }}
                  barCategoryGap="15%"
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="var(--line, rgba(0,0,0,0.06))"
                    opacity={0.5}
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                    tick={<CustomXAxisTick />}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 10,
                      fill: "#64748b",
                      fontFamily: "monospace",
                    }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "rgba(124, 58, 237, 0.04)" }}
                  />
                  <Bar
                    dataKey="count"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={44}
                    label={<CustomBarLabel />}
                  >
                    {chartData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={ACCENT_SHADES[index % ACCENT_SHADES.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
