/* eslint-disable security/detect-object-injection */
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useChangeStage } from "../hooks/use-lead-stage";
import type { Lead, LeadStage } from "../types/lead-types";
import { carsApi } from "@/src/features/cars/api/cars-api";
import {
  ChevronRight,
  ChevronLeft,
  Trophy,
  XCircle,
  Loader2,
  X,
  Sparkles,
} from "lucide-react";

interface LeadStageControlProps {
  lead: Lead;
}

const ACTIVE_STAGES: LeadStage[] = [
  "new",
  "contacted",
  "test_drive",
  "discussion",
];

const STAGE_CONFIG: Record<
  LeadStage,
  { label: string; shortLabel: string; description: string }
> = {
  new: {
    label: "New Lead",
    shortLabel: "New",
    description: "Initial inquiry recorded",
  },
  contacted: {
    label: "Contacted",
    shortLabel: "Contacted",
    description: "First contact established",
  },
  test_drive: {
    label: "Test Drive",
    shortLabel: "Test Drive",
    description: "Vehicle test drive done",
  },
  discussion: {
    label: "Discussion",
    shortLabel: "Discussion",
    description: "Price/Terms negotiation",
  },
  won: {
    label: "Won",
    shortLabel: "Won",
    description: "Deal closed & car selected",
  },
  lost: {
    label: "Lost",
    shortLabel: "Lost",
    description: "Deal closed (buyer walked)",
  },
};

function getStageConfig(stage: LeadStage) {
  return STAGE_CONFIG[stage] || STAGE_CONFIG.new;
}

const COMMON_LOST_REASONS = [
  "Bought elsewhere",
  "Price too high",
  "Loan rejected",
  "Changed mind / no longer buying",
  "Car model not available",
  "Other",
];

function formatCurrency(amountStr: string | null): string {
  if (!amountStr) return "";
  const num = Number(amountStr);
  if (isNaN(num)) return amountStr;
  return `₹${num.toLocaleString("en-IN")}`;
}

