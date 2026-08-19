"use client";

import Link from "next/link";
import { TrendingUp, Coins, ArrowUpRight, Vault } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  LabelList,
} from "recharts";
import { useDashboardStats } from "../hooks/use-dashboard-stats";
import {
  formatCompactCurrency,
  formatFullCurrency,
} from "@/src/utils/currency";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      fullName: string;
      value: number;
      sub: string;
      fill: string;
    };
  }>;
}

function FinancialTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="rounded-xl border border-line/80 bg-card p-3 shadow-xl font-sans text-xs space-y-1 select-none">
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full shrink-0"
            style={{ backgroundColor: item.fill }}
          />
          <span className="font-bold text-ink">{item.fullName}</span>
        </div>
        <p className="font-mono font-bold text-sm text-ink">
          {formatFullCurrency(item.value)}
        </p>
        <p className="text-[10px] text-ink-subtle">{item.sub}</p>
      </div>
    );
  }
  return null;
}

export function FinancialSnapshot() {
  const { data, isLoading, isError } = useDashboardStats();

  if (isError) return null;

  const capitalTiedUpNum = Number(data?.financials?.capital_tied_up || 0);
  const stockValueNum = Number(data?.financials?.stock_value || 0);

  const profit = Math.max(0, stockValueNum - capitalTiedUpNum);
  const roiPct = capitalTiedUpNum > 0 ? (profit / capitalTiedUpNum) * 100 : 0;

  const chartData = [
    {
      name: "Invested",
      fullName: "Invested Capital",
      value: capitalTiedUpNum,
      sub: "Purchase + Refurbish Cost",
      fill: "#6366f1", // Accent indigo
    },
    {
      name: "Stock Value",
      fullName: "Total Stock Value",
      value: stockValueNum,
      sub: "Asking Price Total",
      fill: "#8b5cf6", // Deep purple
    },
    {
      name: "Gross Profit",
      fullName: "Expected Gross Profit",
      value: profit,
      sub: `Expected Margin (+${roiPct.toFixed(0)}%)`,
      fill: "#10b981", // Muted emerald green
    },
  ];

  return (
    <div className="flex flex-col justify-between h-full w-full rounded-xl border border-line/60 bg-card p-4 space-y-4 select-none font-sans transition-all hover:border-line">
      {/* 1. Header Bar */}
      <div className="flex items-center justify-between border-b border-line/40 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">
            <Coins className="h-4 w-4 stroke-[2.25px]" />
          </div>
          <h2 className="text-xs font-bold text-ink tracking-tight font-heading">
            Capital Overview
          </h2>
        </div>

        <Link
          href="/owner/inventory?tab=in_stock"
          className="flex h-6 w-6 items-center justify-center rounded-md text-ink-subtle hover:bg-inset hover:text-accent transition-colors"
          title="View In-Stock Inventory"
        >
          <ArrowUpRight className="h-3.5 w-3.5 stroke-[2px]" />
        </Link>
      </div>

      {/* 2. Full-Width 3-Column Core Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
        {/* Metric 1: Total Invested (Purchase + Refurbish) */}
        <div className="rounded-xl border border-line/60 bg-inset p-3 space-y-1 w-full">
          <div className="flex items-center gap-1.5 text-xs font-medium text-ink-muted">
            <Vault className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
            <span className="truncate">Invested Capital</span>
          </div>
          {isLoading ? (
            <div className="h-6 w-20 animate-pulse rounded bg-line/20" />
          ) : (
            <p
              className="font-mono text-base sm:text-lg font-bold text-ink tracking-tight truncate"
              title={formatFullCurrency(capitalTiedUpNum)}
            >
              {formatCompactCurrency(capitalTiedUpNum)}
            </p>
          )}
          <span className="text-[10px] text-ink-subtle block truncate">
            Purchase + Refurb
          </span>
        </div>

        {/* Metric 2: Total Stock Value */}
        <div className="rounded-xl border border-line/60 bg-inset p-3 space-y-1 w-full">
          <div className="flex items-center gap-1.5 text-xs font-medium text-ink-muted">
            <Coins className="h-3.5 w-3.5 text-purple-500 shrink-0" />
            <span className="truncate">Total Stock Value</span>
          </div>
          {isLoading ? (
            <div className="h-6 w-20 animate-pulse rounded bg-line/20" />
          ) : (
            <p
              className="font-mono text-base sm:text-lg font-bold text-ink tracking-tight truncate"
              title={formatFullCurrency(stockValueNum)}
            >
              {formatCompactCurrency(stockValueNum)}
            </p>
          )}
          <span className="text-[10px] text-ink-subtle block truncate">
            Asking Price Total
          </span>
        </div>

        {/* Metric 3: Expected Gross Profit */}
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3 space-y-1 w-full">
          <div className="flex items-center justify-between text-xs font-medium text-emerald-700">
            <span className="truncate">Gross Profit</span>
            {roiPct > 0 && (
              <span className="inline-flex items-center text-[10px] font-bold text-emerald-600 font-mono">
                <TrendingUp className="h-3 w-3 mr-0.5" />
                +{roiPct.toFixed(0)}%
              </span>
            )}
          </div>
          {isLoading ? (
            <div className="h-6 w-20 animate-pulse rounded bg-emerald-500/20" />
          ) : (
            <p
              className="font-mono text-base sm:text-lg font-bold text-emerald-600 tracking-tight truncate"
              title={formatFullCurrency(profit)}
            >
              +{formatCompactCurrency(profit)}
            </p>
          )}
          <span className="text-[10px] text-emerald-600/80 block truncate font-mono font-medium">
            Expected Margin
          </span>
        </div>
      </div>

      {/* 3. Recharts BarChart Visualization Section */}
      <div className="rounded-xl border border-line/60 bg-inset/50 p-3 pt-4 space-y-2 w-full">
        <div className="flex items-center justify-between text-[11px] font-mono font-bold text-ink-subtle px-1">
          <span>FINANCIAL SPREAD</span>
          {roiPct > 0 && (
            <span className="text-emerald-600 font-bold">
              +{roiPct.toFixed(0)}% ROI Margin
            </span>
          )}
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 10, right: 45, left: 10, bottom: 5 }}
            >
              <XAxis
                type="number"
                tickFormatter={(val) => formatCompactCurrency(Number(val))}
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{
                  fontSize: 11,
                  fontWeight: 600,
                  fill: "#6b7280",
                }}
                axisLine={false}
                tickLine={false}
                width={85}
              />
              <Tooltip
                content={<FinancialTooltip />}
                cursor={{ fill: "rgba(0, 0, 0, 0.04)" }}
              />
              <Bar
                dataKey="value"
                radius={[0, 6, 6, 0]}
                barSize={24}
                isAnimationActive={true}
              >
                <LabelList
                  dataKey="value"
                  position="right"
                  formatter={(val: unknown) =>
                    formatCompactCurrency(Number(val))
                  }
                  style={{ fontSize: "11px", fontWeight: 700, fill: "#4b5563" }}
                />
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
