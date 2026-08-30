"use client";

import { useState } from "react";
import Link from "next/link";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { useBooking } from "../hooks/use-booking";
import { bookingApi } from "../api/booking-api";
import { SettleDeliverForm } from "./settle-deliver-form";
import {
  ShieldCheck,
  CreditCard,
  Building2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ArrowRight,
  Share2,
  Download,
  Printer,
  Truck,
  Gauge,
  UserCheck,
  MapPin,
  FileCheck,
} from "lucide-react";

interface BookingSettlementStageProps {
  bookingId: string;
  readOnly?: boolean;
  basePath?: string;
}

function formatCurrency(amountStr: string | null | undefined): string {
  if (!amountStr) return "₹0";
  const num = Number(amountStr);
  if (isNaN(num)) return amountStr;
  return `₹${num.toLocaleString("en-IN")}`;
}

function formatDateIST(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const PAYMENT_TYPE_LABELS: Record<string, string> = {
  advance: "Advance Payment",
  part_payment: "Part Payment",
  settlement: "Final Settlement",
  refund: "Refund",
  cancellation_charge: "Cancellation Charge",
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash: "Cash",
  bank_transfer: "Bank Transfer",
  upi: "UPI",
  card: "Card",
  cheque: "Cheque",
  loan: "Loan Disbursement",
  exchange: "Vehicle Exchange",
  other: "Other",
};

export function BookingSettlementStage({
  bookingId,
  readOnly = false,
  basePath = "/staff/booking",
}: BookingSettlementStageProps) {
  const { data: booking, isLoading, isError } = useBooking(bookingId);
  const [isSettlementLoading, setIsSettlementLoading] = useState(false);
  const [isSettlementDownloading, setIsSettlementDownloading] = useState(false);

  const [isDeliveryLoading, setIsDeliveryLoading] = useState(false);
  const [isDeliveryDownloading, setIsDeliveryDownloading] = useState(false);

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
        <p className="text-xs font-semibold text-ink">Failed to load settlement details.</p>
      </div>
    );
  }

  const isActive = booking.status === "prebooked" || booking.status === "offer";

  // Active stage for sales/cro: render SettleDeliverForm
  if (isActive && !readOnly) {
    return <SettleDeliverForm booking={booking} />;
  }

  // Active stage for read-only owner
  if (isActive && readOnly) {
    return (
      <div className="rounded-2xl border border-line bg-card p-6 text-center space-y-3 select-none font-sans shadow-xs">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
          <Clock className="h-5 w-5" />
        </div>
        <div className="space-y-1 max-w-sm mx-auto">
          <h3 className="text-sm font-bold text-ink font-sans">
            Pending Settlement &amp; Delivery
          </h3>
          <p className="text-xs text-ink-subtle">
            Sales staff have not completed settlement &amp; delivery for this booking yet.
          </p>
        </div>
      </div>
    );
  }

  // --- SETTLEMENT FORM PDF HANDLERS ---
  const handleViewSettlementPdf = async () => {
    if (!booking) return;
    setIsSettlementLoading(true);
    try {
      const blob = await bookingApi.getSettlementPdf(booking.id);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err: unknown) {
      let message = "Failed to load settlement PDF";
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
      setIsSettlementLoading(false);
    }
  };

  const handleDownloadSettlementPdf = async () => {
    if (!booking) return;
    setIsSettlementDownloading(true);
    try {
      const blob = await bookingApi.getSettlementPdf(booking.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Settlement-${booking.booking_number}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Settlement PDF downloaded");
    } catch (err: unknown) {
      let message = "Failed to download settlement PDF";
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
      setIsSettlementDownloading(false);
    }
  };

  const handleShareSettlement = async () => {
    if (!booking) return;

    const carStr = booking.car
      ? `${booking.car.year} ${booking.car.make} ${booking.car.model}${
          booking.car.reg_number ? ` (${booking.car.reg_number})` : ""
        }`
      : "Vehicle";

    const shareText = `Cars4 Settlement Form - Booking ${booking.booking_number}\nBuyer: ${
      booking.customer?.name || "Customer"
    }\nCar: ${carStr}\nGrand Total: ${formatCurrency(
      booking.grand_total || booking.agreed_price
    )} · Total Paid: ${formatCurrency(booking.amount_paid)}`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `Cars4 Settlement Form ${booking.booking_number}`,
          text: shareText,
        });
        return;
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);
      toast.success("Settlement summary copied to clipboard");
    } catch {
      toast.error("Failed to copy summary to clipboard");
    }
  };

  // --- DELIVERY NOTE PDF HANDLERS ---
  const handleViewDeliveryPdf = async () => {
    if (!booking) return;
    setIsDeliveryLoading(true);
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
      setIsDeliveryLoading(false);
    }
  };

  const handleDownloadDeliveryPdf = async () => {
    if (!booking) return;
    setIsDeliveryDownloading(true);
    try {
      const blob = await bookingApi.getDeliveryPdf(booking.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Delivery-${booking.booking_number}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Delivery note PDF downloaded");
    } catch (err: unknown) {
      let message = "Failed to download delivery note PDF";
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
      setIsDeliveryDownloading(false);
    }
  };

  const handleShareDelivery = async () => {
    if (!booking) return;

    const carStr = booking.car
      ? `${booking.car.year} ${booking.car.make} ${booking.car.model}${
          booking.car.reg_number ? ` (${booking.car.reg_number})` : ""
        }`
      : "Vehicle";

    const shareText = `Cars4 Delivery Note - Booking ${booking.booking_number}\nBuyer: ${
      booking.customer?.name || "Customer"
    }\nCar: ${carStr}\nChassis: ${booking.delivery?.chassis_number || "—"}\nEngine: ${
      booking.delivery?.engine_number || "—"
    }`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `Cars4 Delivery Note ${booking.booking_number}`,
          text: shareText,
        });
        return;
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);
      toast.success("Delivery note summary copied to clipboard");
    } catch {
      toast.error("Failed to copy summary to clipboard");
    }
  };

  // Post-completion read-only settlement + delivery view (delivered or closed)
  const settlement = booking.settlement;
  const delivery = booking.delivery;

  const agreedNum = Number(booking.agreed_price || 0);
  const accessoriesNum = Number(booking.accessories_total || 0);
  const rtoNum = Number(settlement?.rto_charges || 0);
  const insuranceNum = Number(settlement?.insurance_charges || 0);
  const grandTotalNum = Number(booking.grand_total || agreedNum + accessoriesNum + rtoNum + insuranceNum);
  const amountPaidNum = Number(booking.amount_paid || 0);

  return (
    <div className="space-y-6 select-none font-sans pb-36 sm:pb-12">
      {/* Guided Proceed to Close Banner (Delivered status for operating role) */}
      {booking.status === "delivered" && !readOnly && (
        <div className="rounded-2xl border border-accent/30 bg-accent/5 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs font-sans">
          <div className="space-y-1">
            <div className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-2">
              <ArrowRight className="h-4 w-4 text-accent" />
              <span>Next Guided Pipeline Step</span>
            </div>
            <div className="text-xs text-ink-subtle leading-relaxed">
              Settlement and vehicle delivery are complete. Proceed to final stage: RC transfer tracking and sale closure.
            </div>
          </div>
          <Link
            href={`${basePath}/${booking.id}/close`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-inverse text-xs font-bold transition-opacity hover:opacity-95 shadow-xs cursor-pointer shrink-0"
          >
            <span>Proceed to Close (RC Transfer)</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* Status Header Banner */}
      <div
        className="rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-xs border-0"
        style={{ backgroundColor: "#d8f1b7" }}
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-900/15 text-emerald-950 shrink-0">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <div className="font-bold text-sm text-emerald-950">
            Settlement &amp; Vehicle Delivery Completed
          </div>
          <div className="text-xs text-emerald-900/90 leading-relaxed font-medium">
            Financial settlement, final charges, delivery payments, and vehicle handover details have been recorded and verified.
          </div>
        </div>
      </div>

      {/* DOCUMENT SECTION 1: SETTLEMENT FORM PDF & CHARGES BREAKDOWN */}
      <div className="space-y-3">
        {/* Settlement PDF Action Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-line shadow-xs">
          <div className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-2 px-1">
            <FileText className="h-4 w-4 text-accent shrink-0" />
            <span>Document 1: Order / Final Settlement Form PDF</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleViewSettlementPdf}
              disabled={isSettlementLoading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 sm:py-1.5 rounded-xl bg-accent text-inverse text-xs font-bold transition-opacity hover:opacity-95 cursor-pointer shadow-xs disabled:opacity-50 min-h-[44px] sm:min-h-0"
              title="View or Print Settlement Form PDF"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>{isSettlementLoading ? "Opening..." : "View / Print"}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadSettlementPdf}
              disabled={isSettlementDownloading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2.5 sm:py-1.5 rounded-xl bg-inset border border-line text-xs font-semibold text-ink hover:bg-card transition-colors cursor-pointer disabled:opacity-50 min-h-[44px] sm:min-h-0"
              title="Direct Download Settlement Form PDF"
            >
              <Download className="h-3.5 w-3.5 text-ink-subtle" />
              <span>{isSettlementDownloading ? "Downloading..." : "Download"}</span>
            </button>

            <button
              type="button"
              onClick={handleShareSettlement}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2.5 sm:py-1.5 rounded-xl bg-inset border border-line text-xs font-semibold text-ink hover:bg-card transition-colors cursor-pointer min-h-[44px] sm:min-h-0"
              title="Share Settlement Form Summary"
            >
              <Share2 className="h-3.5 w-3.5 text-ink-subtle" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Charges & Financial Breakdown Card */}
        <div className="rounded-2xl border border-line bg-card p-5 space-y-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-line/40 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4.5 w-4.5 text-accent" />
              <h3 className="text-sm font-bold text-ink font-sans">
                Settlement Charges Breakdown
              </h3>
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              Full Balance Cleared
            </span>
          </div>

          {/* Financial Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-inset/50 border border-line/40 space-y-1">
              <span className="text-[10px] font-bold text-ink-subtle uppercase">Agreed Car Price</span>
              <div className="font-mono font-bold text-ink text-sm">{formatCurrency(booking.agreed_price)}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-inset/50 border border-line/40 space-y-1">
              <span className="text-[10px] font-bold text-ink-subtle uppercase">Accessories Total</span>
              <div className="font-mono font-bold text-ink text-sm">{formatCurrency(booking.accessories_total || "0")}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-inset/50 border border-line/40 space-y-1">
              <span className="text-[10px] font-bold text-ink-subtle uppercase">RTO Charges</span>
              <div className="font-mono font-bold text-ink text-sm">
                {settlement?.rto_charges ? formatCurrency(settlement.rto_charges) : "—"}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-inset/50 border border-line/40 space-y-1">
              <span className="text-[10px] font-bold text-ink-subtle uppercase">Insurance Charges</span>
              <div className="font-mono font-bold text-ink text-sm">
                {settlement?.insurance_charges ? formatCurrency(settlement.insurance_charges) : "—"}
              </div>
            </div>
          </div>

          {/* Grand Total & Paid Total Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1 border-t border-line/40">
            <div
              className="p-4 rounded-xl border-0 space-y-1"
              style={{ backgroundColor: "#97d8d0" }}
            >
              <span className="text-[10px] font-extrabold text-[#0a3832] uppercase tracking-wider block">
                Final Grand Total
              </span>
              <div className="font-mono font-extrabold text-[#0a2723] text-xl">
                {formatCurrency(String(grandTotalNum))}
              </div>
            </div>

            <div
              className="p-4 rounded-xl border-0 space-y-1"
              style={{ backgroundColor: "#d8f1b7" }}
            >
              <span className="text-[10px] font-extrabold text-emerald-900 uppercase tracking-wider block">
                Total Collected / Paid
              </span>
              <div className="font-mono font-extrabold text-emerald-950 text-xl">
                {formatCurrency(String(amountPaidNum))}
              </div>
            </div>
          </div>

          {/* Finance Company & Remarks */}
          {(settlement?.finance_company || settlement?.remark) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-inset/30 p-3.5 rounded-xl border border-line/40">
              {settlement.finance_company && (
                <div className="space-y-0.5">
                  <span className="text-ink-subtle font-medium flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5 text-accent" />
                    <span>Finance Company / Lender:</span>
                  </span>
                  <div className="font-bold text-ink">{settlement.finance_company}</div>
                </div>
              )}

              {settlement.remark && (
                <div className="space-y-0.5">
                  <span className="text-ink-subtle font-medium flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5 text-ink-subtle" />
                    <span>Settlement Remark:</span>
                  </span>
                  <div className="font-medium text-ink">{settlement.remark}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* DOCUMENT SECTION 2: CAR DELIVERY NOTE PDF & HANDOVER RECORD */}
      <div className="space-y-3">
        {/* Delivery Note PDF Action Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-line shadow-xs">
          <div className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-2 px-1">
            <Truck className="h-4 w-4 text-accent shrink-0" />
            <span>Document 2: Car Delivery Note PDF</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleViewDeliveryPdf}
              disabled={isDeliveryLoading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 sm:py-1.5 rounded-xl bg-accent text-inverse text-xs font-bold transition-opacity hover:opacity-95 cursor-pointer shadow-xs disabled:opacity-50 min-h-[44px] sm:min-h-0"
              title="View or Print Delivery Note PDF"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>{isDeliveryLoading ? "Opening..." : "View / Print"}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadDeliveryPdf}
              disabled={isDeliveryDownloading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2.5 sm:py-1.5 rounded-xl bg-inset border border-line text-xs font-semibold text-ink hover:bg-card transition-colors cursor-pointer disabled:opacity-50 min-h-[44px] sm:min-h-0"
              title="Direct Download Delivery Note PDF"
            >
              <Download className="h-3.5 w-3.5 text-ink-subtle" />
              <span>{isDeliveryDownloading ? "Downloading..." : "Download"}</span>
            </button>

            <button
              type="button"
              onClick={handleShareDelivery}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2.5 sm:py-1.5 rounded-xl bg-inset border border-line text-xs font-semibold text-ink hover:bg-card transition-colors cursor-pointer min-h-[44px] sm:min-h-0"
              title="Share Delivery Note Summary"
            >
              <Share2 className="h-3.5 w-3.5 text-ink-subtle" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Vehicle Handover Facts Card */}
        <div className="rounded-2xl border border-line bg-card p-5 space-y-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-line/40 pb-3">
            <div className="flex items-center gap-2">
              <Truck className="h-4.5 w-4.5 text-accent" />
              <h3 className="text-sm font-bold text-ink font-sans">
                Vehicle Handover Details &amp; Identifiers
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

      {/* DOCUMENT SECTION 3: FULL PAYMENTS LEDGER TABLE */}
      <div className="rounded-2xl border border-line bg-card p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-line/40 pb-3">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4.5 w-4.5 text-accent" />
            <h3 className="text-sm font-bold text-ink font-sans">
              Full Payments Ledger
            </h3>
          </div>
          <span className="text-[11px] text-ink-subtle font-medium">
            {booking.payments?.length || 0} total payment entries
          </span>
        </div>

        {booking.payments && booking.payments.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-line/50">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-line/50 text-[10px] font-bold text-ink-subtle uppercase tracking-wider bg-inset">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Method</th>
                  <th className="py-2.5 px-3">Reference</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/40 bg-card">
                {booking.payments.map((p) => {
                  const isNegative =
                    p.type === "refund" || p.type === "cancellation_charge";
                  return (
                    <tr key={p.id} className="hover:bg-inset/50 transition-colors">
                      <td className="py-2.5 px-3 font-medium text-ink">
                        {formatDateIST(p.paid_at)}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-ink">
                        {PAYMENT_TYPE_LABELS[p.type] || p.type}
                      </td>
                      <td className="py-2.5 px-3 text-ink-muted">
                        {PAYMENT_METHOD_LABELS[p.method] || p.method}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-ink-subtle">
                        {p.reference || "—"}
                      </td>
                      <td
                        className={`py-2.5 px-3 font-bold font-mono text-right ${
                          isNegative
                            ? "text-rose-500"
                            : "text-emerald-600 dark:text-emerald-400"
                        }`}
                      >
                        {isNegative ? "-" : "+"}
                        {formatCurrency(p.amount)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}
