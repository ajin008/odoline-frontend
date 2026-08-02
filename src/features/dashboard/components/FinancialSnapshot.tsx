"use client";

import Link from "next/link";
import { TrendingUp, Coins, ArrowUpRight, Vault } from "lucide-react";
import { useDashboardStats } from "../hooks/use-dashboard-stats";
import {
  formatCompactCurrency,
  formatFullCurrency,
} from "@/src/utils/currency";

export function FinancialSnapshot() {
  const { data, isLoading, isError } = useDashboardStats();

  if (isError) return null;

  const capitalTiedUpNum = Number(data?.financials?.capital_tied_up || 0);
  const stockValueNum = Number(data?.financials?.stock_value || 0);

  const profit = Math.max(0, stockValueNum - capitalTiedUpNum);
  const roiPct = capitalTiedUpNum > 0 ? (profit / capitalTiedUpNum) * 100 : 0;

  const total = Math.max(stockValueNum, 1);
  const costSharePct = Math.min(100, Math.max(0, (capitalTiedUpNum / total) * 100));

  return (
    <div className="flex flex-col justify-between h-full w-full rounded-2xl border border-line bg-card p-4 space-y-3.5 select-none font-sans transition-all hover:border-accent/40">
      {/* 1. Header Bar */}
      <div className="flex items-center justify-between border-b border-line/40 pb-2.5">
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
        <div className="rounded-xl border border-line/50 bg-inset p-3 space-y-1 w-full">
          <div className="flex items-center gap-1.5 text-xs font-medium text-ink-muted">
            <Vault className="h-3.5 w-3.5 text-blue-500 shrink-0" />
            <span className="truncate">Invested Capital</span>
          </div>
          {isLoading ? (
            <div className="h-6 w-20 animate-pulse rounded bg-line/20" />
          ) : (
            <p
              className="font-heading text-base sm:text-lg font-bold text-ink tracking-tight truncate"
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
        <div className="rounded-xl border border-line/50 bg-inset p-3 space-y-1 w-full">
          <div className="flex items-center gap-1.5 text-xs font-medium text-ink-muted">
            <Coins className="h-3.5 w-3.5 text-purple-500 shrink-0" />
            <span className="truncate">Total Stock Value</span>
          </div>
          {isLoading ? (
            <div className="h-6 w-20 animate-pulse rounded bg-line/20" />
          ) : (
            <p
              className="font-heading text-base sm:text-lg font-bold text-ink tracking-tight truncate"
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
              className="font-heading text-base sm:text-lg font-bold text-emerald-600 tracking-tight truncate"
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

      {/* 3. Visual Capital Range Spread Bar */}
      <div className="rounded-xl border border-line/60 bg-inset/50 p-3 space-y-1.5 w-full">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-ink-muted">
            Cost ({costSharePct.toFixed(0)}%)
          </span>
          <span className="text-emerald-600 font-bold">
            Profit Margin ({(100 - costSharePct).toFixed(0)}%)
          </span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-line/30 overflow-hidden flex">
          <div
            className="h-full bg-blue-500 transition-all duration-500"
            style={{ width: `${costSharePct}%` }}
          />
          <div
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${100 - costSharePct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
