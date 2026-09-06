/* eslint-disable react-hooks/set-state-in-effect */
// File: src/features/cars/components/refurbishment/refurb-pricing-summary.tsx
"use client";

import { useState, useEffect } from "react";
import { formatCurrency } from "../../utils/refurbishment-helpers";
import { useUpdateCarMargin } from "../../hooks/use-car";
import { useMe } from "@/src/features/auth/hooks/use-me";
import { Loader2, TrendingUp } from "lucide-react";
import { formatCompactAmount } from "@/src/lib/formatters";

interface RefurbPricingSummaryProps {
  carId: string;
  purchaseNum: number;
  refurbNum: number;
  landingNum: number;
  initialMargin: number;
  sellingNum: number;
}

export function RefurbPricingSummary({
  carId,
  purchaseNum,
  refurbNum,
  landingNum,
  initialMargin,
}: RefurbPricingSummaryProps) {
  const { data: user } = useMe();
  const isOwner = !user || user.role === "owner";

  const [marginInput, setMarginInput] = useState(
    initialMargin ? String(initialMargin) : ""
  );
  const updateMarginMutation = useUpdateCarMargin(carId);

  useEffect(() => {
    setMarginInput(initialMargin ? String(initialMargin) : "");
  }, [initialMargin]);

  const handleMarginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMarginInput(e.target.value);
  };

  const handleSave = () => {
    const numericVal = Number(marginInput);
    if (!isNaN(numericVal)) {
      updateMarginMutation.mutate(marginInput);
    }
  };

  const currentMargin = Number(marginInput) || initialMargin || 0;
  const liveSellingPrice = landingNum + currentMargin;
  const inputCompactBadge = formatCompactAmount(marginInput);
  const displayCompactBadge = formatCompactAmount(currentMargin);

  return (
    <div className="space-y-4 select-none font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-light text-accent">
            <TrendingUp className="h-4 w-4 stroke-[2px]" />
          </div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-ink font-mono">
            Financial Pipeline & Calculation
          </h3>
        </div>
        <span className="text-[10px] font-mono font-medium text-ink-subtle hidden sm:inline-block">
          Landing = Purchase + Refurb
        </span>
      </div>

      {/* Grid Matrix: 5 Read-Only Pastel Display Cards (Without borders) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 items-stretch">
        {/* 1. Purchase Amount Card */}
        <div className="flex flex-col justify-between rounded-xl bg-[#f1f5f9] p-3.5 transition-all hover:bg-[#e2e8f0]">
          <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#475569]">
            Purchase Price
          </p>
          <p className="text-sm font-bold text-[#0f172a] mt-1 font-mono">
            ₹{formatCurrency(purchaseNum)}
          </p>
        </div>

        {/* 2. Refurbishment Cost Card */}
        <div className="flex flex-col justify-between rounded-xl bg-[#e0f2fe] p-3.5 transition-all hover:bg-[#bae6fd]">
          <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0284c7]">
            + Refurb Cost
          </p>
          <p className="text-sm font-bold text-[#0369a1] mt-1 font-mono">
            ₹{formatCurrency(refurbNum)}
          </p>
        </div>

        {/* 3. Landing Price (Break-Even) Card */}
        <div className="flex flex-col justify-between rounded-xl bg-[#e0e7ff] p-3.5 transition-all hover:bg-[#c7d2fe]">
          <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#4f46e5]">
            = Landing Price
          </p>
          <p className="text-sm font-bold text-[#3730a3] mt-1 font-mono">
            ₹{formatCurrency(landingNum)}
          </p>
        </div>

        {/* 4. Profit Margin Display Card (Read-Only) */}
        <div className="flex flex-col justify-between rounded-xl bg-[#fef3c7] p-3.5 transition-all hover:bg-[#fde68a]">
          <div className="flex items-center justify-between gap-1">
            <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#d97706]">
              + Profit Margin
            </p>
            {displayCompactBadge && (
              <span className="text-[10px] font-mono font-bold text-[#b45309] bg-[#fde68a] px-1.5 py-0.5 rounded border border-[#f59e0b]/30">
                {displayCompactBadge}
              </span>
            )}
          </div>
          <p className="text-sm font-bold text-[#92400e] mt-1 font-mono">
            ₹{formatCurrency(currentMargin)}
          </p>
        </div>

        {/* 5. Target Selling Price Hero Card */}
        <div className="col-span-2 lg:col-span-1 flex flex-col justify-between rounded-xl bg-[#d1fae5] p-3.5 transition-all hover:bg-[#a7f3d0]">
          <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#059669]">
            Target Selling Price
          </p>
          <p className="text-base sm:text-lg font-extrabold text-[#065f46] mt-0.5 font-mono">
            ₹{formatCurrency(liveSellingPrice)}
          </p>
        </div>
      </div>

      {/* Owner-Only Form Control: Set Profit Margin (₹) */}
      {isOwner && (
        <div className="rounded-xl border border-line bg-inset p-4 sm:p-5 space-y-3 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label
                htmlFor="set-profit-margin-input"
                className="text-xs font-bold text-ink font-sans flex items-center gap-1.5 cursor-pointer"
              >
                Set Profit Margin (₹)
              </label>
              <p className="text-[11px] text-ink-subtle font-sans mt-0.5">
                Configure showroom profit margin to recalculate the target selling price.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
              className="flex items-center gap-2.5 w-full sm:w-auto"
            >
              <div className="relative flex-1 sm:w-56">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold font-mono text-ink-muted pointer-events-none">
                  ₹
                </span>
                <input
                  id="set-profit-margin-input"
                  type="number"
                  placeholder="e.g. 25000"
                  value={marginInput}
                  onChange={handleMarginChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSave();
                    }
                  }}
                  className={`w-full rounded-lg border border-line bg-card py-2 pl-7 text-xs font-bold font-mono text-ink focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent ${
                    inputCompactBadge ? "pr-20" : "pr-3"
                  }`}
                />
                {inputCompactBadge && (
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[10px] font-mono font-bold text-accent bg-accent-light/80 px-1.5 py-0.5 rounded border border-accent/20">
                    {inputCompactBadge}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={
                  updateMarginMutation.isPending ||
                  marginInput.trim() === "" ||
                  Number(marginInput) === initialMargin
                }
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-xs font-bold text-inverse shadow-xs transition-all hover:bg-accent-hover active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                {updateMarginMutation.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  "Save"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

