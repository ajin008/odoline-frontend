import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { RefurbishmentTab } from "@/src/features/cars/components/refurbishment-tab";

export default async function RefurbishmentWizardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-6 select-none font-sans">
      {/* Back Link & Header Section */}
      <div className="flex flex-col items-start">
        <Link
          href={`/owner/cars/${id}/documents`}
          className="mb-4 inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-xs font-bold text-inverse shadow-sm transition-all hover:bg-accent-hover active:scale-[0.98]"
        >
          <ArrowLeft className="h-3.5 w-3.5 stroke-[2.5px]" />
          Back to Documents
        </Link>

        <div className="w-full border-b border-line pb-4">
          <h1 className="font-heading text-xl font-bold text-ink">
            Refurbishment & Workshop Costs
          </h1>
          <p className="mt-0.5 text-xs font-medium text-ink-muted">
            Add repair tasks, track parts, and monitor landing price
            calculations.
          </p>
        </div>
      </div>

      {/* Main Container Sheet */}
      <div className="rounded-2xl border border-line bg-card p-6">
        <RefurbishmentTab carId={id} isWizardMode={true} />
      </div>
    </div>
  );
}
