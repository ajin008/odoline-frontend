"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useBooking } from "../hooks/use-booking";
import { useCloseBooking } from "../hooks/use-booking-actions";
import {
  closeBookingSchema,
  type CloseBookingFormValues,
} from "../schemas/booking-schemas";
import {
  FileCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  FileText,
  UploadCloud,
  Loader2,
  Check,
} from "lucide-react";

import { BookingDocumentsCard } from "./booking-documents-card";

interface BookingCloseStageProps {
  bookingId: string;
  readOnly?: boolean;
  basePath?: string;
}

function formatDateIST(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const getTodayString = () => new Date().toISOString().split("T")[0];

export function BookingCloseStage({
  bookingId,
  readOnly = false,
  basePath = "/staff/booking",
}: BookingCloseStageProps) {
  const { data: booking, isLoading, isError } = useBooking(bookingId);
  const closeBookingMutation = useCloseBooking();
  const [rcFilesCount, setRcFilesCount] = useState<number>(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CloseBookingFormValues>({
    resolver: zodResolver(closeBookingSchema),
    defaultValues: {
      rc_transfer_date: getTodayString(),
      rc_note: "",
    },
  });

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isClosed = booking.status === "closed";
  const isDelivered = booking.status === "delivered";
  const isActive =
    booking.status === "prebooked" ||
    booking.status === "offer" ||
    booking.status === "settlement";

  // Active status: Not ready for close yet (must complete Settlement & Delivery first)
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

  // Form submit handler
  const onSubmit = (values: CloseBookingFormValues) => {
    if (rcFilesCount === 0) {
      toast.error(
        "At least one RC transfer document is required to complete closure"
      );
      return;
    }

    const formData = new FormData();
    formData.append("rc_transfer_date", values.rc_transfer_date);
    if (values.rc_note && values.rc_note.trim()) {
      formData.append("rc_note", values.rc_note.trim());
    }

    closeBookingMutation.mutate({
      id: booking.id,
      formData,
    });
  };

  // View mode 1: Action form for Sales/CRO on Delivered Booking
  if (isDelivered && !readOnly) {
    return (
      <div className="space-y-6 select-none font-sans pb-12">
        {/* Header Status Banner (Border-Free Pastel Amber) */}
        <div className="rounded-2xl border-none bg-[#fef3c7] p-4 sm:p-5 flex items-start gap-3.5 shadow-xs">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fde68a] text-[#92400e] shrink-0">
            <FileCheck className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <div className="font-bold text-sm text-[#78350f]">
              Vehicle Delivered — Awaiting RC Transfer &amp; Closure
            </div>
            <div className="text-xs text-[#92400e] leading-relaxed font-medium">
              Upload the RC transfer document, record the transfer date, and
              complete the final sale closure workflow.
            </div>
          </div>
        </div>

        {/* Warning Callout Banner (Border-Free Pastel Rose) */}
        <div className="rounded-2xl border-none bg-[#ffe4e6] p-4 flex items-center gap-3 text-xs text-[#9f1239] font-semibold shadow-xs">
          <AlertTriangle className="h-4 w-4 shrink-0 text-[#be123c]" />
          <span>
            This finalizes the sale — the car will be marked closed and removed
            from active inventory.
          </span>
        </div>

        {/* Upload RC & Close Form Card */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-2xl border border-line bg-card p-5 sm:p-6 space-y-6 shadow-xs"
        >
          <div className="flex items-center gap-2.5 pb-4 border-b border-line">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <UploadCloud className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">
                Upload RC &amp; Complete Booking
              </h3>
              <p className="text-xs text-ink-subtle">
                Provide RC transfer proof document and official transfer date.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Multi-File RC Transfer Document Card */}
            <BookingDocumentsCard
              bookingId={booking.id}
              docType="rc_transfer"
              title="RC Transfer Proof"
              description="Upload 1 PDF document or up to 20 image scans (front/back/pages) of the transferred RC book."
              required={true}
              onFilesCountChange={setRcFilesCount}
            />

            {/* RC Transfer Date & Note */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Transfer Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink">
                  RC Transfer Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  max={getTodayString()}
                  {...register("rc_transfer_date")}
                  className={`w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border bg-card text-ink focus:outline-none focus:ring-2 transition-all ${
                    errors.rc_transfer_date
                      ? "border-rose-500 focus:ring-rose-500/20"
                      : "border-line focus:ring-accent/20 focus:border-accent"
                  }`}
                />
                {errors.rc_transfer_date && (
                  <p className="text-[11px] font-semibold text-rose-500">
                    {errors.rc_transfer_date.message}
                  </p>
                )}
              </div>

              {/* RC Note / Remark */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink">
                  RC Number / Remarks{" "}
                  <span className="text-ink-muted font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. KL-07-2026-1234567 / Transferred at Ernakulam RTO"
                  {...register("rc_note")}
                  className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-line bg-card text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                />
                {errors.rc_note && (
                  <p className="text-[11px] font-semibold text-rose-500">
                    {errors.rc_note.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-line">
            <button
              type="submit"
              disabled={closeBookingMutation.isPending || rcFilesCount === 0}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent text-inverse font-bold text-xs transition-opacity hover:opacity-95 disabled:opacity-50 shadow-md cursor-pointer min-h-[44px]"
            >
              {closeBookingMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Completing Booking...</span>
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  <span>Complete Booking</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // View mode 2: Read-Only / Owner View for Delivered Booking (Awaiting Close)
  if (isDelivered && readOnly) {
    return (
      <div className="space-y-5 select-none font-sans">
        <div className="rounded-2xl border-none bg-[#fef3c7] p-4 sm:p-5 flex items-start gap-3.5 shadow-xs">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fde68a] text-[#92400e] shrink-0">
            <Clock className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <div className="font-bold text-sm text-[#78350f]">
              Vehicle Delivered — Pending RC Transfer &amp; Closure
            </div>
            <div className="text-xs text-[#92400e] leading-relaxed font-medium">
              Vehicle has been delivered to the customer. Awaiting assigned
              sales staff to record the official RC transfer and finalize deal
              closure.
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-card p-6 text-center space-y-4 shadow-xs">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-inset border border-line text-ink-muted">
            <FileText className="h-6 w-6" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-sm font-bold text-ink">
              RC Transfer Document Pending
            </h3>
            <p className="text-xs text-ink-subtle leading-relaxed">
              Once sales staff uploads the RC document and records the transfer
              date, the full RC record and document preview will appear here.
            </p>
          </div>
          <Link
            href={`${basePath}/${booking.id}/settlement`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-inset border border-line text-xs font-semibold text-ink hover:bg-card transition-colors cursor-pointer"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-accent" />
            <span>View Settlement &amp; Delivery Stage Document</span>
          </Link>
        </div>
      </div>
    );
  }

  // View mode 3: Closed Booking (Read-Only Record View for All Roles)
  const delivery = booking.delivery;

  return (
    <div className="space-y-6 select-none font-sans pb-12">
      {/* Header Banner (Border-Free Pastel Emerald) */}
      <div className="rounded-2xl border-none bg-[#d1fae5] p-4 sm:p-5 flex items-start gap-3.5 shadow-xs">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#a7f3d0] text-[#065f46] shrink-0">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <div className="font-extrabold text-sm text-[#065f46]">
            Booking Transaction Closed — RC Transfer Recorded
          </div>
          <div className="text-xs text-[#047857] leading-relaxed font-medium">
            RC transfer document uploaded and deal officially closed. The car is
            marked closed and transaction completed.
          </div>
        </div>
      </div>

      {/* RC Record Details Card */}
      <div className="rounded-2xl border border-line bg-card p-5 sm:p-6 space-y-6 shadow-xs">
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-line">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100/90 text-emerald-800">
              <FileCheck className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">
                Official RC Transfer Record
              </h3>
              <p className="text-xs text-ink-subtle">
                Completed sale signoff details &amp; RC document proof.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-lg bg-emerald-100/90 text-emerald-800 font-mono text-[10px] font-extrabold uppercase tracking-wider">
            Closed &amp; Completed
          </span>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Transfer Date */}
          <div className="p-3.5 rounded-xl bg-inset/50 border border-line/60 space-y-1">
            <span className="text-[11px] font-bold text-ink-subtle uppercase tracking-wider">
              RC Transfer Date
            </span>
            <p className="text-xs font-bold text-ink">
              {formatDateIST(delivery?.rc_transfer_date)}
            </p>
          </div>

          {/* RC Note / Remarks */}
          <div className="p-3.5 rounded-xl bg-inset/50 border border-line/60 space-y-1 sm:col-span-2">
            <span className="text-[11px] font-bold text-ink-subtle uppercase tracking-wider">
              RC Number / Remarks
            </span>
            <p className="text-xs font-medium text-ink">
              {delivery?.rc_note || "No remarks provided"}
            </p>
          </div>
        </div>

        {/* RC Documents View */}
        <div>
          <BookingDocumentsCard
            bookingId={booking.id}
            docType="rc_transfer"
            title="RC Transfer Proof Documents"
            description="Official RC transfer proof uploaded on booking closure."
            readOnly={true}
          />
        </div>

        {/* Navigation back to earlier docs */}
        <div className="pt-2 flex justify-start">
          <Link
            href={`${basePath}/${booking.id}/settlement`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:underline cursor-pointer"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>View Settlement &amp; Delivery Stage Document</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
