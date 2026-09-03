/* eslint-disable react-hooks/set-state-in-effect */
// File: src/features/cars/components/refurbishment/refurb-pricing-summary.tsx
"use client";

import { useState, useEffect } from "react";
import { formatCurrency } from "../../utils/refurbishment-helpers";
import { useUpdateCarMargin } from "../../hooks/use-car";
import { Loader2, TrendingUp } from "lucide-react";

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

  const handleBlurOrSubmit = () => {
    const numericVal = Number(marginInput);
    if (!isNaN(numericVal) && numericVal !== initialMargin) {
      updateMarginMutation.mutate(marginInput);
    }
  };

  const currentMargin = Number(marginInput) || 0;
  const liveSellingPrice = landingNum + currentMargin;

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

      {/* Grid Matrix: Responsive 2-col on Mobile, 5-col Flow on Desktop */}
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

        {/* 4. Profit Margin Input Card */}
        <div className="flex flex-col justify-between rounded-xl bg-[#fef3c7] p-3.5 transition-all hover:bg-[#fde68a] focus-within:bg-[#fde68a]">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#d97706]">
              + Profit Margin
            </p>
            {updateMarginMutation.isPending && (
              <Loader2 className="h-3 w-3 animate-spin text-[#d97706]" />
            )}
          </div>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs text-[#92400e] font-bold font-mono">
              ₹
            </span>
            <input
              type="number"
              placeholder="0"
              value={marginInput}
              onChange={handleMarginChange}
              onBlur={handleBlurOrSubmit}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.currentTarget.blur();
                }
              }}
              className="w-full bg-transparent border-none p-0 text-sm font-bold text-[#92400e] focus:outline-none focus:ring-0 font-mono"
            />
          </div>
        </div>

        {/* 5. Live Selling Price Hero Card (Spans full width on Mobile) */}
        <div className="col-span-2 lg:col-span-1 flex flex-col justify-between rounded-xl bg-[#d1fae5] p-3.5 transition-all hover:bg-[#a7f3d0]">
          <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#059669]">
            Target Selling Price
          </p>
          <p className="text-base sm:text-lg font-extrabold text-[#065f46] mt-0.5 font-mono">
            ₹{formatCurrency(liveSellingPrice)}
          </p>
        </div>
      </div>
    </div>
  );
}
