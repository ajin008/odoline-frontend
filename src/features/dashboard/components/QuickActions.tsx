"use client";

import Link from "next/link";
import { Plus, ArrowUpRight } from "lucide-react";

export function QuickActions() {
  return (
    <section className="select-none font-sans space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line/40 pb-2">
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-ink-muted">
          Terminal Actions
        </h2>
        <span className="text-[10px] font-mono text-ink-subtle uppercase">
          Intake Shortcut
        </span>
      </div>

      {/* Single Minimalist Action Button matching design system */}
      <Link
        href="/owner/cars/add"
        className="group relative flex items-center justify-between rounded-lg border border-line/40 bg-card p-4 transition-all duration-200 hover:border-accent/50 hover:bg-accent/5 active:scale-[0.98] shadow-2xs"
      >
        <div className="flex items-center gap-3.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-accent text-inverse shadow-sm transition-transform duration-200 group-hover:scale-105">
            <Plus className="h-4.5 w-4.5 stroke-[2.5px]" />
          </div>
          <div>
            <span className="text-sm font-bold text-ink block group-hover:text-accent transition-colors">
              Add New Stock Entry
            </span>
            <span className="text-xs text-ink-subtle block">
              Register purchase, seller verification, and initial intake metrics
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-accent font-bold text-xs">
          <span>Start Intake</span>
          <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
        </div>
      </Link>
    </section>
  );
}
