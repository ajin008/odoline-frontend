import { BookingSettlementStage } from "@/src/features/booking/components/booking-settlement-stage";

export default async function StaffBookingSettlementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <BookingSettlementStage
      bookingId={id}
      readOnly={false}
      basePath="/staff/booking"
    />
  );
}
