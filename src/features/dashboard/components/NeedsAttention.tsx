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
        <h2 className="text-[11px] font-mono font-bold uppercase tracking-wider text-ink-muted truncate">
          Action &amp; Risks
        </h2>
        <span className="text-[9px] font-mono text-ink-subtle uppercase shrink-0">
          Risks
        </span>
      </div>

      {/* 2 Stacked #171819 Dark Alert Cards */}
      <div className="flex flex-col gap-2.5 flex-1">
        {/* Row 1: Docs Pending */}
        <Link
          href="/owner/inventory?tab=in_stock"
          className="group relative flex-1 flex items-center justify-between rounded-lg border border-[#262729] bg-[#171819] p-3 text-white transition-all duration-200 hover:border-amber-400/70 hover:shadow-md active:scale-[0.98]"
        >
          <div className="space-y-0.5 min-w-0 flex-1">
            <span className="text-[11px] font-semibold text-slate-400 group-hover:text-white transition-colors block truncate">
              Docs Pending
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              <FileText className="h-3 w-3 text-amber-400 shrink-0 stroke-[2px]" />
              <span className="text-[10px] text-slate-400 truncate">
                Missing doc scans
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 ml-1.5">
            {isLoading ? (
              <div className="h-5 w-8 animate-pulse rounded-md bg-white/10 border border-white/20" />
            ) : (
              <span
                className={[
                  "font-mono text-[11px] font-bold px-2 py-0.5 rounded-md border leading-none shadow-xs",
                  docsPending > 0
                    ? "bg-amber-500/25 text-amber-300 border-amber-400/50"
                    : "bg-white/10 text-slate-300 border-white/20",
                ].join(" ")}
              >
                {docsPending}
              </span>
            )}
            <ArrowRight className="h-3 w-3 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>

        {/* Row 2: Aging Over 60 Days */}
        <Link
          href="/owner/inventory?tab=in_stock"
          className="group relative flex-1 flex items-center justify-between rounded-lg border border-[#262729] bg-[#171819] p-3 text-white transition-all duration-200 hover:border-rose-400/70 hover:shadow-md active:scale-[0.98]"
        >
          <div className="space-y-0.5 min-w-0 flex-1">
            <span className="text-[11px] font-semibold text-slate-400 group-hover:text-white transition-colors block truncate">
              Aging &gt; 60 Days
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              <Clock className="h-3 w-3 text-rose-400 shrink-0 stroke-[2px]" />
              <span className="text-[10px] text-slate-400 truncate">
                Sitting &gt; 60 days
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 ml-1.5">
            {isLoading ? (
              <div className="h-5 w-8 animate-pulse rounded-md bg-white/10 border border-white/20" />
            ) : (
              <span
                className={[
                  "font-mono text-[11px] font-bold px-2 py-0.5 rounded-md border leading-none shadow-xs",
                  agingOver60 > 0
                    ? "bg-rose-500/25 text-rose-300 border-rose-400/50"
                    : "bg-white/10 text-slate-300 border-white/20",
                ].join(" ")}
              >
                {agingOver60}
              </span>
            )}
            <ArrowRight className="h-3 w-3 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>
      </div>
    </div>
  );
}
