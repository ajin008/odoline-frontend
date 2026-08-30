import { BookingCloseStage } from "@/src/features/booking/components/booking-close-stage";

export default async function OwnerBookingClosePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <BookingCloseStage
      bookingId={id}
      readOnly={true}
      basePath="/owner/booking"
    />
  );
}
