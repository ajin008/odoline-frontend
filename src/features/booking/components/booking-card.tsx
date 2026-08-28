"use client";

import Link from "next/link";
import type { BookingListItem } from "../types/booking-types";
import { getBookingStatusConfig } from "../utils/booking-status-map";
import { Phone, Calendar, ChevronRight } from "lucide-react";

interface BookingCardProps {
  booking: BookingListItem;
  activeTab?: "active" | "closed";
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
  activeTab = "active",
}: BookingCardProps) {
  const statusConfig = getBookingStatusConfig(booking.status);
  const agreedNum = Number(booking.agreed_price || 0);
  const paidNum = Number(booking.amount_paid || 0);

  const pctPaid =
    agreedNum > 0
      ? Math.min(100, Math.max(0, Math.round((paidNum / agreedNum) * 100)))
      : 0;

  const dateLabel =
    activeTab === "closed" && booking.cancelled_at
      ? `Cancelled: ${formatDateIST(booking.cancelled_at)}`
      : formatDateIST(booking.prebooked_at);

  return (
    <tr className="border-b border-line/40 hover:bg-inset/70 transition-colors group cursor-pointer">
      {/* Col 1: Booking Ref */}
      <td className="py-3.5 px-4 font-sans">
        <Link href={`/staff/booking/${booking.id}`} className="block">
          <div className="font-mono text-xs font-bold text-accent group-hover:underline">
            {booking.booking_number}
          </div>
          <div className="text-[11px] text-ink-subtle flex items-center gap-1 font-medium mt-0.5">
            <Calendar className="h-3 w-3 shrink-0 text-ink-subtle" />
            <span>{dateLabel}</span>
          </div>
        </Link>
      </td>

      {/* Col 2: Customer */}
      <td className="py-3.5 px-4 font-sans">
        <Link href={`/staff/booking/${booking.id}`} className="block space-y-0.5">
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
        <Link href={`/staff/booking/${booking.id}`} className="block space-y-1">
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
        <Link href={`/staff/booking/${booking.id}`} className="block space-y-1.5 min-w-[210px]">
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
        </Link>
      </td>

      {/* Col 5: Status */}
      <td className="py-3.5 px-4 font-sans">
        <Link href={`/staff/booking/${booking.id}`} className="block">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border whitespace-nowrap ${statusConfig.badgeColor}`}
          >
            {statusConfig.label}
          </span>
        </Link>
      </td>

      {/* Col 6: Action Chevron */}
      <td className="py-3.5 px-4 text-right font-sans">
        <Link href={`/staff/booking/${booking.id}`} className="inline-flex items-center justify-end">
          <ChevronRight className="h-4 w-4 text-ink-subtle group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
        </Link>
      </td>
    </tr>
  );
}

/** Mobile Card View */
export function MobileBookingCard({
  booking,
  activeTab = "active",
}: BookingCardProps) {
  const statusConfig = getBookingStatusConfig(booking.status);
  const agreedNum = Number(booking.agreed_price || 0);
  const paidNum = Number(booking.amount_paid || 0);

  const pctPaid =
    agreedNum > 0
      ? Math.min(100, Math.max(0, Math.round((paidNum / agreedNum) * 100)))
      : 0;

  const dateLabel =
    activeTab === "closed" && booking.cancelled_at
      ? `Cancelled: ${formatDateIST(booking.cancelled_at)}`
      : formatDateIST(booking.prebooked_at);

  return (
    <Link
      href={`/staff/booking/${booking.id}`}
      className="block rounded-2xl border border-line bg-card p-4 space-y-3 shadow-xs hover:border-accent/40 transition-colors select-none font-sans group"
    >
      {/* Top Header: Ref + Status + Date */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-accent group-hover:underline">
            {booking.booking_number}
          </span>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusConfig.badgeColor}`}
          >
            {statusConfig.label}
          </span>
        </div>
        <span className="text-[11px] text-ink-subtle flex items-center gap-1 font-medium">
          <Calendar className="h-3 w-3" />
          <span>{dateLabel}</span>
        </span>
      </div>

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

      {/* Financial Overview Progress Box */}
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
    </Link>
  );
}
