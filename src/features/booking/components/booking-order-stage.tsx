"use client";

import { useBooking } from "../hooks/use-booking";
import { BookingOrderSection } from "./booking-order-section";
import { AlertTriangle } from "lucide-react";

interface BookingOrderStageProps {
  bookingId: string;
  readOnly?: boolean;
}

export function BookingOrderStage({
  bookingId,
  readOnly = false,
}: BookingOrderStageProps) {
  const { data: booking, isLoading, isError } = useBooking(bookingId);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-line bg-card p-5 space-y-4 shadow-xs select-none font-sans">
        <div className="h-5 w-40 animate-pulse rounded-lg bg-inset border border-line" />
        <div className="h-20 animate-pulse rounded-xl bg-inset border border-line" />
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="rounded-2xl border border-dashed border-rose-500/30 bg-rose-500/5 p-6 text-center space-y-2 font-sans">
        <AlertTriangle className="h-5 w-5 text-rose-500 mx-auto" />
        <p className="text-xs font-semibold text-ink">Failed to load booking status.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <BookingOrderSection
        bookingId={booking.id}
        bookingStatus={booking.status}
        readOnly={readOnly}
      />
    </div>
  );
}
