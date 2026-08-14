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
  Check,
  ShoppingBag,
  Tag,
  CreditCard,
  RefreshCw,
  SearchX,
  MoreHorizontal,
  type LucideIcon,
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

const LOST_REASON_CONFIG: Record<
  string,
  { label: string; icon: LucideIcon; colorBg: string; colorText: string }
> = {
  "Bought elsewhere": {
    label: "Bought Elsewhere",
    icon: ShoppingBag,
    colorBg: "bg-blue-500/10",
    colorText: "text-blue-500",
  },
  "Price too high": {
    label: "Price Too High",
    icon: Tag,
    colorBg: "bg-amber-500/10",
    colorText: "text-amber-500",
  },
  "Loan rejected": {
    label: "Loan Rejected",
    icon: CreditCard,
    colorBg: "bg-purple-500/10",
    colorText: "text-purple-500",
  },
  "Changed mind / no longer buying": {
    label: "Changed Mind",
    icon: RefreshCw,
    colorBg: "bg-indigo-500/10",
    colorText: "text-indigo-500",
  },
  "Car model not available": {
    label: "Model Unavailable",
    icon: SearchX,
    colorBg: "bg-pink-500/10",
    colorText: "text-pink-500",
  },
  Other: {
    label: "Other Reason",
    icon: MoreHorizontal,
    colorBg: "bg-slate-500/10",
    colorText: "text-slate-500",
  },
};

