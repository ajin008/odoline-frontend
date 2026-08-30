import { BookingAgreementStage } from "@/src/features/booking/components/booking-agreement-stage";

export default async function OwnerBookingAgreementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <BookingAgreementStage
      bookingId={id}
      readOnly={true}
      basePath="/owner/booking"
    />
  );
}
