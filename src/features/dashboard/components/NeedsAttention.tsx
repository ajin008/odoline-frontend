"use client";

import Link from "next/link";
import { FileText, Clock, ArrowUpRight, ShieldAlert } from "lucide-react";
import { useDashboardStats } from "../hooks/use-dashboard-stats";

export function NeedsAttention() {
  const { data, isLoading, isError } = useDashboardStats();

  if (isError) return null;

  const docsPending = data?.attention?.docs_pending ?? 0;
  const agingOver60 = data?.attention?.aging_over_60 ?? 0;
  const totalAlerts = docsPending + agingOver60;

  return (
    <div className="rounded-2xl border border-line bg-card p-4 space-y-3.5 select-none font-sans transition-all hover:border-accent/40">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line/40 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 border border-rose-500/20 shrink-0">
            <ShieldAlert className="h-4 w-4 stroke-[2.25px]" />
          </div>
          <h2 className="text-xs font-bold text-ink tracking-tight font-heading">
            Operational Attention & Risks
          </h2>
        </div>
        <span className="text-[10px] font-mono font-bold uppercase text-rose-600 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
          {totalAlerts} Alerts
        </span>
      </div>

      {/* 2 High-Density Risk Cards */}
      <div className="grid grid-cols-1 gap-2.5">
        {/* Row 1: Docs Pending */}
        <Link
          href="/owner/inventory?tab=in_stock"
          className="group flex items-center justify-between rounded-xl border border-line/60 bg-inset p-3 transition-all duration-200 hover:border-amber-500/40 hover:bg-card active:scale-[0.98]"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20 shrink-0">
              <FileText className="h-4 w-4 stroke-[2.25px]" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <span className="text-xs font-bold text-ink group-hover:text-amber-600 transition-colors block truncate">
                Docs Pending
              </span>
              <span className="text-[10px] text-ink-muted block truncate font-sans">
                Vehicles missing mandatory paperwork
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-2">
            {isLoading ? (
              <div className="h-5 w-8 animate-pulse rounded-md bg-line/20" />
            ) : (
              <span
                className={[
                  "font-mono text-xs font-bold px-2.5 py-0.5 rounded-md border leading-none",
                  docsPending > 0
                    ? "bg-amber-500 text-white border-amber-600/30"
                    : "bg-inset text-ink-muted border-line/50",
                ].join(" ")}
              >
                {docsPending}
              </span>
            )}
            <ArrowUpRight className="h-4 w-4 text-ink-subtle opacity-40 group-hover:opacity-100 group-hover:text-amber-600 transition-all" />
          </div>
        </Link>

        {/* Row 2: Aging > 60 Days */}
        <Link
          href="/owner/inventory?tab=in_stock"
          className="group flex items-center justify-between rounded-xl border border-line/60 bg-inset p-3 transition-all duration-200 hover:border-rose-500/40 hover:bg-card active:scale-[0.98]"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 border border-rose-500/20 shrink-0">
              <Clock className="h-4 w-4 stroke-[2.25px]" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <span className="text-xs font-bold text-ink group-hover:text-rose-600 transition-colors block truncate">
                Aging &gt; 60 Days
              </span>
              <span className="text-[10px] text-ink-muted block truncate font-sans">
                Vehicles sitting &gt; 60 days in stock
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-2">
            {isLoading ? (
              <div className="h-5 w-8 animate-pulse rounded-md bg-line/20" />
            ) : (
              <span
                className={[
                  "font-mono text-xs font-bold px-2.5 py-0.5 rounded-md border leading-none",
                  agingOver60 > 0
                    ? "bg-rose-600 text-white border-rose-700/30"
                    : "bg-inset text-ink-muted border-line/50",
                ].join(" ")}
              >
                {agingOver60}
              </span>
            )}
            <ArrowUpRight className="h-4 w-4 text-ink-subtle opacity-40 group-hover:opacity-100 group-hover:text-rose-600 transition-all" />
          </div>
        </Link>
      </div>
    </div>
  );
}
