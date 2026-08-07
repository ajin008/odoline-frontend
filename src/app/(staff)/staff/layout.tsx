import { StaffShell } from "@/src/features/dashboard/components/layout/staff/staff-shell";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StaffShell>{children}</StaffShell>;
}