export function LeadStageControl({ lead }: LeadStageControlProps) {
  const changeStageMutation = useChangeStage(lead.id);

  // Modals state
  const [isWonOpen, setIsWonOpen] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState("");
  const [wonPrice, setWonPrice] = useState("");
  const [wonNotes, setWonNotes] = useState("");

  const [isLostOpen, setIsLostOpen] = useState(false);
  const [selectedReasonOption, setSelectedReasonOption] = useState(
    COMMON_LOST_REASONS[0]
  );
  const [customReason, setCustomReason] = useState("");
  const [lostNotes, setLostNotes] = useState("");

  // In-stock cars query for WON dialog
  const { data: inStockCarsPage, isLoading: isLoadingCars } = useQuery({
    queryKey: ["cars", "in-stock-list"],
    queryFn: () => carsApi.getList({ statuses: ["in_stock"] }),
    enabled: isWonOpen,
  });

  const inStockCars = inStockCarsPage?.data || [];

  const currentStage = lead.stage;
  const isTerminal = currentStage === "won" || currentStage === "lost";
  const activeIndex = ACTIVE_STAGES.indexOf(currentStage as LeadStage);

  // Simple next / prev stage derivation for active stages
  const nextActiveStage =
    activeIndex >= 0 && activeIndex < ACTIVE_STAGES.length - 1
      ? ACTIVE_STAGES[activeIndex + 1]
      : null;

  const prevActiveStage =
    activeIndex > 0 ? ACTIVE_STAGES[activeIndex - 1] : null;

  const handleAdvanceStage = () => {
    if (!nextActiveStage) return;
    changeStageMutation.mutate({ to_stage: nextActiveStage });
  };

  const handlePrevStage = () => {
    if (!prevActiveStage) return;
    changeStageMutation.mutate({ to_stage: prevActiveStage });
  };

  const handleCarSelect = (carId: string) => {
    setSelectedCarId(carId);
    const chosenCar = inStockCars.find((c) => c.id === carId);
    if (chosenCar && chosenCar.selling_price) {
      setWonPrice(chosenCar.selling_price);
    }
  };

  const handleWonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCarId || !wonPrice) return;

    changeStageMutation.mutate(
      {
        to_stage: "won",
        won_car_id: selectedCarId,
        won_price: wonPrice,
        notes: wonNotes.trim() || undefined,
      },
      {
        onSuccess: () => {
          setIsWonOpen(false);
        },
      }
    );
  };

  const handleLostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason =
      selectedReasonOption === "Other"
        ? customReason.trim()
        : selectedReasonOption;

    if (!finalReason) return;

    changeStageMutation.mutate(
      {
        to_stage: "lost",
        lost_reason: finalReason,
        notes: lostNotes.trim() || undefined,
      },
      {
        onSuccess: () => {
          setIsLostOpen(false);
        },
      }
    );
  };

  return (
    <div className="rounded-2xl border border-line bg-card p-5 space-y-4 font-sans select-none">
      {/* Header & Framing */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line/60 pb-3">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-muted flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent" />
            Buyer Pipeline Journey
          </h3>
          <p className="text-[11px] text-ink-subtle mt-0.5">
            Stage represents customer progression (independent of priority
            quality label).
          </p>
        </div>

        {/* Action Controls for Active Stages */}
        {!isTerminal && (
          <div className="flex items-center gap-2 flex-wrap">
            {prevActiveStage && (
              <button
                type="button"
                onClick={handlePrevStage}
                disabled={changeStageMutation.isPending}
                className="flex items-center gap-1 rounded-xl border border-line px-3 py-1.5 text-xs font-semibold text-ink-subtle hover:text-ink hover:bg-hover transition-colors cursor-pointer disabled:opacity-50"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>{getStageConfig(prevActiveStage).shortLabel}</span>
              </button>
            )}

            {nextActiveStage && (
              <button
                type="button"
                onClick={handleAdvanceStage}
                disabled={changeStageMutation.isPending}
                className="flex items-center gap-1 rounded-xl bg-accent px-3 py-1.5 text-xs font-semibold text-inverse shadow-sm hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
              >
                {changeStageMutation.isPending && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                )}
                <span>
                  Move to {getStageConfig(nextActiveStage).shortLabel}
                </span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setIsWonOpen(true);
                setSelectedCarId("");
                setWonPrice("");
                setWonNotes("");
              }}
              className="flex items-center gap-1 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/30 px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Trophy className="h-3.5 w-3.5" />
              <span>Mark Won</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsLostOpen(true);
                setSelectedReasonOption(COMMON_LOST_REASONS[0]);
                setCustomReason("");
                setLostNotes("");
              }}
              className="flex items-center gap-1 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer"
            >
              <XCircle className="h-3.5 w-3.5" />
              <span>Mark Lost</span>
            </button>
          </div>
        )}
      </div>

      {/* Stepper Pipeline Bar */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {ACTIVE_STAGES.map((stg, idx) => {
          const isCurrent = currentStage === stg;
          const isPassed = activeIndex > idx && !isTerminal;

          return (
            <div
              key={stg}
              className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                isCurrent
                  ? "bg-accent/15 border-accent text-accent font-bold shadow-xs scale-[1.02]"
                  : isPassed
                  ? "bg-inset/60 border-line/60 text-ink font-medium"
                  : "bg-inset/30 border-line/40 text-ink-subtle/60 font-normal"
              }`}
            >
              <span className="text-xs font-semibold truncate w-full">
                {getStageConfig(stg).shortLabel}
              </span>
              <span className="text-[9px] text-ink-subtle hidden sm:block truncate w-full">
                {getStageConfig(stg).description}
              </span>
            </div>
          );
        })}

        {/* Terminal Stage Column (Won / Lost) */}
        <div
          className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
            currentStage === "won"
              ? "bg-emerald-500/20 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs"
              : currentStage === "lost"
              ? "bg-red-500/20 border-red-500 text-red-500 font-bold shadow-xs"
              : "bg-inset/30 border-line/40 text-ink-subtle/60 font-normal"
          }`}
        >
          <span className="text-xs font-semibold truncate w-full">
            {currentStage === "won"
              ? "Won"
              : currentStage === "lost"
              ? "Lost"
              : "Won / Lost"}
          </span>
          <span className="text-[9px] text-ink-subtle hidden sm:block truncate w-full">
            {currentStage === "won"
              ? "Deal Handoff"
              : currentStage === "lost"
              ? "Closed Lost"
              : "Terminal State"}
          </span>
        </div>
      </div>

      {/* Terminal Details View when WON or LOST */}
      {currentStage === "won" && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <Trophy className="h-4 w-4 shrink-0" />
            <span>Lead Won &amp; Ready for Booking Handoff 🎉</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
            <div>
              <span className="text-ink-subtle block text-[11px]">
                Agreed Deal Price
              </span>
              <span className="font-bold font-mono text-ink">
                {formatCurrency(lead.won_price)}
              </span>
            </div>

            <div>
              <span className="text-ink-subtle block text-[11px]">
                Won Car Reference ID
              </span>
              <span className="font-mono text-ink text-[11px] truncate block">
                {lead.won_car_id || "N/A"}
              </span>
            </div>

            <div>
              <span className="text-ink-subtle block text-[11px]">
                Won Date
              </span>
              <span className="font-medium text-ink">
                {lead.won_at
                  ? new Date(lead.won_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>
      )}

      {currentStage === "lost" && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-red-500">
            <XCircle className="h-4 w-4 shrink-0" />
            <span>Lead Marked as Lost</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
            <div>
              <span className="text-ink-subtle block text-[11px]">
                Reason for Loss
              </span>
              <span className="font-bold text-ink">
                {lead.lost_reason || "Not specified"}
              </span>
            </div>

            <div>
              <span className="text-ink-subtle block text-[11px]">
                Lost Date
              </span>
              <span className="font-medium text-ink">
                {lead.lost_at
                  ? new Date(lead.lost_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Modal 1: Mark as Won */}
      {isWonOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-line bg-card p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h4 className="text-sm font-bold text-ink flex items-center gap-2">
                <Trophy className="h-4 w-4 text-emerald-500" />
                Mark Lead as Won
              </h4>
              <button
                type="button"
                onClick={() => setIsWonOpen(false)}
                className="text-ink-subtle hover:text-ink transition-colors p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleWonSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-ink-muted">
                  Select Purchased Car (In-Stock Inventory) *
                </label>
                {isLoadingCars ? (
                  <div className="py-3 text-center text-xs text-ink-subtle flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-accent" />
                    Loading available cars…
                  </div>
                ) : inStockCars.length === 0 ? (
                  <p className="text-xs text-amber-500 py-1">
                    No in-stock vehicles available in inventory.
                  </p>
                ) : (
                  <select
                    value={selectedCarId}
                    onChange={(e) => handleCarSelect(e.target.value)}
                    required
                    className="w-full rounded-xl border border-line bg-inset p-3 text-xs text-ink focus:border-accent focus:outline-none"
                  >
                    <option value="">-- Choose a Car --</option>
                    {inStockCars.map((car) => (
                      <option key={car.id} value={car.id}>
                        {car.year} {car.make} {car.model} ({car.reg_number}) —
                        Asking: ₹
                        {car.selling_price
                          ? Number(car.selling_price).toLocaleString("en-IN")
                          : "N/A"}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-ink-muted">
                  Agreed Final Selling Price (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle text-xs">
                    ₹
                  </span>
                  <input
                    type="text"
                    required
                    value={wonPrice}
                    onChange={(e) => setWonPrice(e.target.value)}
                    placeholder="e.g. 650000.00"
                    className="w-full rounded-xl border border-line bg-inset py-2.5 pl-8 pr-3 text-xs font-mono text-ink focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-ink-muted">
                  Closing Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={wonNotes}
                  onChange={(e) => setWonNotes(e.target.value)}
                  placeholder="e.g. Final deal agreed after test drive, customer bringing token tomorrow..."
                  className="w-full rounded-xl border border-line bg-inset p-3 text-xs text-ink focus:border-accent focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWonOpen(false)}
                  className="rounded-xl border border-line px-3.5 py-2 text-xs font-medium text-ink hover:bg-hover transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    changeStageMutation.isPending || !selectedCarId || !wonPrice
                  }
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {changeStageMutation.isPending && (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  )}
                  <span>Confirm Won</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Mark as Lost */}
      {isLostOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-line bg-card p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h4 className="text-sm font-bold text-ink flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                Mark Lead as Lost
              </h4>
              <button
                type="button"
                onClick={() => setIsLostOpen(false)}
                className="text-ink-subtle hover:text-ink transition-colors p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleLostSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-ink-muted">
                  Reason for Loss *
                </label>
                <select
                  value={selectedReasonOption}
                  onChange={(e) => setSelectedReasonOption(e.target.value)}
                  className="w-full rounded-xl border border-line bg-inset p-3 text-xs text-ink focus:border-accent focus:outline-none"
                >
                  {COMMON_LOST_REASONS.map((reason) => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
              </div>

              {selectedReasonOption === "Other" && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-ink-muted">
                    Specify Reason *
                  </label>
                  <input
                    type="text"
                    required
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Enter reason..."
                    className="w-full rounded-xl border border-line bg-inset p-3 text-xs text-ink focus:border-accent focus:outline-none"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-medium text-ink-muted">
                  Additional Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={lostNotes}
                  onChange={(e) => setLostNotes(e.target.value)}
                  placeholder="e.g. Customer decided to buy new car instead..."
                  className="w-full rounded-xl border border-line bg-inset p-3 text-xs text-ink focus:border-accent focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsLostOpen(false)}
                  className="rounded-xl border border-line px-3.5 py-2 text-xs font-medium text-ink hover:bg-hover transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={changeStageMutation.isPending}
                  className="flex items-center gap-1.5 rounded-xl bg-red-500 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {changeStageMutation.isPending && (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  )}
                  <span>Confirm Lost</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
