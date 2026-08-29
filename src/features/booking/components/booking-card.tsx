"use client";

import Link from "next/link";
import type { BookingListItem } from "../types/booking-types";
import { getBookingStatusConfig } from "../utils/booking-status-map";
import { Phone, Calendar, ChevronRight } from "lucide-react";

interface BookingCardProps {
  booking: BookingListItem;
  activeTab?: "active" | "closed";
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

/** Desktop Table Row View */
export function BookingCard({
  booking,
  basePath = "/staff/booking",
}: BookingCardProps) {
  const statusConfig = getBookingStatusConfig(booking.status);
  const isCancelled = booking.status === "cancelled";
  const detailHref = `${basePath}/${booking.id}`;

  const agreedNum = Number(booking.agreed_price || 0);
  const paidNum = Number(booking.amount_paid || 0);

  const pctPaid =
    agreedNum > 0
      ? Math.min(100, Math.max(0, Math.round((paidNum / agreedNum) * 100)))
      : 0;

  const dateLabel = isCancelled
    ? `Cancelled: ${formatDateIST(booking.cancelled_at)}`
    : formatDateIST(booking.prebooked_at);

  return (
    <tr
      className={`border-b border-line/40 transition-colors group cursor-pointer ${
        isCancelled ? "bg-rose-500/2 hover:bg-rose-500/5" : "hover:bg-inset/70"
      }`}
    >
      {/* Col 1: Booking Ref */}
      <td className="py-3.5 px-4 font-sans">
        <Link href={detailHref} className="block">
          <div className="font-mono text-xs font-bold text-accent group-hover:underline">
            {booking.booking_number}
          </div>
          <div className="text-[11px] text-ink-subtle flex items-center gap-1 font-medium mt-0.5">
            <Calendar className="h-3 w-3 shrink-0 text-ink-subtle" />
            <span>{dateLabel}</span>
          </div>
          {booking.rep?.name && (
            <div className="mt-1">
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-accent/10 text-accent border border-accent/20">
                By {booking.rep.name}
              </span>
            </div>
          )}
          {isCancelled && booking.cancel_reason && (
            <div className="text-[10px] text-rose-600/80 dark:text-rose-400/80 font-medium truncate max-w-[150px] mt-0.5">
              {booking.cancel_reason}
            </div>
          )}
        </Link>
      </td>

      {/* Col 2: Customer */}
      <td className="py-3.5 px-4 font-sans">
        <Link href={detailHref} className="block space-y-0.5">
          <div className="font-semibold text-xs text-ink group-hover:text-accent transition-colors">
            {booking.customer?.name || "Customer Unlinked"}
          </div>
          {booking.customer?.phone && (
            <div className="text-[11px] text-ink-muted font-mono flex items-center gap-1">
              <Phone className="h-3 w-3 shrink-0 text-ink-subtle" />
              <span>{booking.customer.phone}</span>
            </div>
          )}
        </Link>
      </td>

      {/* Col 3: Vehicle */}
      <td className="py-3.5 px-4 font-sans">
        <Link href={detailHref} className="block space-y-1">
          <div className="font-semibold text-xs text-ink truncate max-w-[210px]">
            {booking.car
              ? `${booking.car.year} ${booking.car.make} ${booking.car.model}`
              : "Vehicle Unlinked"}
          </div>
          {booking.car?.reg_number && (
            <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-inset text-ink-muted border border-line/60">
              {booking.car.reg_number}
            </span>
          )}
        </Link>
      </td>

      {/* Col 4: Financial Overview */}
      <td className="py-3.5 px-4 font-sans">
        <Link href={detailHref} className="block min-w-[210px]">
          {isCancelled ? (
            <div className="space-y-1 bg-rose-500/5 p-2 rounded-xl border border-rose-500/15">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-ink-subtle">
                  Advance:{" "}
                  <strong className="font-mono text-ink font-semibold">
                    {formatCurrency(
                      booking.advance_total || booking.amount_paid
                    )}
                  </strong>
                </span>
                <span className="text-ink-subtle">
                  Refunded:{" "}
                  <strong className="font-mono text-ink-muted font-semibold">
                    {formatCurrency(booking.refunded_total)}
                  </strong>
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-rose-500/15">
                <span className="font-bold text-rose-600 dark:text-rose-400">
                  Retained Charge:
                </span>
                <strong className="font-mono font-bold text-rose-600 dark:text-rose-400 text-xs">
                  {formatCurrency(booking.amount_retained)}
                </strong>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-ink">
                  {formatCurrency(booking.agreed_price)}
                </span>
                <span className="text-[11px] font-sans">
                  <strong className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
                    {formatCurrency(booking.amount_paid)}
                  </strong>{" "}
                  <span className="text-ink-subtle">paid</span>
                </span>
              </div>

              {/* Payment Progress Bar */}
              <div className="h-1.5 w-full bg-inset rounded-full overflow-hidden border border-line/40">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${pctPaid}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-ink-subtle font-sans">
                <span>
                  Balance:{" "}
                  <strong className="font-mono text-amber-600 dark:text-amber-400 font-semibold">
                    {formatCurrency(booking.balance_due)}
                  </strong>
                </span>
                <span className="text-[10px] font-medium text-ink-muted">
                  {pctPaid}% collected
                </span>
              </div>
            </div>
          )}
        </Link>
      </td>

      {/* Col 5: Status */}
      <td className="py-3.5 px-4 font-sans">
        <Link href={detailHref} className="block">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border whitespace-nowrap ${statusConfig.badgeColor}`}
          >
            {statusConfig.label}
          </span>
        </Link>
      </td>

      {/* Col 6: Action Chevron */}
      <td className="py-3.5 px-4 text-right font-sans">
        <Link
          href={detailHref}
          className="inline-flex items-center justify-end"
        >
          <ChevronRight className="h-4 w-4 text-ink-subtle group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
        </Link>
      </td>
    </tr>
  );
}

/** Mobile Card View */
export function MobileBookingCard({
  booking,
  basePath = "/staff/booking",
}: BookingCardProps) {
  const statusConfig = getBookingStatusConfig(booking.status);
  const isCancelled = booking.status === "cancelled";
  const detailHref = `${basePath}/${booking.id}`;

  const agreedNum = Number(booking.agreed_price || 0);
  const paidNum = Number(booking.amount_paid || 0);

  const pctPaid =
    agreedNum > 0
      ? Math.min(100, Math.max(0, Math.round((paidNum / agreedNum) * 100)))
      : 0;

  const dateLabel = isCancelled
    ? `Cancelled: ${formatDateIST(booking.cancelled_at)}`
    : formatDateIST(booking.prebooked_at);

  return (
    <Link
      href={detailHref}
      className={`block rounded-2xl border p-4 space-y-3 shadow-xs transition-colors select-none font-sans group ${
        isCancelled
          ? "border-rose-500/25 bg-rose-500/[0.02] dark:bg-rose-500/[0.03] hover:border-rose-500/40"
          : "border-line bg-card hover:border-accent/40"
      }`}
    >
      {/* Top Header: Ref + Status + Date */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-xs font-bold text-accent group-hover:underline">
            {booking.booking_number}
          </span>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusConfig.badgeColor}`}
          >
            {statusConfig.label}
          </span>
          {booking.rep?.name && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-accent/10 text-accent border border-accent/20">
              By {booking.rep.name}
            </span>
          )}
        </div>
        <span className="text-[11px] text-ink-subtle flex items-center gap-1 font-medium">
          <Calendar className="h-3 w-3" />
          <span>{dateLabel}</span>
        </span>
      </div>

