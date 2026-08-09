"use client";

import { useState, useRef } from "react";
import {
  Camera,
  Upload,
  Star,
  Trash2,
  Loader2,
  X,
  ImageIcon,
} from "lucide-react";
import {
  useCarPhotos,
  useUploadCarPhoto,
  useDeleteCarPhoto,
  useSetPrimaryCarPhoto,
} from "../hooks/use-car-photos";
import type { CarPhoto } from "../api/car-photos-api";

interface CarPhotoGalleryProps {
  carId: string;
  isOwner?: boolean;
}

export function CarPhotoGallery({ carId, isOwner = true }: CarPhotoGalleryProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<CarPhoto | null>(null);

  const { data: photos = [], isLoading, isError } = useCarPhotos(carId);
  const uploadPhoto = useUploadCarPhoto(carId);
  const deletePhoto = useDeleteCarPhoto(carId);
  const setPrimaryPhoto = useSetPrimaryCarPhoto(carId);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;
      await uploadPhoto.mutateAsync(file);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Upload Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-accent stroke-[2.25px]" />
            <h3 className="text-base font-bold text-ink font-heading">
              Car Photo Gallery
            </h3>
          </div>
          <p className="text-xs text-ink-subtle mt-0.5 font-sans">
            Manage vehicle photos. The primary photo is displayed in search & stock cards.
          </p>
        </div>

        {isOwner && (
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              multiple
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadPhoto.isPending}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-accent rounded-xl hover:bg-accent/90 transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              {uploadPhoto.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin stroke-[2.5px]" />
              ) : (
                <Upload className="h-4 w-4 stroke-[2.5px]" />
              )}
              <span>Upload Photos</span>
            </button>
          </div>
        )}
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 text-ink-muted space-y-2">
          <Loader2 className="h-6 w-6 animate-spin text-accent" />
          <p className="text-xs font-medium">Loading car photos...</p>
        </div>
      ) : isError ? (
        <div className="py-8 text-center text-xs text-red-500 font-medium">
          Failed to load car photos. Please try again.
        </div>
      ) : photos.length === 0 ? (
        /* Empty State */
        <div
          onClick={() => isOwner && fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center py-12 px-6 border-2 border-dashed border-line/80 rounded-2xl bg-inset/40 text-center transition-all ${
            isOwner ? "cursor-pointer hover:border-accent/60 hover:bg-inset/60" : ""
          }`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-light text-accent mb-3">
            <ImageIcon className="h-6 w-6 stroke-[1.75px]" />
          </div>
          <p className="text-sm font-bold text-ink">No photos uploaded yet</p>
          <p className="text-xs text-ink-subtle max-w-sm mt-1">
            {isOwner
              ? "Click here to upload photos for this vehicle. High quality exterior and interior photos help sales staff."
              : "No showroom photos available for this vehicle."}
          </p>
        </div>
      ) : (
        /* Photo Grid */
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className={`group relative rounded-xl overflow-hidden border bg-card shadow-sm transition-all hover:shadow-md ${
                photo.is_primary ? "border-accent ring-2 ring-accent/20" : "border-line"
              }`}
            >
              {/* Image Preview Container */}
              <div
                onClick={() => setSelectedPhoto(photo)}
                className="aspect-4/3 w-full overflow-hidden bg-inset cursor-pointer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt="Car photo"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Primary Badge */}
              {photo.is_primary && (
                <div className="absolute top-2 left-2 flex items-center gap-1 rounded-lg bg-accent px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                  <Star className="h-3 w-3 fill-current stroke-none" />
                  <span>PRIMARY</span>
                </div>
              )}

              {/* Action Buttons Overlay for Owner */}
              {isOwner && (
                <div className="absolute bottom-2 right-2 flex items-center gap-1.5 opacity-90 transition-opacity group-hover:opacity-100">
                  {!photo.is_primary && (
                    <button
                      type="button"
                      onClick={() => setPrimaryPhoto.mutate(photo.id)}
                      disabled={setPrimaryPhoto.isPending}
                      title="Set as primary photo"
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/60 text-white backdrop-blur-md hover:bg-accent transition-colors cursor-pointer"
                    >
                      <Star className="h-3.5 w-3.5 stroke-[2px]" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => deletePhoto.mutate(photo.id)}
                    disabled={deletePhoto.isPending}
                    title="Delete photo"
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/60 text-white backdrop-blur-md hover:bg-red-600 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5 stroke-[2px]" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Photo Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full overflow-hidden rounded-2xl bg-card border border-line shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
              <div className="flex items-center gap-2">
                {selectedPhoto.is_primary && (
                  <span className="flex items-center gap-1 rounded-md bg-accent/10 px-2 py-0.5 text-[10px] font-bold text-accent border border-accent/20">
                    <Star className="h-3 w-3 fill-accent stroke-none" />
                    PRIMARY PHOTO
                  </span>
                )}
                <span className="text-xs font-mono text-ink-subtle">
                  Uploaded {new Date(selectedPhoto.created_at).toLocaleDateString()}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="rounded-lg p-1.5 text-ink-subtle hover:bg-inset hover:text-ink transition-colors cursor-pointer"
              >
                <X className="h-5 w-5 stroke-[2.25px]" />
              </button>
            </div>

            <div className="flex items-center justify-center bg-inset p-4 min-h-[300px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedPhoto.url}
                alt="Enlarged car photo"
                className="max-h-[75vh] w-auto max-w-full rounded-xl object-contain shadow-md"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
