"use client";

import { Clock, ShieldCheck, Truck } from "lucide-react";

interface BookingPlaceholderStageProps {
  stage: "settlement" | "delivery";
}

export function BookingPlaceholderStage({ stage }: BookingPlaceholderStageProps) {
  const isSettlement = stage === "settlement";

  return (
    <div className="rounded-2xl border border-line bg-card p-8 text-center space-y-4 shadow-xs select-none font-sans">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 border border-accent/20 text-accent">
        {isSettlement ? (
          <ShieldCheck className="h-6 w-6" />
        ) : (
          <Truck className="h-6 w-6" />
        )}
      </div>

      <div className="space-y-1.5 max-w-md mx-auto">
        <h3 className="text-base font-bold text-ink">
          {isSettlement
            ? "Stage 3: Settlement & Final Clearance"
            : "Stage 4: Vehicle Delivery & Sale Closure"}
        </h3>
        <p className="text-xs text-ink-subtle leading-relaxed">
          {isSettlement
            ? "Financial settlement documentation, RC transfer fees, and balance clearance workflows will be enabled in slice BK-3."
            : "Final vehicle delivery handover, gate pass, owner signoff, and sale closure modules will be enabled in slice BK-4."}
        </p>
      </div>

      <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-inset border border-line text-xs font-semibold text-ink-muted">
        <Clock className="h-3.5 w-3.5 text-accent" />
        <span>Module Coming Soon</span>
      </div>
    </div>
  );
}
