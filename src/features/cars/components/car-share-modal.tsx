"use client";

import { useState } from "react";
import {
  Share2,
  X,
  Check,
  Copy,
  Download,
  Loader2,
  MessageCircle,
  ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import type { Car } from "../api/cars-api";
import { carPhotosApi, type CarPhoto } from "../api/car-photos-api";
import { formatIndianNumber } from "@/src/lib/formatters";

interface CarShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  car: Car;
  photos: CarPhoto[];
}

export function CarShareModal({
  isOpen,
  onClose,
  car,
  photos,
}: CarShareModalProps) {
  const allPhotos: { id: string; url: string; is_primary: boolean }[] =
    photos.length > 0
      ? photos.map((p) => ({ id: p.id, url: p.url, is_primary: p.is_primary }))
      : car.primary_photo_url || car.thumbnail_url
      ? [
          {
            id: "primary",
            url: car.primary_photo_url || car.thumbnail_url!,
            is_primary: true,
          },
        ]
      : [];

  // Default selected photo: primary photo (or first photo)
  const defaultSelectedIds = new Set<string>(
    allPhotos.filter((p) => p.is_primary).map((p) => p.id)
  );

  if (defaultSelectedIds.size === 0 && allPhotos.length > 0) {
    const first = allPhotos.at(0);
    if (first) {
      defaultSelectedIds.add(first.id);
    }
  }

  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    defaultSelectedIds
  );
  const [isSharing, setIsSharing] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  if (!isOpen) return null;

  const togglePhotoSelection = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (next.size > 1) {
          next.delete(id);
        }
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Compose Staff-Safe Text Details Block — ZERO URLs / ZERO LINKS
  const askingPriceDisplay = car.selling_price
    ? `₹${formatIndianNumber(Number(car.selling_price))}`
    : "Price on Request";

  const titleText = `${car.make} ${car.model} (${car.year})`;

  const shareTextLines = [
    `🚗 *${titleText}*`,
    car.reg_number ? `📋 Reg No: ${car.reg_number}` : "",
    `💰 Asking Price: ${askingPriceDisplay}`,
    car.km_driven !== null ? `🛣️ Distance: ${formatIndianNumber(car.km_driven)} KM` : "",
    `⛽ Fuel: ${car.fuel_type || "N/A"} | ⚙️ Transmission: ${car.transmission || "N/A"}`,
    car.color ? `🎨 Color: ${car.color}` : "",
    car.specifications ? `\n✨ *Specifications & Features:*\n${car.specifications}` : "",
    `\nContact our showroom for bookings & test drives!`,
  ].filter(Boolean);

  const fullShareText = shareTextLines.join("\n");

  // Helper to convert any Image Blob to clean JPEG File (WhatsApp & OS Share demand image/jpeg for image captions)
  const blobToJpegFile = async (blob: Blob, filename: string): Promise<File> => {
    let cleanName = filename.replace(/[^a-zA-Z0-9_\-]/g, "_");
    if (!cleanName || /^blob$/i.test(cleanName)) {
      cleanName = car.reg_number
        ? car.reg_number.trim().replace(/[^a-zA-Z0-9]/g, "-")
        : `${car.make}_${car.model}`.replace(/\s+/g, "_");
    }
    const finalFilename = `${cleanName}.jpg`;

    if (blob.type === "image/jpeg") {
      return new File([blob], finalFilename, { type: "image/jpeg" });
    }

    return new Promise<File>((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      const blobUrl = URL.createObjectURL(blob);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
        }
        canvas.toBlob(
          (jpegBlob) => {
            URL.revokeObjectURL(blobUrl);
            if (jpegBlob && jpegBlob.size > 0) {
              resolve(
                new File([jpegBlob], finalFilename, { type: "image/jpeg" })
              );
            } else {
              resolve(
                new File([blob], finalFilename, { type: "image/jpeg" })
              );
            }
          },
          "image/jpeg",
          0.92
        );
      };
      img.onerror = () => {
        URL.revokeObjectURL(blobUrl);
        resolve(new File([blob], finalFilename, { type: "image/jpeg" }));
      };
      img.src = blobUrl;
    });
  };

  // Fetch presigned image binary from S3 and convert to JPEG File
  const fetchImageFiles = async (): Promise<File[]> => {
    const selectedPhotos = allPhotos.filter((p) => selectedIds.has(p.id));
    const files: File[] = [];

    for (let i = 0; i < selectedPhotos.length; i++) {
      const photo = selectedPhotos.at(i);
      if (!photo) continue;
      try {
        let blob: Blob;
        if (photo.id && photo.id !== "primary" && photo.id !== "fallback") {
          blob = await carPhotosApi.getPhotoFileBlob(car.id, photo.id);
        } else {
          const response = await fetch(photo.url);
          if (!response.ok) {
            throw new Error(`Fetch failed: ${response.status}`);
          }
          blob = await response.blob();
        }

        if (!blob || blob.size === 0) continue;

        const vehiclePrefix = car.reg_number
          ? car.reg_number.trim().replace(/[^a-zA-Z0-9]/g, "-")
          : `${car.make}_${car.model}`.replace(/\s+/g, "_");
        const safeFilename = `${vehiclePrefix}-photo-${i + 1}`;
        const jpegFile = await blobToJpegFile(blob, safeFilename);
        files.push(jpegFile);
      } catch {
        // Skip failed image fetch
      }
    }

    return files;
  };

  // Download Raw Image Binary Files to device
  const handleDownloadPhotos = async () => {
    const selectedPhotos = allPhotos.filter((p) => selectedIds.has(p.id));
    let downloadedCount = 0;

    for (let i = 0; i < selectedPhotos.length; i++) {
      const photo = selectedPhotos.at(i);
      if (!photo) continue;
      try {
        let blob: Blob;
        if (photo.id && photo.id !== "primary" && photo.id !== "fallback") {
          blob = await carPhotosApi.getPhotoFileBlob(car.id, photo.id);
        } else {
          const response = await fetch(photo.url);
          if (!response.ok) {
            throw new Error(`Fetch failed: ${response.status}`);
          }
          blob = await response.blob();
        }

        if (!blob || blob.size === 0) continue;

        const ext = blob.type.includes("png")
          ? ".png"
          : blob.type.includes("webp")
          ? ".webp"
          : ".jpg";
        const vehiclePrefix = car.reg_number
          ? car.reg_number.trim().replace(/[^a-zA-Z0-9]/g, "-")
          : `${car.make}_${car.model}`.replace(/\s+/g, "_");
        const fileName = `${vehiclePrefix}-photo-${i + 1}${ext}`;

        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
        downloadedCount++;
      } catch {
        // Skip failed download
      }
    }

    if (downloadedCount === 0) {
      toast.error("Download failed, please retry");
    }
  };

  // Copy Specs Text to Clipboard
  const handleCopyText = async () => {
    setIsCopying(true);
    try {
      await navigator.clipboard.writeText(fullShareText);
      toast.success("Vehicle specs text copied to clipboard!");
    } catch {
      toast.error("Failed to copy text.");
    } finally {
      setIsCopying(false);
    }
  };

  // Main Single-Tap Action: Shares Image File + Specs Text as ONE combined message bubble with caption!
  const handleShareWhatsAppImgAndText = async () => {
    setIsSharing(true);
    try {
      const files = await fetchImageFiles();
      if (files.length === 0) {
        toast.error("Failed to load vehicle image file.");
        return;
      }

      const shareData: ShareData = {
        title: titleText,
        text: fullShareText,
        files: files,
      };

      if (
        typeof navigator !== "undefined" &&
        navigator.canShare &&
        navigator.canShare({ files }) &&
        navigator.share
      ) {
        await navigator.share(shareData);
        toast.success("Shared image & specs!");
        onClose();
      } else {
        // Fallback for browsers that don't support native file share
        await handleDownloadPhotos();
        await navigator.clipboard.writeText(fullShareText);
        const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
          fullShareText
        )}`;
        window.open(waUrl, "_blank");
        toast.success(
          "Image saved & specs copied! Attach image in WhatsApp chat.",
          { duration: 6000 }
        );
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        toast.error("Could not share image file and specs.");
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-lg w-full rounded-xl bg-card border border-line overflow-hidden font-sans select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-line px-5 py-4 bg-card">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-light text-accent">
              <Share2 className="h-4 w-4 stroke-[2.25px]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink font-heading">
                Share Vehicle Details
              </h3>
              <p className="text-[11px] text-ink-subtle">
                Share image file & specs as a single message to WhatsApp, Telegram, etc.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-subtle hover:bg-inset hover:text-ink transition-colors cursor-pointer"
          >
            <X className="h-5 w-5 stroke-[2.25px]" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Photo Selector Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-ink uppercase tracking-wider">
                Select Photo ({selectedIds.size} selected)
              </label>
              <span className="text-[10px] text-ink-subtle">
                Primary photo selected by default
              </span>
            </div>

            {allPhotos.length === 0 ? (
              <div className="flex items-center justify-center py-6 border border-dashed border-line rounded-lg bg-inset/50 text-xs text-ink-subtle">
                <ImageIcon className="h-4 w-4 mr-1.5 opacity-50" />
                No photos uploaded yet
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2.5">
                {allPhotos.map((photo) => {
                  const isSelected = selectedIds.has(photo.id);
                  return (
                    <div
                      key={photo.id}
                      onClick={() => togglePhotoSelection(photo.id)}
                      className={`relative aspect-square rounded-lg overflow-hidden border cursor-pointer transition-all ${
                        isSelected
                          ? "border-accent ring-2 ring-accent/30"
                          : "border-line opacity-60 hover:opacity-100"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo.url}
                        alt="Vehicle thumbnail"
                        className="h-full w-full object-cover"
                      />
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white">
                          <Check className="h-3 w-3 stroke-[3px]" />
                        </div>
                      )}
                      {photo.is_primary && (
                        <div className="absolute bottom-1 left-1 rounded bg-black/70 px-1 py-0.5 text-[8px] font-bold text-white uppercase">
                          Primary
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Formatted Text Preview Block */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink uppercase tracking-wider">
              Caption Text Preview
            </label>
            <div className="rounded-lg border border-line/80 bg-inset/70 p-3 text-xs text-ink-subtle whitespace-pre-wrap font-mono leading-relaxed max-h-36 overflow-y-auto select-text">
              {fullShareText}
            </div>
          </div>
        </div>

        {/* Modal Actions Footer: 3 Clean Simplified Options */}
        <div className="border-t border-line p-4 bg-inset/40 space-y-2">
          {/* Single Tap Action: Share Image + Specs Caption to WhatsApp / Telegram */}
          <button
            type="button"
            onClick={handleShareWhatsAppImgAndText}
            disabled={isSharing}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-all cursor-pointer disabled:opacity-50"
          >
            {isSharing ? (
              <Loader2 className="h-4 w-4 animate-spin stroke-[2.5px]" />
            ) : (
              <MessageCircle className="h-4 w-4 stroke-[2.25px]" />
            )}
            <span>Share Image + Specs (Combined Message)</span>
          </button>

          {/* Secondary Actions: Copy Text & Download Image */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleCopyText}
              disabled={isCopying}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-ink bg-card border border-line hover:bg-inset rounded-lg transition-colors cursor-pointer"
            >
              <Copy className="h-3.5 w-3.5 stroke-[2px]" />
              <span>Copy Text Only</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPhotos}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-ink bg-card border border-line hover:bg-inset rounded-lg transition-colors cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 stroke-[2px]" />
              <span>Download Image Only</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
