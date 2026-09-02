"use client";

import { useState, useRef } from "react";
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
  ExternalLink,
  X,
  File,
  Image as ImageIcon,
  Check,
} from "lucide-react";

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

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const getTodayString = () => new Date().toISOString().split("T")[0];

export function BookingCloseStage({
  bookingId,
  readOnly = false,
  basePath = "/staff/booking",
}: BookingCloseStageProps) {
  const { data: booking, isLoading, isError } = useBooking(bookingId);
  const closeBookingMutation = useCloseBooking();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

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

  // Handle file selection & validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type) && !file.type.startsWith("image/")) {
      setFileError("Only JPG, PNG, WEBP images and PDF documents are allowed");
      setSelectedFile(null);
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10 MB
    if (file.size > maxSize) {
      setFileError("File size exceeds 10MB limit");
      setSelectedFile(null);
      return;
    }

    setFileError(null);
    setSelectedFile(file);
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Form submit handler
  const onSubmit = (values: CloseBookingFormValues) => {
    if (!selectedFile) {
      setFileError("RC document file is required to complete closure");
      toast.error("Please upload the RC transfer document");
      return;
    }

    const formData = new FormData();
    formData.append("rc_document", selectedFile);
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
        {/* Header Status Banner */}
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 sm:p-5 flex items-start gap-3.5 shadow-xs">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
            <FileCheck className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <div className="font-bold text-sm text-amber-800 dark:text-amber-300">
              Vehicle Delivered — Awaiting RC Transfer &amp; Closure
            </div>
            <div className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed font-medium">
              Upload the RC transfer document, record the transfer date, and
              complete the final sale closure workflow.
            </div>
          </div>
        </div>

        {/* Warning Callout Banner */}
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-4 flex items-center gap-3 text-xs text-rose-600 dark:text-rose-400 font-semibold shadow-xs">
          <AlertTriangle className="h-4 w-4 shrink-0 text-rose-500" />
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
            {/* RC Document File Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-ink flex items-center justify-between">
                <span>
                  RC Document <span className="text-rose-500">*</span>
                </span>
                <span className="text-[11px] font-normal text-ink-muted">
                  JPG, PNG, WEBP or PDF (Max 10MB)
                </span>
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
                onChange={handleFileChange}
                className="hidden"
                id="rc-document-file-input"
              />

              {!selectedFile ? (
                <label
                  htmlFor="rc-document-file-input"
                  className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                    fileError
                      ? "border-rose-500/50 bg-rose-500/5"
                      : "border-line bg-inset/50 hover:bg-inset hover:border-accent/50"
                  }`}
                >
                  <UploadCloud className="h-8 w-8 text-ink-subtle mb-2" />
                  <span className="text-xs font-bold text-ink mb-0.5">
                    Click to browse or upload RC document
                  </span>
                  <span className="text-[11px] text-ink-muted">
                    Supports image scans and PDF files
                  </span>
                </label>
              ) : (
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-line bg-inset/70">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent shrink-0">
                      {selectedFile.type === "application/pdf" ? (
                        <File className="h-5 w-5" />
                      ) : (
                        <ImageIcon className="h-5 w-5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-ink truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-[11px] text-ink-muted">
                        {formatFileSize(selectedFile.size)} ·{" "}
                        {selectedFile.type || "Document"}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleClearFile}
                    className="p-1.5 rounded-lg text-ink-muted hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="Remove file"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {fileError && (
                <p className="text-xs font-semibold text-rose-500 flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>{fileError}</span>
                </p>
              )}
            </div>

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
              disabled={closeBookingMutation.isPending || !selectedFile}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent text-inverse font-bold text-xs transition-opacity hover:opacity-95 disabled:opacity-50 shadow-md cursor-pointer min-h-[44px]"
            >
              {closeBookingMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Uploading RC &amp; Completing Booking...</span>
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  <span>Upload RC &amp; Complete Booking</span>
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
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 sm:p-5 flex items-start gap-3.5 shadow-xs">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
            <Clock className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <div className="font-bold text-sm text-amber-800 dark:text-amber-300">
              Vehicle Delivered — Pending RC Transfer &amp; Closure
            </div>
            <div className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
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
            <span>View Settlement &amp; Delivery Document</span>
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
      <div className="rounded-2xl bg-emerald-100/80 text-emerald-950 p-4 sm:p-5 flex items-start gap-3.5 shadow-xs">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-200/90 text-emerald-900 shrink-0">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <div className="font-extrabold text-sm text-emerald-950">
            Booking Transaction Closed — RC Transfer Recorded
          </div>
          <div className="text-xs text-emerald-900 leading-relaxed font-medium">
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

        {/* RC Document Attachment View */}
        {delivery?.rc_document_url ? (
          <div className="p-4 rounded-xl border border-line bg-inset/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent shrink-0">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-ink">
                  RC Transfer Document Proof
                </p>
                <p className="text-[11px] text-ink-subtle">
                  Private upload stored securely in S3
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => window.open(delivery.rc_document_url!, "_blank")}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-accent text-inverse font-bold text-xs transition-opacity hover:opacity-95 shadow-xs cursor-pointer"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>View / Download RC Document</span>
            </button>
          </div>
        ) : (
          <div className="p-4 rounded-xl border border-line bg-inset/40 text-center text-xs font-medium text-ink-muted">
            RC document file reference unavailable.
          </div>
        )}

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
