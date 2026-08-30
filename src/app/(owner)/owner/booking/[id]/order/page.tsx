import { BookingOrderStage } from "@/src/features/booking/components/booking-order-stage";

export default async function OwnerBookingOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <BookingOrderStage bookingId={id} readOnly={true} />;
}
