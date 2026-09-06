// src/features/cars/components/car-thumbnail.tsx
"use client";

import Image from "next/image";
import { Car as CarIcon, Image as ImageIcon, Eye } from "lucide-react";
import { useCarDocuments, usePresignedUrl } from "../hooks/use-documents";
import { GroupedDocType } from "../type/document-types";

export function CarThumbnail({
  carId,
  thumbnailUrl: initialThumbnailUrl,
  onPreview,
}: {
  carId: string;
  thumbnailUrl?: string | null;
  onPreview?: (url: string) => void;
}) {
  // Only fetch documents if no batch-presigned thumbnail URL is passed
  const { data: documents, isLoading: docsLoading } = useCarDocuments(carId, {
    enabled: !initialThumbnailUrl,
  });

  const purchasePhotoGroup = (documents as GroupedDocType[] | undefined)?.find(
    (d) => d.doc_type === "purchase_photo"
  );
  const purchasePhotoFile = purchasePhotoGroup?.files?.[0];

  // Cached presigned URL fallback if needed
  const { data: presignedUrl, isLoading: urlLoading } = usePresignedUrl(
    carId,
    purchasePhotoFile?.id,
    { enabled: !initialThumbnailUrl && !purchasePhotoFile?.file_url && !!purchasePhotoFile }
  );

  const imageUrl = initialThumbnailUrl || purchasePhotoFile?.file_url || presignedUrl;

  const isLoading =
    !initialThumbnailUrl &&
    (docsLoading || (!!purchasePhotoFile && !purchasePhotoFile?.file_url && urlLoading));

  // Loading State
  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-inset animate-pulse">
        <ImageIcon className="h-6 w-6 text-ink-subtle opacity-30" />
      </div>
    );
  }

  // Success State — Render image & Eye preview overlay button
  if (imageUrl) {
    return (
      <div className="relative h-full w-full group/thumb">
        <Image
          src={imageUrl}
          alt="Vehicle preview"
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover object-[center_35%] transition-opacity duration-300"
          unoptimized
        />
        {onPreview && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onPreview(imageUrl);
            }}
            className="absolute top-2 right-2 z-10 flex h-7 w-7 items-center justify-center rounded-lg bg-black/20 text-white/80 backdrop-blur-xs transition-all duration-200 hover:bg-black/40 hover:text-white cursor-pointer border border-white/20"
            title="View image preview"
          >
            <Eye className="h-3.5 w-3.5 stroke-[1.75px]" />
          </button>
        )}
      </div>
    );
  }

  // Fallback State (No photo uploaded yet)
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-inset border-b border-line/50 text-ink-muted">
      <CarIcon className="h-8 w-8 stroke-[1.5px] opacity-40 mb-1" />
      <span className="text-[9px] font-bold uppercase tracking-wider opacity-60">
        No Photo
      </span>
    </div>
  );
}
