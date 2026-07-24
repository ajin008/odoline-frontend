// features/cars/components/car-card.tsx
import Link from "next/link";
import { MapPin, FileText, Wrench, CheckCircle2, AlertCircle, Calendar } from "lucide-react";
import type { Car } from "../api/cars-api";
import { CarThumbnail } from "./car-thumbnail";

export function CarCard({ car }: { car: Car }) {
  const isPurchasing = car.status.toLowerCase() === "purchasing";
  const isInStock = car.status.toLowerCase() === "in_stock";

  const docsSummary = car.progress_summary?.documents;
  const refurbSummary = car.progress_summary?.refurbishment;

  // In Stock: stock_added_at & holding days
  const stockAddedDate = car.stock_added_at ? new Date(car.stock_added_at) : null;
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

  return (
    <Link
      href={`/owner/cars/${car.id}/intake`}
      className={[
        "group flex flex-col justify-between rounded-2xl border border-line bg-card overflow-hidden transition-all duration-300 select-none",
        "hover:border-accent hover:-translate-y-0.5 active:scale-[0.98]",
      ].join(" ")}
    >
      {/* Dynamic Thumbnail Header */}
      <div className="relative aspect-video w-full bg-inset border-b border-line/40 overflow-hidden shrink-0">
        <CarThumbnail carId={car.id} />
      </div>

      {/* Content Section */}
      <div className="p-4.5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          {/* Header Title & Main Status Badge */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-heading text-base font-semibold text-ink tracking-tight line-clamp-1 group-hover:text-accent transition-colors duration-200">
              {car.make} {car.model}
            </h3>

            <span
              className={[
                "text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-md shrink-0 mt-0.5 border",
                isPurchasing
                  ? "bg-warning-light border-warning/10 text-warning"
                  : isInStock
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700"
                  : "bg-accent-light/60 border-accent/10 text-accent",
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
                  <span className="bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold">
                    {holdingDays}d
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
                  (docsSummary.pending_required && docsSummary.pending_required > 0) ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20 shrink-0">
                      <AlertCircle className="h-3 w-3 text-rose-600" />
                      Mandatory Docs Missing
                    </span>
                  ) : docsSummary.has_pending ? (
                    /* 2. YELLOW / WARNING: Soft / Optional Docs Pending */
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 shrink-0">
                      <AlertCircle className="h-3 w-3 text-amber-600" />
                      Docs Pending
                    </span>
                  ) : (
                    /* 3. GREEN / SUCCESS: All Docs Uploaded */
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 shrink-0">
                      <CheckCircle2 className="h-3 w-3" />
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
                        style={{ width: `${refurbSummary.progress_percentage}%` }}
                      />
                    </div>
                  )}
                </div>
              )}
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
  );
}
