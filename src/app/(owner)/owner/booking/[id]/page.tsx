import { BookingDetail } from "@/src/features/booking/components/booking-detail";

export const metadata = {
  title: "Booking Detail | Owner Terminal",
  description: "Read-only view of vehicle booking agreement terms, payments ledger, rep attribution, and delivery progress.",
};

export default async function OwnerBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <BookingDetail bookingId={id} readOnly basePath="/owner/booking" />;
}
