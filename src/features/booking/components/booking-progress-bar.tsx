"use client";

import type { BookingStatus } from "../types/booking-types";
import { getBookingMilestones } from "../utils/booking-progress";
import { Check, XCircle, Clock, ChevronRight } from "lucide-react";

interface BookingProgressBarProps {
  status: BookingStatus;
  cancelReason?: string | null;
}

export function BookingProgressBar({
  status,
  cancelReason,
}: BookingProgressBarProps) {
  const { stages, isCancelled } = getBookingMilestones(status);

  if (isCancelled) {
    return (
      <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 sm:p-5 flex items-start gap-3.5 text-xs text-rose-600 dark:text-rose-400 select-none shadow-xs">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/20 text-rose-500 shrink-0">
          <XCircle className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <div className="font-bold text-sm text-rose-700 dark:text-rose-300">
            Booking Transaction Cancelled
          </div>
          <div className="text-xs text-rose-600/90 dark:text-rose-400/90 leading-relaxed">
            {cancelReason
              ? `Reason: ${cancelReason}`
              : "This booking agreement was marked as cancelled. No further pipeline stage progression is available."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-line bg-card p-4 sm:p-5 shadow-xs font-sans select-none space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-[11px] font-bold text-ink-subtle uppercase tracking-wider flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 text-accent" />
          <span>Booking Lifecycle Stages</span>
        </div>
        <span className="text-[11px] font-medium text-ink-muted hidden sm:inline">
          Stage 1 of 4: Prebooking Agreement Active
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {stages.map((stage, idx) => {
          const isDone = stage.state === "done";
          const isCurrent = stage.state === "current";

          return (
            <div
              key={stage.id}
              className={`relative flex items-center gap-3 p-3 rounded-xl border transition-all ${
                isDone
                  ? "bg-emerald-500/5 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                  : isCurrent
                  ? "bg-accent/10 border-line/60 text-ink"
                  : "bg-inset/50 border-line/60 text-ink-muted"
              }`}
            >
              {/* Icon / Number Indicator */}
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-lg font-mono text-xs font-bold shrink-0 transition-colors ${
                  isDone
                    ? "bg-emerald-500 text-white"
                    : isCurrent
                    ? "bg-accent text-inverse shadow-xs"
                    : "bg-card border border-line text-ink-subtle"
                }`}
              >
                {isDone ? (
                  <Check className="h-4 w-4 stroke-[2.5]" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>

              {/* Stage Info */}
              <div className="space-y-0.5 min-w-0 flex-1">
                <div className="text-xs font-bold tracking-tight truncate">
                  {stage.label}
                </div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-subtle">
                  {isDone ? "Completed" : isCurrent ? "Active Stage" : "Upcoming"}
                </div>
              </div>

              {/* Arrow Connector for Desktop */}
              {idx < stages.length - 1 && (
                <ChevronRight className="h-4 w-4 text-line shrink-0 hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
