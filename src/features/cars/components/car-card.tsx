/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  MapPin,
  FileText,
  Wrench,
  CheckCircle2,
  AlertCircle,
  Calendar,
  X,
} from "lucide-react";
import type { Car } from "../api/cars-api";
import { CarThumbnail } from "./car-thumbnail";

export function CarCard({ car }: { car: Car }) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isInStock = car.status.toLowerCase() === "in_stock";

  const docsSummary = car.progress_summary?.documents;
  const refurbSummary = car.progress_summary?.refurbishment;

  // In Stock: stock_added_at & holding days
  const stockAddedDate = car.stock_added_at
    ? new Date(car.stock_added_at)
    : null;
  const formattedStockAddedDate = stockAddedDate
    ? stockAddedDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  const holdingDays = stockAddedDate
    ? Math.max(
        0,
        Math.floor(
          (new Date().getTime() - stockAddedDate.getTime()) /
            (1000 * 60 * 60 * 24)
        )
      )
    : null;

  // Pipeline: purchasing_at
  const formattedPurchaseDate =
    !isInStock && car.purchasing_at
      ? new Date(car.purchasing_at).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : null;

  // Asking Price (from server-computed selling_price or landing_price)
  const askingPriceNum = Number(car.selling_price || car.landing_price || 0);
  const formattedAskingPrice =
    askingPriceNum > 0 ? `₹${askingPriceNum.toLocaleString("en-IN")}` : null;

  return (
    <>
      <Link
        href={`/owner/cars/${car.id}/intake`}
        className={[
          "group flex flex-col justify-between rounded-xl border border-line bg-card overflow-hidden transition-all duration-300 select-none",
          "hover:border-accent hover:-translate-y-0.5 active:scale-[0.98]",
        ].join(" ")}
      >
        {/* Dynamic Thumbnail Header */}
        <div className="relative aspect-video w-full bg-inset border-b border-line/40 overflow-hidden shrink-0">
          <CarThumbnail
            carId={car.id}
            thumbnailUrl={car.thumbnail_url}
            onPreview={(url) => setPreviewUrl(url)}
          />
          {isInStock && holdingDays !== null && (
            <div
              className={[
                "absolute top-2 left-2 z-10 flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold font-mono tracking-tight shadow-sm backdrop-blur-xs border select-none",
                holdingDays >= 45
                  ? "bg-red-600/90 text-white border-red-500/50"
                  : holdingDays >= 30
                  ? "bg-amber-600/90 text-white border-amber-500/50"
                  : "bg-black/60 text-white/90 border-white/20",
              ].join(" ")}
            >
              <span>{holdingDays}d in stock</span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4.5 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-2.5">
            {/* Header Title & Main Status Badge */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                {/* Make / Brand (Upper sub-heading) */}
                <p className="text-[10px] font-mono font-bold tracking-widest text-ink-muted uppercase truncate">
                  {car.make}
                </p>
                {/* Model Name (Main headline) */}
                <h3 className="font-heading text-base font-bold text-ink tracking-tight line-clamp-1 group-hover:text-accent transition-colors duration-200 mt-0.5">
                  {car.model}
                </h3>
              </div>

              <span
                className={[
                  "text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-md shrink-0 mt-0.5 border shadow-sm text-white",
                  car.status.toLowerCase() === "purchasing"
                    ? "bg-amber-500 border-amber-600/30"
                    : car.status.toLowerCase() === "in_refurbishment"
                    ? "bg-indigo-600 border-indigo-700/30"
                    : car.status.toLowerCase() === "in_stock"
                    ? "bg-emerald-600 border-emerald-700/30"
                    : car.status.toLowerCase() === "refurb_complete"
                    ? "bg-teal-600 border-teal-700/30"
                    : car.status.toLowerCase() === "booked"
                    ? "bg-purple-600 border-purple-700/30"
                    : "bg-zinc-700 border-zinc-800/30",
                ].join(" ")}
              >
                {car.status.replace("_", " ")}
              </span>
            </div>

            {/* Specs & Timestamp Sub-line */}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-ink-subtle font-sans flex-wrap">
              <span className="bg-inset border border-line px-1.5 py-0.5 rounded text-[10px] font-mono font-medium text-ink-muted">
                {car.year}
              </span>
              <span>•</span>
              <span>{car.km_driven?.toLocaleString("en-IN") ?? "0"} km</span>

              {/* In Stock: Render stock_added_at & holding days */}
              {isInStock && formattedStockAddedDate && (
                <>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium text-ink-muted">
                    <Calendar className="h-3 w-3 text-ink-subtle shrink-0" />
                    {formattedStockAddedDate}
                  </span>
                  {typeof holdingDays === "number" && (
                    <span className="bg-emerald-500/15 text-emerald-700 border border-emerald-500/30 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold">
                      {holdingDays === 0
                        ? "Stocked Today"
                        : holdingDays === 1
                        ? "1 Day in Stock"
                        : `${holdingDays} Days in Stock`}
                    </span>
                  )}
                </>
              )}

              {/* Pipeline: Render purchasing_at */}
              {!isInStock && formattedPurchaseDate && (
                <>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium text-ink-muted">
                    <Calendar className="h-3 w-3 text-ink-subtle shrink-0" />
                    {formattedPurchaseDate}
                  </span>
                </>
              )}
            </div>

            {/* Progress Summary Section */}
            {(docsSummary || refurbSummary) && (
              <div className="pt-2 border-t border-line/50 space-y-2 text-[11px] font-sans">
                {/* Document Progress Summary Badge */}
                {docsSummary && (
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5 text-ink-muted min-w-0">
                      <FileText className="h-3.5 w-3.5 shrink-0 text-ink-subtle" />
                      <span className="truncate">Docs:</span>
                    </div>

                    {/* 1. RED / DANGER: Mandatory Hard Docs Missing */}
                    {docsSummary.hard_docs_complete === false ||
                    (docsSummary.pending_required &&
                      docsSummary.pending_required > 0) ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-white bg-rose-600 px-2 py-0.5 rounded-md shadow-sm border border-rose-700/30 shrink-0">
                        <AlertCircle className="h-3 w-3 text-white stroke-[2.5px]" />
                        Mandatory Docs Missing
                      </span>
                    ) : docsSummary.has_pending ? (
                      /* 2. YELLOW / WARNING: Soft / Optional Docs Pending */
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-white bg-amber-500 px-2 py-0.5 rounded-md shadow-sm border border-amber-600/30 shrink-0">
                        <AlertCircle className="h-3 w-3 text-white stroke-[2.5px]" />
                        Docs Pending
                      </span>
                    ) : (
                      /* 3. GREEN / SUCCESS: All Docs Uploaded */
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-white bg-emerald-600 px-2 py-0.5 rounded-md shadow-sm border border-emerald-700/30 shrink-0">
                        <CheckCircle2 className="h-3 w-3 text-white stroke-[2.5px]" />
                        Docs Complete
                      </span>
                    )}
                  </div>
                )}

                {/* Refurbishment Progress Summary */}
                {refurbSummary && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-ink-muted">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Wrench className="h-3.5 w-3.5 shrink-0 text-ink-subtle" />
                        <span className="truncate">Refurb:</span>
                      </div>
                      <span className="font-mono text-[10px] font-bold text-ink">
                        {refurbSummary.total_tasks === 0
                          ? "0 Tasks"
                          : `${refurbSummary.completed_tasks}/${refurbSummary.total_tasks} Done (${refurbSummary.progress_percentage}%)`}
                      </span>
                    </div>

                    {/* Mini Progress Bar */}
                    {refurbSummary.total_tasks > 0 && (
                      <div className="h-1.5 w-full rounded-full bg-inset border border-line/60 overflow-hidden">
                        <div
                          className="h-full bg-accent transition-all duration-300 rounded-full"
                          style={{
                            width: `${refurbSummary.progress_percentage}%`,
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Asking Price Display Row */}
            {formattedAskingPrice && (
              <div className="pt-2 border-t border-line/50 flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted">
                  Asking Price
                </span>
                <span className="text-xs font-bold font-mono text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                  {formattedAskingPrice}
                </span>
              </div>
            )}
          </div>

          {/* Lower Footer Info Section */}
          <div className="pt-2.5 border-t border-line/50 flex items-center justify-between text-[11px] font-medium text-ink-muted font-sans">
            <div className="flex items-center gap-1 min-w-0">
              <MapPin className="h-3.5 w-3.5 text-ink-subtle shrink-0" />
              <span className="truncate tracking-tight font-mono text-[10px] font-medium text-ink-subtle uppercase">
                {car.reg_number || "NO-REG"}
              </span>
            </div>

            <span className="text-accent font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-1 group-hover:translate-x-0 text-xs">
              Resume →
            </span>
          </div>
        </div>
      </Link>

      {/* Image Preview Modal */}
      {previewUrl &&
        mounted &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
            onClick={() => setPreviewUrl(null)}
          >
            <div
              className="relative flex flex-col max-w-4xl w-full max-h-[90vh] bg-card border border-line rounded-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-line px-5 py-4 bg-card z-10">
                <div>
                  <p className="text-[10px] font-mono font-bold tracking-widest text-ink-muted uppercase">
                    {car.make}
                  </p>
                  <h3 className="text-base font-bold tracking-tight text-ink font-heading mt-0.5">
                    {car.model}
                  </h3>
                  <p className="text-[11px] font-mono text-ink-muted mt-0.5">
                    {car.reg_number || "NO-REG"} • {car.year}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setPreviewUrl(null)}
                  className="rounded-lg p-1.5 text-ink-subtle hover:bg-inset hover:text-ink transition-colors cursor-pointer"
                  title="Close preview"
                >
                  <X className="h-5 w-5 stroke-[2.25px]" />
                </button>
              </div>

              {/* Modal Image Body */}
              <div className="flex-1 overflow-auto bg-inset p-4 flex items-center justify-center min-h-[300px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt={`${car.make} ${car.model} Preview`}
                  className="max-h-[75vh] w-auto max-w-full rounded-xl shadow-md object-contain"
                />
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
