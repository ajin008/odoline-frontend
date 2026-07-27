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
        <h2 className="text-[11px] font-mono font-bold uppercase tracking-wider text-ink-muted truncate">
          Capital Overview
        </h2>
        <span className="text-[9px] font-mono text-ink-subtle uppercase shrink-0">
          Unsold
        </span>
      </div>

      {/* 2 Stacked Dark Accent Cards */}
      <div className="flex flex-col gap-2.5 flex-1">
        {/* Row 1: Capital Tied Up */}
        <Link
          href="/owner/inventory?tab=in_stock"
          className="group relative flex-1 flex items-center justify-between rounded-lg border border-accent/40 bg-gradient-to-br from-[#210d3e] to-[#130626] p-3 text-white transition-all duration-200 hover:border-accent/70 hover:shadow-md active:scale-[0.98]"
        >
          <div className="space-y-0.5 min-w-0 flex-1">
            <span className="text-[11px] font-semibold text-purple-200/80 group-hover:text-white transition-colors block truncate">
              Capital Tied Up
            </span>
            {isLoading ? (
              <div className="h-5 w-20 animate-pulse rounded-md bg-accent/20 border border-accent/30" />
            ) : (
              <p className="font-mono text-sm sm:text-base font-bold text-white tracking-tight truncate" title={formattedCapital}>
                {formattedCapital}
              </p>
            )}
          </div>

          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent text-inverse shadow-sm transition-transform group-hover:scale-105 ml-1.5">
            <Vault className="h-3.5 w-3.5 stroke-[2px]" />
          </div>
        </Link>

        {/* Row 2: Total Stock Value */}
        <Link
          href="/owner/inventory?tab=in_stock"
          className="group relative flex-1 flex items-center justify-between rounded-lg border border-accent/40 bg-gradient-to-br from-[#2a104e] to-[#16072c] p-3 text-white transition-all duration-200 hover:border-accent/70 hover:shadow-md active:scale-[0.98]"
        >
          <div className="space-y-0.5 min-w-0 flex-1">
            <span className="text-[11px] font-semibold text-purple-200/80 group-hover:text-white transition-colors block truncate">
              Total Stock Value
            </span>
            {isLoading ? (
              <div className="h-5 w-20 animate-pulse rounded-md bg-accent/20 border border-accent/30" />
            ) : (
              <p className="font-mono text-sm sm:text-base font-bold text-white tracking-tight truncate" title={formattedStockValue}>
                {formattedStockValue}
              </p>
            )}
          </div>

          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent text-inverse shadow-sm transition-transform group-hover:scale-105 ml-1.5">
            <TrendingUp className="h-3.5 w-3.5 stroke-[2px]" />
          </div>
        </Link>
      </div>
    </div>
  );
}
