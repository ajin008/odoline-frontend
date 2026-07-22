// File: src/features/cars/components/refurbishment-tab.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight, PackageCheck, AlertCircle } from "lucide-react";
import { useRefurbishmentItems } from "../hooks/use-refurbishment";
import { useCar, useAddToCartStock } from "../hooks/use-car";
import { useCarDocuments } from "../hooks/use-documents";
import { DOCUMENT_CONFIGS } from "../type/document-types";
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

  // Check mandatory hard documents (RC Book & Purchase Photo)
  const uploadedDocTypes = new Set(documents.map((doc) => doc.document_type));
  const missingHardDocs = DOCUMENT_CONFIGS.filter(
    (cfg) => cfg.isHardDoc && !uploadedDocTypes.has(cfg.type)
  );
  const isMissingHardDocs = missingHardDocs.length > 0;

  // Check pending workshop refurbishment tasks (must be 100% completed / Done)
  const hasPendingRefurbTasks =
    items.length > 0 && items.some((item) => item.status !== "done");

  if (isCarLoading || isItemsLoading || isDocsLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-line bg-card">
        <Loader2 className="h-6 w-6 animate-spin text-ink-muted" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 select-none font-sans">
        {/* 1. Pricing Pipeline Summary with Live Margin Input */}
        <div className="pb-6 border-b border-line/60">
          <RefurbPricingSummary
            carId={carId}
            purchaseNum={purchaseNum}
            refurbNum={refurbNum}
            landingNum={landingNum}
            initialMargin={marginNum}
            sellingNum={sellingNum}
          />
        </div>

        {/* 2. Add Workshop Task Form */}
        <div className="pb-6 border-b border-line/60">
          <AddRefurbItemForm carId={carId} />
        </div>

        {/* 3. Workshop Task List Matrix */}
        <div className="pb-6 border-b border-line/60">
          <RefurbTaskList
            carId={carId}
            items={items}
            progressPercentage={stats.progressPercentage}
            onViewBill={setBillPreviewUrl}
          />
        </div>

        {/* 4. Action Buttons & Validation Warnings */}
        <div className="flex flex-col items-end gap-3 pt-2">
          {isMissingHardDocs && !isAlreadyInStock && (
            <div className="flex items-center gap-2 text-xs font-medium text-amber-950 bg-[#f5b023]/10 px-3.5 py-2 rounded-xl border border-[#f5b023]/30">
              <AlertCircle className="h-4 w-4 shrink-0 text-[#f5b023]" />
              <span>
                Mandatory document(s) missing:{" "}
                <strong className="font-semibold text-amber-950">
                  {missingHardDocs.map((d) => d.label).join(" & ")}
                </strong>
              </span>
            </div>
          )}

          {hasPendingRefurbTasks && !isAlreadyInStock && (
            <div className="flex items-center gap-2 text-xs font-medium text-amber-950 bg-[#f5b023]/10 px-3.5 py-2 rounded-xl border border-[#f5b023]/30">
              <AlertCircle className="h-4 w-4 shrink-0 text-[#f5b023]" />
              <span>
                Workshop tasks pending:{" "}
                <strong className="font-semibold text-amber-950">
                  All refurbishment tasks must be marked as Done before moving to stock.
                </strong>
              </span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            {/* Leave it for Now Button */}
            <button
              type="button"
              onClick={() => router.push("/owner/inventory")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-line bg-inset px-4 py-3 text-xs font-bold text-ink-muted hover:text-ink hover:bg-card transition-all cursor-pointer"
            >
              Leave it for Now
            </button>

            {/* Add to Stock Button */}
            <button
              type="button"
              disabled={
                addToStockMutation.isPending ||
                isAlreadyInStock ||
                isMissingHardDocs ||
                hasPendingRefurbTasks
              }
              onClick={() => addToStockMutation.mutate()}
              className="w-full sm:w-auto min-w-45 inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-bold text-inverse transition-all hover:bg-accent-hover active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {addToStockMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isAlreadyInStock ? (
                <>
                  <PackageCheck className="h-4 w-4 stroke-[2.5px]" />
                  Car Currently In Stock
                </>
              ) : (
                <>
                  {isWizardMode ? "Complete & Add to Stock" : "Add to Stock"}
                  <ArrowRight className="h-4 w-4 stroke-[2.5px]" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 5. Bill Preview Modal */}
      <BillPreviewModal
        billPreviewUrl={billPreviewUrl}
        onClose={() => setBillPreviewUrl(null)}
      />

      {/* 6. Custom Stock Transition Success Modal with Tick Mark Animation */}
      <StockSuccessModal
        isOpen={addToStockMutation.isSuccess}
        redirectPath="/owner/inventory?tab=in_stock"
      />
    </>
  );
}
