import { BookingAgreementStage } from "@/src/features/booking/components/booking-agreement-stage";

export default async function StaffBookingAgreementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <BookingAgreementStage
      bookingId={id}
      readOnly={false}
      basePath="/staff/booking"
    />
  );
}
