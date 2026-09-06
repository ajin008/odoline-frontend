// File: src/features/cars/components/refurbishment-tab.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  ArrowRight,
  PackageCheck,
  AlertCircle,
  Wrench,
  CheckCircle2,
} from "lucide-react";
import { useRefurbishmentItems } from "../hooks/use-refurbishment";
import { useCar, useAddToCartStock } from "../hooks/use-car";
import { useCarDocuments } from "../hooks/use-documents";
import { DOCUMENT_CONFIGS, GroupedDocType } from "../type/document-types";
import { calculateRefurbTotals } from "../utils/refurbishment-helpers";
import { RefurbPricingSummary } from "./refurbishment/refurb-pricing-summary";
import { AddRefurbItemForm } from "./refurbishment/add-refurb-item-form";
import { RefurbTaskList } from "./refurbishment/refurb-task-list";
import { BillPreviewModal } from "./refurbishment/bill-preview-modal";
import { StockSuccessModal } from "./stock-success-modal";

interface RefurbishmentTabProps {
  carId: string;
  isWizardMode?: boolean;
}

export function RefurbishmentTab({
  carId,
  isWizardMode = false,
}: RefurbishmentTabProps) {
  const router = useRouter();
  const { data: car, isLoading: isCarLoading } = useCar(carId);
  const { data: items = [], isLoading: isItemsLoading } =
    useRefurbishmentItems(carId);
  const { data: documents = [], isLoading: isDocsLoading } =
    useCarDocuments(carId);

  const addToStockMutation = useAddToCartStock(carId);
  const [billPreviewUrl, setBillPreviewUrl] = useState<string | null>(null);

  const stats = calculateRefurbTotals(items);

  const purchaseNum = Number(car?.purchase_amount || 0);
  const refurbNum = stats.totalCost || Number(car?.refurb_total || 0);
  const landingNum = purchaseNum + refurbNum;
  const marginNum = Number(car?.margin || 0);
  const sellingNum = landingNum + marginNum;

  const isAlreadyInStock = car?.status === "in_stock";

  const uploadedDocTypes = new Set((documents as GroupedDocType[]).map((doc) => doc.doc_type || (doc as unknown as { document_type?: string }).document_type));
  const missingHardDocs = DOCUMENT_CONFIGS.filter(
    (cfg) => cfg.isHardDoc && !uploadedDocTypes.has(cfg.type)
  );
  const isMissingHardDocs = missingHardDocs.length > 0;

  const hasPendingRefurbTasks =
    items.length > 0 && items.some((item) => item.status !== "done");

  if (isCarLoading || isItemsLoading || isDocsLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl bg-card">
        <Loader2 className="h-6 w-6 animate-spin text-ink-muted" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 sm:space-y-6 select-none font-sans">
        {/* 1. Bento Financial Overview Header */}
        <div className="rounded-2xl bg-card p-2.5 sm:p-6 shadow-bento">
          <RefurbPricingSummary
            carId={carId}
            purchaseNum={purchaseNum}
            refurbNum={refurbNum}
            landingNum={landingNum}
            initialMargin={marginNum}
            sellingNum={sellingNum}
          />
        </div>

        {/* 2. Interactive Workshop Operations Container */}
        <div className="rounded-xl bg-card p-2.5 sm:p-6 shadow-bento space-y-6">
          <div className="flex items-center gap-3 border-b border-line/50 pb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-light text-accent shrink-0">
              <Wrench className="h-4 w-4 stroke-[2.5px]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-ink">
                Workshop & Refurbishment Matrix
              </h2>
              <p className="text-xs text-ink-subtle">
                Register parts, track vendor bills, and monitor task completion status.
              </p>
            </div>
          </div>

          {/* Add Item Form Component */}
          <AddRefurbItemForm carId={carId} />

          <div className="border-t border-line/60 pt-6">
            <RefurbTaskList
              carId={carId}
              items={items}
              progressPercentage={stats.progressPercentage}
              onViewBill={setBillPreviewUrl}
            />
          </div>
        </div>

        {/* 3. Action Hub & Validation Status */}
        <div className="rounded-xl bg-card p-2.5 sm:p-6 shadow-bento space-y-4">
          {(isMissingHardDocs || hasPendingRefurbTasks) && !isAlreadyInStock && (
            <div className="flex flex-col gap-2 p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-950 text-xs">
              {isMissingHardDocs && (
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
                  <span>
                    Mandatory document(s) missing:{" "}
                    <strong className="font-semibold">
                      {missingHardDocs.map((d) => d.label).join(" & ")}
                    </strong>
                  </span>
                </div>
              )}
              {hasPendingRefurbTasks && (
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
                  <span>
                    Workshop tasks pending: All refurbishment tasks must be marked as Done.
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Action Hub */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-ink-muted text-center sm:text-left">
              {isAlreadyInStock ? (
                <span className="inline-flex items-center gap-1.5 text-emerald-600 font-bold">
                  <CheckCircle2 className="h-4 w-4" /> Asset is verified and active in live stock inventory.
                </span>
              ) : (
                <span>
                  Review financial pipeline and ensure tasks are finalized before stocking.
                </span>
              )}
            </div>

            {/* Action Buttons: Stacked Row-by-Row on Mobile, Side-by-Side on Desktop */}
            <div className="flex flex-col sm:flex-row-reverse items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                disabled={
                  addToStockMutation.isPending ||
                  isAlreadyInStock ||
                  isMissingHardDocs ||
                  hasPendingRefurbTasks
                }
                onClick={() => addToStockMutation.mutate()}
                className="w-full sm:w-auto min-h-[44px] min-w-45 inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-bold text-inverse transition-all hover:bg-accent-hover active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addToStockMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isAlreadyInStock ? (
                  <>
                    <PackageCheck className="h-4 w-4 stroke-[2.5px]" />
                    In Stock
                  </>
                ) : (
                  <>
                    {isWizardMode ? "Complete & Add to Stock" : "Add to Stock"}
                    <ArrowRight className="h-4 w-4 stroke-[2.5px]" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => router.push("/owner/inventory")}
                className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center rounded-lg border border-line bg-inset px-4 py-3 text-xs font-bold text-ink-muted hover:text-ink hover:bg-card transition-all active:scale-95 cursor-pointer"
              >
                Leave for Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <BillPreviewModal
        billPreviewUrl={billPreviewUrl}
        onClose={() => setBillPreviewUrl(null)}
      />

      <StockSuccessModal
        isOpen={addToStockMutation.isSuccess}
        redirectPath="/owner/inventory?tab=in_stock"
      />
    </>
  );
}
