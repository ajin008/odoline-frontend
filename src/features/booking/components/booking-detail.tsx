"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useBooking } from "../hooks/use-booking";
import { getBookingStatusConfig } from "../utils/booking-status-map";
import { BookingProgressBar } from "./booking-progress-bar";
import { AdvanceAgreementPrint } from "./advance-agreement-print";
import {
  ArrowLeft,
  User,
  Phone,
  Car as CarIcon,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Building2,
  FileText,
  CreditCard,
  AlertTriangle,
  Lock,
  ArrowRight,
  Printer,
  Share2,
} from "lucide-react";

interface BookingDetailProps {
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

export function BookingDetail({ bookingId }: BookingDetailProps) {
  const { data: booking, isLoading, isError } = useBooking(bookingId);

  const handlePrint = () => {
    window.print();
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
      <div className="w-full space-y-5 font-sans select-none">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 animate-pulse rounded-xl bg-inset border border-line" />
          <div className="h-6 w-48 animate-pulse rounded-lg bg-inset border border-line" />
        </div>
        <div className="h-28 animate-pulse rounded-2xl bg-inset border border-line" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-40 animate-pulse rounded-xl bg-inset border border-line" />
          <div className="h-40 animate-pulse rounded-xl bg-inset border border-line" />
        </div>
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="w-full space-y-5 font-sans select-none">
        <div className="flex items-center gap-3">
          <Link
            href="/staff/booking"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-card border border-line text-ink hover:bg-inset transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <span className="text-sm font-bold text-ink">Back to Bookings</span>
        </div>

        <div className="rounded-xl border border-dashed border-rose-500/30 bg-rose-500/5 p-8 text-center space-y-3">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-ink font-sans">
              Booking Not Found or Access Denied
            </h3>
            <p className="text-xs text-ink-subtle max-w-sm mx-auto">
              This booking record does not exist or is not assigned to your account.
            </p>
          </div>
          <Link
            href="/staff/booking"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-inverse text-xs font-bold transition-opacity hover:opacity-95"
          >
            Return to Booking List
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = getBookingStatusConfig(booking.status);
  const balanceDueNum = Number(booking.balance_due);
  const isFullyPaid = balanceDueNum <= 0;

  return (
    <div className="w-full space-y-5 font-sans select-none pb-8">
      {/* 1. Header & Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line/60 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/staff/booking"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-card border border-line text-ink hover:bg-inset transition-colors shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-ink font-mono">
                {booking.booking_number}
              </h1>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusConfig.badgeColor}`}
              >
                {statusConfig.label}
              </span>
            </div>
            <div className="text-xs text-ink-subtle flex items-center gap-1 font-medium">
              <Calendar className="h-3.5 w-3.5 text-ink-subtle" />
              <span>Prebooked on {formatDateIST(booking.prebooked_at)}</span>
            </div>
          </div>
        </div>

        {/* Action Toolbar: Payment Status, Share, Print */}
        <div className="flex items-center gap-2 flex-wrap">
          {isFullyPaid ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
              <span>Fully paid</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>Balance pending</span>
            </span>
          )}

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-line text-xs font-semibold text-ink hover:bg-inset transition-colors cursor-pointer"
            title="Share Agreement Summary"
          >
            <Share2 className="h-3.5 w-3.5 text-ink-subtle" />
            <span>Share</span>
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

      {/* 2. Four-Stage Milestone Progress Bar */}
      <BookingProgressBar
        status={booking.status}
        cancelReason={booking.cancel_reason}
      />

      {/* 3. Section Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Buyer Card */}
        <div className="rounded-2xl border border-line bg-card p-4 space-y-2.5 shadow-xs">
          <div className="flex items-center gap-2 border-b border-line/40 pb-2">
            <User className="h-4 w-4 text-accent" />
            <h3 className="text-xs font-bold text-ink uppercase tracking-wider">
              Buyer Details
            </h3>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="font-bold text-ink text-sm">
              {booking.customer?.name || "Customer Unlinked"}
            </div>
            {booking.customer?.phone && (
              <a
                href={`tel:${booking.customer.phone}`}
                className="inline-flex items-center gap-1.5 text-accent hover:underline font-mono font-semibold"
              >
                <Phone className="h-3.5 w-3.5 shrink-0" />
                <span>{booking.customer.phone}</span>
              </a>
            )}
          </div>
        </div>

        {/* Vehicle Details Card */}
        <div className="rounded-2xl border border-line bg-card p-4 space-y-2.5 shadow-xs">
          <div className="flex items-center gap-2 border-b border-line/40 pb-2">
            <CarIcon className="h-4 w-4 text-accent" />
            <h3 className="text-xs font-bold text-ink uppercase tracking-wider">
              Booked Vehicle
            </h3>
          </div>

          <div className="space-y-1 text-xs">
            <div className="font-bold text-ink text-sm truncate">
              {booking.car
                ? `${booking.car.year} ${booking.car.make} ${booking.car.model}`
                : "Vehicle Unlinked"}
            </div>
            {booking.car?.reg_number && (
              <div className="font-mono text-ink-muted font-semibold uppercase">
                {booking.car.reg_number}
              </div>
            )}
            {booking.car?.selling_price && (
              <div className="text-ink-subtle text-[11px]">
                Asking Price:{" "}
                <span className="font-mono font-semibold text-ink">
                  {formatCurrency(booking.car.selling_price)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Showroom Seller Card */}
        <div className="rounded-2xl border border-line bg-card p-4 space-y-2.5 shadow-xs">
          <div className="flex items-center gap-2 border-b border-line/40 pb-2">
            <Building2 className="h-4 w-4 text-accent" />
            <h3 className="text-xs font-bold text-ink uppercase tracking-wider">
              Seller (Showroom)
            </h3>
          </div>

          <div className="space-y-1 text-xs">
            <div className="font-bold text-ink text-sm">
              {booking.seller?.name || "Dealership"}
            </div>
            <div className="text-ink-muted text-[11px] leading-relaxed">
              {booking.seller?.address}
            </div>
            {booking.seller?.phone && (
              <div className="font-mono text-ink-subtle text-[11px]">
                Tel: {booking.seller.phone}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Advance Agreement & Financial Breakdown */}
      <div className="rounded-2xl border border-line bg-card p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-line/40 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="h-4.5 w-4.5 text-accent" />
            <h3 className="text-sm font-bold text-ink font-sans">
              Advance Agreement Terms &amp; Financials
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-inset p-3.5 rounded-xl border border-line/50 space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-bold text-ink-subtle uppercase tracking-wider">
              Agreed Deal Price
            </span>
            <div className="text-lg font-bold font-mono text-ink">
              {formatCurrency(booking.agreed_price)}
            </div>
          </div>

          <div className="bg-emerald-500/5 p-3.5 rounded-xl border border-emerald-500/20 space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Total Amount Paid
            </span>
            <div className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {formatCurrency(booking.amount_paid)}
            </div>
          </div>

          <div className="bg-amber-500/5 p-3.5 rounded-xl border border-amber-500/20 space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Balance Due
            </span>
            <div className="text-lg font-bold font-mono text-amber-600 dark:text-amber-400">
              {formatCurrency(booking.balance_due)}
            </div>
          </div>
        </div>

        {/* Terms & Receipt Meta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-inset/50 p-3.5 rounded-xl border border-line/40">
          {booking.balance_due_days ? (
            <div className="space-y-0.5">
              <span className="text-ink-subtle font-medium">
                Balance Due Days:
              </span>
              <div className="font-bold text-ink">
                Within {booking.balance_due_days} working days
              </div>
            </div>
          ) : null}

          {booking.advance_receipt_no ? (
            <div className="space-y-0.5">
              <span className="text-ink-subtle font-medium">
                Advance Receipt Ref:
              </span>
              <div className="font-bold text-ink font-mono">
                {booking.advance_receipt_no}{" "}
                {booking.advance_receipt_date
                  ? `(dtd ${formatDateIST(booking.advance_receipt_date)})`
                  : ""}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* 5. Payments Ledger Audit Trail */}
      <div className="rounded-2xl border border-line bg-card p-5 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 border-b border-line/40 pb-3">
          <CreditCard className="h-4.5 w-4.5 text-accent" />
          <h3 className="text-sm font-bold text-ink font-sans">
            Payments Ledger Audit Trail
          </h3>
        </div>

        {booking.payments && booking.payments.length > 0 ? (
          <div className="overflow-x-auto">
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
              <tbody className="divide-y divide-line/40">
                {booking.payments.map((p) => {
                  const isNegative =
                    p.type === "refund" || p.type === "cancellation_charge";
                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-inset/40 transition-colors"
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
          <div className="text-xs text-ink-subtle italic py-2 text-center">
            No payments logged in the ledger yet.
          </div>
        )}
      </div>

      {/* 6. Disabled "Proceed to Order Form" Placeholder Button */}
      <div className="pt-3 border-t border-line/60 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-ink-subtle font-medium">
          <Lock className="h-4 w-4 text-ink-subtle shrink-0" />
          <span>
            Order form &amp; accessories specification module coming next in BK-2.
          </span>
        </div>

        <button
          type="button"
          disabled
          className="w-full sm:w-auto h-11 px-6 rounded-xl bg-accent/40 text-inverse font-bold text-sm flex items-center justify-center gap-2 cursor-not-allowed opacity-60"
        >
          <span>Proceed to Order Form</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* 7. Hidden Print-Only Document */}
      <AdvanceAgreementPrint booking={booking} />
    </div>
  );
}
