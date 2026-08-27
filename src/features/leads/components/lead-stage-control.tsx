/* eslint-disable security/detect-object-injection */
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useChangeStage } from "../hooks/use-lead-stage";
import type { Lead, LeadStage } from "../types/lead-types";
import { carsApi } from "@/src/features/cars/api/cars-api";
import { CustomSelect } from "@/src/components/ui/custom-select";
import {
  ChevronRight,
  ChevronLeft,
  Trophy,
  XCircle,
  Loader2,
  X,
  Check,
  ShoppingBag,
  Car,
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
    <div className="font-sans select-none space-y-4">
      {/* ========================================================================= */}
      {/* MOBILE APP STAGE CARD (Mobile View ONLY: < 640px)                         */}
      {/* ========================================================================= */}
      <div className="flex flex-col gap-3 sm:hidden rounded-2xl border border-line bg-card p-4 shadow-xs">
        {/* Header Info */}
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-subtle block">
              Pipeline Stage
            </span>
            <p className="text-sm font-extrabold text-ink">
              {getStageConfig(currentStage).label}
            </p>
          </div>

          <div>
            {isTerminal ? (
              <span
                className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  currentStage === "won"
                    ? "bg-emerald-500/10 text-emerald-500"
                    : "bg-red-500/10 text-red-500"
                }`}
              >
                {currentStage === "won" ? "Won Deal 🎉" : "Lost Lead"}
              </span>
            ) : (
              <span className="inline-flex items-center rounded-lg bg-accent/10 border border-accent/20 px-2.5 py-0.5 text-[11px] font-bold text-accent font-mono">
                Step {activeIndex + 1} of 5
              </span>
            )}
          </div>
        </div>

        {/* 5-Segment Visual Track Indicator */}
        <div className="grid grid-cols-5 gap-1.5 py-0.5">
          {ACTIVE_STAGES.map((stg, idx) => {
            const isCurrent = currentStage === stg;
            const isPassed = activeIndex > idx && !isTerminal;

            return (
              <div
                key={stg}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  isCurrent
                    ? "bg-accent shadow-xs"
                    : isPassed
                    ? "bg-accent/40"
                    : "bg-inset border border-line/60"
                }`}
              />
            );
          })}
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${
              currentStage === "won"
                ? "bg-emerald-500"
                : currentStage === "lost"
                ? "bg-rose-500"
                : "bg-inset border border-line/60"
            }`}
          />
        </div>

        {/* Mobile Action Buttons */}
        {!isTerminal && (
          <div className="space-y-2 pt-1">
            {nextActiveStage && (
              <button
                type="button"
                onClick={handleAdvanceStage}
                disabled={changeStageMutation.isPending}
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-accent px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
              >
                {changeStageMutation.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                <span>
                  Move to {getStageConfig(nextActiveStage).shortLabel}
                </span>
                <ChevronRight className="h-4 w-4" />
              </button>
            )}

            <div className="grid grid-cols-3 gap-2">
              {prevActiveStage ? (
                <button
                  type="button"
                  onClick={handlePrevStage}
                  disabled={changeStageMutation.isPending}
                  className="flex items-center justify-center gap-1 rounded-lg border border-line bg-surface hover:bg-hover py-2 px-1 text-xs font-semibold text-ink transition-colors cursor-pointer disabled:opacity-50 truncate"
                >
                  <ChevronLeft className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">
                    {getStageConfig(prevActiveStage).shortLabel}
                  </span>
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={() => {
                  setIsWonOpen(true);
                  setSelectedCarId("");
                  setWonPrice("");
                  setWonNotes("");
                }}
                className="flex items-center justify-center gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-1 text-xs font-bold shadow-xs cursor-pointer"
              >
                <Trophy className="h-3.5 w-3.5 stroke-[2.5px] shrink-0" />
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
                className="flex items-center justify-center gap-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white py-2 px-1 text-xs font-bold shadow-xs cursor-pointer"
              >
                <XCircle className="h-3.5 w-3.5 stroke-[2.5px] shrink-0" />
                <span>Lost</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP STAGE CONTROL (Desktop View ONLY: >= 640px)                       */}
      {/* ========================================================================= */}
      <div className="hidden sm:block rounded-xl border-none bg-card p-5 space-y-4">
        {/* Header Info & Stage Transition Buttons */}
        <div className="flex flex-row items-center justify-between gap-3 border-b border-line/40 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Pipeline Stage
              </span>
              {isTerminal && (
                <span
                  className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    currentStage === "won"
                      ? "bg-emerald-500/10 text-emerald-500"
                      : "bg-red-500/10 text-red-500"
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

          {/* Transition Action Buttons Row */}
          {!isTerminal && (
            <div className="flex items-center gap-2 flex-wrap">
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
          )}
        </div>

        {/* Desktop Stepper Pipeline Bar */}
        <div className="hidden sm:grid grid-cols-5 gap-1.5 sm:gap-2">
          {ACTIVE_STAGES.map((stg, idx) => {
            const isCurrent = currentStage === stg;
            const isPassed = activeIndex > idx && !isTerminal;

            return (
              <div
                key={stg}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl text-center transition-all ${
                  isCurrent
                    ? "bg-accent text-white shadow-xs font-bold scale-[1.02]"
                    : isPassed
                    ? "bg-accent/10 text-accent font-semibold"
                    : "bg-inset/40 border border-line/60 text-ink-subtle/70 font-normal"
                }`}
              >
                <div className="flex items-center gap-1">
                  {isPassed && (
                    <Check className="h-3 w-3 text-accent shrink-0 stroke-[2.5px]" />
                  )}
                  <span className="text-xs font-bold truncate">
                    {getStageConfig(stg).shortLabel}
                  </span>
                </div>
                <span
                  className={`text-[9px] hidden sm:block truncate w-full ${
                    isCurrent ? "text-white/80" : "text-ink-subtle"
                  }`}
                >
                  {getStageConfig(stg).description}
                </span>
              </div>
            );
          })}

          {/* Terminal Stage Column (Won / Lost) */}
          <div
            className={`flex flex-col items-center justify-center p-2.5 rounded-xl text-center transition-all ${
              currentStage === "won"
                ? "bg-emerald-600 text-white font-bold shadow-xs scale-[1.02]"
                : currentStage === "lost"
                ? "bg-rose-600 text-white font-bold shadow-xs scale-[1.02]"
                : "bg-inset/40 border border-line/60 text-ink-subtle/70 font-normal"
            }`}
          >
            <span className="text-xs font-bold truncate w-full">
              {currentStage === "won"
                ? "Won"
                : currentStage === "lost"
                ? "Lost"
                : "Closed"}
            </span>
            <span
              className={`text-[9px] hidden sm:block truncate w-full ${
                isTerminal ? "text-white/80" : "text-ink-subtle"
              }`}
            >
              {currentStage === "won"
                ? "Deal won"
                : currentStage === "lost"
                ? "Deal lost"
                : "Terminal"}
            </span>
          </div>
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
                  <CustomSelect
                    options={inStockCars.data.map((car) => ({
                      value: car.id,
                      label: `${car.year} ${car.make} ${car.model}`,
                      description: `Reg: ${car.reg_number}`,
                      icon: <Car className="h-3.5 w-3.5" />,
                    }))}
                    value={selectedCarId}
                    onChange={(val) => setSelectedCarId(val)}
                    placeholder="-- Pick an in-stock car --"
                    searchPlaceholder="Search by car name or reg no..."
                    icon={<Car className="h-4 w-4" />}
                    className="w-full"
                    buttonClassName="w-full min-h-[44px] bg-inset border border-line text-xs font-semibold text-ink rounded-xl hover:border-accent transition-all px-3"
                  />
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
