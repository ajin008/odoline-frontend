/* eslint-disable no-console */
// src/features/cars/components/car-thumbnail.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Car as CarIcon, Image as ImageIcon } from "lucide-react";
import { useCarDocuments } from "../hooks/use-documents";
import { documentsApi } from "../api/documents-api";

export function CarThumbnail({ carId }: { carId: string }) {
  const { data: documents, isLoading: docsLoading } = useCarDocuments(carId);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    const fetchPresignedUrl = async () => {
      if (!documents || documents.length === 0) return;

      const purchasePhoto = documents.find(
        (d) => d.document_type === "purchase_photo"
      );
      if (!purchasePhoto) return;

      setImageLoading(true);
      try {
        const url = await documentsApi.getPresignedUrl(carId, purchasePhoto.id);
        setImageUrl(url);
      } catch (error) {
        console.error("Failed to load thumbnail", error);
      } finally {
        setImageLoading(false);
      }
    };

    fetchPresignedUrl();
  }, [documents, carId]);

  // Loading State
  if (docsLoading || imageLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-inset animate-pulse">
        <ImageIcon className="h-6 w-6 text-ink-subtle opacity-30" />
      </div>
    );
  }

  // Success State — Adjusted object positioning to push the view down slightly from the very top
  if (imageUrl) {
    return (
      <div className="relative h-full w-full">
        <Image
          src={imageUrl}
          alt="Vehicle preview"
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover object-[center_35%] transition-opacity duration-300"
          unoptimized
        />
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
