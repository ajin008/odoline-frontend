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
        <div className="flex flex-col justify-between rounded-xl border border-line bg-inset p-3.5 transition-all hover:bg-card">
          <p className="text-[10px] font-mono font-semibold uppercase text-ink-muted">
            Purchase Price
          </p>
          <p className="text-sm font-bold text-ink mt-1 font-mono">
            ₹{formatCurrency(purchaseNum)}
          </p>
        </div>

        {/* 2. Refurbishment Cost Card */}
        <div className="flex flex-col justify-between rounded-xl border border-accent/20 bg-accent-light/30 p-3.5 transition-all hover:bg-accent-light/50">
          <p className="text-[10px] font-mono font-semibold uppercase text-accent">
            + Refurb Cost
          </p>
          <p className="text-sm font-bold text-accent mt-1 font-mono">
            ₹{formatCurrency(refurbNum)}
          </p>
        </div>

        {/* 3. Landing Price (Break-Even) Card */}
        <div className="flex flex-col justify-between rounded-xl border border-ink bg-ink p-3.5 text-inverse shadow-sm">
          <p className="text-[10px] font-mono font-semibold uppercase text-inverse/70">
            = Landing Price
          </p>
          <p className="text-sm font-bold text-inverse mt-1 font-mono">
            ₹{formatCurrency(landingNum)}
          </p>
        </div>

        {/* 4. Profit Margin Input Card */}
        <div className="flex flex-col justify-between rounded-xl border border-line bg-inset p-3.5 transition-all focus-within:border-accent focus-within:bg-card">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-mono font-semibold uppercase text-ink-muted">
              + Profit Margin
            </p>
            {updateMarginMutation.isPending && (
              <Loader2 className="h-3 w-3 animate-spin text-accent" />
            )}
          </div>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs text-ink-muted font-bold font-mono">
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
              className="w-full bg-transparent border-none p-0 text-sm font-bold text-ink focus:outline-none focus:ring-0 font-mono"
            />
          </div>
        </div>

        {/* 5. Live Selling Price Hero Card (Spans full width on Mobile) */}
        <div className="col-span-2 lg:col-span-1 flex flex-col justify-between rounded-xl border border-emerald-500 bg-emerald-600 p-3.5 text-white shadow-sm">
          <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-100">
            Target Selling Price
          </p>
          <p className="text-base sm:text-lg font-extrabold text-white mt-0.5 font-mono">
            ₹{formatCurrency(liveSellingPrice)}
          </p>
        </div>
      </div>
    </div>
  );
}
