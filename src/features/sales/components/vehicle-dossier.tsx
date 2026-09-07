/* eslint-disable security/detect-object-injection */
"use client";

import { useState } from "react";
import Link from "next/link";
import { isAxiosError } from "axios";
import { useDossier } from "../hooks/use-dossier";
import { bookingApi } from "@/src/features/booking/api/booking-api";
import {
  downloadPdfDocument,
  buildDocFilename,
} from "@/src/features/booking/utils/doc-actions";
import { formatIndianNumber } from "@/src/lib/formatters";
import { Badge } from "@/src/components/ui/badge";
import { toast } from "sonner";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Clock,
  Coins,
  Download,
  Eye,
  FileCheck2,
  FileText,
  FolderArchive,
  History,
  Info,
  Loader2,
  PackageCheck,
  Receipt,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  User,
  UserCheck,
  Wrench,
  X,
  Share2,
} from "lucide-react";
import { downloadFile, shareFile } from "@/src/lib/file-action-utils";
import { carPhotosApi } from "@/src/features/cars/api/car-photos-api";
import { AuthenticatedImage } from "@/src/components/ui/authenticated-image";

interface VehicleDossierProps {
  carId: string;
}

function formatDateIST(dateStr: string | null | undefined): string {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "N/A";
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

function formatDateTimeIST(dateStr: string | null | undefined): string {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "N/A";
  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatCurrencyStr(val: string | null | undefined): string {
  if (!val) return "₹0";
  const num = Number(val);
  return isNaN(num) ? `₹${val}` : `₹${formatIndianNumber(num)}`;
}

export function VehicleDossier({ carId }: VehicleDossierProps) {
  const { data: dossier, isLoading, isError, error } = useDossier(carId);

  // Mobile App-like View Tabs
  const [mobileTab, setMobileTab] = useState<
    "journey" | "financials" | "documents"
  >("journey");

  // Gallery state
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // PDF action loading states
  const [activePdfLoading, setActivePdfLoading] = useState<string | null>(null);

  // Audit history collapsible state
  const [isAuditHistoryOpen, setIsAuditHistoryOpen] = useState(false);

  // Document modal preview state
  const [previewDocUrl, setPreviewDocUrl] = useState<{
    id?: string;
    url: string;
    mimeType?: string;
    title: string;
  } | null>(null);

  if (isLoading) {
    return (
      <div className="w-full space-y-6 py-2 font-sans animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-6 w-48 bg-card border border-line rounded-lg" />
          <div className="h-6 w-32 bg-card border border-line rounded-lg" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <div className="h-64 rounded-2xl bg-card border border-line" />
            <div className="h-96 rounded-2xl bg-card border border-line" />
          </div>
          <div className="lg:col-span-4 space-y-6">
            <div className="h-80 rounded-2xl bg-card border border-line" />
            <div className="h-48 rounded-2xl bg-card border border-line" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !dossier) {
    const errMessage = isAxiosError(error)
      ? error.response?.data?.error?.message || error.message
      : error instanceof Error
      ? error.message
      : "Failed to load vehicle dossier";

    return (
      <div className="w-full py-16 px-4 text-center space-y-4">
        <div className="h-14 w-14 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto">
          <Info className="h-7 w-7" />
        </div>
        <h2 className="text-base sm:text-lg font-bold text-ink">
          Dossier Unavailable
        </h2>
        <p className="text-xs text-ink-muted max-w-md mx-auto">{errMessage}</p>
        <div className="pt-2">
          <Link
            href="/owner/sales"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-accent bg-accent/10 border border-accent/20 rounded-xl hover:bg-accent/20 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Completed Sales</span>
          </Link>
        </div>
      </div>
    );
  }

  const {
    car,
    purchase,
    documents,
    refurbishment,
    pricing,
    stock,
    lifecycle,
    booking,
    sale,
  } = dossier;

  const photoList =
    car.photos && car.photos.length > 0
      ? car.photos
      : car.primary_photo_url
      ? [car.primary_photo_url]
      : [];
  const currentPhoto =
    photoList.at(selectedPhotoIndex) ?? car.primary_photo_url;

  const rcDocs = booking.rc_documents || booking.documents?.rc_documents || [];
  const deliveryImgs =
    booking.delivery_images || booking.documents?.delivery_images || [];

  // PDF action handlers
  const handleViewPdf = async (docKey: string, bookingId: string) => {
    setActivePdfLoading(`view_${docKey}`);
    try {
      let blob: Blob;
      let title = "Document PDF";
      if (docKey === "agreement") {
        blob = await bookingApi.getAgreementPdf(bookingId);
        title = "Advance Sale Agreement";
      } else if (docKey === "order") {
        blob = await bookingApi.getOrderPdf(bookingId);
        title = "Order Form & Accessories";
      } else if (docKey === "settlement") {
        blob = await bookingApi.getSettlementPdf(bookingId);
        title = "Settlement Statement";
      } else {
        blob = await bookingApi.getDeliveryPdf(bookingId);
        title = "Delivery Handover Note";
      }

      const url = URL.createObjectURL(blob);
      setPreviewDocUrl({
        url,
        mimeType: "application/pdf",
        title: `${title} - ${car.reg_number || `${car.make} ${car.model}`}`,
      });
    } catch (err: unknown) {
      const msg = isAxiosError(err)
        ? err.response?.data?.error?.message || err.message
        : err instanceof Error
        ? err.message
        : "Failed to generate PDF";
      toast.error(msg);
    } finally {
      setActivePdfLoading(null);
    }
  };

  const handleDownloadPdf = async (
    docKey: string,
    bookingId: string,
    filename: string
  ) => {
    setActivePdfLoading(`dl_${docKey}`);
    try {
      const docTitleMap: Record<string, string> = {
        agreement: "Agreement PDF",
        order: "Order Form PDF",
        settlement: "Settlement PDF",
        delivery: "Delivery Note PDF",
      };
      await downloadPdfDocument({
        fetchBlob: () => {
          if (docKey === "agreement")
            return bookingApi.getAgreementPdf(bookingId);
          if (docKey === "order") return bookingApi.getOrderPdf(bookingId);
          if (docKey === "settlement")
            return bookingApi.getSettlementPdf(bookingId);
          return bookingApi.getDeliveryPdf(bookingId);
        },
        filename,
        docTitle: docTitleMap[docKey] || "PDF",
      });
    } catch {
      // handled inside helper
    } finally {
      setActivePdfLoading(null);
    }
  };

  // Money Story computations
  const purchaseNum = Number(pricing.purchase_amount || 0);
  const refurbNum = Number(pricing.refurb_total || 0);
  const landingNum = Number(pricing.landing_price || purchaseNum + refurbNum);
  const agreedNum = Number(booking.agreed_price || sale.final_sale_value || 0);

  const grossProfit = agreedNum - landingNum;
  const marginPercent =
    landingNum > 0 ? ((grossProfit / landingNum) * 100).toFixed(1) : "0";

  return (
    <div className="w-full space-y-5 font-sans select-none pb-12">
      {/* ------------------------------------------------------------- */}
      {/* BREADCRUMB & PAGE ACTION BAR                                  */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line/60 pb-3">
        <div className="flex items-center gap-3">
          <Link
            href="/owner/sales"
            className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-inset border border-line text-ink-muted hover:text-ink hover:bg-card transition-all"
            title="Back to Completed Sales"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-[11px] font-semibold text-ink-subtle">
              <span>Console</span>
              <span>/</span>
              <Link
                href="/owner/sales"
                className="hover:text-ink transition-colors"
              >
                Sales
              </Link>
              <span>/</span>
              <span className="text-ink font-mono">{car.reg_number}</span>
            </div>
            <h1 className="text-base sm:text-lg font-extrabold font-heading text-ink leading-snug">
              {car.year} {car.make} {car.model}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* BORDER-FREE PASTEL BADGE */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-bold uppercase tracking-wider">
            <ShieldCheck className="h-3.5 w-3.5 text-slate-500" />
            <span>Owner Confidential</span>
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MOBILE APP-LIKE SEGMENTED TAB SWITCHER (< md screens)         */}
      {/* ------------------------------------------------------------- */}
      <div className="md:hidden flex items-center p-1 rounded-xl bg-inset border border-line/80">
        <button
          type="button"
          onClick={() => setMobileTab("journey")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all text-center ${
            mobileTab === "journey"
              ? "bg-card text-ink shadow-2xs border border-line/50"
              : "text-ink-subtle hover:text-ink"
          }`}
        >
          Journey Timeline
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("financials")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all text-center ${
            mobileTab === "financials"
              ? "bg-emerald-100 text-emerald-800 font-bold"
              : "text-ink-subtle hover:text-ink"
          }`}
        >
          Money Story
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("documents")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all text-center ${
            mobileTab === "documents"
              ? "bg-card text-ink shadow-2xs border border-line/50"
              : "text-ink-subtle hover:text-ink"
          }`}
        >
          Sale Docs ({documents.length + 5})
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MAIN 12-COLUMN SAAS WORKSPACE GRID                            */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 xl:gap-6 items-start">
        {/* =========================================================== */}
        {/* LEFT COLUMN: VEHICLE HERO + TIMELINE JOURNEY               */}
        {/* =========================================================== */}
        <div
          className={`xl:col-span-8 space-y-6 ${
            mobileTab !== "journey" ? "hidden md:block" : ""
          }`}
        >
          {/* VEHICLE CASE FILE HERO BENTO CARD */}
          <div className="rounded-2xl bg-card border border-line p-4 sm:p-6 shadow-bento space-y-5">
            <div className="flex flex-col xl:flex-row gap-5 items-stretch">
              {/* Photo Frame Container */}
              <div className="w-full xl:w-80 shrink-0 space-y-2 flex flex-col">
                <div className="relative aspect-video sm:aspect-2/1 xl:aspect-16/10 w-full rounded-xl overflow-hidden bg-inset border border-line group">
                  {currentPhoto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={currentPhoto}
                      alt={`${car.year} ${car.make} ${car.model}`}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                      onClick={() => setIsLightboxOpen(true)}
                    />
                  ) : (
                    <div className="h-full w-full flex flex-col items-center justify-center text-ink-subtle space-y-1.5">
                      <FolderArchive className="h-8 w-8 stroke-1" />
                      <span className="text-xs font-semibold">No Photo</span>
                    </div>
                  )}

                  {currentPhoto && (
                    <button
                      type="button"
                      onClick={() => setIsLightboxOpen(true)}
                      className="absolute bottom-2 right-2 bg-black/70 hover:bg-black/90 text-white px-2 py-0.5 rounded-md text-[10px] font-semibold flex items-center gap-1 backdrop-blur-md transition-colors cursor-pointer"
                    >
                      <Eye className="h-3 w-3" />
                      <span>Zoom ({photoList.length})</span>
                    </button>
                  )}
                </div>

                {/* Horizontal Thumbnail Strip */}
                {photoList.length > 1 && (
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
                    {photoList.map((photoUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedPhotoIndex(idx)}
                        className={`h-10 w-14 rounded-md overflow-hidden border shrink-0 transition-all cursor-pointer ${
                          selectedPhotoIndex === idx
                            ? "border-accent ring-2 ring-accent/20 scale-105"
                            : "border-line/70 opacity-60 hover:opacity-100"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photoUrl}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Vehicle Hero Data Block */}
              <div className="flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-ink bg-inset px-2.5 py-1 rounded-md border border-line/70 uppercase">
                        {car.reg_number}
                      </span>
                      <span className="text-xs text-ink-subtle">·</span>
                      <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        BK: {booking.booking_number}
                      </span>
                    </div>

                    {/* BORDER-FREE PASTEL BADGE: COMPLETED SALE */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-100/90 text-emerald-800 text-xs font-extrabold uppercase tracking-wider">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />
                      <span>Completed Sale</span>
                    </div>
                  </div>

                  {/* Specification Badges Pill Matrix */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    <div className="bg-inset/80 p-2.5 rounded-lg border border-line/50 space-y-0.5">
                      <span className="text-[10px] font-bold text-ink-subtle uppercase tracking-wider">
                        Fuel
                      </span>
                      <p className="text-xs font-bold text-ink capitalize truncate">
                        {car.fuel_type || "N/A"}
                      </p>
                    </div>
                    <div className="bg-inset/80 p-2.5 rounded-lg border border-line/50 space-y-0.5">
                      <span className="text-[10px] font-bold text-ink-subtle uppercase tracking-wider">
                        Gearbox
                      </span>
                      <p className="text-xs font-bold text-ink capitalize truncate">
                        {car.transmission || "N/A"}
                      </p>
                    </div>
                    <div className="bg-inset/80 p-2.5 rounded-lg border border-line/50 space-y-0.5">
                      <span className="text-[10px] font-bold text-ink-subtle uppercase tracking-wider">
                        Mileage
                      </span>
                      <p className="text-xs font-bold text-ink font-mono truncate">
                        {car.km_driven
                          ? `${formatIndianNumber(car.km_driven)} km`
                          : "N/A"}
                      </p>
                    </div>
                    <div className="bg-inset/80 p-2.5 rounded-lg border border-line/50 space-y-0.5">
                      <span className="text-[10px] font-bold text-ink-subtle uppercase tracking-wider">
                        Color
                      </span>
                      <p className="text-xs font-bold text-ink capitalize truncate">
                        {car.color || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sale Executive Summary Bar */}
                <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-inset border border-line/70 text-xs font-medium flex-wrap">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>
                      Sold for{" "}
                      <strong className="font-mono font-extrabold text-ink">
                        ₹{formatIndianNumber(agreedNum)}
                      </strong>
                    </span>
                    <span className="text-ink-subtle">·</span>
                    <span className="text-ink-muted">
                      Closed {formatDateIST(sale.closed_at)}
                    </span>
                  </div>

                  {/* BORDER-FREE PASTEL PILL: COLLECTED */}
                  <div className="text-[11px] font-extrabold font-mono bg-emerald-100/90 text-emerald-800 px-2.5 py-1 rounded-md">
                    Full ₹{formatIndianNumber(Number(sale.total_collected))}{" "}
                    Collected
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TIMELINE PHASE CARDS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-ink-subtle flex items-center gap-2">
                <History className="h-4 w-4 text-ink-subtle" />
                <span>Lifecycle Phase Journey</span>
              </h2>
              <span className="text-[11px] text-ink-subtle font-medium">
                Chronological Audit Flow
              </span>
            </div>

            <div className="space-y-4 border-l-2 border-line/70 pl-4 sm:pl-6 ml-2 sm:ml-3">
              {/* PHASE 1: ACQUISITION */}
              <div className="relative group space-y-2">
                <div className="absolute -left-[25px] sm:-left-[33px] top-1 h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-sky-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                  1
                </div>

                <div className="rounded-2xl bg-card border border-line p-4 sm:p-5 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap border-b border-line/50 pb-2.5">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4 text-sky-600" />
                      <h3 className="text-xs sm:text-sm font-extrabold text-ink">
                        Vehicle Intake &amp; Acquisition
                      </h3>
                    </div>
                    {/* BORDER-FREE PASTEL DATE PILL */}
                    <span className="text-[11px] font-mono text-sky-800 bg-sky-100/90 px-2.5 py-0.5 rounded-md font-bold">
                      {formatDateTimeIST(purchase.purchased_at)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-ink-subtle uppercase tracking-wider">
                        Purchase Cost
                      </span>
                      <p className="text-sm font-extrabold font-mono text-ink">
                        {formatCurrencyStr(purchase.purchase_amount)}
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-ink-subtle uppercase tracking-wider">
                        Seller Details
                      </span>
                      <p className="font-bold text-ink">
                        {purchase.seller_name}
                      </p>
                      <p className="text-ink-muted font-mono text-[11px]">
                        {purchase.seller_phone}
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-ink-subtle uppercase tracking-wider">
                        Acquired By Staff
                      </span>
                      <p className="font-bold text-ink flex items-center gap-1">
                        <User className="h-3.5 w-3.5 text-ink-subtle" />
                        <span>{purchase.purchased_by?.name || "System"}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* PHASE 2: INTAKE DOCUMENTS VAULT */}
              <div className="relative group space-y-2">
                <div className="absolute -left-[25px] sm:-left-[33px] top-1 h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                  2
                </div>

                <div className="rounded-2xl bg-card border border-line p-4 sm:p-5 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap border-b border-line/50 pb-2.5">
                    <div className="flex items-center gap-2">
                      <FolderArchive className="h-4 w-4 text-indigo-600" />
                      <h3 className="text-xs sm:text-sm font-extrabold text-ink">
                        Intake Documents Vault
                      </h3>
                    </div>
                    {/* BORDER-FREE PASTEL BADGE */}
                    <span className="px-2.5 py-0.5 rounded-md bg-indigo-100/90 text-indigo-800 text-[11px] font-bold">
                      {documents.length} Files Uploaded
                    </span>
                  </div>

                  {documents.length === 0 ? (
                    <p className="text-xs text-ink-subtle italic py-1">
                      No intake documents attached.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="rounded-xl bg-inset p-3 border border-line/60 flex flex-col justify-between gap-2"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-mono text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-card border border-line text-ink-subtle">
                                {doc.doc_type.replace(/_/g, " ")}
                              </span>
                              <span className="text-[10px] text-ink-subtle">
                                {formatDateIST(doc.uploaded_at)}
                              </span>
                            </div>
                            <p className="text-xs font-bold text-ink truncate pt-0.5">
                              {doc.file_name || doc.doc_type}
                            </p>
                            <p className="text-[10px] text-ink-muted">
                              By {doc.uploaded_by?.name || "Staff"}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              setPreviewDocUrl({
                                id: doc.id,
                                url: doc.file_url,
                                mimeType: doc.mime_type || undefined,
                                title: doc.file_name || doc.doc_type,
                              })
                            }
                            className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-card hover:bg-inset border border-line text-xs font-semibold text-ink transition-colors cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5 text-ink-subtle" />
                            <span>View</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* PHASE 3: REFURBISHMENT */}
              <div className="relative group space-y-2">
                <div className="absolute -left-[25px] sm:-left-[33px] top-1 h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                  3
                </div>

                <div className="rounded-2xl bg-card border border-line p-4 sm:p-5 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap border-b border-line/50 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Wrench className="h-4 w-4 text-amber-600" />
                      <h3 className="text-xs sm:text-sm font-extrabold text-ink">
                        Refurbishment &amp; Restoration
                      </h3>
                    </div>
                    {/* BORDER-FREE PASTEL BADGE */}
                    <Badge variant="warning" className="text-xs font-mono font-extrabold px-2.5 py-0.5">
                      Total: {formatCurrencyStr(refurbishment.refurb_total)}
                    </Badge>
                  </div>

                  {refurbishment.items.length === 0 ? (
                    <p className="text-xs text-ink-subtle italic py-1">
                      No refurbishment items logged for this vehicle.
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-line/60 text-[10px] font-bold text-ink-subtle uppercase tracking-wider">
                            <th className="pb-1.5 pl-1">Item</th>
                            <th className="pb-1.5">Vendor</th>
                            <th className="pb-1.5">Status</th>
                            <th className="pb-1.5 text-right pr-1">Cost</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-line/40">
                          {refurbishment.items.map((item) => (
                            <tr
                              key={item.id}
                              className="hover:bg-inset/50 transition-colors"
                            >
                              <td className="py-2 pl-1 font-bold text-ink">
                                {item.item_name}
                              </td>
                              <td className="py-2 text-ink-muted text-[11px]">
                                {item.vendor_name
                                  ? `${item.vendor_name}`
                                  : item.vendor_type || "N/A"}
                              </td>
                              <td className="py-2">
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-inset border border-line text-ink-subtle">
                                  {item.status}
                                </span>
                              </td>
                              <td className="py-2 text-right pr-1 font-mono font-bold text-ink">
                                {formatCurrencyStr(item.cost)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* PHASE 4: STOCK PUBLICATION */}
              <div className="relative group space-y-2">
                <div className="absolute -left-[25px] sm:-left-[33px] top-1 h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                  4
                </div>

                <div className="rounded-2xl bg-card border border-line p-4 sm:p-5 shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <PackageCheck className="h-4 w-4 text-blue-600" />
                      <h3 className="text-xs sm:text-sm font-extrabold text-ink">
                        Showroom Stock Active
                      </h3>
                    </div>
                    {/* BORDER-FREE PASTEL PILL */}
                    <span className="text-[11px] font-mono text-blue-800 bg-blue-100/90 px-2 py-0.5 rounded font-bold">
                      {formatDateTimeIST(stock.stock_added_at)}
                    </span>
                  </div>
                  <p className="text-xs text-ink-muted">
                    Refurbishment completed and vehicle published to showroom
                    active inventory.
                  </p>
                </div>
              </div>

              {/* PHASE 5: BOOKING & 5 SALE DOCUMENTS */}
              <div className="relative group space-y-2">
                <div className="absolute -left-[25px] sm:-left-[33px] top-1 h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                  5
                </div>

                <div className="rounded-2xl bg-card border border-line p-4 sm:p-5 shadow-bento space-y-4">
                  <div className="flex items-center justify-between gap-2 flex-wrap border-b border-line/50 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Receipt className="h-4 w-4 text-purple-600" />
                      <h3 className="text-xs sm:text-sm font-extrabold text-ink">
                        Customer Booking &amp; 5 Sale Documents
                      </h3>
                    </div>
                    {/* BORDER-FREE PASTEL BADGE */}
                    <span className="text-xs font-mono bg-purple-100/90 text-purple-800 px-2.5 py-0.5 rounded-md font-bold">
                      Prebooked {formatDateIST(booking.prebooked_at)}
                    </span>
                  </div>

                  {/* Customer & Rep Quick Card */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-inset p-3 rounded-xl border border-line/60 text-xs">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-ink-subtle uppercase tracking-wider">
                        Booked By Staff
                      </span>
                      <p className="font-bold text-ink flex items-center gap-1">
                        <UserCheck className="h-3.5 w-3.5 text-purple-600" />
                        <span>{booking.booked_by?.name || "Staff"}</span>
                      </p>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-ink-subtle uppercase tracking-wider">
                        Customer Buyer
                      </span>
                      <p className="font-bold text-ink">
                        {booking.customer?.name || "N/A"}
                      </p>
                      <p className="text-ink-muted font-mono text-[11px]">
                        {booking.customer?.phone || ""}
                      </p>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-ink-subtle uppercase tracking-wider">
                        Agreed Value
                      </span>
                      <p className="font-mono font-bold text-ink">
                        {formatCurrencyStr(booking.agreed_price)}
                      </p>
                    </div>
                  </div>

                  {/* THE 5 DOCUMENTS LIST */}
                  <div className="space-y-2 pt-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-ink-subtle">
                      Finalized Sale Documents Vault
                    </div>

                    <div className="space-y-2">
                      {/* Doc 1: Agreement */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-xl bg-inset border border-line/70">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-lg bg-card border border-line flex items-center justify-center text-slate-700 shrink-0">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-ink">
                              Advance Sale Agreement
                            </h4>
                            <p className="text-[10px] text-ink-muted">
                              Created{" "}
                              {formatDateTimeIST(
                                booking.documents?.advance_agreement?.created_at
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 self-end sm:self-center">
                          <button
                            type="button"
                            disabled={activePdfLoading === "view_agreement"}
                            onClick={() =>
                              handleViewPdf("agreement", booking.id)
                            }
                            className="px-2.5 py-1 rounded-md bg-card hover:bg-inset border border-line text-xs font-semibold text-ink transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                          >
                            {activePdfLoading === "view_agreement" ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Eye className="h-3 w-3 text-ink-subtle" />
                            )}
                            <span>View</span>
                          </button>
                          <button
                            type="button"
                            disabled={activePdfLoading === "dl_agreement"}
                            onClick={() =>
                              handleDownloadPdf(
                                "agreement",
                                booking.id,
                                buildDocFilename(
                                  "Advance-Agreement-Receipt",
                                  booking.booking_number,
                                  booking.customer?.name
                                )
                              )
                            }
                            className="px-2.5 py-1 rounded-md bg-card hover:bg-inset border border-line text-xs font-semibold text-ink transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                          >
                            {activePdfLoading === "dl_agreement" ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Download className="h-3 w-3 text-ink-subtle" />
                            )}
                            <span>Download</span>
                          </button>
                        </div>
                      </div>

                      {/* Doc 2: Order Form */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-xl bg-inset border border-line/70">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-lg bg-card border border-line flex items-center justify-center text-slate-700 shrink-0">
                            <FileCheck2 className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-xs font-bold text-ink">
                                Order Form &amp; Accessories
                              </h4>
                              {!booking.documents?.order_form?.exists && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-card border border-line text-ink-subtle">
                                  Not Added
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-ink-muted">
                              {booking.documents?.order_form?.exists
                                ? `Created ${formatDateTimeIST(
                                    booking.documents?.order_form?.created_at
                                  )}`
                                : "No order form created"}
                            </p>
                          </div>
                        </div>

                        {booking.documents?.order_form?.exists ? (
                          <div className="flex items-center gap-1.5 self-end sm:self-center">
                            <button
                              type="button"
                              disabled={activePdfLoading === "view_order"}
                              onClick={() => handleViewPdf("order", booking.id)}
                              className="px-2.5 py-1 rounded-md bg-card hover:bg-inset border border-line text-xs font-semibold text-ink transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                            >
                              {activePdfLoading === "view_order" ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Eye className="h-3 w-3 text-ink-subtle" />
                              )}
                              <span>View</span>
                            </button>
                            <button
                              type="button"
                              disabled={activePdfLoading === "dl_order"}
                              onClick={() =>
                                handleDownloadPdf(
                                  "order",
                                  booking.id,
                                  buildDocFilename(
                                    "Order-Form",
                                    booking.booking_number,
                                    booking.customer?.name
                                  )
                                )
                              }
                              className="px-2.5 py-1 rounded-md bg-card hover:bg-inset border border-line text-xs font-semibold text-ink transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                            >
                              {activePdfLoading === "dl_order" ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Download className="h-3 w-3 text-ink-subtle" />
                              )}
                              <span>Download</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-ink-subtle italic self-end sm:self-center">
                            N/A
                          </span>
                        )}
                      </div>

                      {/* Doc 3: Settlement */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-xl bg-inset border border-line/70">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-lg bg-card border border-line flex items-center justify-center text-slate-700 shrink-0">
                            <Coins className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-ink">
                              Settlement Form
                            </h4>
                            <p className="text-[10px] text-ink-muted">
                              Created{" "}
                              {formatDateTimeIST(
                                booking.documents?.settlement?.created_at
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 self-end sm:self-center">
                          <button
                            type="button"
                            disabled={activePdfLoading === "view_settlement"}
                            onClick={() =>
                              handleViewPdf("settlement", booking.id)
                            }
                            className="px-2.5 py-1 rounded-md bg-card hover:bg-inset border border-line text-xs font-semibold text-ink transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                          >
                            {activePdfLoading === "view_settlement" ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Eye className="h-3 w-3 text-ink-subtle" />
                            )}
                            <span>View</span>
                          </button>
                          <button
                            type="button"
                            disabled={activePdfLoading === "dl_settlement"}
                            onClick={() =>
                              handleDownloadPdf(
                                "settlement",
                                booking.id,
                                buildDocFilename(
                                  "Settlement-Statement",
                                  booking.booking_number,
                                  booking.customer?.name
                                )
                              )
                            }
                            className="px-2.5 py-1 rounded-md bg-card hover:bg-inset border border-line text-xs font-semibold text-ink transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                          >
                            {activePdfLoading === "dl_settlement" ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Download className="h-3 w-3 text-ink-subtle" />
                            )}
                            <span>Download</span>
                          </button>
                        </div>
                      </div>

                      {/* Doc 4: Delivery Note */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-xl bg-inset border border-line/70">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-lg bg-card border border-line flex items-center justify-center text-slate-700 shrink-0">
                            <PackageCheck className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-ink">
                              Delivery Handover Note
                            </h4>
                            <p className="text-[10px] text-ink-muted">
                              Created{" "}
                              {formatDateTimeIST(
                                booking.documents?.delivery_note?.created_at
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 self-end sm:self-center">
                          <button
                            type="button"
                            disabled={activePdfLoading === "view_delivery"}
                            onClick={() =>
                              handleViewPdf("delivery", booking.id)
                            }
                            className="px-2.5 py-1 rounded-md bg-card hover:bg-inset border border-line text-xs font-semibold text-ink transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                          >
                            {activePdfLoading === "view_delivery" ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Eye className="h-3 w-3 text-ink-subtle" />
                            )}
                            <span>View</span>
                          </button>
                          <button
                            type="button"
                            disabled={activePdfLoading === "dl_delivery"}
                            onClick={() =>
                              handleDownloadPdf(
                                "delivery",
                                booking.id,
                                buildDocFilename(
                                  "Delivery-Note",
                                  booking.booking_number,
                                  booking.customer?.name
                                )
                              )
                            }
                            className="px-2.5 py-1 rounded-md bg-card hover:bg-inset border border-line text-xs font-semibold text-ink transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                          >
                            {activePdfLoading === "dl_delivery" ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Download className="h-3 w-3 text-ink-subtle" />
                            )}
                            <span>Download</span>
                          </button>
                        </div>
                      </div>

                      {/* Doc 5: RC Transfer */}
                      <div className="rounded-xl bg-inset border border-line/70 p-3 space-y-2">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-lg bg-card border border-line flex items-center justify-center text-emerald-600 shrink-0">
                              <CheckCircle2 className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-xs font-bold text-ink">
                                  RC Transfer Record &amp; Files
                                </h4>
                                {booking.documents?.rc_transfer
                                  ?.rc_transfer_date && (
                                  <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100/90 px-1.5 py-0.5 rounded">
                                    Transfer:{" "}
                                    {
                                      booking.documents.rc_transfer
                                        .rc_transfer_date
                                    }
                                  </span>
                                )}
                                {rcDocs.length > 0 && (
                                  <span className="text-[10px] font-mono font-bold text-indigo-800 bg-indigo-100/90 px-1.5 py-0.5 rounded">
                                    {rcDocs.length}{" "}
                                    {rcDocs.length === 1 ? "file" : "files"}
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-ink-muted">
                                {booking.documents?.rc_transfer?.uploaded_at
                                  ? `Uploaded ${formatDateTimeIST(
                                      booking.documents.rc_transfer.uploaded_at
                                    )}`
                                  : "RC transfer document files uploaded during sale closure"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {rcDocs.length > 0 ? (
                          <div className="space-y-1.5 pt-1">
                            {rcDocs.map((doc, idx) => (
                              <div
                                key={doc.id || idx}
                                className="flex items-center justify-between gap-2 p-2 rounded-lg bg-card border border-line/50 text-xs"
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <FileText className="h-3.5 w-3.5 text-ink-subtle shrink-0" />
                                  <span className="font-medium text-ink truncate">
                                    {doc.file_name || `RC Transfer File ${idx + 1}`}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setPreviewDocUrl({
                                        id: doc.id,
                                        url: doc.stream_url,
                                        mimeType: doc.mime_type || undefined,
                                        title: doc.file_name || `RC Transfer File ${idx + 1} - ${car.reg_number}`,
                                      })
                                    }
                                    className="px-2.5 py-1 rounded-md bg-inset hover:bg-line/40 border border-line text-xs font-semibold text-ink transition-colors flex items-center gap-1 cursor-pointer"
                                  >
                                    <Eye className="h-3 w-3 text-ink-subtle" />
                                    <span>View</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      downloadFile({
                                        url: doc.stream_url,
                                        fileName: doc.file_name || `RC_Transfer_${car.reg_number}_${idx + 1}`,
                                        mimeType: doc.mime_type || undefined,
                                        title: `RC Transfer - ${car.reg_number}`,
                                      })
                                    }
                                    className="px-2.5 py-1 rounded-md bg-inset hover:bg-line/40 border border-line text-xs font-semibold text-ink transition-colors flex items-center gap-1 cursor-pointer"
                                  >
                                    <Download className="h-3 w-3 text-ink-subtle" />
                                    <span>Download</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : booking.documents?.rc_transfer?.rc_document_url ? (
                          <div className="flex items-center justify-between gap-2 pt-1">
                            <span className="text-xs font-medium text-ink">
                              RC Transfer Document
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setPreviewDocUrl({
                                  url: booking.documents.rc_transfer
                                    .rc_document_url!,
                                  title: `RC Transfer Document - ${car.reg_number}`,
                                })
                              }
                              className="px-2.5 py-1 rounded-md bg-card hover:bg-inset border border-line text-xs font-semibold text-ink transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Eye className="h-3 w-3 text-ink-subtle" />
                              <span>View</span>
                            </button>
                          </div>
                        ) : (
                          <div className="pt-1">
                            <span className="text-[11px] text-ink-subtle italic">
                              No File
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Delivery Handover Photos Section */}
                      {deliveryImgs.length > 0 && (
                        <div className="space-y-2 pt-3 border-t border-line/50">
                          <div className="flex items-center justify-between gap-2">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-ink-subtle flex items-center gap-1.5">
                              <PackageCheck className="h-3.5 w-3.5 text-blue-600" />
                              <span>
                                Delivery Handover Photos ({deliveryImgs.length})
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                            {deliveryImgs.map((img, idx) => (
                              <div
                                key={img.id || idx}
                                onClick={() =>
                                  setPreviewDocUrl({
                                    id: img.id,
                                    url: img.stream_url,
                                    mimeType: img.mime_type || "image/jpeg",
                                    title: img.file_name || `Delivery Photo ${idx + 1} - ${car.reg_number}`,
                                  })
                                }
                                className="group relative rounded-xl bg-inset border border-line/60 overflow-hidden flex flex-col justify-between cursor-pointer"
                              >
                                <div className="relative aspect-4/3 w-full bg-slate-900 overflow-hidden">
                                  <AuthenticatedImage
                                    src={img.stream_url}
                                    alt={img.file_name || `Delivery photo ${idx + 1}`}
                                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="p-1.5 rounded-lg bg-black/70 text-white flex items-center justify-center">
                                      <Eye className="h-3.5 w-3.5" />
                                    </span>
                                  </div>
                                </div>
                                <div className="p-2 bg-inset text-[10px]">
                                  <p className="font-semibold text-ink truncate">
                                    {img.file_name || `Delivery Photo ${idx + 1}`}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* PHASE 6: FINALIZED SALE */}
              <div className="relative group space-y-2">
                <div className="absolute -left-[25px] sm:-left-[33px] top-1 h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                  ✓
                </div>

                {/* SOFT PASTEL CARD */}
                <div className="rounded-2xl bg-card border border-line p-4 sm:p-5 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap border-b border-line/50 pb-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <h3 className="text-xs sm:text-sm font-extrabold text-ink">
                        Sale Finalized &amp; Closed
                      </h3>
                    </div>
                    <span className="text-xs font-mono text-ink-muted">
                      {formatDateTimeIST(sale.closed_at)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-ink-subtle uppercase tracking-wider">
                        Final Value
                      </span>
                      <p className="font-extrabold font-mono text-ink">
                        {formatCurrencyStr(sale.final_sale_value)}
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-ink-subtle uppercase tracking-wider">
                        Total Collected
                      </span>
                      {/* BORDER-FREE PASTEL PILL */}
                      <p className="font-extrabold font-mono text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded">
                        {formatCurrencyStr(sale.total_collected)}
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-ink-subtle uppercase tracking-wider">
                        Sales Rep
                      </span>
                      <p className="font-bold text-ink truncate">
                        {sale.sold_by?.name || "Staff"}
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-ink-subtle uppercase tracking-wider">
                        RC Closed By
                      </span>
                      <p className="font-bold text-ink truncate">
                        {sale.closed_by?.name || "Staff"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================== */}
        {/* RIGHT COLUMN: STICKY OWNER FINANCIALS & QUICK PASSPORT       */}
        {/* =========================================================== */}
        <div
          className={`lg:col-span-4 space-y-5 lg:sticky lg:top-4 ${
            mobileTab === "journey" ? "hidden md:block" : ""
          }`}
        >
          {/* OWNER MONEY STORY CARD */}
          <div className="rounded-2xl bg-card border border-line p-5 shadow-bento space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-line/60 pb-3">
              <div className="flex items-center gap-2">
                <Coins className="h-4 w-4 text-emerald-600" />
                <h3 className="text-sm font-extrabold font-heading text-ink">
                  The Money Story
                </h3>
              </div>
              {/* BORDER-FREE PASTEL BADGE */}
              <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider">
                Owner Confidential
              </span>
            </div>

            {/* Net Profit Banner (Border-Free Pastel Emerald Card) */}
            <div className="p-4 rounded-xl bg-emerald-100/80 text-emerald-900 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 block">
                Net Profit Realized
              </span>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-xl font-extrabold font-mono text-emerald-950">
                  ₹{formatIndianNumber(grossProfit)}
                </span>
                <span className="text-xs font-extrabold text-emerald-900 font-mono bg-emerald-200/70 px-2 py-0.5 rounded">
                  {marginPercent}% ROI
                </span>
              </div>
            </div>

            {/* Stepped Financial Breakdown */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-inset border border-line/60">
                <span className="text-ink-muted font-medium">
                  Purchase Amount
                </span>
                <span className="font-mono font-bold text-ink">
                  {formatCurrencyStr(pricing.purchase_amount)}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-inset border border-line/60">
                <span className="text-ink-muted font-medium">
                  + Refurbishment
                </span>
                <span className="font-mono font-bold text-ink">
                  {formatCurrencyStr(pricing.refurb_total)}
                </span>
              </div>

              {/* Total Landing Price (Border-Free Soft Pastel Sky Card) */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-sky-100/80 text-sky-950">
                <span className="text-sky-900 font-bold">
                  Total Landing Price
                </span>
                <span className="font-mono font-extrabold text-sky-950">
                  {formatCurrencyStr(pricing.landing_price)}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-inset border border-line/60">
                <span className="text-ink-muted font-medium">
                  + Owner Target Margin
                </span>
                <span className="font-mono font-bold text-ink">
                  {formatCurrencyStr(pricing.margin)}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-inset border border-line/60">
                <span className="text-ink-muted font-medium">
                  Asking Selling Price
                </span>
                <span className="font-mono font-bold text-ink">
                  {formatCurrencyStr(pricing.selling_price)}
                </span>
              </div>

              {/* Agreed Sale Value (Border-Free Soft Pastel Emerald Card) */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-100/80 text-emerald-950 pt-3">
                <span className="font-extrabold text-emerald-900">
                  Agreed Sale Value
                </span>
                <span className="font-mono text-base font-extrabold text-emerald-950">
                  {formatCurrencyStr(booking.agreed_price)}
                </span>
              </div>
            </div>
          </div>

          {/* TABLET / DESKTOP RESPONSIVE SUB-GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-5">
            {/* VEHICLE QUICK PASSPORT */}
            <div className="rounded-2xl bg-card border border-line p-5 shadow-2xs space-y-3">
              <h3 className="text-xs font-extrabold text-ink uppercase tracking-wider border-b border-line/50 pb-2">
                Vehicle Quick Passport
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-line/40">
                  <span className="text-ink-muted">Make &amp; Model</span>
                  <span className="font-bold text-ink text-right">
                    {car.make} {car.model}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-line/40">
                  <span className="text-ink-muted">Year</span>
                  <span className="font-mono font-bold text-ink">
                    {car.year}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-line/40">
                  <span className="text-ink-muted">Reg Number</span>
                  <span className="font-mono font-bold text-ink">
                    {car.reg_number}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-line/40">
                  <span className="text-ink-muted">Fuel / Transmission</span>
                  <span className="font-bold text-ink capitalize">
                    {car.fuel_type || "N/A"} · {car.transmission || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-ink-muted">Distance Driven</span>
                  <span className="font-mono font-bold text-ink">
                    {car.km_driven
                      ? `${formatIndianNumber(car.km_driven)} km`
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* TRANSACTION PARTIES CARD */}
            <div className="rounded-2xl bg-card border border-line p-5 shadow-2xs space-y-3">
              <h3 className="text-xs font-extrabold text-ink uppercase tracking-wider border-b border-line/50 pb-2">
                Transaction Stakeholders
              </h3>
              <div className="space-y-2.5 text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-ink-subtle font-bold uppercase tracking-wider">
                    Customer Buyer
                  </span>
                  <p className="font-bold text-ink">
                    {booking.customer?.name || "N/A"}
                  </p>
                  <p className="text-ink-muted font-mono text-[11px]">
                    {booking.customer?.phone || ""}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-ink-subtle font-bold uppercase tracking-wider">
                    Sales Representative Credited
                  </span>
                  <p className="font-bold text-ink">
                    {sale.sold_by?.name || "Staff"}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-ink-subtle font-bold uppercase tracking-wider">
                    RC Transfer Closed By
                  </span>
                  <p className="font-bold text-ink">
                    {sale.closed_by?.name || "Staff"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* AUDIT LOG COLLAPSIBLE DRAWER */}
          <div className="rounded-2xl bg-card border border-line overflow-hidden">
            <button
              type="button"
              onClick={() => setIsAuditHistoryOpen(!isAuditHistoryOpen)}
              className="w-full flex items-center justify-between p-4 text-xs font-bold text-ink hover:bg-inset transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-ink-subtle" />
                <span>Audit Timeline ({lifecycle.length})</span>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-ink-subtle transition-transform ${
                  isAuditHistoryOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isAuditHistoryOpen && (
              <div className="p-3 border-t border-line space-y-2 max-h-60 overflow-y-auto">
                {lifecycle.map((h, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-inset text-[11px] space-y-0.5"
                  >
                    <div className="flex justify-between font-mono text-[10px] text-ink-subtle">
                      <span>{formatDateIST(h.created_at)}</span>
                      <span>By {h.changed_by?.name || "System"}</span>
                    </div>
                    <p className="font-bold text-ink">
                      {h.from_status ? `${h.from_status} → ` : ""}
                      <span className="text-ink font-mono">{h.to_status}</span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* DOCUMENT PREVIEW MODAL                                        */}
      {/* ------------------------------------------------------------- */}
      {previewDocUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl h-[85vh] bg-card rounded-2xl border border-line flex flex-col overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-3.5 border-b border-line">
              <h3 className="text-xs font-bold text-ink truncate">
                {previewDocUrl.title}
              </h3>
              <div className="flex items-center gap-2">
                {(() => {
                  const vehiclePrefix = `${car.reg_number ? car.reg_number : `${car.make}_${car.model}`}`;
                  const isImage =
                    previewDocUrl.mimeType?.startsWith("image/") ||
                    /\.(jpg|jpeg|png|webp|gif|svg)(\?|$)/i.test(previewDocUrl.url);
                  const ext = isImage
                    ? previewDocUrl.mimeType?.split("/")[1] || "jpg"
                    : "pdf";
                  const docFilename = `${vehiclePrefix}_${previewDocUrl.title || "Document"}.${ext}`;

                  return (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          downloadFile({
                            url: previewDocUrl.url,
                            fileName: docFilename,
                            mimeType: previewDocUrl.mimeType,
                          })
                        }
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-ink-muted bg-inset hover:bg-line/40 border border-line cursor-pointer"
                        title="Download Document"
                      >
                        <Download className="h-3.5 w-3.5 stroke-[2px]" />
                        <span className="hidden sm:inline">Download</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          shareFile({
                            url: previewDocUrl.url,
                            fileName: docFilename,
                            title: `${car.make} ${car.model} - ${previewDocUrl.title}`,
                            text: car.reg_number ? `Registration: ${car.reg_number}` : undefined,
                            mimeType: previewDocUrl.mimeType || (isImage ? "image/jpeg" : "application/pdf"),
                          })
                        }
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-500/10 hover:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/20 transition-all px-2.5 py-1 rounded-lg cursor-pointer"
                        title="Share Document"
                      >
                        <Share2 className="h-3.5 w-3.5 stroke-[2px]" />
                        <span className="hidden sm:inline">Share</span>
                      </button>
                    </>
                  );
                })()}

                <button
                  type="button"
                  onClick={() => setPreviewDocUrl(null)}
                  className="p-1.5 text-ink-muted hover:text-ink rounded-lg bg-inset border border-line transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 w-full bg-inset relative flex items-center justify-center overflow-auto p-2 sm:p-4">
              {previewDocUrl.mimeType?.startsWith("image/") ||
              /\.(jpg|jpeg|png|webp|gif|svg)(\?|$)/i.test(previewDocUrl.url) ? (
                <AuthenticatedImage
                  src={previewDocUrl.url}
                  alt={previewDocUrl.title}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-md"
                />
              ) : (
                <iframe
                  src={previewDocUrl.url}
                  className="w-full h-full border-0"
                  title={previewDocUrl.title}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* PHOTO LIGHTBOX MODAL                                          */}
      {/* ------------------------------------------------------------- */}
      {isLightboxOpen && currentPhoto && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            {(() => {
              const vehiclePrefix = `${car.reg_number ? car.reg_number : `${car.make}_${car.model}`}`;
              const photoFilename = `${vehiclePrefix}-photo-${selectedPhotoIndex + 1}.jpg`;
              const photoObj =
                car.photos && typeof car.photos[selectedPhotoIndex] === "object"
                  ? (car.photos[selectedPhotoIndex] as { id?: string })
                  : null;
              const photoId = photoObj?.id;

              return (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      downloadFile({
                        fetchBlob: photoId
                          ? () => carPhotosApi.getPhotoFileBlob(car.id, photoId)
                          : undefined,
                        url: photoId ? undefined : currentPhoto,
                        fileName: photoFilename,
                      })
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                    title="Download Photo"
                  >
                    <Download className="h-3.5 w-3.5 stroke-[2px]" />
                    <span className="hidden sm:inline">Download</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      shareFile({
                        fetchBlob: photoId
                          ? () => carPhotosApi.getPhotoFileBlob(car.id, photoId)
                          : undefined,
                        url: photoId ? undefined : currentPhoto,
                        fileName: photoFilename,
                        title: `${car.make} ${car.model} Photo`,
                        text: car.reg_number ? `Registration: ${car.reg_number}` : undefined,
                        mimeType: "image/jpeg",
                      })
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-300 bg-emerald-500/20 hover:bg-emerald-500/30 transition-colors cursor-pointer"
                    title="Share Photo"
                  >
                    <Share2 className="h-3.5 w-3.5 stroke-[2px]" />
                    <span className="hidden sm:inline">Share</span>
                  </button>
                </>
              );
            })()}

            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors cursor-pointer"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="max-w-5xl max-h-[90vh] relative flex flex-col items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentPhoto}
              alt={`${car.year} ${car.make} ${car.model}`}
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />
            <p className="text-white text-xs font-semibold mt-3">
              Photo {selectedPhotoIndex + 1} of {photoList.length} — {car.year}{" "}
              {car.make} {car.model}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
