"use client";

import { useState } from "react";
import Link from "next/link";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { useBooking } from "../hooks/use-booking";
import { bookingApi } from "../api/booking-api";
import { downloadPdfDocument, sharePdfDocument, buildDocFilename } from "../utils/doc-actions";
import {
  Truck,
  CheckCircle2,
  AlertTriangle,
  Gauge,
  UserCheck,
  MapPin,
  FileCheck,
  ArrowRight,
  ShieldCheck,
  Share2,
  Download,
  Printer,
} from "lucide-react";

interface BookingDeliveryStageProps {
  bookingId: string;
  readOnly?: boolean;
  basePath?: string;
}

function formatDateIST(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function BookingDeliveryStage({
  bookingId,
  readOnly = false,
  basePath = "/staff/booking",
}: BookingDeliveryStageProps) {
  const { data: booking, isLoading, isError } = useBooking(bookingId);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-5 select-none font-sans">
        <div className="h-48 animate-pulse rounded-2xl bg-inset border border-line" />
        <div className="h-48 animate-pulse rounded-2xl bg-inset border border-line" />
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="rounded-2xl border border-dashed border-rose-500/30 bg-rose-500/5 p-6 text-center space-y-2 select-none font-sans">
        <AlertTriangle className="h-5 w-5 text-rose-500 mx-auto" />
        <p className="text-xs font-semibold text-ink">Failed to load delivery details.</p>
      </div>
    );
  }

  const isActive = booking.status === "prebooked" || booking.status === "offer";

  // Active status (prebooked or offer): Delivery is executed on Stage 3 (Settlement)
  if (isActive) {
    return (
      <div className="rounded-2xl border border-line bg-card p-6 text-center space-y-4 shadow-xs select-none font-sans">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 border border-accent/20 text-accent">
          <Truck className="h-6 w-6" />
        </div>

        <div className="space-y-1.5 max-w-md mx-auto">
          <h3 className="text-base font-bold text-ink font-sans">
            Stage 4: Vehicle Delivery Handover
          </h3>
          <p className="text-xs text-ink-subtle leading-relaxed">
            Vehicle delivery handover and final financial settlement are executed together as a single fused action on <span className="font-bold text-ink">Stage 3 (Settlement)</span>.
          </p>
        </div>

        {!readOnly ? (
          <Link
            href={`${basePath}/${booking.id}/settlement`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-inverse font-bold text-xs transition-opacity hover:opacity-95 shadow-xs cursor-pointer"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Go to Settlement Stage</span>
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

  // PDF Handlers
  const handleViewDeliveryPdf = async () => {
    if (!booking) return;
    setIsPdfLoading(true);
    try {
      const blob = await bookingApi.getDeliveryPdf(booking.id);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err: unknown) {
      let message = "Failed to load delivery note PDF";
      if (isAxiosError(err)) {
        if (err.response?.data instanceof Blob) {
          try {
            const text = await err.response.data.text();
            const json = JSON.parse(text);
            if (json.message) message = json.message;
          } catch {
            // ignore
          }
        } else if (err.response?.data?.message) {
          message = err.response.data.message;
        }
      }
      toast.error(message);
    } finally {
      setIsPdfLoading(false);
    }
  };

  const handleDownloadDeliveryPdf = async () => {
    if (!booking) return;
    setIsDownloading(true);
    const filename = buildDocFilename(
      "Delivery-Note",
      booking.booking_number,
      booking.customer?.name
    );
    try {
      await downloadPdfDocument({
        fetchBlob: () => bookingApi.getDeliveryPdf(booking.id),
        filename,
        docTitle: "Delivery note PDF",
      });
    } catch {
      // handled inside helper
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShareDelivery = async () => {
    if (!booking) return;
    const customerName = booking.customer?.name || "Customer";
    const filename = buildDocFilename(
      "Delivery-Note",
      booking.booking_number,
      customerName
    );
    const shareText = `Cars4 Delivery Note — ${booking.booking_number} — ${customerName}`;

    try {
      await sharePdfDocument({
        fetchBlob: () => bookingApi.getDeliveryPdf(booking.id),
        filename,
        shareTitle: `Cars4 Delivery Note ${booking.booking_number}`,
        shareText,
      });
    } catch {
      // handled inside helper
    }
  };

  // Post-completion read-only delivery record (delivered or closed)
  const delivery = booking.delivery;

  return (
    <div className="space-y-5 select-none font-sans">
      {/* Delivery Confirmation Header Banner */}
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 sm:p-5 flex items-start gap-3.5 shadow-xs">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <div className="font-bold text-sm text-emerald-800 dark:text-emerald-300">
            Vehicle Handover Completed
          </div>
          <div className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed">
            The vehicle has been delivered to the customer. Gate pass and handover details logged.
          </div>
        </div>
      </div>

      {/* Document Actions Bar (Share / Download / View-Print) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-line shadow-xs">
        <div className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-2 px-1">
          <Truck className="h-4 w-4 text-accent shrink-0" />
          <span>Car Delivery Note PDF</span>
        </div>

        <div className="grid grid-cols-3 sm:flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleShareDelivery}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-xl bg-inset border border-line text-xs font-semibold text-ink hover:bg-card transition-colors cursor-pointer"
            title="Share Delivery Note Summary"
          >
            <Share2 className="h-3.5 w-3.5 text-ink-subtle" />
            <span>Share</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadDeliveryPdf}
            disabled={isDownloading}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-xl bg-inset border border-line text-xs font-semibold text-ink hover:bg-card transition-colors cursor-pointer disabled:opacity-50"
            title="Direct Download Delivery Note PDF"
          >
            <Download className="h-3.5 w-3.5 text-ink-subtle" />
            <span>{isDownloading ? "Downloading..." : "Download"}</span>
          </button>

          <button
            type="button"
            onClick={handleViewDeliveryPdf}
            disabled={isPdfLoading}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 sm:py-1.5 rounded-xl bg-accent text-inverse text-xs font-bold transition-opacity hover:opacity-95 cursor-pointer shadow-xs disabled:opacity-50"
            title="View or Print Delivery Note PDF"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>{isPdfLoading ? "Opening..." : "View / Print"}</span>
          </button>
        </div>
      </div>

      {/* Vehicle Handover Facts Card */}
      <div className="rounded-2xl border border-line bg-card p-5 space-y-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-line/40 pb-3">
          <div className="flex items-center gap-2">
            <Truck className="h-4.5 w-4.5 text-accent" />
            <h3 className="text-sm font-bold text-ink font-sans">
              Handover Record &amp; Vehicle Identifiers
            </h3>
          </div>
          <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            Delivered
          </span>
        </div>

        {/* Handover Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Chassis Number */}
          <div className="p-3.5 rounded-xl bg-inset/50 border border-line/40 space-y-1">
            <span className="text-[10px] font-bold text-ink-subtle uppercase">Chassis Number (VIN)</span>
            <div className="font-mono font-bold text-ink text-sm uppercase">
              {delivery?.chassis_number || "—"}
            </div>
          </div>

          {/* Engine Number */}
          <div className="p-3.5 rounded-xl bg-inset/50 border border-line/40 space-y-1">
            <span className="text-[10px] font-bold text-ink-subtle uppercase">Engine Number</span>
            <div className="font-mono font-bold text-ink text-sm uppercase">
              {delivery?.engine_number || "—"}
            </div>
          </div>

          {/* Odometer Reading */}
          <div className="p-3.5 rounded-xl bg-inset/50 border border-line/40 space-y-1">
            <span className="text-[10px] font-bold text-ink-subtle uppercase flex items-center gap-1">
              <Gauge className="h-3 w-3 text-accent" />
              <span>Odometer at Delivery</span>
            </span>
            <div className="font-mono font-bold text-ink text-sm">
              {delivery?.km_reading !== null && delivery?.km_reading !== undefined
                ? `${delivery.km_reading.toLocaleString("en-IN")} KM`
                : "—"}
            </div>
          </div>

          {/* Witness Name */}
          <div className="p-3.5 rounded-xl bg-inset/50 border border-line/40 space-y-1">
            <span className="text-[10px] font-bold text-ink-subtle uppercase flex items-center gap-1">
              <UserCheck className="h-3 w-3 text-accent" />
              <span>Handover Witness</span>
            </span>
            <div className="font-bold text-ink text-xs">
              {delivery?.witness_name || "—"}
            </div>
          </div>

          {/* Delivery Location */}
          <div className="sm:col-span-2 p-3.5 rounded-xl bg-inset/50 border border-line/40 space-y-1">
            <span className="text-[10px] font-bold text-ink-subtle uppercase flex items-center gap-1">
              <MapPin className="h-3 w-3 text-accent" />
              <span>Delivery Handover Location</span>
            </span>
            <div className="font-bold text-ink text-xs">
              {delivery?.delivery_place || "Main Showroom"}
            </div>
          </div>
        </div>

        {/* Timestamp Meta */}
        {delivery?.created_at && (
          <div className="text-[11px] text-ink-subtle font-medium pt-2 border-t border-line/40 flex items-center gap-2">
            <FileCheck className="h-3.5 w-3.5 text-accent" />
            <span>Handover recorded on {formatDateIST(delivery.created_at)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
