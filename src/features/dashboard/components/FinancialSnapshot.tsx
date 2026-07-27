"use client";

import Link from "next/link";
import { Vault, TrendingUp } from "lucide-react";
import { useDashboardStats } from "../hooks/use-dashboard-stats";

export function FinancialSnapshot() {
  const { data, isLoading, isError } = useDashboardStats();

  if (isError) return null;

  const capitalTiedUpNum = Number(data?.financials?.capital_tied_up || 0);
  const stockValueNum = Number(data?.financials?.stock_value || 0);

  const formattedCapital = `₹${capitalTiedUpNum.toLocaleString("en-IN")}`;
  const formattedStockValue = `₹${stockValueNum.toLocaleString("en-IN")}`;

  return (
    <div className="flex flex-col h-full space-y-3 select-none font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line/40 pb-2">
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-ink-muted">
          Capital Overview
        </h2>
        <span className="text-[10px] font-mono text-ink-subtle uppercase">
          Unsold Stock
        </span>
      </div>

      {/* 2 Stacked Minimalist Rows */}
      <div className="flex flex-col gap-3 flex-1">
        {/* Row 1: Capital Tied Up */}
        <Link
          href="/owner/inventory?tab=in_stock"
          className="group relative flex-1 flex items-center justify-between rounded-lg border border-line/40 bg-inset p-3.5 sm:p-4 transition-all duration-200 hover:border-accent/40 hover:bg-card active:scale-[0.98]"
        >
          <div className="space-y-0.5 min-w-0">
            <span className="text-xs font-semibold text-ink-muted group-hover:text-ink transition-colors">
              Capital Tied Up (Invested)
            </span>
            {isLoading ? (
              <div className="h-6 w-28 animate-pulse rounded-md bg-card border border-line/40" />
            ) : (
              <p className="font-mono text-xl sm:text-2xl font-bold text-ink tracking-tight truncate">
                {formattedCapital}
              </p>
            )}
          </div>

          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-card border border-line/40 text-ink-muted group-hover:text-accent group-hover:border-accent/30 transition-colors ml-2">
            <Vault className="h-3.5 w-3.5 stroke-[2px]" />
          </div>
        </Link>

        {/* Row 2: Total Stock Value */}
        <Link
          href="/owner/inventory?tab=in_stock"
          className="group relative flex-1 flex items-center justify-between rounded-lg border border-line/40 bg-inset p-3.5 sm:p-4 transition-all duration-200 hover:border-accent/40 hover:bg-card active:scale-[0.98]"
        >
          <div className="space-y-0.5 min-w-0">
            <span className="text-xs font-semibold text-ink-muted group-hover:text-ink transition-colors">
              Total Stock Value (Asking)
            </span>
            {isLoading ? (
              <div className="h-6 w-28 animate-pulse rounded-md bg-card border border-line/40" />
            ) : (
              <p className="font-mono text-xl sm:text-2xl font-bold text-ink tracking-tight truncate">
                {formattedStockValue}
              </p>
            )}
          </div>

          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-card border border-line/40 text-ink-muted group-hover:text-accent group-hover:border-accent/30 transition-colors ml-2">
            <TrendingUp className="h-3.5 w-3.5 stroke-[2px]" />
          </div>
        </Link>
      </div>
    </div>
  );
}
