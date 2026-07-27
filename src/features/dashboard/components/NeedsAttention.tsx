"use client";

import Link from "next/link";
import { FileText, Clock, ArrowRight } from "lucide-react";
import { useDashboardStats } from "../hooks/use-dashboard-stats";

export function NeedsAttention() {
  const { data, isLoading, isError } = useDashboardStats();

  if (isError) return null;

  const docsPending = data?.attention?.docs_pending ?? 0;
  const agingOver60 = data?.attention?.aging_over_60 ?? 0;

  return (
    <div className="flex flex-col h-full space-y-3 select-none font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line/40 pb-2">
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-ink-muted">
          Action &amp; Risks
        </h2>
        <span className="text-[10px] font-mono text-ink-subtle uppercase">
          Attention Needed
        </span>
      </div>

      {/* 2 Minimalist Alert Rows */}
      <div className="flex flex-col gap-3 flex-1">
        {/* Row 1: Docs Pending */}
        <Link
          href="/owner/inventory?tab=in_stock"
          className="group relative flex-1 flex items-center justify-between rounded-lg border border-line/40 bg-inset p-3.5 sm:p-4 transition-all duration-200 hover:border-warning/50 hover:bg-card active:scale-[0.98]"
        >
          <div className="space-y-0.5 min-w-0">
            <span className="text-xs font-semibold text-ink-muted group-hover:text-ink transition-colors">
              Mandatory Docs Pending
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <FileText className="h-3.5 w-3.5 text-ink-subtle stroke-[2px]" />
              <span className="text-xs text-ink-subtle truncate">
                Missing mandatory document scans
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-2">
            {isLoading ? (
              <div className="h-6 w-10 animate-pulse rounded-md bg-card border border-line/40" />
            ) : (
              <span
                className={[
                  "font-mono text-xs font-bold px-2.5 py-1 rounded-md border",
                  docsPending > 0
                    ? "bg-warning-light text-warning border-warning/30"
                    : "bg-card text-ink-subtle border-line/40",
                ].join(" ")}
              >
                {docsPending}
              </span>
            )}
            <ArrowRight className="h-3.5 w-3.5 text-ink-subtle group-hover:text-ink group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>

        {/* Row 2: Aging Over 60 Days */}
        <Link
          href="/owner/inventory?tab=in_stock"
          className="group relative flex-1 flex items-center justify-between rounded-lg border border-line/40 bg-inset p-3.5 sm:p-4 transition-all duration-200 hover:border-danger/50 hover:bg-card active:scale-[0.98]"
        >
          <div className="space-y-0.5 min-w-0">
            <span className="text-xs font-semibold text-ink-muted group-hover:text-ink transition-colors">
              Aging &gt; 60 Days
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Clock className="h-3.5 w-3.5 text-ink-subtle stroke-[2px]" />
              <span className="text-xs text-ink-subtle truncate">
                In-stock cars sitting &gt; 60 days
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-2">
            {isLoading ? (
              <div className="h-6 w-10 animate-pulse rounded-md bg-card border border-line/40" />
            ) : (
              <span
                className={[
                  "font-mono text-xs font-bold px-2.5 py-1 rounded-md border",
                  agingOver60 > 0
                    ? "bg-danger-light text-danger border-danger/30"
                    : "bg-card text-ink-subtle border-line/40",
                ].join(" ")}
              >
                {agingOver60}
              </span>
            )}
            <ArrowRight className="h-3.5 w-3.5 text-ink-subtle group-hover:text-ink group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>
      </div>
    </div>
  );
}
