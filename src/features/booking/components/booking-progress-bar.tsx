"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { BookingStatus } from "../types/booking-types";
import { getBookingMilestones } from "../utils/booking-progress";
import { Check, XCircle, Clock, ChevronRight, Lock } from "lucide-react";

interface BookingProgressBarProps {
  status: BookingStatus;
  cancelReason?: string | null;
  hasOrderForm?: boolean;
  bookingId?: string;
  basePath?: string;
}

export function BookingProgressBar({
  status,
  cancelReason,
  hasOrderForm = false,
  bookingId,
  basePath = "/staff/booking",
}: BookingProgressBarProps) {
  const pathname = usePathname();
  const { stages, isCancelled } = getBookingMilestones(status, hasOrderForm);

  if (isCancelled) {
    return (
      <div className="rounded-2xl border-none bg-[#ffe4e6] p-4 sm:p-5 flex items-start gap-3.5 text-xs text-[#9f1239] select-none shadow-xs font-sans">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fecdd3] text-[#be123c] shrink-0">
          <XCircle className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <div className="font-bold text-sm text-[#9f1239]">
            Booking Transaction Cancelled
          </div>
          <div className="text-xs text-[#be123c] leading-relaxed font-medium">
            {cancelReason
              ? `Reason: ${cancelReason}`
              : "This booking agreement was marked as cancelled. No further pipeline stage progression is available."}
          </div>
        </div>
      </div>
    );
  }

  // Active step index for mobile step counter
  const activeIndex = stages.findIndex(
    (s) =>
      pathname &&
      (pathname.endsWith(`/${s.id}`) || pathname.includes(`/${s.id}/`))
  );

  return (
    <div className="rounded-2xl border border-line bg-card p-3.5 sm:p-5 shadow-xs font-sans select-none space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="text-[11px] font-bold text-ink-subtle uppercase tracking-wider flex items-center gap-1.5 min-w-0">
          <Clock className="h-3.5 w-3.5 text-accent shrink-0" />
          <span className="sm:hidden font-extrabold text-ink truncate">Stage Documents</span>
          <span className="hidden sm:inline truncate">Booking Lifecycle Stage Documents</span>
        </div>
        <span className="text-[11px] font-medium text-ink-muted hidden sm:inline">
          Click milestone tabs to view or edit stage documents
        </span>
        <span className="text-[10px] font-mono font-bold text-accent bg-accent/10 px-2.5 py-0.5 rounded-full sm:hidden shrink-0">
          {activeIndex >= 0 ? `Step ${activeIndex + 1} of 4` : "4 Steps"}
        </span>
      </div>

      {/* 2x2 Grid on Mobile, 4-Col Grid on Tablet & Desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
        {stages.map((stage, idx) => {
          const isDone = stage.state === "done";
          const isClickable = stage.isClickable;

          // Determine if this stage is the active route in current pathname
          const stageHref =
            bookingId && isClickable
              ? `${basePath}/${bookingId}/${stage.id}`
              : null;

          const isActiveRoute = Boolean(
            pathname &&
              (pathname.endsWith(`/${stage.id}`) ||
                pathname.includes(`/${stage.id}/`))
          );

          const cardContent = (
            <div
              className={`relative flex items-center gap-2 sm:gap-2.5 p-2.5 sm:p-3 rounded-xl border-0 transition-all h-full shadow-xs ${
                isActiveRoute
                  ? "bg-sky-100/90 text-sky-950"
                  : isDone
                  ? "bg-emerald-100/90 text-emerald-950"
                  : isClickable
                  ? "bg-inset/70 text-ink hover:bg-inset"
                  : "bg-inset/30 text-ink-subtle opacity-40 cursor-not-allowed select-none"
              }`}
              title={
                !isClickable
                  ? "Available after vehicle delivery"
                  : undefined
              }
            >
              {/* Icon / Number Indicator */}
              <div
                className={`flex h-6 sm:h-7 w-6 sm:w-7 items-center justify-center rounded-lg font-mono text-[11px] sm:text-xs font-bold shrink-0 transition-colors ${
                  isActiveRoute
                    ? "bg-sky-700 text-white shadow-xs font-extrabold"
                    : isDone
                    ? "bg-emerald-700 text-white shadow-xs"
                    : isClickable
                    ? "bg-card border border-line text-ink-subtle font-bold"
                    : "bg-card border border-line text-ink-subtle opacity-60"
                }`}
              >
                {isDone ? (
                  <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[2.5]" />
                ) : !isClickable ? (
                  <Lock className="h-3 w-3 sm:h-3.5 sm:w-3.5 opacity-70" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>

              {/* Stage Info */}
              <div className="space-y-0.5 min-w-0 flex-1">
                <div className="text-[11px] sm:text-xs font-bold tracking-tight leading-tight flex items-center justify-between gap-1">
                  <span
                    className={`line-clamp-2 ${
                      isActiveRoute
                        ? "text-sky-950 font-extrabold"
                        : isDone
                        ? "text-emerald-950 font-extrabold"
                        : ""
                    }`}
                  >
                    {stage.label}
                  </span>
                  {isActiveRoute && (
                    <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-sky-700 animate-pulse shrink-0 hidden xs:block" />
                  )}
                </div>

                {/* Status Badge */}
                <div>
                  {isActiveRoute ? (
                    <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-md bg-sky-700 text-white font-mono font-black text-[8px] sm:text-[9px] tracking-wider shadow-xs">
                      <span>• ACTIVE</span>
                    </span>
                  ) : isDone ? (
                    <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-extrabold text-emerald-900 tracking-wider">
                      <span>DONE</span>
                    </span>
                  ) : isClickable ? (
                    <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-semibold text-ink-subtle tracking-wider">
                      <span>OPEN</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-medium text-ink-subtle/70 tracking-wider">
                      <span>LOCKED</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Arrow Connector for Desktop */}
              {idx < stages.length - 1 && (
                <ChevronRight className="h-4 w-4 text-line shrink-0 hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10" />
              )}
            </div>
          );

          if (stageHref) {
            return (
              <Link key={stage.id} href={stageHref} className="block group">
                {cardContent}
              </Link>
            );
          }

          return <div key={stage.id}>{cardContent}</div>;
        })}
      </div>
    </div>
  );
}