      {/* Cancel Reason Line on Mobile */}
      {isCancelled && booking.cancel_reason && (
        <div className="text-[11px] text-rose-600 dark:text-rose-400 font-medium px-2.5 py-1 bg-rose-500/10 rounded-lg border border-rose-500/15">
          Reason: {booking.cancel_reason}
        </div>
      )}

      {/* Customer & Vehicle Info Grid */}
      <div className="grid grid-cols-2 gap-3 text-xs bg-inset/50 p-2.5 rounded-xl border border-line/40">
        <div className="space-y-0.5 min-w-0">
          <div className="text-[10px] uppercase font-bold text-ink-subtle">
            Customer
          </div>
          <div className="font-semibold text-ink truncate">
            {booking.customer?.name || "Customer Unlinked"}
          </div>
          {booking.customer?.phone && (
            <div className="text-[11px] font-mono text-ink-muted flex items-center gap-1">
              <Phone className="h-3 w-3 shrink-0 text-ink-subtle" />
              <span className="truncate">{booking.customer.phone}</span>
            </div>
          )}
        </div>

        <div className="space-y-0.5 min-w-0">
          <div className="text-[10px] uppercase font-bold text-ink-subtle">
            Booked Vehicle
          </div>
          <div className="font-semibold text-ink truncate">
            {booking.car
              ? `${booking.car.year} ${booking.car.make} ${booking.car.model}`
              : "Vehicle Unlinked"}
          </div>
          {booking.car?.reg_number && (
            <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-mono font-bold uppercase bg-card text-ink-muted border border-line/60">
              {booking.car.reg_number}
            </span>
          )}
        </div>
      </div>

      {/* Financial Overview Box */}
      {isCancelled ? (
        <div className="p-3 rounded-xl bg-inset/70 border border-line/40 font-sans">
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="space-y-0.5">
              <div className="text-[10px] text-ink-subtle uppercase font-bold">
                Advance
              </div>
              <div className="font-mono font-semibold text-ink text-xs">
                {formatCurrency(booking.advance_total || booking.amount_paid)}
              </div>
            </div>
            <div className="space-y-0.5">
              <div className="text-[10px] text-rose-600 dark:text-rose-400 uppercase font-bold">
                Retained
              </div>
              <div className="font-mono font-bold text-rose-600 dark:text-rose-400 text-xs">
                {formatCurrency(booking.amount_retained)}
              </div>
            </div>
            <div className="space-y-0.5">
              <div className="text-[10px] text-ink-subtle uppercase font-bold">
                Refunded
              </div>
              <div className="font-mono font-semibold text-ink-muted text-xs">
                {formatCurrency(booking.refunded_total)}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-ink">
              {formatCurrency(booking.agreed_price)}
            </span>
            <span className="text-[11px] font-sans">
              <strong className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
                {formatCurrency(booking.amount_paid)}
              </strong>{" "}
              <span className="text-ink-subtle">paid</span>
            </span>
          </div>

          <div className="h-1.5 w-full bg-inset rounded-full overflow-hidden border border-line/40">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${pctPaid}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-ink-subtle font-sans">
            <span>
              Balance:{" "}
              <strong className="font-mono text-amber-600 dark:text-amber-400 font-semibold">
                {formatCurrency(booking.balance_due)}
              </strong>
            </span>
            <span className="text-[10px] font-medium text-ink-muted">
              {pctPaid}% collected
            </span>
          </div>
        </div>
      )}
    </Link>
  );
}
