import { redirect } from "next/navigation";

export const metadata = {
  title: "Booking Detail | Owner Terminal",
  description:
    "Read-only view of vehicle booking agreement terms, payments ledger, rep attribution, and delivery progress.",
};

export default async function OwnerBookingIndexPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/owner/booking/${id}/agreement`);
}
