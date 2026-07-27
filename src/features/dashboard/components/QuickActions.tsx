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

      {/* Action Button: Accent BG & White Text on Mobile */}
      <Link
        href="/owner/cars/add"
        className="group relative flex items-center justify-between rounded-lg border border-accent md:border-line/40 bg-accent md:bg-card p-3.5 sm:p-4 text-inverse md:text-ink transition-all duration-200 hover:border-accent/50 md:hover:bg-accent/5 active:scale-[0.98] shadow-sm md:shadow-2xs"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-md bg-white/20 md:bg-accent text-white md:text-inverse shadow-xs transition-transform duration-200 group-hover:scale-105">
            <Plus className="h-4 w-4 sm:h-4.5 sm:w-4.5 stroke-[2.5px]" />
          </div>
          <div>
            <span className="text-sm font-bold block transition-colors">
              Add New Stock Entry
            </span>
            <span className="hidden md:block text-xs text-ink-subtle">
              Register purchase, seller verification, and initial intake metrics
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 font-bold text-xs text-white/90 md:text-accent">
          <span className="hidden sm:inline">Start Intake</span>
          <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
        </div>
      </Link>
    </section>
  );
}