function getLostReasonConfig(reason: string) {
  if (
    reason &&
    Object.prototype.hasOwnProperty.call(LOST_REASON_CONFIG, reason)
  ) {
    return LOST_REASON_CONFIG[reason];
  }
  return LOST_REASON_CONFIG["Other"];
}

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

  // In-stock cars query for Won dialog picker
  const { data: inStockCars, isLoading: isCarsLoading } = useQuery({
    queryKey: ["cars", "in-stock-picker"],
    queryFn: () => carsApi.getList({ statuses: ["in_stock"] }),
    enabled: isWonOpen,
  });

  const currentStage = lead.stage;
  const isTerminal = currentStage === "won" || currentStage === "lost";
  const activeIndex = ACTIVE_STAGES.indexOf(currentStage as LeadStage);

  const prevActiveStage =
    activeIndex > 0 ? ACTIVE_STAGES[activeIndex - 1] : null;
  const nextActiveStage =
    activeIndex >= 0 && activeIndex < ACTIVE_STAGES.length - 1
      ? ACTIVE_STAGES[activeIndex + 1]
      : null;

  const handleAdvanceStage = () => {
    if (!nextActiveStage) return;
    changeStageMutation.mutate({
      to_stage: nextActiveStage,
    });
  };

  const handlePrevStage = () => {
    if (!prevActiveStage) return;
    changeStageMutation.mutate({
      to_stage: prevActiveStage,
    });
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
    <div className="rounded-xl border border-line bg-card p-5 space-y-4 font-sans select-none">
      {/* Header Info & Stage Transition Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line/60 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Pipeline Stage
            </span>
            {isTerminal && (
              <span
                className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  currentStage === "won"
                    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                    : "bg-red-500/10 text-red-500 border border-red-500/20"
                }`}
              >
                {currentStage === "won" ? "Won Deal" : "Lost Lead"}
              </span>
            )}
          </div>
          <p className="text-sm font-bold text-ink font-sans">
            {getStageConfig(currentStage).label}
          </p>
        </div>

        {/* Transition Action Buttons */}
        {!isTerminal && (
          <>
            {/* Mobile Action Buttons (Full Touch Friendly Layout) */}
            <div className="flex flex-col gap-2 sm:hidden pt-1 w-full">
              {nextActiveStage && (
                <button
                  type="button"
                  onClick={handleAdvanceStage}
                  disabled={changeStageMutation.isPending}
                  className="flex items-center justify-center gap-2 w-full rounded-lg bg-accent px-4 py-2.5 text-xs font-bold text-inverse shadow-xs hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
                >
                  {changeStageMutation.isPending && (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  )}
                  <span>
                    Move to {getStageConfig(nextActiveStage).shortLabel}
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}

              <div className="grid grid-cols-2 gap-2 w-full">
                {prevActiveStage ? (
                  <button
                    type="button"
                    onClick={handlePrevStage}
                    disabled={changeStageMutation.isPending}
                    className="flex items-center justify-center gap-1 rounded-lg border border-line bg-surface hover:bg-hover px-3 py-2 text-xs font-semibold text-ink transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    <span className="truncate">{getStageConfig(prevActiveStage).shortLabel}</span>
                  </button>
                ) : <div />}

                <div className="flex items-center gap-1.5 w-full">
                  <button
                    type="button"
                    onClick={() => {
                      setIsWonOpen(true);
                      setSelectedCarId("");
                      setWonPrice("");
                      setWonNotes("");
                    }}
                    className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white py-2 text-xs font-bold shadow-xs cursor-pointer"
                  >
                    <Trophy className="h-3.5 w-3.5 stroke-[2.5px]" />
                    <span>Won</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsLostOpen(true);
                      setSelectedReasonOption(COMMON_LOST_REASONS[0]);
                      setCustomReason("");
                      setLostNotes("");
                    }}
                    className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white py-2 text-xs font-bold shadow-xs cursor-pointer"
                  >
                    <XCircle className="h-3.5 w-3.5 stroke-[2.5px]" />
                    <span>Lost</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop Action Buttons Row */}
            <div className="hidden sm:flex items-center gap-2 flex-wrap">
              {prevActiveStage && (
                <button
                  type="button"
                  onClick={handlePrevStage}
                  disabled={changeStageMutation.isPending}
                  className="flex items-center gap-1 rounded-lg border border-line bg-surface hover:bg-hover px-3 py-1.5 text-xs font-semibold text-ink transition-colors cursor-pointer disabled:opacity-50"
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
                  className="flex items-center gap-1.5 rounded-lg bg-accent px-3.5 py-1.5 text-xs font-bold text-inverse shadow-xs hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
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
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white px-3.5 py-1.5 text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer"
              >
                <Trophy className="h-3.5 w-3.5 stroke-[2.5px]" />
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
                className="flex items-center gap-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white px-3.5 py-1.5 text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer"
              >
                <XCircle className="h-3.5 w-3.5 stroke-[2.5px]" />
                <span>Mark Lost</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Mobile Pipeline Stepper & Progress Bar */}
      <div className="flex flex-col space-y-2.5 sm:hidden pt-2 border-t border-line/50">
        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono font-medium text-ink-subtle">
            <span>Pipeline Stage</span>
            <span className="font-bold text-accent">
              {currentStage === "won"
                ? "100% (Won)"
                : currentStage === "lost"
                ? "Closed (Lost)"
                : `${Math.round(((activeIndex + 1) / 4) * 100)}% (${activeIndex + 1}/4)`}
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-inset border border-line/40 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                currentStage === "won"
                  ? "bg-emerald-500"
                  : currentStage === "lost"
                  ? "bg-rose-500"
                  : "bg-accent"
              }`}
              style={{
                width:
                  currentStage === "won"
                    ? "100%"
                    : currentStage === "lost"
                    ? "100%"
                    : `${((activeIndex + 1) / 4) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Scrollable Stage Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none max-w-full">
          {ACTIVE_STAGES.map((stg, idx) => {
            const isCurrent = currentStage === stg;
            const isPassed = activeIndex > idx && !isTerminal;

            return (
              <div
                key={stg}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold whitespace-nowrap shrink-0 border transition-all ${
                  isCurrent
                    ? "bg-accent text-inverse border-accent font-bold shadow-xs"
                    : isPassed
                    ? "bg-inset/80 border-line text-ink"
                    : "bg-inset/30 border-line/40 text-ink-subtle/60"
                }`}
              >
                {isPassed && <Check className="h-3 w-3 text-emerald-500 shrink-0 stroke-[2.5px]" />}
                <span>{getStageConfig(stg).shortLabel}</span>
              </div>
            );
          })}

          {/* Terminal Pill */}
          <div
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold whitespace-nowrap shrink-0 border transition-all ${
              currentStage === "won"
                ? "bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs"
                : currentStage === "lost"
                ? "bg-rose-600 text-white border-rose-600 font-bold shadow-xs"
                : "bg-inset/30 border-line/40 text-ink-subtle/60"
            }`}
          >
            <span>
              {currentStage === "won"
                ? "Won Deal 🎉"
                : currentStage === "lost"
                ? "Lost Lead"
                : "Closed"}
            </span>
          </div>
        </div>
      </div>

      {/* Desktop Stepper Pipeline Bar */}
      <div className="hidden sm:grid grid-cols-5 gap-1.5 sm:gap-2">
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
              ? "bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs"
              : currentStage === "lost"
              ? "bg-red-500/15 border-red-500 text-red-500 font-bold shadow-xs"
              : "bg-inset/30 border-line/40 text-ink-subtle/60 font-normal"
          }`}
        >
          <span className="text-xs font-semibold truncate w-full">
            {currentStage === "won"
              ? "Won"
              : currentStage === "lost"
              ? "Lost"
              : "Closed"}
          </span>
          <span className="text-[9px] text-ink-subtle hidden sm:block truncate w-full">
            {currentStage === "won"
              ? "Deal won"
              : currentStage === "lost"
              ? "Deal lost"
              : "Terminal"}
          </span>
        </div>
      </div>

      {/* Won Details Banner (if already WON) */}
      {currentStage === "won" && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-2 text-xs">
          <div className="flex items-center justify-between font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="flex items-center gap-1.5">
              <Trophy className="h-4 w-4" />
              Won Deal Snapshot
            </span>
            {lead.won_at && (
              <span className="text-[11px] font-mono font-normal">
                {new Date(lead.won_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-emerald-500/20 text-ink">
            <div>
              <span className="text-ink-subtle">Purchased Car: </span>
              <span className="font-bold">
                {lead.won_car
                  ? `${lead.won_car.year} ${lead.won_car.make} ${lead.won_car.model}`
                  : "Vehicle Selected"}
              </span>
            </div>
            <div>
              <span className="text-ink-subtle font-mono">Agreed Price: </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                {formatCurrency(lead.won_price)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Lost Details Banner (if already LOST) */}
      {currentStage === "lost" && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 space-y-2 text-xs">
          <div className="flex items-center justify-between font-semibold text-red-500">
            <span className="flex items-center gap-1.5">
              <XCircle className="h-4 w-4" />
              Lost Lead Reason
            </span>
            {lead.lost_at && (
              <span className="text-[11px] font-mono font-normal">
                {new Date(lead.lost_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            )}
          </div>

          <p className="text-ink font-medium pt-1 border-t border-red-500/20">
            &ldquo;{lead.lost_reason || "No reason specified"}&rdquo;
          </p>
        </div>
      )}

      {/* Modal 1: Mark as Won */}
      {isWonOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 pointer-events-auto">
          <div className="w-full max-w-md rounded-2xl border border-line bg-card p-5 shadow-xl space-y-4 pointer-events-auto">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h4 className="text-sm font-bold text-ink flex items-center gap-2">
                <Trophy className="h-4 w-4 text-emerald-500" />
                Close Deal as Won
              </h4>
              <button
                type="button"
                onClick={() => setIsWonOpen(false)}
                className="text-ink-subtle hover:text-ink transition-colors p-1 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleWonSubmit} className="space-y-4">
              {/* Select Car from In-Stock vehicles */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-ink-muted">
                  Select Purchased Car *
                </label>
                {isCarsLoading ? (
                  <div className="py-2 text-xs text-ink-subtle flex items-center gap-2">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Loading available vehicles…
                  </div>
                ) : !inStockCars?.data || inStockCars.data.length === 0 ? (
                  <p className="text-xs text-amber-500 font-medium py-1">
                    No in-stock vehicles available to link.
                  </p>
                ) : (
                  <select
                    value={selectedCarId}
                    onChange={(e) => setSelectedCarId(e.target.value)}
                    required
                    className="w-full rounded-xl border border-line bg-inset p-3 text-xs text-ink focus:border-accent focus:outline-none"
                  >
                    <option value="">-- Pick an in-stock car --</option>
                    {inStockCars.data.map((car) => (
                      <option key={car.id} value={car.id}>
                        {car.year} {car.make} {car.model} — (Reg:{" "}
                        {car.reg_number})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Agreed Final Deal Price */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-ink-muted">
                  Agreed Deal Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  value={wonPrice}
                  onChange={(e) => setWonPrice(e.target.value)}
                  placeholder="e.g. 750000"
                  className="w-full rounded-xl border border-line bg-inset p-3 text-xs text-ink focus:border-accent focus:outline-none font-mono"
                />
              </div>

              {/* Optional Notes */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-ink-muted">
                  Closing Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={wonNotes}
                  onChange={(e) => setWonNotes(e.target.value)}
                  placeholder="e.g. Customer paid via bank transfer, delivery scheduled..."
                  className="w-full rounded-xl border border-line bg-inset p-3 text-xs text-ink focus:border-accent focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWonOpen(false)}
                  className="rounded-lg border border-line bg-surface px-3.5 py-2 text-xs font-semibold text-ink hover:bg-hover transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    changeStageMutation.isPending || !selectedCarId || !wonPrice
                  }
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 px-4 py-2 text-xs font-bold text-white shadow-xs hover:shadow transition-all disabled:opacity-50 cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 pointer-events-auto">
          <div className="w-full max-w-md rounded-2xl border border-line bg-card p-5 shadow-xl space-y-4 font-sans pointer-events-auto">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h4 className="text-sm font-bold text-ink flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                Mark Lead as Lost
              </h4>
              <button
                type="button"
                onClick={() => setIsLostOpen(false)}
                className="text-ink-subtle hover:text-ink transition-colors p-1 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleLostSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-ink">
                  Reason for Loss <span className="text-danger">*</span>
                </label>

                <div className="grid grid-cols-2 gap-2">
                  {COMMON_LOST_REASONS.map((reason) => {
                    const isSelected = selectedReasonOption === reason;
                    const config = getLostReasonConfig(reason);
                    const Icon = config.icon;

                    return (
                      <button
                        key={reason}
                        type="button"
                        onClick={() => setSelectedReasonOption(reason)}
                        className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? "bg-red-500/10 border-red-500/50 text-ink ring-1 ring-red-500/30 shadow-xs"
                            : "bg-inset/40 border-line/60 text-ink-muted hover:border-line hover:text-ink hover:bg-inset"
                        }`}
                      >
                        <div
                          className={`flex h-7 w-7 items-center justify-center rounded-lg ${config.colorBg} ${config.colorText} shrink-0`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-xs font-medium leading-tight truncate">
                          {reason}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedReasonOption === "Other" && (
                <div className="space-y-1 animate-in fade-in duration-200">
                  <label className="text-xs font-medium text-ink-muted">
                    Specify Reason <span className="text-danger">*</span>
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
                  className="rounded-lg border border-line bg-surface px-3.5 py-2 text-xs font-semibold text-ink hover:bg-hover transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={changeStageMutation.isPending}
                  className="flex items-center gap-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 active:bg-rose-800 px-4 py-2 text-xs font-bold text-white shadow-xs hover:shadow transition-all disabled:opacity-50 cursor-pointer"
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
