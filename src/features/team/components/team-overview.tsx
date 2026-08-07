"use client";

import { BarChart3, Sparkles, ShieldCheck, Clock, CalendarCheck } from "lucide-react";

export function TeamOverview() {
  return (
    <div className="space-y-6 select-none font-sans max-w-4xl">
      {/* Overview Analytics Placeholder Card */}
      <div className="rounded-xl border border-dashed border-accent/40 bg-accent/5 p-8 text-center space-y-4 shadow-bento">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-inverse shadow-sm">
          <BarChart3 className="h-6 w-6 stroke-[2.5px]" />
        </div>

        <div className="space-y-1.5 max-w-md mx-auto">
          <div className="flex items-center justify-center gap-1.5">
            <Sparkles className="h-4 w-4 text-accent" />
            <h3 className="text-base font-bold text-ink font-sans">
              Attendance &amp; Team Analytics Hub
            </h3>
          </div>
          <p className="text-xs text-ink-muted leading-relaxed">
            Live attendance dashboards, daily check-in/out logs, late arrival records, and staff performance metrics will automatically populate here once check-in/out engine is activated.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/15 px-3.5 py-1 text-xs font-mono font-bold text-accent">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>ATTENDANCE ENGINE DEFERRED</span>
        </div>
      </div>

      {/* Feature Teaser Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-line/90 bg-card p-5 space-y-2 shadow-bento">
          <div className="flex items-center gap-2 text-xs font-bold text-ink font-sans">
            <Clock className="h-4 w-4 text-accent stroke-[2.5px]" />
            <span>Geofence Clock-In Logs</span>
          </div>
          <p className="text-xs text-ink-subtle leading-relaxed">
            Track daily sales staff attendance inside the showroom geofence boundary automatically.
          </p>
        </div>

        <div className="rounded-xl border border-line/90 bg-card p-5 space-y-2 shadow-bento">
          <div className="flex items-center gap-2 text-xs font-bold text-ink font-sans">
            <CalendarCheck className="h-4 w-4 text-accent stroke-[2.5px]" />
            <span>Shift &amp; Holiday Reports</span>
          </div>
          <p className="text-xs text-ink-subtle leading-relaxed">
            Automatic shift tracking with department holiday schedules and monthly attendance summaries.
          </p>
        </div>
      </div>
    </div>
  );
}
