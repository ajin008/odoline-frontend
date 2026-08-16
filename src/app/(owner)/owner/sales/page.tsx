import { SalesShell } from "@/src/features/leads/components/sales-shell";

export const metadata = {
  title: "Sales & CRM Pipeline | Owner Terminal",
  description: "Track dealership-wide lead conversion metrics, sales stage breakdown, and unassigned lead queues.",
};

export default function SalesPage() {
  return <SalesShell />;
}
