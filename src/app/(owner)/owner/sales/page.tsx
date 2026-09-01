import { OwnerSalesShell } from "@/src/features/sales/components/owner-sales-shell";

export const metadata = {
  title: "Sales & Revenue | Owner Terminal",
  description: "View dealership completed sales records, closed bookings, and sales performance.",
};

export default function SalesPage() {
  return <OwnerSalesShell />;
}
