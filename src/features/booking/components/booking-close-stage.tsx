"use client";

import Link from "next/link";
import { useBooking } from "../hooks/use-booking";
import {
  FileCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  FileText,
} from "lucide-react";

interface BookingCloseStageProps {
  bookingId: string;
  readOnly?: boolean;
  basePath?: string;
}

export function BookingCloseStage({
  bookingId,
  readOnly = false,
  basePath = "/staff/booking",
}: BookingCloseStageProps) {
  const { data: booking, isLoading, isError } = useBooking(bookingId);

  if (isLoading) {
    return (
      <div className="space-y-5 select-none font-sans">
        <div className="h-48 animate-pulse rounded-2xl bg-inset border border-line" />
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="rounded-2xl border border-dashed border-rose-500/30 bg-rose-500/5 p-6 text-center space-y-2 select-none font-sans">
        <AlertTriangle className="h-5 w-5 text-rose-500 mx-auto" />
        <p className="text-xs font-semibold text-ink">
          Failed to load booking status.
        </p>
      </div>
    );
  }

  const isClosed = booking.status === "closed";
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isDelivered = booking.status === "delivered";
  const isActive = booking.status === "prebooked" || booking.status === "offer";

  // Active status: Not ready for close yet
  if (isActive) {
    return (
      <div className="rounded-2xl border border-line bg-card p-6 text-center space-y-4 shadow-xs select-none font-sans">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
          <Clock className="h-6 w-6" />
        </div>

        <div className="space-y-1.5 max-w-md mx-auto">
          <h3 className="text-base font-bold text-ink font-sans">
            Stage 4: Sale Closure &amp; RC Transfer
          </h3>
          <p className="text-xs text-ink-subtle leading-relaxed">
            Vehicle delivery and settlement must be completed on{" "}
            <span className="font-bold text-ink">
              Stage 3 (Settlement &amp; Delivery)
            </span>{" "}
            before accessing RC Transfer tracking and final deal closure.
          </p>
        </div>

        {!readOnly ? (
          <Link
            href={`${basePath}/${booking.id}/settlement`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-inverse font-bold text-xs transition-opacity hover:opacity-95 shadow-xs cursor-pointer"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Go to Settlement &amp; Delivery Stage</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-inset border border-line text-xs font-semibold text-ink-muted">
            <span>Pending Settlement &amp; Delivery by Sales Staff</span>
          </div>
        )}
      </div>
    );
  }

  // Delivered or Closed status
  return (
    <div className="space-y-5 select-none font-sans">
      {/* Header Banner */}
      <div
        className={`rounded-2xl border p-4 sm:p-5 flex items-start gap-3.5 shadow-xs ${
          isClosed
            ? "border-emerald-500/30 bg-emerald-500/10"
            : "border-amber-500/30 bg-amber-500/10"
        }`}
      >
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl shrink-0 ${
            isClosed
              ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
              : "bg-amber-500/20 text-amber-600 dark:text-amber-400"
          }`}
        >
          {isClosed ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <FileCheck className="h-5 w-5" />
          )}
        </div>
        <div className="space-y-1">
          <div
            className={`font-bold text-sm ${
              isClosed
                ? "text-emerald-800 dark:text-emerald-300"
                : "text-amber-800 dark:text-amber-300"
            }`}
          >
            {isClosed
              ? "Booking Transaction Closed"
              : "Vehicle Delivered — Awaiting RC Transfer &amp; Closure"}
          </div>
          <div
            className={`text-xs leading-relaxed ${
              isClosed
                ? "text-emerald-700 dark:text-emerald-400"
                : "text-amber-700 dark:text-amber-400"
            }`}
          >
            {isClosed
              ? "RC transfer documents uploaded and deal officially closed."
              : "Vehicle has been delivered. RC transfer document upload and deal closure workflow will be enabled in slice BK-3.4."}
          </div>
        </div>
      </div>

      {/* Stage Detail Bento Card */}
      <div className="rounded-2xl border border-line bg-card p-6 text-center space-y-4 shadow-xs">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
          <FileText className="h-6 w-6" />
        </div>

        <div className="space-y-1.5 max-w-md mx-auto">
          <h3 className="text-base font-bold text-ink font-sans">
            RC Transfer &amp; Sale Closure Module
          </h3>
          <p className="text-xs text-ink-subtle leading-relaxed">
            RC transfer document attachments, RC transfer date logging, and
            final deal closure signoff module (slice BK-3.4).
          </p>
        </div>

        <Link
          href={`${basePath}/${booking.id}/settlement`}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-inset border border-line text-xs font-semibold text-ink hover:bg-card transition-colors cursor-pointer"
        >
          <ShieldCheck className="h-3.5 w-3.5 text-accent" />
          <span>View Settlement &amp; Delivery Document</span>
        </Link>
      </div>
    </div>
  );
}
