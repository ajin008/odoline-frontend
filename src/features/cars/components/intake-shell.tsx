"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useCar } from "../hooks/use-car";
import { VehicleSellerForm } from "./vehicle-seller-form";
import { DocumentsGrid } from "./documents-grid";
import { useCarDocuments } from "../hooks/use-documents";
import { DOCUMENT_CONFIGS } from "../type/document-types";
import { RefurbishmentTab } from "./refurbishment-tab";

const TABS = [
  { key: "vehicle", label: "Vehicle & Seller" },
  { key: "documents", label: "Documents" },
  { key: "refurbishment", label: "Refurbishment" },
] as const;

export function IntakeShell({ carId }: { carId: string }) {
  const { data: car, isLoading: isCarLoading, isError } = useCar(carId);

  const { data: documents = [] } = useCarDocuments(carId);

  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("vehicle");

  const uploadedTypes = new Set(documents.map((d) => d.document_type));
  const pendingDocsCount = DOCUMENT_CONFIGS.filter(
    (cfg) => !uploadedTypes.has(cfg.type)
  ).length;

  if (isCarLoading) {
    return (
      <div className="space-y-4">
        <div className="h-24 animate-pulse rounded-2xl bg-inset border border-line" />
        <div className="h-64 animate-pulse rounded-2xl bg-inset border border-line" />
      </div>
    );
  }

  if (isError || !car) {
    return (
      <div className="rounded-2xl border border-line bg-card p-8 text-center max-w-md mx-auto my-6">
        <p className="text-sm font-semibold text-danger font-sans">
          Car not found.
        </p>
        <p className="mt-1 text-xs text-ink-subtle font-sans">
          The requested system asset payload could not be loaded cleanly.
        </p>
        <Link
          href="/owner/inventory"
          className="mt-4 inline-flex items-center justify-center rounded-xl bg-accent px-4 py-2 text-xs font-bold text-inverse shadow-sm transition-all hover:bg-accent-hover active:scale-[0.98]"
        >
          Back to Inventory
        </Link>
      </div>
    );
  }

  const isPurchasing = car.status.toLowerCase() === "purchasing";

  return (
    <div className="space-y-6 select-none font-sans">
      {/* Accent Styled Back Button Link */}
      <div>
        <Link
          href="/owner/inventory"
          className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-xs font-bold text-inverse shadow-sm transition-all hover:bg-accent-hover active:scale-[0.98] cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5 stroke-[2.5px]" />
          Back to Inventory
        </Link>
      </div>

      {/* Car Profile Header Block */}
      <div className="rounded-2xl border border-line bg-card p-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between sm:justify-start gap-3">
              <h1 className="font-heading text-lg font-semibold text-ink">
                {car.make} {car.model}
              </h1>

              {/* Bright Status Badge for Mobile / Desktop Header */}
              <span
                className={[
                  "sm:hidden text-[9px] font-mono font-bold uppercase px-2.5 py-1 rounded-md border shrink-0",
                  isPurchasing
                    ? "bg-warning text-white border-warning"
                    : "bg-accent text-white border-accent",
                ].join(" ")}
              >
                {car.status.replace("_", " ")}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-ink-subtle font-sans">
              <span className="font-mono bg-inset border border-line px-1.5 py-0.5 rounded text-[10px] text-ink-muted uppercase">
                {car.reg_number || "NO REG NUMBER"}
              </span>
              <span>•</span>
              <span className="font-mono text-[11px] font-medium text-ink-muted">
                {car.year}
              </span>
              {/* Desktop Inline Purchase Display */}
              {car.purchase_amount && (
                <span className="hidden sm:inline-flex items-center gap-2">
                  <span>•</span>
                  <span className="text-ink font-semibold">
                    Purchase: ₹
                    {Number(car.purchase_amount).toLocaleString("en-IN")}
                  </span>
                </span>
              )}
            </div>

            {/* Mobile Bottom Stacked Purchase Display */}
            {car.purchase_amount && (
              <div className="pt-2 sm:hidden flex items-center justify-between border-t border-line/60 mt-2">
                <span className="text-[10px] font-mono uppercase text-ink-muted font-bold">
                  Purchase Amount:
                </span>
                <span className="text-xs font-bold font-mono text-ink">
                  ₹{Number(car.purchase_amount).toLocaleString("en-IN")}
                </span>
              </div>
            )}
          </div>

          {/* Desktop Bright Status Badge */}
          <span
            className={[
              "hidden sm:inline-block text-[9px] font-mono font-bold uppercase px-2.5 py-1 rounded-md shrink-0 border",
              isPurchasing
                ? "bg-warning text-white border-warning"
                : "bg-accent text-white border-accent",
            ].join(" ")}
          >
            {car.status.replace("_", " ")}
          </span>
        </div>
      </div>

      {/* Primary Intake Steps Segmented Switch Control */}
      <div className="flex w-full sm:w-max gap-1 overflow-x-auto rounded-xl bg-inset p-1 border border-line no-scrollbar">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={[
              "flex-1 sm:flex-initial text-center shrink-0 rounded-lg px-3 sm:px-4 py-2 text-xs font-bold font-sans transition-all duration-200 cursor-pointer",
              tab === t.key
                ? "bg-accent text-inverse shadow-sm"
                : "text-ink-muted hover:text-ink",
            ].join(" ")}
          >
            <div className="flex items-center justify-center gap-1.5">
              <span>{t.label}</span>
              {t.key === "documents" && pendingDocsCount > 0 && (
                <span
                  className={`inline-flex items-center justify-center rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                    tab === t.key
                      ? "bg-inverse text-accent"
                      : "bg-rose-600 text-white"
                  }`}
                >
                  {pendingDocsCount}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Context-Switched Stage Panels */}
      <div className="transition-all duration-200">
        {tab === "vehicle" && <VehicleSellerForm car={car} />}

        {tab === "documents" && (
          <div className="rounded-2xl border border-line bg-card p-6">
            <DocumentsGrid carId={car.id} />
          </div>
        )}

        {tab === "refurbishment" && (
          <div className="rounded-2xl border border-line bg-card p-6">
            <RefurbishmentTab carId={car.id} />
          </div>
        )}
      </div>
    </div>
  );
}
