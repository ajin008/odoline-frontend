import { BookingList } from "@/src/features/booking/components/booking-list";

export default function StaffBookingPage() {
  return (
    <div className="w-full space-y-5 font-sans select-none">
      <div className="space-y-1 border-b border-line/60 pb-4">
        <h1 className="text-xl font-bold tracking-tight text-ink font-sans">
          Car Bookings &amp; Deliveries
        </h1>
        <p className="text-xs text-ink-muted">
          Track customer booking tokens, advance payments, and scheduled vehicle deliveries.
        </p>
      </div>

      <BookingList />
    </div>
  );
}
