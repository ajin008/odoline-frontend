import { LeadDetail } from "@/src/features/leads/components/lead-detail";

export default async function StaffLeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <LeadDetail leadId={id} />;
}
