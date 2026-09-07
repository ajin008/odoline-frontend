"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Share2,
  Car as CarIcon,
  ShieldCheck,
  FileText,
  Wrench,
  CheckCircle2,
  Clock,
  Loader2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Camera,
  Gauge,
  Fuel,
  Calendar,
  Layers,
  Palette,
  X,
  Copy,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { useCar } from "../hooks/use-car";
import { useCarPhotos } from "../hooks/use-car-photos";
import { useCarDocuments } from "../hooks/use-documents";
import { useRefurbishmentItems } from "../hooks/use-refurbishment";
import { formatIndianNumber } from "@/src/lib/formatters";
import { CarPhotoGallery } from "./car-photo-gallery";
import { CarShareModal } from "./car-share-modal";
import { DocumentsGrid } from "./documents-grid";
import { documentsApi } from "../api/documents-api";
import { downloadFile, shareFile } from "@/src/lib/file-action-utils";

export function StaffCarDetail({ carId }: { carId: string }) {
  const { data: car, isLoading: isCarLoading, isError } = useCar(carId);
  const { data: photos = [] } = useCarPhotos(carId);
  const { data: documents = [] } = useCarDocuments(carId);
  const { data: refurbItems = [] } = useRefurbishmentItems(carId);

  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<
    "overview" | "photos" | "refurb" | "docs"
  >("overview");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [docPreview, setDocPreview] = useState<{
    id?: string;
    url: string;
    mimeType: string;
    name: string;
  } | null>(null);

  if (isCarLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-ink-muted space-y-3">
        <Loader2 className="h-7 w-7 animate-spin text-accent" />
        <p className="text-xs font-semibold font-sans tracking-wide">
          Loading vehicle profile...
        </p>
      </div>
    );
  }

  if (isError || !car) {
    return (
      <div className="rounded-xl border border-line bg-card p-8 text-center max-w-md mx-auto my-12 space-y-4">
        <p className="text-sm font-semibold text-red-600">
          Vehicle detail payload could not be loaded.
        </p>
        <Link
          href="/staff/stock"
          className="inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2 text-xs font-bold text-white transition-all hover:bg-accent/90"
        >
          Return to Showroom Stock
        </Link>
      </div>
    );
  }

  const allPhotos =
    photos.length > 0
      ? photos
      : car.primary_photo_url || car.thumbnail_url
      ? [
          {
            id: "fallback",
            car_id: car.id,
            file_key: "",
            url: car.primary_photo_url || car.thumbnail_url!,
            is_primary: true,
            sort_order: 0,
            created_at: new Date().toISOString(),
          },
        ]
      : [];

  const currentPhoto = allPhotos.at(activePhotoIdx);
  const askingPriceDisplay = car.selling_price
    ? `₹${formatIndianNumber(Number(car.selling_price))}`
    : "Price on Request";

  const completedRefurbCount = refurbItems.filter(
    (i) => i.status === "done"
  ).length;

  const handleShareClick = () => {
    setIsShareModalOpen(true);
  };

  const handleCopySpecs = async () => {
    if (!car?.specifications) return;
    try {
      await navigator.clipboard.writeText(car.specifications);
      toast.success("Specifications copied to clipboard");
    } catch {
      toast.error("Failed to copy specifications");
    }
  };

  const handleCopyAccidentHistory = async () => {
    if (!car?.accident_history) return;
    try {
      await navigator.clipboard.writeText(car.accident_history);
      toast.success("Accident history copied to clipboard");
    } catch {
      toast.error("Failed to copy accident history");
    }
  };

  return (
    <div className="space-y-6 font-sans select-none pb-12">
      {/* SaaS Header & Action Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-4">
        <div className="space-y-1">
          {/* Breadcrumb & Status Pill */}
          <div className="flex items-center gap-2">
            <Link
              href="/staff/stock"
              className="inline-flex items-center gap-1 text-xs font-semibold text-ink-subtle hover:text-ink transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5 stroke-[2.25px]" />
              <span>Stock</span>
            </Link>
            <span className="text-ink-subtle text-xs">/</span>
            <span className="text-xs font-mono font-bold text-ink-muted uppercase">
              {car.make}
            </span>
            {Boolean(car.is_booked || car.status === "booked") ? (
              <span className="rounded-md bg-emerald-600 text-white border border-emerald-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                BOOKED
              </span>
            ) : (
              <span className="rounded-md bg-emerald-600 text-white border border-emerald-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                IN STOCK
              </span>
            )}
          </div>

          {/* Vehicle Title & Reg Number */}
          <h1 className="text-xl sm:text-2xl font-bold text-ink font-heading leading-tight">
            {car.model}{" "}
            <span className="text-base font-normal text-ink-subtle">
              ({car.year})
            </span>
          </h1>
        </div>

        {/* Primary Action Button */}
        <button
          type="button"
          onClick={handleShareClick}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-accent rounded-lg hover:bg-accent/90 transition-all cursor-pointer"
        >
          <Share2 className="h-4 w-4 stroke-[2.25px]" />
          <span>Share Vehicle Details</span>
        </button>
      </div>

      {/* Main 2-Column Responsive Hero Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Photo Showcase & Gallery Strip (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl border border-line bg-inset">
            {currentPhoto ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={currentPhoto.url}
                alt={`${car.make} ${car.model}`}
                className="h-full w-full object-cover transition-transform duration-300"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center text-ink-subtle">
                <ImageIcon className="h-10 w-10 stroke-[1.5px] opacity-40 mb-1.5" />
                <span className="text-xs font-medium">
                  No Showroom Photos Uploaded
                </span>
              </div>
            )}

            {/* Gallery Navigation Arrows */}
            {allPhotos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setActivePhotoIdx((prev) =>
                      prev === 0 ? allPhotos.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-lg bg-black/60 text-white backdrop-blur-md hover:bg-accent transition-colors cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4 stroke-[2.5px]" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActivePhotoIdx((prev) =>
                      prev === allPhotos.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-lg bg-black/60 text-white backdrop-blur-md hover:bg-accent transition-colors cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4 stroke-[2.5px]" />
                </button>
              </>
            )}

            {/* Registration Tag & Photo Counter Overlay */}
            <div className="absolute top-3 left-3 rounded-md bg-black/75 px-2.5 py-1 text-[10px] font-mono font-bold text-white backdrop-blur-md">
              {car.reg_number || "NO-REG"}
            </div>

            {allPhotos.length > 0 && (
              <div className="absolute bottom-3 right-3 rounded-md bg-black/75 px-2.5 py-1 text-[10px] font-mono font-bold text-white backdrop-blur-md">
                {activePhotoIdx + 1} / {allPhotos.length}
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          {allPhotos.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {allPhotos.map((photo, idx) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => setActivePhotoIdx(idx)}
                  className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border transition-all cursor-pointer ${
                    idx === activePhotoIdx
                      ? "border-accent ring-2 ring-accent/30"
                      : "border-line opacity-60 hover:opacity-100"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.url}
                    alt="Thumbnail"
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Prominent Asking Price & Key Specs Card (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl border border-line bg-card p-5 space-y-4">
            {/* Price Header */}
            <div>
              <span className="text-[10px] font-mono font-bold tracking-wider text-ink-muted uppercase block">
                Official Asking Price
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-accent font-sans mt-1">
                {askingPriceDisplay}
              </div>
              <p className="text-[11px] text-ink-subtle mt-1 font-sans">
                Asking price for customer negotiations.
              </p>
            </div>

            {/* Key Specifications Grid */}
            <div className="border-t border-line/60 pt-4 space-y-3">
              <span className="text-xs font-bold text-ink uppercase tracking-wider block font-sans">
                Vehicle Specifications
              </span>

              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="flex items-center gap-2.5 rounded-lg bg-inset/70 p-2.5 border border-line/40">
                  <Gauge className="h-4 w-4 text-ink-muted shrink-0 stroke-[1.75px]" />
                  <div className="min-w-0">
                    <span className="text-[9px] font-mono text-ink-subtle uppercase block">
                      Distance
                    </span>
                    <p className="font-sans font-bold text-ink truncate text-xs">
                      {car.km_driven !== null
                        ? `${formatIndianNumber(car.km_driven)} KM`
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 rounded-lg bg-inset/70 p-2.5 border border-line/40">
                  <Fuel className="h-4 w-4 text-ink-muted shrink-0 stroke-[1.75px]" />
                  <div className="min-w-0">
                    <span className="text-[9px] font-mono text-ink-subtle uppercase block">
                      Fuel
                    </span>
                    <p className="font-sans font-bold text-ink capitalize truncate text-xs">
                      {car.fuel_type || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 rounded-lg bg-inset/70 p-2.5 border border-line/40">
                  <Layers className="h-4 w-4 text-ink-muted shrink-0 stroke-[1.75px]" />
                  <div className="min-w-0">
                    <span className="text-[9px] font-mono text-ink-subtle uppercase block">
                      Transmission
                    </span>
                    <p className="font-sans font-bold text-ink capitalize truncate text-xs">
                      {car.transmission || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 rounded-lg bg-inset/70 p-2.5 border border-line/40">
                  <Palette className="h-4 w-4 text-ink-muted shrink-0 stroke-[1.75px]" />
                  <div className="min-w-0">
                    <span className="text-[9px] font-mono text-ink-subtle uppercase block">
                      Color
                    </span>
                    <p className="font-sans font-bold text-ink truncate text-xs">
                      {car.color || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 rounded-lg bg-inset/70 p-2.5 border border-line/40">
                  <Calendar className="h-4 w-4 text-ink-muted shrink-0 stroke-[1.75px]" />
                  <div className="min-w-0">
                    <span className="text-[9px] font-mono text-ink-subtle uppercase block">
                      Year
                    </span>
                    <p className="font-sans font-bold text-ink truncate text-xs">
                      {car.year || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 rounded-lg bg-inset/70 p-2.5 border border-line/40">
                  <Clock className="h-4 w-4 text-accent shrink-0 stroke-[1.75px]" />
                  <div className="min-w-0">
                    <span className="text-[9px] font-mono text-ink-subtle uppercase block">
                      Stock Age
                    </span>
                    <p className="font-sans font-bold text-accent truncate text-xs">
                      {car.days_in_stock ?? 0} Days
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fully Responsive Subtabs Segmented Switcher (Mobile, Tablet, Desktop) */}
      <div className="w-full overflow-x-auto rounded-lg bg-inset p-1 border border-line no-scrollbar">
        <div className="flex w-full min-w-max gap-1">
          {[
            {
              key: "overview" as const,
              label: "Overview & Specs",
              icon: <CarIcon className="h-3.5 w-3.5 stroke-[2px]" />,
            },
            {
              key: "photos" as const,
              label: `Photos (${photos.length})`,
              icon: <Camera className="h-3.5 w-3.5 stroke-[2px]" />,
            },
            {
              key: "refurb" as const,
              label: `Refurb (${refurbItems.length})`,
              icon: <Wrench className="h-3.5 w-3.5 stroke-[2px]" />,
            },
            {
              key: "docs" as const,
              label: `Documents (${documents.length})`,
              icon: <FileText className="h-3.5 w-3.5 stroke-[2px]" />,
            },
          ].map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setActiveTab(t.key)}
              className={[
                "flex-1 text-center shrink-0 rounded-md px-3 sm:px-4 py-2 text-xs font-bold font-sans transition-all duration-200 cursor-pointer whitespace-nowrap",
                activeTab === t.key
                  ? "bg-accent text-inverse shadow-xs"
                  : "text-ink-muted hover:text-ink",
              ].join(" ")}
            >
              <div className="flex items-center justify-center gap-1.5">
                {t.icon}
                <span>{t.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Panel 1: Overview & Specs */}
      {activeTab === "overview" && (
        <div className="space-y-4">
          {car.specifications ? (
            <div className="rounded-xl border border-line bg-card p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-line/60 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-accent stroke-[2px]" />
                  <h3 className="text-sm font-bold text-ink font-heading">
                    Specifications & Key Features
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={handleCopySpecs}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-ink-muted bg-inset hover:bg-line/40 hover:text-ink border border-line transition-all cursor-pointer shadow-2xs active:scale-95 shrink-0"
                  title="Copy Specifications to clipboard"
                >
                  <Copy className="h-3.5 w-3.5 stroke-[2px]" />
                  <span>Copy Specs</span>
                </button>
              </div>
              <p className="text-xs text-ink-subtle whitespace-pre-wrap leading-relaxed font-sans">
                {car.specifications}
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-line bg-card p-6 text-center text-xs text-ink-subtle">
              No detailed specifications added for this vehicle yet.
            </div>
          )}

          {car.accident_history && (
            <div className="rounded-xl border border-line bg-card p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-line/60 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-accent stroke-[2px]" />
                  <h3 className="text-sm font-bold text-ink font-heading">
                    Accident & Replacement History
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={handleCopyAccidentHistory}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-ink-muted bg-inset hover:bg-line/40 hover:text-ink border border-line transition-all cursor-pointer shadow-2xs active:scale-95 shrink-0"
                  title="Copy Accident History to clipboard"
                >
                  <Copy className="h-3.5 w-3.5 stroke-[2px]" />
                  <span>Copy History</span>
                </button>
              </div>
              <p className="text-xs text-ink-subtle whitespace-pre-wrap leading-relaxed font-sans">
                {car.accident_history}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab Panel 2: Showroom Photos */}
      {activeTab === "photos" && <CarPhotoGallery carId={car.id} />}

      {/* Tab Panel 3: Refurbishment Tasks (Strictly Staff-Safe, NO COSTS) */}
      {activeTab === "refurb" && (
        <div className="rounded-xl border border-line bg-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-line/60 pb-3">
            <div>
              <h3 className="text-sm font-bold text-ink font-heading">
                Workshop & Refurbishment Tasks
              </h3>
              <p className="text-xs text-ink-subtle">
                {completedRefurbCount} of {refurbItems.length} tasks completed.
              </p>
            </div>
          </div>

          {refurbItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-ink-subtle">
              No refurbishment tasks recorded for this vehicle.
            </div>
          ) : (
            <div className="divide-y divide-line/60">
              {refurbItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    {item.status === "done" ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 stroke-[2.25px]" />
                    ) : (
                      <Clock className="h-4 w-4 text-amber-500 shrink-0 stroke-[2.25px]" />
                    )}
                    <div>
                      <p className="font-semibold text-ink font-sans">
                        {item.item_name}
                      </p>
                      <p className="text-[10px] text-ink-subtle capitalize">
                        {item.item_type}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      item.status === "done"
                        ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                    }`}
                  >
                    {item.status === "done" ? "Completed" : "In Progress"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Panel 4: Vehicle Documents */}
      {activeTab === "docs" && (
        <div className="space-y-4">
          <DocumentsGrid carId={car.id} />
        </div>
      )}

      {/* Share Modal Dialog */}
      <CarShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        car={car}
        photos={photos}
      />

      {/* Full Screen Inline Document / PDF Preview Modal */}
      {docPreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setDocPreview(null)}
        >
          <div
            className="relative flex flex-col max-h-[92vh] max-w-5xl w-full rounded-xl bg-card border border-line overflow-hidden font-sans select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-line px-5 py-3.5 bg-card z-10">
              <div className="flex items-center gap-2 min-w-0">
                <h3 className="text-sm font-bold tracking-tight text-ink font-sans truncate">
                  {docPreview.name}
                </h3>
                {docPreview.mimeType === "application/pdf" ? (
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-500/10 text-rose-700 border border-rose-500/20 px-2 py-0.5 rounded-md shrink-0">
                    PDF Document
                  </span>
                ) : (
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-500/10 text-blue-700 border border-blue-500/20 px-2 py-0.5 rounded-md shrink-0">
                    Image Document
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {(() => {
                  const vehiclePrefix = car
                    ? `${
                        car.reg_number
                          ? car.reg_number
                          : `${car.make}_${car.model}`
                      }`
                    : "Vehicle";
                  const ext =
                    docPreview.mimeType === "application/pdf" ? ".pdf" : ".jpg";
                  const docFilename = `${vehiclePrefix}_${
                    docPreview.name || "Document"
                  }${ext}`;

                  return (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          downloadFile({
                            fetchBlob: docPreview.id
                              ? () => documentsApi.downloadFileBlob(carId, docPreview.id!)
                              : undefined,
                            url: docPreview.id ? undefined : docPreview.url,
                            fileName: docFilename,
                          })
                        }
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-muted hover:text-ink transition-colors px-2.5 py-1.5 rounded-lg bg-inset hover:bg-line/40 border border-line cursor-pointer"
                        title="Download File"
                      >
                        <Download className="h-3.5 w-3.5 stroke-[2px]" />
                        <span className="hidden sm:inline">Download</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          shareFile({
                            fetchBlob: docPreview.id
                              ? () => documentsApi.downloadFileBlob(carId, docPreview.id!)
                              : undefined,
                            url: docPreview.id ? undefined : docPreview.url,
                            fileName: docFilename,
                            title: `${
                              car ? `${car.make} ${car.model}` : "Vehicle"
                            } - ${docPreview.name || "Document"}`,
                            text: car?.reg_number
                              ? `Registration: ${car.reg_number}`
                              : undefined,
                            mimeType: docPreview.mimeType,
                          })
                        }
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-500/10 hover:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/20 transition-all px-2.5 py-1.5 rounded-lg cursor-pointer"
                        title="Share File"
                      >
                        <Share2 className="h-3.5 w-3.5 stroke-[2px]" />
                        <span className="hidden sm:inline">Share</span>
                      </button>
                    </>
                  );
                })()}

                <button
                  type="button"
                  onClick={() => setDocPreview(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-subtle hover:bg-inset hover:text-ink transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5 stroke-[2.25px]" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-hidden bg-inset p-3 flex items-center justify-center min-h-[60vh]">
              {docPreview.mimeType === "application/pdf" ? (
                <iframe
                  src={docPreview.url}
                  title="PDF Document Preview"
                  className="w-full h-[75vh] min-h-[480px] rounded-lg border border-line bg-card"
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={docPreview.url}
                  alt="Document Preview"
                  className="max-h-[75vh] w-auto max-w-full rounded-lg object-contain"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
