"use client";

import type { BookingStatus } from "../types/booking-types";
import { getBookingMilestones } from "../utils/booking-progress";
import { Check, XCircle } from "lucide-react";

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
      <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 flex items-center gap-3 text-xs text-rose-600 dark:text-rose-400 select-none">
        <XCircle className="h-5 w-5 shrink-0 text-rose-500" />
        <div className="space-y-0.5">
          <div className="font-bold">Booking Cancelled</div>
          {cancelReason ? (
            <div className="text-ink-subtle">{cancelReason}</div>
          ) : (
            <div className="text-ink-subtle">
              This booking transaction was cancelled.
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-line bg-card p-4 sm:p-5 shadow-xs font-sans select-none space-y-3">
      <div className="text-xs font-bold text-ink uppercase tracking-wider text-ink-subtle">
        Booking Milestone Progress
      </div>

      <div className="grid grid-cols-4 gap-2 relative">
        {stages.map((stage, idx) => {
          const isDone = stage.state === "done";
          const isCurrent = stage.state === "current";

          return (
            <div
              key={stage.id}
              className="flex flex-col items-center text-center space-y-2 relative group"
            >
              {/* Connecting line between stages */}
              {idx < stages.length - 1 && (
                <div
                  className={`absolute top-4 left-1/2 w-full h-[2px] -z-0 transition-colors ${
                    isDone
                      ? "bg-emerald-500"
                      : isCurrent
                      ? "bg-accent/40"
                      : "bg-line/60"
                  }`}
                />
              )}

              {/* Step indicator circle */}
              <div
                className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  isDone
                    ? "bg-emerald-500 text-white shadow-xs"
                    : isCurrent
                    ? "bg-accent text-inverse ring-4 ring-accent/20 shadow-xs"
                    : "bg-inset border border-line text-ink-subtle"
                }`}
              >
                {isDone ? (
                  <Check className="h-4 w-4 stroke-[2.5]" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>

              {/* Stage label */}
              <div className="space-y-0.5">
                <div
                  className={`text-xs font-bold tracking-tight ${
                    isDone
                      ? "text-emerald-600 dark:text-emerald-400"
                      : isCurrent
                      ? "text-ink font-extrabold"
                      : "text-ink-subtle"
                  }`}
                >
                  <span className="hidden sm:inline">{stage.label}</span>
                  <span className="sm:hidden">{stage.shortLabel}</span>
                </div>
                <div className="text-[10px] font-medium text-ink-subtle uppercase tracking-wider">
                  {isDone ? "Done" : isCurrent ? "Current" : "Upcoming"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
