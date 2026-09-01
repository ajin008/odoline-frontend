import { OwnerLeadDetail } from "@/src/features/leads/components/owner-lead-detail";

export const metadata = {
  title: "Lead Details | Owner Terminal",
  description: "Read-only view of dealership customer lead, full timeline, interested vehicles, follow-up history, and stage audit log.",
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OwnerLeadDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <OwnerLeadDetail leadId={id} />;
}
