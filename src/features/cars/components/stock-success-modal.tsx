// File: src/features/cars/components/stock-success-modal.tsx
"use client";

import { useEffect } from "react";
import { Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface StockSuccessModalProps {
  isOpen: boolean;
  redirectPath?: string;
}

export function StockSuccessModal({
  isOpen,
  redirectPath = "/owner/inventory?tab=in_stock",
}: StockSuccessModalProps) {
  const router = useRouter();

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      router.push(redirectPath);
    }, 1800);

    return () => clearTimeout(timer);
  }, [isOpen, redirectPath, router]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200 select-none font-sans">
      <div className="relative flex flex-col items-center text-center max-w-sm w-full rounded-3xl border border-emerald-500/30 bg-card p-8 animate-in zoom-in-95 duration-300">
        {/* Animated Tick Mark Circle Container with Micro-Scale Physics Animation */}
        <div className="relative mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 border-2 border-emerald-500/20 text-emerald-600">
          {/* Pulsing ring background */}
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping opacity-75" />

          {/* Solid Icon Box with Pop-In Micro Animation */}
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white animate-in zoom-in-50 spin-in-12 duration-500 ease-out">
            <Check className="h-8 w-8 stroke-[3.5px] animate-in zoom-in duration-300 delay-150" />
          </div>
        </div>

        {/* Modal Text Content adhering to typography system */}
        <h3 className="font-heading text-xl font-bold text-ink">
          Added to Stock!
        </h3>
        <p className="mt-1.5 text-xs font-medium text-ink-muted leading-relaxed">
          Vehicle status transitioned to{" "}
          <span className="font-mono text-emerald-600 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
            IN_STOCK
          </span>{" "}
          and logged into history.
        </p>

        {/* Redirect Loader Indicator */}
        <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-inset px-4 py-2 border border-line text-xs font-mono text-ink-muted">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-600 stroke-[2.5px]" />
          <span>Redirecting to inventory...</span>
        </div>
      </div>
    </div>
  );
}
