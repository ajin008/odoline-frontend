"use client";

import { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  MoreVertical,
  PieChart,
  BarChart2,
  ArrowUpRight,
  ShieldCheck,
  Coins,
} from "lucide-react";
import { useDashboardStats } from "../hooks/use-dashboard-stats";
import {
  formatCompactCurrency,
  formatFullCurrency,
} from "@/src/utils/currency";

export function FinancialSnapshot() {
  const { data, isLoading, isError } = useDashboardStats();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  if (isError) return null;

  const capitalTiedUpNum = Number(data?.financials?.capital_tied_up || 0);
  const stockValueNum = Number(data?.financials?.stock_value || 0);
  const totalStockCount = data?.total_stock || 0;

  const profit = Math.max(0, stockValueNum - capitalTiedUpNum);
  const roiPct = capitalTiedUpNum > 0 ? (profit / capitalTiedUpNum) * 100 : 0;

  // Breakdown estimations
  const purchaseEst = Math.round(capitalTiedUpNum * 0.88);
  const refurbEst = Math.round(capitalTiedUpNum * 0.12);

  const total = Math.max(stockValueNum, 1);
  const purchasePct = Math.min(100, Math.max(0, (purchaseEst / total) * 100));
  const refurbPct = Math.min(100, Math.max(0, (refurbEst / total) * 100));
  const profitPct = Math.min(100, Math.max(0, (profit / total) * 100));

  // SVG Donut Arc calculations (radius = 48)
  const radius = 48;
  const circumference = 2 * Math.PI * radius; // ~301.59

  const purchaseStroke = (purchasePct / 100) * circumference;
  const refurbStroke = (refurbPct / 100) * circumference;
  const profitStroke = (profitPct / 100) * circumference;

  const purchaseOffset = 0;
  const refurbOffset = -purchaseStroke;
  const profitOffset = -(purchaseStroke + refurbStroke);

  return (
    <div className="flex flex-col h-full space-y-4 select-none font-sans">
      {/* ============================================================= */}
      {/* 1. TOP HEADER & METRIC HIGHLIGHT (CARD 1 OF REFERENCE DESIGN)   */}
      {/* ============================================================= */}
      <div className="space-y-3">
        {/* Card Header Bar */}
        <div className="flex items-center justify-between border-b border-line/40 pb-2">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">
              <Coins className="h-4 w-4 stroke-[2.25px]" />
            </div>
            <h2 className="text-[11px] font-mono font-bold uppercase tracking-wider text-ink-muted">
              Total Revenue Potential
            </h2>
          </div>
          <Link
            href="/owner/inventory?tab=in_stock"
            className="flex h-6 w-6 items-center justify-center rounded-md text-ink-subtle hover:bg-inset hover:text-accent transition-colors"
            title="View Stock Inventory"
          >
            <ArrowUpRight className="h-3.5 w-3.5 stroke-[2px]" />
          </Link>
        </div>

        {/* Primary Stock Revenue Figure & ROI Badge */}
        <div>
          {isLoading ? (
            <div className="h-7 w-32 animate-pulse rounded-md bg-inset" />
          ) : (
            <div className="flex items-baseline gap-2 flex-wrap">
              <span
                className="font-heading text-xl sm:text-2xl font-extrabold text-ink tracking-tight"
                title={formatFullCurrency(stockValueNum)}
              >
                {formatCompactCurrency(stockValueNum)}
              </span>
              {roiPct > 0 && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono">
                  <TrendingUp className="h-3 w-3 stroke-[2.5px]" />+
                  {roiPct.toFixed(1)}% ROI
                </span>
              )}
            </div>
          )}
        </div>

        {/* Key Breakdown Details Pill */}
        <div className="rounded-xl border border-line/50 bg-inset p-2.5 space-y-1.5 text-xs font-sans">
          <div className="flex items-center justify-between">
            <span className="text-ink-muted text-[11px]">
              Total Capital Invested:
            </span>
            <span
              className="font-mono font-bold text-ink"
              title={formatFullCurrency(capitalTiedUpNum)}
            >
              {formatCompactCurrency(capitalTiedUpNum)}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-line/30 pt-1.5">
            <span className="text-ink-muted text-[11px]">
              Active In-Stock Fleet:
            </span>
            <span className="font-mono font-bold text-ink">
              {totalStockCount} Vehicles
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================= */}
      {/* 2. HORIZONTAL MULTI-BAR RANGE CHART (CARD 2 OF REFERENCE DESIGN) */}
      {/* ============================================================= */}
      <div className="rounded-xl border border-line/60 bg-inset/40 p-3 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <BarChart2 className="h-3.5 w-3.5 text-blue-500 stroke-[2px]" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted">
              Capital & Margin Range
            </span>
          </div>
          <MoreVertical className="h-3.5 w-3.5 text-ink-subtle opacity-40" />
        </div>

        {/* Multi-Tier Progress Bars */}
        <div className="space-y-2.5 pt-0.5">
          {/* Invested Capital Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] font-sans">
              <span className="text-ink-muted font-medium">
                Invested Capital
              </span>
              <span className="font-mono font-bold text-ink">
                {formatCompactCurrency(capitalTiedUpNum)}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-inset border border-line/60 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-500"
                style={{
                  width: `${Math.min(100, (capitalTiedUpNum / total) * 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Expected Profit Bar with Glowing Tooltip Callout */}
          <div className="space-y-1 relative">
            <div className="flex items-center justify-between text-[10px] font-sans">
              <span className="text-ink-muted font-medium">
                Expected Gross Profit
              </span>
              <span className="font-mono font-bold text-emerald-600">
                +{formatCompactCurrency(profit)}
              </span>
            </div>

            <div className="relative h-2 w-full rounded-full bg-inset border border-line/60 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                style={{ width: `${profitPct}%` }}
              />
            </div>

            {/* Floating Tooltip Callout Pill (matching reference image callout bubble) */}
            {profit > 0 && (
              <div
                className="absolute -top-6 right-0 z-10 cursor-pointer"
                onMouseEnter={() => setActiveTooltip("profit")}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                <div className="relative bg-ink text-inverse px-1.5 py-0.5 rounded text-[9px] font-mono font-bold shadow-md border border-inverse/20">
                  +{formatCompactCurrency(profit)}
                  {/* Arrow Stem */}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-ink rotate-45" />
                </div>
              </div>
            )}
          </div>

          {/* X-Axis Tick Scale */}
          <div className="flex items-center justify-between pt-0.5 border-t border-line/30 text-[9px] font-mono text-ink-subtle">
            <span>₹0</span>
            <span>{formatCompactCurrency(total * 0.33)}</span>
            <span>{formatCompactCurrency(total * 0.66)}</span>
            <span>{formatCompactCurrency(total)}</span>
          </div>
        </div>
      </div>

      {/* ============================================================= */}
      {/* 3. SEGMENTED DONUT ARC CHART & LEGEND (CARD 3 OF REFERENCE DESIGN)*/}
      {/* ============================================================= */}
      <div className="rounded-xl border border-line/60 bg-inset/40 p-3 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <PieChart className="h-3.5 w-3.5 text-purple-500 stroke-[2px]" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted">
              Portfolio Valuation Breakdown
            </span>
          </div>
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
        </div>

        {/* Donut Arc Chart + Side Legend Layout (Mobile Responsive) */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center pt-0.5">
          {/* Donut Arc Ring Gauge (Center Ring + Segments) */}
          <div className="sm:col-span-5 flex justify-center relative py-1">
            <svg
              viewBox="0 0 120 120"
              className="w-28 h-28 transform -rotate-90 drop-shadow-xs"
            >
              {/* Background Track Circle */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                className="stroke-line/30"
                strokeWidth="12"
                fill="transparent"
              />

              {/* Segment 1: Purchase Cost (Blue) */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                stroke="#3b82f6"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={`${purchaseStroke} ${circumference}`}
                strokeDashoffset={purchaseOffset}
                strokeLinecap="round"
                className="transition-all duration-500 hover:opacity-80"
              />

              {/* Segment 2: Refurbishment Cost (Teal) */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                stroke="#14b8a6"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={`${refurbStroke} ${circumference}`}
                strokeDashoffset={refurbOffset}
                strokeLinecap="round"
                className="transition-all duration-500 hover:opacity-80"
              />

              {/* Segment 3: Gross Profit Margin (Purple) */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                stroke="#a855f7"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={`${profitStroke} ${circumference}`}
                strokeDashoffset={profitOffset}
                strokeLinecap="round"
                className="transition-all duration-500 hover:opacity-80"
              />
            </svg>

            {/* Inner Donut Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-heading text-base font-extrabold text-ink tracking-tight">
                {totalStockCount}
              </span>
              <span className="text-[8px] font-mono font-bold text-ink-muted uppercase">
                Stock Cars
              </span>
            </div>
          </div>

          {/* Breakdown Legend Table */}
          <div className="sm:col-span-7 space-y-1.5 text-xs font-sans">
            {/* Row 1: Purchase Cost */}
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-card border border-line/40">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                <span className="text-[10px] font-medium text-ink-muted truncate">
                  Purchase Cost
                </span>
              </div>
              <span className="font-mono text-[10px] font-bold text-ink shrink-0">
                {formatCompactCurrency(purchaseEst)}
              </span>
            </div>

            {/* Row 2: Workshop Refurbish */}
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-card border border-line/40">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="h-2 w-2 rounded-full bg-teal-500 shrink-0" />
                <span className="text-[10px] font-medium text-ink-muted truncate">
                  Refurbishment
                </span>
              </div>
              <span className="font-mono text-[10px] font-bold text-ink shrink-0">
                {formatCompactCurrency(refurbEst)}
              </span>
            </div>

            {/* Row 3: Expected Gross Profit */}
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-card border border-line/40">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="h-2 w-2 rounded-full bg-purple-500 shrink-0" />
                <span className="text-[10px] font-medium text-ink-muted truncate">
                  Expected Profit
                </span>
              </div>
              <span className="font-mono text-[10px] font-bold text-purple-600 shrink-0">
                +{formatCompactCurrency(profit)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
