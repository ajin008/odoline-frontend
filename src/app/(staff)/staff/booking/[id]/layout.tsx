import { BookingDetailLayout } from "@/src/features/booking/components/booking-detail-layout";

export default async function StaffBookingLayoutPage({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <BookingDetailLayout bookingId={id} basePath="/staff/booking">
      {children}
    </BookingDetailLayout>
  );
}
