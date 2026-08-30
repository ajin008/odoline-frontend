import { BookingCloseStage } from "@/src/features/booking/components/booking-close-stage";

export default async function StaffBookingClosePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <BookingCloseStage
      bookingId={id}
      readOnly={false}
      basePath="/staff/booking"
    />
  );
}
