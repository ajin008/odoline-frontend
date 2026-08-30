"use client";

import { useBooking } from "../hooks/use-booking";
import { toast } from "sonner";
import { AdvanceAgreementPrint } from "./advance-agreement-print";
import {
  Receipt,
  CreditCard,
  Printer,
  Download,
  Share2,
  Clock,
  AlertTriangle,
} from "lucide-react";

interface BookingAgreementStageProps {
  bookingId: string;
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

export function BookingAgreementStage({ bookingId }: BookingAgreementStageProps) {
  const { data: booking, isLoading, isError } = useBooking(bookingId);

  const handlePrint = () => {
    if (!booking) return;
    const originalTitle = document.title;
    const customerName = booking.customer?.name || "Customer";
    const sanitizedCustomer = customerName.replace(/[/\\?%*:|"<>]/g, "").trim();
    document.title = `Cars4 Prebooking Agreement - ${sanitizedCustomer}`;
    document.body.setAttribute("data-print-document", "agreement");
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
      document.body.removeAttribute("data-print-document");
    }, 1000);
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
        <p className="text-xs font-semibold text-ink">Failed to load agreement details.</p>
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
    <div className="space-y-5 select-none font-sans">
      {/* Agreement Actions Bar */}
      <div className="flex items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-line shadow-xs flex-wrap">
        <div className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-2 px-2">
          <Receipt className="h-4 w-4 text-accent" />
          <span>Stage 1: Advance Sale Agreement</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-inset border border-line text-xs font-semibold text-ink hover:bg-card transition-colors cursor-pointer"
            title="Share Agreement Summary"
          >
            <Share2 className="h-3.5 w-3.5 text-ink-subtle" />
            <span>Share</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-inset border border-line text-xs font-semibold text-ink hover:bg-card transition-colors cursor-pointer"
            title="Download Agreement PDF"
          >
            <Download className="h-3.5 w-3.5 text-ink-subtle" />
            <span>PDF</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-accent text-inverse text-xs font-bold transition-opacity hover:opacity-95 cursor-pointer shadow-xs"
            title="Print Advance Agreement"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print Agreement</span>
          </button>
        </div>
      </div>

      {/* Bento Card A: Financial Agreement Breakdown */}
      <div className="rounded-2xl border border-line bg-card p-5 space-y-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-line/40 pb-3">
          <div className="flex items-center gap-2">
            <Receipt className="h-4.5 w-4.5 text-accent" />
            <h3 className="text-sm font-bold text-ink font-sans">
              Financial Terms &amp; Collection Progress
            </h3>
          </div>
          <span className="text-[11px] font-mono font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            {pctPaid}% Paid
          </span>
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
            <span className="font-semibold text-ink">Payment Collection Progress</span>
            <span className="font-mono text-ink-subtle">{formatCurrency(booking.amount_paid)} of {formatCurrency(booking.agreed_price)}</span>
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

      {/* Hidden Printable Agreement Document */}
      {booking && <AdvanceAgreementPrint booking={booking} />}
    </div>
  );
}
