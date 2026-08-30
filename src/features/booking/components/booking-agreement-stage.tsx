"use client";

import { useState } from "react";
import { isAxiosError } from "axios";
import { useBooking } from "../hooks/use-booking";
import { useMe } from "@/src/features/auth/hooks/use-me";
import { bookingApi } from "../api/booking-api";
import { toast } from "sonner";
import { EditAgreementModal } from "./edit-agreement-modal";
import Link from "next/link";
import {
  Receipt,
  CreditCard,
  Printer,
  Download,
  Share2,
  Clock,
  AlertTriangle,
  Edit3,
  ArrowRight,
} from "lucide-react";

interface BookingAgreementStageProps {
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

export function BookingAgreementStage({
  bookingId,
  readOnly = false,
  basePath = "/staff/booking",
}: BookingAgreementStageProps) {
  const { data: user } = useMe();
  const { data: booking, isLoading, isError } = useBooking(bookingId);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const isTerminal =
    booking?.status === "cancelled" || booking?.status === "closed";
  const isActive =
    booking?.status === "prebooked" || booking?.status === "offer";
  const canEdit = Boolean(
    booking && !isTerminal && !readOnly && user && user.role !== "owner"
  );
  const showProceedBar = Boolean(booking && isActive && !readOnly);

  const handleViewAgreement = async () => {
    if (!booking) return;
    setIsPdfLoading(true);
    try {
      const blob = await bookingApi.getAgreementPdf(booking.id);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err: unknown) {
      let message = "Failed to load agreement PDF";
      if (isAxiosError(err)) {
        if (err.response?.data instanceof Blob) {
          try {
            const text = await err.response.data.text();
            const json = JSON.parse(text);
            if (json.message) message = json.message;
          } catch {
            // ignore JSON parse failure on Blob
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

  const handleDownloadAgreement = async () => {
    if (!booking) return;
    setIsDownloading(true);
    try {
      const blob = await bookingApi.getAgreementPdf(booking.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Agreement-${booking.booking_number}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Agreement PDF downloaded");
    } catch (err: unknown) {
      let message = "Failed to download agreement PDF";
      if (isAxiosError(err)) {
        if (err.response?.data instanceof Blob) {
          try {
            const text = await err.response.data.text();
            const json = JSON.parse(text);
            if (json.message) message = json.message;
          } catch {
            // ignore parse error
          }
        } else if (err.response?.data?.message) {
          message = err.response.data.message;
        }
      }
      toast.error(message);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!booking) return;

    const carStr = booking.car
      ? `${booking.car.year} ${booking.car.make} ${booking.car.model}${
          booking.car.reg_number ? ` (${booking.car.reg_number})` : ""
        }`
      : "Vehicle";

    const shareText = `Cars4 Booking ${booking.booking_number}\nBuyer: ${
      booking.customer?.name || "Customer"
    }\nCar: ${carStr}\nAgreed: ${formatCurrency(
      booking.agreed_price
    )} · Advance: ${formatCurrency(
      booking.amount_paid
    )} · Balance: ${formatCurrency(booking.balance_due)}`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `Cars4 Booking ${booking.booking_number}`,
          text: shareText,
        });
        return;
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);
      toast.success("Agreement summary copied to clipboard");
    } catch {
      toast.error("Failed to copy summary to clipboard");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-5">
        <div className="h-48 animate-pulse rounded-2xl bg-inset border border-line" />
        <div className="h-48 animate-pulse rounded-2xl bg-inset border border-line" />
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="rounded-2xl border border-dashed border-rose-500/30 bg-rose-500/5 p-6 text-center space-y-2">
        <AlertTriangle className="h-5 w-5 text-rose-500 mx-auto" />
        <p className="text-xs font-semibold text-ink">
          Failed to load agreement details.
        </p>
      </div>
    );
  }

  const agreedNum = Number(booking.agreed_price || 0);
  const paidNum = Number(booking.amount_paid || 0);
  const pctPaid =
    agreedNum > 0
      ? Math.min(100, Math.max(0, Math.round((paidNum / agreedNum) * 100)))
      : 0;

  return (
    <div className="space-y-5 select-none font-sans pb-36 sm:pb-12">
      {/* Guided Next-Stage Proceed Banner */}
      {showProceedBar && (
        <div className="rounded-2xl border border-accent/30 bg-accent/5 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="space-y-1">
            <div className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-2">
              <ArrowRight className="h-4 w-4 text-accent" />
              <span>Next Guided Pipeline Step</span>
            </div>
            <div className="text-xs text-ink-subtle leading-relaxed">
              Advance agreement is recorded. Proceed to add order form (vehicle
              accessories &amp; offers).
            </div>
          </div>
          <Link
            href={`${basePath}/${booking.id}/order`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-inverse text-xs font-bold transition-opacity hover:opacity-95 shadow-xs cursor-pointer shrink-0"
          >
            <span>Proceed to Order Form</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* Agreement Actions Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-line shadow-xs">
        <div className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-2 px-1">
          <Receipt className="h-4 w-4 text-accent shrink-0" />
          <span>Stage 1: Advance Sale Agreement</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleViewAgreement}
            disabled={isPdfLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 sm:py-1.5 rounded-xl bg-accent text-inverse text-xs font-bold transition-opacity hover:opacity-95 cursor-pointer shadow-xs disabled:opacity-50 min-h-[44px] sm:min-h-0"
            title="View or Print Advance Agreement PDF"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>{isPdfLoading ? "Opening..." : "View / Print"}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadAgreement}
            disabled={isDownloading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2.5 sm:py-1.5 rounded-xl bg-inset border border-line text-xs font-semibold text-ink hover:bg-card transition-colors cursor-pointer disabled:opacity-50 min-h-[44px] sm:min-h-0"
            title="Direct Download Agreement PDF"
          >
            <Download className="h-3.5 w-3.5 text-ink-subtle" />
            <span>{isDownloading ? "Downloading..." : "Download"}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2.5 sm:py-1.5 rounded-xl bg-inset border border-line text-xs font-semibold text-ink hover:bg-card transition-colors cursor-pointer min-h-[44px] sm:min-h-0"
            title="Share Agreement Summary"
          >
            <Share2 className="h-3.5 w-3.5 text-ink-subtle" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Bento Card A: Financial Agreement Breakdown */}
      <div className="rounded-2xl border border-line bg-card p-5 space-y-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-line/40 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Receipt className="h-4.5 w-4.5 text-accent" />
            <h3 className="text-sm font-bold text-ink font-sans">
              Financial Terms &amp; Collection Progress
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {canEdit && (
              <button
                type="button"
                onClick={() => setIsEditOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-inset border border-line text-xs font-semibold text-ink hover:bg-card transition-colors cursor-pointer"
                title="Edit Agreement Details"
              >
                <Edit3 className="h-3.5 w-3.5 text-accent" />
                <span>Edit</span>
              </button>
            )}
            <span className="text-[11px] font-mono font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              {pctPaid}% Paid
            </span>
          </div>
        </div>

        {/* 3 Metrics Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Agreed Price */}
          <div className="bg-inset/70 p-4 rounded-xl border border-line/50 space-y-1">
            <div className="text-[10px] font-bold text-ink-subtle uppercase tracking-wider">
              Agreed Deal Price
            </div>
            <div className="text-xl font-bold font-mono text-ink">
              {formatCurrency(booking.agreed_price)}
            </div>
          </div>

          {/* Total Paid */}
          <div
            className="p-4 rounded-xl border-0 space-y-1"
            style={{ backgroundColor: "#d8f1b7" }}
          >
            <div className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider">
              Advance Amount Paid
            </div>
            <div className="text-xl font-bold font-mono text-emerald-950">
              {formatCurrency(booking.amount_paid)}
            </div>
          </div>

          {/* Balance Due */}
          <div
            className="p-4 rounded-xl border-0 space-y-1"
            style={{ backgroundColor: "#fae9cf" }}
          >
            <div className="text-[10px] font-bold text-amber-900 uppercase tracking-wider">
              Net Balance Due
            </div>
            <div className="text-xl font-bold font-mono text-amber-950">
              {formatCurrency(booking.balance_due)}
            </div>
          </div>
        </div>

        {/* Payment Collection Progress Bar */}
        <div className="space-y-1.5 bg-inset/40 p-3.5 rounded-xl border border-line/40">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-ink">
              Payment Collection Progress
            </span>
            <span className="font-mono text-ink-subtle">
              {formatCurrency(booking.amount_paid)} of{" "}
              {formatCurrency(booking.agreed_price)}
            </span>
          </div>
          <div className="h-2 w-full bg-inset rounded-full overflow-hidden border border-line/60">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${pctPaid}%` }}
            />
          </div>
        </div>

        {/* Agreement Terms Meta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-inset/30 p-3.5 rounded-xl border border-line/40">
          {booking.balance_due_days ? (
            <div className="space-y-0.5">
              <span className="text-ink-subtle font-medium">
                Balance Settlement Window:
              </span>
              <div className="font-bold text-ink flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-amber-500" />
                <span>Within {booking.balance_due_days} working days</span>
              </div>
            </div>
          ) : null}

          {booking.advance_receipt_no ? (
            <div className="space-y-0.5">
              <span className="text-ink-subtle font-medium">
                Advance Receipt Reference:
              </span>
              <div className="font-bold text-ink font-mono">
                Ref #{booking.advance_receipt_no}{" "}
                {booking.advance_receipt_date
                  ? `(dtd ${formatDateIST(booking.advance_receipt_date)})`
                  : ""}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Bento Card B: Payments Ledger Audit Trail */}
      <div className="rounded-2xl border border-line bg-card p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-line/40 pb-3">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4.5 w-4.5 text-accent" />
            <h3 className="text-sm font-bold text-ink font-sans">
              Payments Ledger Audit Trail
            </h3>
          </div>
          <span className="text-[11px] text-ink-subtle font-medium">
            {booking.payments?.length || 0} ledger entries
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
                    <tr
                      key={p.id}
                      className="hover:bg-inset/50 transition-colors"
                    >
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
        ) : (
          <div className="text-xs text-ink-subtle italic py-4 text-center bg-inset/30 rounded-xl border border-line/40">
            No payments logged in the ledger yet.
          </div>
        )}
      </div>

      {/* Edit Agreement Metadata Modal */}
      {booking && (
        <EditAgreementModal
          booking={booking}
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
        />
      )}
    </div>
  );
}
