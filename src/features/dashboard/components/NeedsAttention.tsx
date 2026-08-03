"use client";

import Link from "next/link";
import {
  FileText,
  Clock,
  ArrowUpRight,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";
import { useDashboardStats } from "../hooks/use-dashboard-stats";

export function NeedsAttention() {
  const { data, isLoading, isError } = useDashboardStats();

  if (isError) return null;

  const docsPending = data?.attention?.docs_pending ?? 0;
  const agingOver60 = data?.attention?.aging_over_60 ?? 0;
  const totalAlerts = docsPending + agingOver60;

  return (
    <div className="flex flex-col justify-between h-full w-full rounded-xl border border-line bg-card p-4 space-y-3.5 select-none font-sans transition-all hover:border-accent/40">
      <div className="space-y-3.5">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-line/40 pb-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 border border-rose-500/20 shrink-0">
              <ShieldAlert className="h-4 w-4 stroke-[2.25px]" />
            </div>
            <h2 className="text-xs font-bold text-ink tracking-tight font-heading truncate">
              Attention & Risks
            </h2>
          </div>
          <span className="text-[10px] font-mono font-bold uppercase text-rose-600 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full shrink-0">
            {totalAlerts} Alerts
          </span>
        </div>

        {/* 2 High-Density Risk Cards */}
        <div className="grid grid-cols-1 gap-2.5">
          {/* Row 1: Docs Pending */}
          <Link
            href="/owner/inventory?tab=in_stock"
            className="group flex items-center justify-between rounded-lg border border-line/60 bg-inset p-2.5 transition-all duration-200 hover:border-amber-500/40 hover:bg-card active:scale-[0.98]"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 border border-amber-500/20 shrink-0">
                <FileText className="h-3.5 w-3.5 stroke-[2.25px]" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <span className="text-xs font-bold text-ink group-hover:text-amber-600 transition-colors block truncate">
                  Docs Pending
                </span>
                <span className="text-[10px] text-ink-muted block truncate font-sans">
                  Missing doc scans
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0 ml-1.5">
              {isLoading ? (
                <div className="h-5 w-6 animate-pulse rounded bg-line/20" />
              ) : (
                <span
                  className={[
                    "font-mono text-xs font-bold px-2 py-0.5 rounded-md border leading-none",
                    docsPending > 0
                      ? "bg-amber-500 text-white border-amber-600/30"
                      : "bg-inset text-ink-muted border-line/50",
                  ].join(" ")}
                >
                  {docsPending}
                </span>
              )}
              <ArrowUpRight className="h-3.5 w-3.5 text-ink-subtle opacity-40 group-hover:opacity-100 group-hover:text-amber-600 transition-all" />
            </div>
          </Link>

          {/* Row 2: Aging > 60 Days */}
          <Link
            href="/owner/inventory?tab=in_stock"
            className="group flex items-center justify-between rounded-lg border border-line/60 bg-inset p-2.5 transition-all duration-200 hover:border-rose-500/40 hover:bg-card active:scale-[0.98]"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 border border-rose-500/20 shrink-0">
                <Clock className="h-3.5 w-3.5 stroke-[2.25px]" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <span className="text-xs font-bold text-ink group-hover:text-rose-600 transition-colors block truncate">
                  Aging &gt; 60 Days
                </span>
                <span className="text-[10px] text-ink-muted block truncate font-sans">
                  Sitting &gt; 60 days
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0 ml-1.5">
              {isLoading ? (
                <div className="h-5 w-6 animate-pulse rounded bg-line/20" />
              ) : (
                <span
                  className={[
                    "font-mono text-xs font-bold px-2 py-0.5 rounded-md border leading-none",
                    agingOver60 > 0
                      ? "bg-rose-600 text-white border-rose-700/30"
                      : "bg-inset text-ink-muted border-line/50",
                  ].join(" ")}
                >
                  {agingOver60}
                </span>
              )}
              <ArrowUpRight className="h-3.5 w-3.5 text-ink-subtle opacity-40 group-hover:opacity-100 group-hover:text-rose-600 transition-all" />
            </div>
          </Link>
        </div>
      </div>

      {/* Bottom Compliance & Risk Health Banner */}
      <div className="rounded-lg border border-line/60 bg-inset/50 p-2.5 space-y-1.5 mt-auto">
        <div className="flex items-center justify-between text-[10px] font-sans">
          <div className="flex items-center gap-1 text-ink-muted font-medium min-w-0">
            <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
            <span className="truncate">Risk Status</span>
          </div>
          <span className="font-mono font-bold text-ink shrink-0">
            {totalAlerts === 0 ? "Optimal" : `${totalAlerts} Active`}
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-line/30 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              totalAlerts === 0
                ? "bg-emerald-500 w-full"
                : totalAlerts < 3
                ? "bg-amber-500 w-3/4"
                : "bg-rose-500 w-1/2"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
