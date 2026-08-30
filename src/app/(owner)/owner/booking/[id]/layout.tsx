import { BookingDetailLayout } from "@/src/features/booking/components/booking-detail-layout";

export default async function OwnerBookingLayoutPage({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <BookingDetailLayout bookingId={id} readOnly={true} basePath="/owner/booking">
      {children}
    </BookingDetailLayout>
  );
}
