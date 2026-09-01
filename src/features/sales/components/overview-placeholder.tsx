"use client";

import { TrendingUp, Sparkles, PieChart, BarChart2 } from "lucide-react";

export function OverviewPlaceholder() {
  return (
    <div className="w-full space-y-6">
      {/* Overview Banner Card */}
      <div className="relative overflow-hidden rounded-2xl bg-card border border-line p-6 sm:p-8 shadow-bento">
        {/* Subtle decorative background gradient */}
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-accent/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 border border-accent/20 px-3 py-1 text-xs font-bold text-accent">
              <Sparkles className="h-3.5 w-3.5" />
              <span>BK-5 Module · Coming Soon</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-ink font-sans">
              Sales &amp; Revenue Overview
            </h2>
            <p className="text-sm font-medium text-ink-muted leading-relaxed">
              Sales Overview coming soon — revenue, profit, and sales trends will appear here.
            </p>
          </div>

          <div className="h-16 w-16 rounded-2xl bg-accent-light/60 border border-accent/20 flex items-center justify-center text-accent shrink-0 shadow-sm">
            <TrendingUp className="h-8 w-8" />
          </div>
        </div>
      </div>

      {/* Feature Preview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl bg-card/60 border border-line/60 p-5 space-y-3">
          <div className="h-10 w-10 rounded-lg bg-inset border border-line flex items-center justify-center text-ink-subtle">
            <BarChart2 className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-ink">Dealership Revenue</h3>
          <p className="text-xs text-ink-muted leading-normal">
            Realized gross margins, period revenue growth, and vehicle sales price variance analytics.
          </p>
        </div>

        <div className="rounded-xl bg-card/60 border border-line/60 p-5 space-y-3">
          <div className="h-10 w-10 rounded-lg bg-inset border border-line flex items-center justify-center text-ink-subtle">
            <PieChart className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-ink">Salesperson Performance</h3>
          <p className="text-xs text-ink-muted leading-normal">
            Individual sales rep delivery counts, average deal turnaround time, and commission tracking.
          </p>
        </div>

        <div className="rounded-xl bg-card/60 border border-line/60 p-5 space-y-3">
          <div className="h-10 w-10 rounded-lg bg-inset border border-line flex items-center justify-center text-ink-subtle">
            <TrendingUp className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-ink">Monthly Growth</h3>
          <p className="text-xs text-ink-muted leading-normal">
            Comparative month-over-month inventory velocity, delivery rates, and sales breakdown.
          </p>
        </div>
      </div>
    </div>
  );
}
