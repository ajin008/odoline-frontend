/* eslint-disable react-hooks/set-state-in-effect */
// File: src/features/cars/components/refurbishment/refurb-pricing-summary.tsx
"use client";

import { useState, useEffect } from "react";
import { formatCurrency } from "../../utils/refurbishment-helpers";
import { useUpdateCarMargin } from "../../hooks/use-car";
import { Loader2 } from "lucide-react";

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
    <div className="space-y-3 select-none font-sans">
      <h3 className="font-heading text-xs font-semibold uppercase tracking-tight text-ink">
        Financial Pipeline & Server Math
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center items-center">
        <div className="bg-inset p-3.5 rounded-xl border border-line">
          <p className="text-[10px] font-mono uppercase text-ink-muted">
            Purchase
          </p>
          <p className="text-sm font-bold text-ink mt-0.5">
            ₹{formatCurrency(purchaseNum)}
          </p>
        </div>
        <div className="bg-inset p-3.5 rounded-xl border border-line">
          <p className="text-[10px] font-mono uppercase text-ink-muted">
            Refurb Total
          </p>
          <p className="text-sm font-bold text-accent mt-0.5">
            ₹{formatCurrency(refurbNum)}
          </p>
        </div>
        <div className="bg-ink p-3.5 rounded-xl border border-ink text-white">
          <p className="text-[10px] font-mono uppercase text-ink-muted font-bold">
            Landing Price
          </p>
          <p className="text-sm font-bold text-white mt-0.5">
            ₹{formatCurrency(landingNum)}
          </p>
        </div>
        <div className="bg-inset p-3.5 rounded-xl border border-line py-5">
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-xs text-ink-muted font-bold">₹</span>
            <div className="relative w-full max-w-36">
              <input
                type="number"
                placeholder="Enter margin"
                value={marginInput}
                onChange={handleMarginChange}
                onBlur={handleBlurOrSubmit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.currentTarget.blur();
                  }
                }}
                className="w-full text-center bg-card border border-line rounded-lg text-sm sm:text-base font-bold text-ink py-1.5 px-2 placeholder:text-xs placeholder:font-normal placeholder:text-ink-muted focus:outline-none focus:border-accent"
              />
            </div>
            {updateMarginMutation.isPending && (
              <Loader2 className="h-4 w-4 animate-spin text-accent shrink-0" />
            )}
          </div>
        </div>
        <div className="bg-emerald-600 p-3.5 rounded-xl border border-emerald-500 text-white">
          <p className="text-[10px] font-mono uppercase tracking-wider text-emerald-100 font-bold">
            Selling Price
          </p>
          <p className="text-base sm:text-lg font-extrabold text-white mt-0.5">
            ₹{formatCurrency(liveSellingPrice)}
          </p>
        </div>
      </div>
    </div>
  );
}
