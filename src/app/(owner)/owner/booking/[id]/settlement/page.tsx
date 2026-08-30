import { BookingSettlementStage } from "@/src/features/booking/components/booking-settlement-stage";

export default async function OwnerBookingSettlementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <BookingSettlementStage
      bookingId={id}
      readOnly={true}
      basePath="/owner/booking"
    />
  );
}
