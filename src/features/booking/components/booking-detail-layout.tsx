"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { useBooking } from "../hooks/use-booking";
import { useBookingOrder } from "../hooks/use-booking-order";
import {
  getBookingStatusConfig,
  getRcTransferBadgeConfig,
  getBalanceOverdueBadgeConfig,
} from "../utils/booking-status-map";
import { Badge } from "@/src/components/ui/badge";
import { BookingProgressBar } from "./booking-progress-bar";
import { CancelBookingModal } from "./cancel-booking-modal";
import {
  ArrowLeft,
  User,
  Car as CarIcon,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Building2,
  ExternalLink,
  ChevronRight,
  XCircle,
  AlertTriangle,
} from "lucide-react";

interface BookingDetailLayoutProps {
  bookingId: string;
  readOnly?: boolean;
  basePath?: string;
  children: React.ReactNode;
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

export function BookingDetailLayout({
  bookingId,
  readOnly = false,
  basePath = "/staff/booking",
  children,
}: BookingDetailLayoutProps) {
  const pathname = usePathname();
  const { data: booking, isLoading, isError } = useBooking(bookingId);
  const { data: order } = useBookingOrder(bookingId);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

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
  const balanceDueNum = Number(booking.balance_due || 0);
  const isFullyPaid = balanceDueNum <= 0;

  const leadHref = readOnly
    ? `/owner/crm`
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

  // Determine current stage name for breadcrumbs
  let currentStageName = "Agreement";
  if (pathname?.endsWith("/order") || pathname?.includes("/order/")) {
    currentStageName = "Order Form";
  } else if (
    pathname?.endsWith("/settlement") ||
    pathname?.includes("/settlement/") ||
    pathname?.endsWith("/delivery") ||
    pathname?.includes("/delivery/")
  ) {
    currentStageName = "Settlement & Delivery";
  } else if (pathname?.endsWith("/close") || pathname?.includes("/close/")) {
    currentStageName = "Close (RC Transfer)";
  }

  return (
    <div className="w-full space-y-5 font-sans select-none">
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
          <ChevronRight className="h-3.5 w-3.5 text-line" />
          <span className="text-accent font-semibold">{currentStageName}</span>
        </div>

        {/* Title & Actions Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-ink font-mono">
                {booking.booking_number}
              </h1>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-extrabold ${statusConfig.badgeColor}`}
              >
                {statusConfig.label}
              </span>
              {booking.status === "delivered" && (
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-extrabold ${
                    getRcTransferBadgeConfig(
                      booking.car?.delivered_at,
                      booking.updated_at
                    ).badgeColor
                  }`}
                >
                  {
                    getRcTransferBadgeConfig(
                      booking.car?.delivered_at,
                      booking.updated_at
                    ).label
                  }
                </span>
              )}
              {getBalanceOverdueBadgeConfig(
                booking.status,
                booking.prebooked_at,
                booking.balance_due_days,
                booking.balance_due
              ) && (
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-extrabold ${
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
            </div>

            {/* Header Action Button (Cancel booking - right aligned) */}
            {booking.status === "prebooked" && !readOnly && (
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 text-xs font-semibold transition-colors cursor-pointer shadow-xs shrink-0 ml-auto"
                title="Cancel Booking"
              >
                <XCircle className="h-4 w-4" />
                <span>Cancel Booking</span>
              </button>
            )}
          </div>

          {booking.status !== "cancelled" && (
            <div className="flex items-center gap-2 flex-wrap">
              {isFullyPaid ? (
                <Badge variant="success" className="px-3 py-1 text-xs font-extrabold">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  <span>Fully Paid</span>
                </Badge>
              ) : (
                <Badge variant="warning" className="px-3 py-1 text-xs font-extrabold">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>Balance Pending</span>
                </Badge>
              )}
            </div>
          )}

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
      </div>

      {/* 2. Lifecycle Progress Pipeline Navigation Bar */}
      <BookingProgressBar
        status={booking.status}
        cancelReason={booking.cancel_reason}
        hasOrderForm={Boolean(order)}
        bookingId={booking.id}
        basePath={basePath}
      />

      {/* 3. Master 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ================= LEFT / STAGE CONTENT COLUMN (8 cols) ================= */}
        <div className="lg:col-span-8 space-y-5">{children}</div>

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
