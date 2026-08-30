import { redirect } from "next/navigation";

export default async function StaffBookingIndexPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/staff/booking/${id}/agreement`);
}
