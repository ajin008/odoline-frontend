// app/(owner)/owner/layout.tsx
import { OwnerShell } from "@/src/features/dashboard/layout/owner/owner-shell";
export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <OwnerShell>{children}</OwnerShell>;
}
