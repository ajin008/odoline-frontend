// app/(owner)/owner/cars/[id]/intake/page.tsx
import { IntakeShell } from "@/src/features/cars/components/intake-shell";

export default async function IntakePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="w-full">
      <IntakeShell carId={id} />
    </div>
  );
}
