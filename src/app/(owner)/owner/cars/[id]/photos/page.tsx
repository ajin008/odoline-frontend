import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CarPhotoGallery } from "@/src/features/cars/components/car-photo-gallery";

export default async function PhotoWizardPage({
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
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold tracking-tight text-ink-subtle hover:text-ink transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5 stroke-[2.25px]" />
          <span>Back to Documents</span>
        </Link>

        <div className="w-full border-b border-line pb-4">
          <h1 className="font-heading text-xl font-bold text-ink">
            Upload Car Photos
          </h1>
          <p className="mt-0.5 text-xs font-medium text-ink-muted">
            Provide high-quality exterior & interior photos for this vehicle before proceeding to refurbishment.
          </p>
        </div>
      </div>

      {/* Car Photo Gallery Wizard Component View */}
      <div>
        <CarPhotoGallery carId={id} isOwner={true} isWizardMode={true} />
      </div>
    </div>
  );
}
