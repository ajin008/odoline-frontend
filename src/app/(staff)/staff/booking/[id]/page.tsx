import { BookingDetail } from "@/src/features/booking/components/booking-detail";

export default async function StaffBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <BookingDetail bookingId={id} />;
}
