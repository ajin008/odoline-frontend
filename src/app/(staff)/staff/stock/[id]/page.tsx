import { StaffCarDetail } from "@/src/features/cars/components/staff-car-detail";

export default async function StaffCarDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <StaffCarDetail carId={id} />;
}
