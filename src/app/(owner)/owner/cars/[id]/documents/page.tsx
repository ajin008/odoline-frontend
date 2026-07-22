import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { DocumentsGrid } from "@/src/features/cars/components/documents-grid";

export default async function DocumentWizardPage({
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
          href={`/owner/cars/${id}/intake`}
          className="mb-4 inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-xs font-bold tracking-tight text-inverse shadow-sm transition-all hover:bg-accent-hover active:scale-[0.98]"
        >
          <ArrowLeft className="h-3.5 w-3.5 stroke-[2.5px]" />
          Back to Vehicle Details
        </Link>

        <div className="w-full border-b border-line pb-4">
          <h1 className="text-xl font-bold tracking-tight text-ink font-sans">
            Upload Documents
          </h1>
          <p className="mt-0.5 text-xs font-medium text-ink-muted">
            Provide the required physical records to transition this vehicle to
            refurbishment.
          </p>
        </div>
      </div>

      {/* Main Container Sheet — Shadows removed for flat, clean look */}
      <div className="rounded-2xl border border-line bg-card p-6">
        <DocumentsGrid carId={id} isWizardMode={true} />
      </div>
    </div>
  );
}
