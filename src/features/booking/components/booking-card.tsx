"use client";

import Link from "next/link";
import type { BookingListItem } from "../types/booking-types";
import { getBookingStatusConfig } from "../utils/booking-status-map";
import {
  User,
  Phone,
  Car as CarIcon,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Hash,
} from "lucide-react";

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

export function BookingCard({ booking, activeTab = "active" }: BookingCardProps) {
  const statusConfig = getBookingStatusConfig(booking.status);
  const balanceDueNum = Number(booking.balance_due);
  const isFullyPaid = balanceDueNum <= 0;

  const dateLabel =
    activeTab === "closed" && booking.cancelled_at
      ? `Cancelled: ${formatDateIST(booking.cancelled_at)}`
      : `Prebooked: ${formatDateIST(booking.prebooked_at)}`;

  return (
    <Link
      href={`/staff/booking/${booking.id}`}
      className="block flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 transition-colors hover:bg-inset/60 cursor-pointer select-none font-sans group"
    >
      {/* Column 1: Booking # + Status + Date */}
      <div className="flex items-center gap-3 min-w-[200px]">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 text-accent group-hover:bg-accent group-hover:text-inverse transition-colors font-mono font-bold text-xs shrink-0">
          <Hash className="h-4 w-4" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-ink group-hover:text-accent transition-colors">
              {booking.booking_number}
            </span>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusConfig.badgeColor}`}
            >
              {statusConfig.label}
            </span>
          </div>
          <div className="text-[11px] text-ink-subtle flex items-center gap-1 font-medium">
            <Calendar className="h-3 w-3 shrink-0" />
            <span>{dateLabel}</span>
          </div>
        </div>
      </div>

      {/* Column 2: Customer Info */}
      <div className="min-w-[170px] space-y-0.5">
        <div className="flex items-center gap-1.5 font-bold text-xs text-ink truncate">
          <User className="h-3.5 w-3.5 text-accent shrink-0" />
          <span className="truncate">
            {booking.customer?.name || "Customer Unlinked"}
          </span>
        </div>
        {booking.customer?.phone && (
          <div className="flex items-center gap-1.5 text-[11px] text-ink-muted pl-5 font-mono">
            <Phone className="h-3 w-3 shrink-0 text-ink-subtle" />
            <span>{booking.customer.phone}</span>
          </div>
        )}
      </div>

      {/* Column 3: Vehicle Info */}
      <div className="min-w-[190px] space-y-0.5">
        <div className="flex items-center gap-1.5 font-bold text-xs text-ink truncate">
          <CarIcon className="h-3.5 w-3.5 text-accent shrink-0" />
          <span className="truncate">
            {booking.car
              ? `${booking.car.year} ${booking.car.make} ${booking.car.model}`
              : "Vehicle Unlinked"}
          </span>
        </div>
        {booking.car?.reg_number && (
          <div className="pl-5 font-mono text-[11px] font-semibold text-ink-muted uppercase">
            {booking.car.reg_number}
          </div>
        )}
      </div>

      {/* Column 4: Financial breakdown & Payment Status Pill */}
      <div className="flex items-center gap-4 min-w-[280px] justify-between lg:justify-end">
        <div className="flex items-center gap-3 text-right">
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-ink-subtle">
              Agreed
            </div>
            <div className="text-xs font-bold font-mono text-ink">
              {formatCurrency(booking.agreed_price)}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400">
              Paid
            </div>
            <div className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {formatCurrency(booking.amount_paid)}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-amber-600 dark:text-amber-400">
              Balance
            </div>
            <div className="text-xs font-bold font-mono text-amber-600 dark:text-amber-400">
              {formatCurrency(booking.balance_due)}
            </div>
          </div>
        </div>

        <div>
          {isFullyPaid ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
              <CheckCircle2 className="h-3 w-3 shrink-0" />
              <span>Fully paid</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 whitespace-nowrap">
              <AlertCircle className="h-3 w-3 shrink-0" />
              <span>Balance pending</span>
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
