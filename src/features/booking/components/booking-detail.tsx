"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { useBooking } from "../hooks/use-booking";
import { useBookingOrder } from "../hooks/use-booking-order";
import { bookingApi } from "../api/booking-api";
import {
  getBookingStatusConfig,
  getRcTransferBadgeConfig,
  getBalanceOverdueBadgeConfig,
} from "../utils/booking-status-map";
import { BookingProgressBar } from "./booking-progress-bar";
import { CancelBookingModal } from "./cancel-booking-modal";
import { BookingOrderSection } from "./booking-order-section";
import {
  ArrowLeft,
  User,
  Car as CarIcon,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Building2,
  CreditCard,
  AlertTriangle,
  Printer,
  Download,
  Share2,
  ChevronRight,
  Receipt,
  Clock,
  ExternalLink,
  XCircle,
} from "lucide-react";

interface BookingDetailProps {
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

function getInitials(name: string | null | undefined): string {
  if (!name) return "CU";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
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

export function BookingDetail({
  bookingId,
  readOnly = false,
  basePath = "/staff/booking",
}: BookingDetailProps) {
  const { data: booking, isLoading, isError } = useBooking(bookingId);
  const { data: order } = useBookingOrder(bookingId);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

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
            // ignore parse error on Blob
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
      <div className="w-full space-y-5 font-sans select-none">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 animate-pulse rounded-xl bg-inset border border-line" />
          <div className="h-6 w-48 animate-pulse rounded-lg bg-inset border border-line" />
        </div>
        <div className="h-24 animate-pulse rounded-2xl bg-inset border border-line" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-8 space-y-5">
            <div className="h-48 animate-pulse rounded-2xl bg-inset border border-line" />
            <div className="h-48 animate-pulse rounded-2xl bg-inset border border-line" />
          </div>
          <div className="lg:col-span-4 space-y-4">
            <div className="h-36 animate-pulse rounded-2xl bg-inset border border-line" />
            <div className="h-36 animate-pulse rounded-2xl bg-inset border border-line" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="w-full space-y-5 font-sans select-none">
        <div className="flex items-center gap-3">
          <Link
            href={basePath}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-card border border-line text-ink hover:bg-inset transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <span className="text-sm font-bold text-ink">Back to Bookings</span>
        </div>

        <div className="rounded-2xl border border-dashed border-rose-500/30 bg-rose-500/5 p-8 text-center space-y-3">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-ink font-sans">
              Booking Not Found or Access Denied
            </h3>
            <p className="text-xs text-ink-subtle max-w-sm mx-auto">
              This booking record does not exist or is not accessible.
            </p>
          </div>
          <Link
            href={basePath}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-inverse text-xs font-bold transition-opacity hover:opacity-95"
          >
            Return to Booking List
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = getBookingStatusConfig(booking.status);
  const agreedNum = Number(booking.agreed_price || 0);
  const paidNum = Number(booking.amount_paid || 0);
  const balanceDueNum = Number(booking.balance_due || 0);
  const isFullyPaid = balanceDueNum <= 0;

  const pctPaid =
    agreedNum > 0
      ? Math.min(100, Math.max(0, Math.round((paidNum / agreedNum) * 100)))
      : 0;

  const leadHref = readOnly
    ? `/owner/sales`
    : booking.lead?.id
    ? `/staff/leads/${booking.lead.id}`
    : null;

  const carHref = readOnly
    ? booking.car?.id
      ? `/owner/cars/${booking.car.id}/intake`
      : `/owner/inventory`
    : booking.car?.id
    ? `/staff/stock/${booking.car.id}`
    : null;

  return (
    <div className="w-full space-y-5 font-sans select-none pb-28 md:pb-12">
      {/* 1. Header Toolbar & Breadcrumb */}
      <div className="space-y-3 border-b border-line/60 pb-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-medium text-ink-subtle">
          <Link
            href={basePath}
            className="hover:text-ink transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Bookings</span>
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-line" />
          <span className="font-mono text-ink font-bold">
            {booking.booking_number}
          </span>
        </div>

        {/* Title & Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight text-ink font-mono">
                {booking.booking_number}
              </h1>
              <span
                className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold border ${statusConfig.badgeColor}`}
              >
                {statusConfig.label}
              </span>
              {booking.status === "delivered" && (
                <span
                  className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold border ${
                    getRcTransferBadgeConfig(booking.car?.delivered_at, booking.updated_at).badgeColor
                  }`}
                >
                  {getRcTransferBadgeConfig(booking.car?.delivered_at, booking.updated_at).label}
                </span>
              )}
              {getBalanceOverdueBadgeConfig(
                booking.status,
                booking.prebooked_at,
                booking.balance_due_days,
                booking.balance_due
              ) && (
                <span
                  className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold border ${
                    getBalanceOverdueBadgeConfig(
                      booking.status,
                      booking.prebooked_at,
                      booking.balance_due_days,
                      booking.balance_due
                    )!.badgeColor
                  }`}
                >
                  {
                    getBalanceOverdueBadgeConfig(
                      booking.status,
                      booking.prebooked_at,
                      booking.balance_due_days,
                      booking.balance_due
                    )!.label
                  }
                </span>
              )}
              {isFullyPaid ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  <span>Fully Paid</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>Balance Pending</span>
                </span>
              )}
            </div>

            <div className="text-xs text-ink-subtle flex items-center gap-2 flex-wrap font-medium">
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-ink-subtle" />
                <span>
                  Prebooking Agreement executed on{" "}
                  {formatDateIST(booking.prebooked_at)}
                </span>
              </div>
              {booking.rep?.name && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1 font-semibold text-ink">
                    <User className="h-3.5 w-3.5 text-accent" />
                    <span>Booked by {booking.rep.name}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="grid grid-cols-3 sm:flex items-center gap-2 w-full sm:w-auto">
            {booking.status === "prebooked" && !readOnly && (
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(true)}
                className="col-span-3 sm:col-span-1 inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                title="Cancel Booking"
              >
                <XCircle className="h-4 w-4" />
                <span>Cancel Booking</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-card border border-line text-xs font-semibold text-ink hover:bg-inset transition-colors cursor-pointer shadow-xs"
              title="Share Agreement Summary"
            >
              <Share2 className="h-4 w-4 text-ink-subtle" />
              <span>Share</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadAgreement}
              disabled={isDownloading}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-card border border-line text-xs font-semibold text-ink hover:bg-inset transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              title="Direct Download Advance Agreement PDF"
            >
              <Download className="h-4 w-4 text-ink-subtle" />
              <span>{isDownloading ? "Downloading..." : "Download"}</span>
            </button>

            <button
              type="button"
              onClick={handleViewAgreement}
              disabled={isPdfLoading}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-accent text-inverse text-xs font-bold transition-opacity hover:opacity-95 cursor-pointer shadow-xs disabled:opacity-50"
              title="View or Print Advance Agreement PDF"
            >
              <Printer className="h-4 w-4" />
              <span>{isPdfLoading ? "Opening..." : "View / Print"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Lifecycle Progress Pipeline */}
      <BookingProgressBar
        status={booking.status}
        cancelReason={booking.cancel_reason}
        hasOrderForm={Boolean(order)}
      />

      {/* 3. Master 2-Column Bento Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ================= LEFT / MAIN COLUMN (8 cols) ================= */}
        <div className="lg:col-span-8 space-y-5">
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
        </div>

        {/* ================= RIGHT / SIDEBAR COLUMN (4 cols) ================= */}
        <div className="lg:col-span-4 space-y-4">
          {/* Sidebar 1: Buyer Profile Bento Card */}
          <div className="rounded-2xl border border-line bg-card p-4 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-line/40 pb-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-accent" />
                <h3 className="text-xs font-bold text-ink uppercase tracking-wider">
                  Buyer Profile
                </h3>
              </div>
              {leadHref && (
                <Link
                  href={leadHref}
                  className="text-[11px] font-semibold text-accent hover:underline flex items-center gap-1"
                >
                  <span>View Lead</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              )}
            </div>

            {leadHref ? (
              <Link
                href={leadHref}
                className="flex items-start gap-3 p-2 -mx-2 rounded-xl hover:bg-inset transition-colors group cursor-pointer"
              >
                {/* Initials Avatar */}
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 text-accent font-bold text-sm shrink-0 group-hover:bg-accent group-hover:text-inverse transition-colors">
                  {getInitials(booking.customer?.name)}
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="font-bold text-ink text-sm truncate group-hover:text-accent transition-colors flex items-center gap-1.5">
                    <span>{booking.customer?.name || "Customer Unlinked"}</span>
                    <ChevronRight className="h-3.5 w-3.5 text-ink-subtle opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  {booking.customer?.phone && (
                    <div className="font-mono text-xs font-semibold text-ink-muted">
                      {booking.customer.phone}
                    </div>
                  )}
                </div>
              </Link>
            ) : (
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 text-accent font-bold text-sm shrink-0">
                  {getInitials(booking.customer?.name)}
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="font-bold text-ink text-sm truncate">
                    {booking.customer?.name || "Customer Unlinked"}
                  </div>
                  {booking.customer?.phone && (
                    <div className="font-mono text-xs font-semibold text-ink-muted">
                      {booking.customer.phone}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick Action Links */}
            {booking.customer?.phone && (
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-line/40">
                <a
                  href={`tel:${booking.customer.phone}`}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-inset border border-line/60 text-xs font-semibold text-ink hover:bg-card hover:border-accent transition-all"
                >
                  <Image
                    src="/icons/phonecall-icon.png"
                    alt="Call"
                    width={16}
                    height={16}
                    className="h-4 w-4 shrink-0 object-contain"
                  />
                  <span>Call Buyer</span>
                </a>
                <a
                  href={`https://wa.me/91${booking.customer.phone.replace(
                    /[^0-9]/g,
                    ""
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-all"
                >
                  <Image
                    src="/icons/whatsappIcon.png"
                    alt="WhatsApp"
                    width={16}
                    height={16}
                    className="h-4 w-4 shrink-0 object-contain"
                  />
                  <span>WhatsApp</span>
                </a>
              </div>
            )}
          </div>

          {/* Sidebar 2: Booked Vehicle Bento Card */}
          <div className="rounded-2xl border border-line bg-card p-4 space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between border-b border-line/40 pb-3">
              <div className="flex items-center gap-2">
                <CarIcon className="h-4 w-4 text-accent" />
                <h3 className="text-xs font-bold text-ink uppercase tracking-wider">
                  Booked Vehicle
                </h3>
              </div>
              {carHref && (
                <Link
                  href={carHref}
                  className="text-[11px] font-semibold text-accent hover:underline flex items-center gap-1"
                >
                  <span>View Car</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              )}
            </div>

            {carHref ? (
              <Link
                href={carHref}
                className="block space-y-2 text-xs p-2 -mx-2 rounded-xl hover:bg-inset transition-colors group cursor-pointer"
              >
                <div className="font-bold text-ink text-sm leading-snug group-hover:text-accent transition-colors flex items-center justify-between gap-1">
                  <span>
                    {`${booking.car?.year || ""} ${booking.car?.make || ""} ${
                      booking.car?.model || "Vehicle"
                    }`}
                  </span>
                  <ChevronRight className="h-4 w-4 text-ink-subtle opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>

                {booking.car?.reg_number && (
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded text-[11px] font-mono font-bold uppercase bg-inset text-ink-muted border border-line/60">
                      {booking.car.reg_number}
                    </span>
                  </div>
                )}

                {booking.car?.selling_price && (
                  <div className="bg-inset/50 p-2.5 rounded-xl border border-line/40 flex items-center justify-between text-xs">
                    <span className="text-ink-subtle">Asking Stock Price:</span>
                    <span className="font-mono font-bold text-ink">
                      {formatCurrency(booking.car.selling_price)}
                    </span>
                  </div>
                )}
              </Link>
            ) : (
              <div className="space-y-2 text-xs">
                <div className="font-bold text-ink text-sm leading-snug">
                  {booking.car
                    ? `${booking.car.year} ${booking.car.make} ${booking.car.model}`
                    : "Vehicle Unlinked"}
                </div>

                {booking.car?.reg_number && (
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded text-[11px] font-mono font-bold uppercase bg-inset text-ink-muted border border-line/60">
                      {booking.car.reg_number}
                    </span>
                  </div>
                )}

                {booking.car?.selling_price && (
                  <div className="bg-inset/50 p-2.5 rounded-xl border border-line/40 flex items-center justify-between text-xs">
                    <span className="text-ink-subtle">Asking Stock Price:</span>
                    <span className="font-mono font-bold text-ink">
                      {formatCurrency(booking.car.selling_price)}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar 3: Showroom Seller Bento Card */}
          <div className="rounded-2xl border border-line bg-card p-4 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 border-b border-line/40 pb-3">
              <Building2 className="h-4 w-4 text-accent" />
              <h3 className="text-xs font-bold text-ink uppercase tracking-wider">
                Showroom (Seller)
              </h3>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="font-bold text-ink text-sm">
                {booking.seller?.name || "Cars4 Showroom"}
              </div>
              {booking.seller?.address && (
                <div className="text-ink-muted text-[11px] leading-relaxed">
                  {booking.seller.address}
                </div>
              )}
              {booking.seller?.phone && (
                <div className="font-mono text-ink-subtle text-[11px] pt-1 border-t border-line/30">
                  Contact:{" "}
                  <span className="font-semibold text-ink">
                    {booking.seller.phone}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stage 2 Vehicle Order Form Section */}
      <BookingOrderSection
        bookingId={booking.id}
        bookingStatus={booking.status}
        readOnly={readOnly}
      />

      {/* Cancel Booking Modal */}
      {booking.status === "prebooked" && !readOnly && (
        <CancelBookingModal
          isOpen={isCancelModalOpen}
          onClose={() => setIsCancelModalOpen(false)}
          bookingId={booking.id}
          bookingNumber={booking.booking_number}
          amountPaid={booking.amount_paid}
        />
      )}
    </div>
  );
}
