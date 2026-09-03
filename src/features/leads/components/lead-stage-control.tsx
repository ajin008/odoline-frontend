/* eslint-disable react-hooks/incompatible-library */
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useChangeStage } from "../hooks/use-lead-stage";
import type { Lead, LeadStage } from "../types/lead-types";
import { carsApi } from "@/src/features/cars/api/cars-api";
import { CustomSelect } from "@/src/components/ui/custom-select";
import { useConfig } from "@/src/features/settings/hooks/use-config";
import { useCreateBooking } from "@/src/features/booking/hooks/use-booking-actions";
import {
  advanceAgreementSchema,
  type AdvanceAgreementFormValues,
} from "@/src/features/booking/schemas/booking-schemas";
import { numberToWordsRupees } from "@/src/features/booking/utils/number-to-words";
import type { PaymentMethod } from "@/src/features/booking/types/booking-types";
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
  FileText,
  Banknote,
  Building2,
  QrCode,
  Coins,
  Wallet,
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

const stageConfigMap = new Map<LeadStage, (typeof STAGE_CONFIG)[LeadStage]>([
  ["new", STAGE_CONFIG.new],
  ["contacted", STAGE_CONFIG.contacted],
  ["test_drive", STAGE_CONFIG.test_drive],
  ["discussion", STAGE_CONFIG.discussion],
  ["won", STAGE_CONFIG.won],
  ["lost", STAGE_CONFIG.lost],
]);

function getStageConfig(stage: LeadStage) {
  return stageConfigMap.get(stage) || STAGE_CONFIG.new;
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

const lostReasonConfigMap = new Map<
  string,
  { label: string; icon: LucideIcon; colorBg: string; colorText: string }
>([
  ["Bought elsewhere", LOST_REASON_CONFIG["Bought elsewhere"]],
  ["Price too high", LOST_REASON_CONFIG["Price too high"]],
  ["Loan rejected", LOST_REASON_CONFIG["Loan rejected"]],
  [
    "Changed mind / no longer buying",
    LOST_REASON_CONFIG["Changed mind / no longer buying"],
  ],
  ["Car model not available", LOST_REASON_CONFIG["Car model not available"]],
  ["Other", LOST_REASON_CONFIG["Other"]],
]);

function getLostReasonConfig(reason: string) {
  return lostReasonConfigMap.get(reason) || LOST_REASON_CONFIG["Other"];
}

function formatCurrency(amountStr: string | null): string {
  if (!amountStr) return "";
  const num = Number(amountStr);
  if (isNaN(num)) return amountStr;
  return `₹${num.toLocaleString("en-IN")}`;
}

const PAYMENT_METHOD_OPTIONS = [
  { value: "cash", label: "Cash", icon: <Banknote className="h-3.5 w-3.5" /> },
  {
    value: "bank_transfer",
    label: "Bank Transfer / NEFT / RTGS",
    icon: <Building2 className="h-3.5 w-3.5" />,
  },
  {
    value: "upi",
    label: "UPI / GPay / PhonePe",
    icon: <QrCode className="h-3.5 w-3.5" />,
  },
  {
    value: "card",
    label: "Credit / Debit Card",
    icon: <CreditCard className="h-3.5 w-3.5" />,
  },
  {
    value: "cheque",
    label: "Cheque",
    icon: <FileText className="h-3.5 w-3.5" />,
  },
  {
    value: "loan",
    label: "Bank Loan / Finance",
    icon: <Coins className="h-3.5 w-3.5" />,
  },
  {
    value: "exchange",
    label: "Exchange Car",
    icon: <Car className="h-3.5 w-3.5" />,
  },
  {
    value: "other",
    label: "Other Method",
    icon: <Wallet className="h-3.5 w-3.5" />,
  },
];

export function LeadStageControl({ lead }: LeadStageControlProps) {
  const changeStageMutation = useChangeStage(lead.id);
  const createBookingMutation = useCreateBooking();
  const { data: configData } = useConfig();

  // Modals state
  const [isWonOpen, setIsWonOpen] = useState(false);
  const [wonStep, setWonStep] = useState<"won" | "advance">("won");
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

  // Step 2 Form Hook
  const {
    register: registerAdvance,
    handleSubmit: handleSubmitAdvance,
    setValue: setAdvanceValue,
    setError: setErrorAdvance,
    watch: watchAdvance,
    reset: resetAdvance,
    formState: { errors: advanceErrors },
  } = useForm<AdvanceAgreementFormValues>({
    resolver: zodResolver(advanceAgreementSchema),
    defaultValues: {
      advance_amount: "",
      advance_method: "cash",
      advance_reference: "",
      advance_receipt_date: new Date().toISOString().split("T")[0],
      balance_due_days: "",
    },
  });

  const watchAdvanceAmount = watchAdvance("advance_amount");
  const watchMethod = watchAdvance("advance_method") || "cash";

  const amountInWords = watchAdvanceAmount
    ? numberToWordsRupees(watchAdvanceAmount)
    : "";

  const calculatedBalance =
    wonPrice &&
    watchAdvanceAmount &&
    !isNaN(Number(wonPrice)) &&
    !isNaN(Number(watchAdvanceAmount))
      ? Math.max(0, Number(wonPrice) - Number(watchAdvanceAmount))
      : null;

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

  const handleOpenWonModal = () => {
    setIsWonOpen(true);
    setWonStep("won");
    setSelectedCarId("");
    setWonPrice("");
    setWonNotes("");
    resetAdvance({
      advance_amount: "",
      advance_method: "cash",
      advance_reference: "",
      advance_receipt_date: new Date().toISOString().split("T")[0],
      balance_due_days: "",
    });
  };

  const handleProceedToAdvance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCarId || !wonPrice || Number(wonPrice) < 3000) return;
    setWonStep("advance");
  };

  const onSubmitAdvance = (data: AdvanceAgreementFormValues) => {
    const advNum = Number(data.advance_amount);
    const wonNum = Number(wonPrice);

    if (advNum < 3000) {
      setErrorAdvance("advance_amount", {
        type: "manual",
        message: "Advance amount must be at least ₹3,000",
      });
      return;
    }

    if (wonNum && advNum > wonNum) {
      setErrorAdvance("advance_amount", {
        type: "manual",
        message: `Advance amount cannot exceed agreed deal price (${formatCurrency(wonPrice)})`,
      });
      return;
    }

    createBookingMutation.mutate(
      {
        lead_id: lead.id,
        won_car_id: selectedCarId,
        won_price: wonPrice,
        closing_notes: wonNotes.trim() || undefined,
        advance_amount: data.advance_amount,
        advance_method: data.advance_method as PaymentMethod,
        advance_reference: data.advance_reference?.trim() || undefined,
        advance_receipt_date: data.advance_receipt_date || undefined,
        balance_due_days: data.balance_due_days
          ? Number(data.balance_due_days)
          : undefined,
      },
      {
        onSuccess: () => {
          setIsWonOpen(false);
          setWonStep("won");
        },
        onError: (err: unknown) => {
          const axiosErr = err as {
            response?: { data?: { error?: { code?: string } } };
          };
          const code = axiosErr?.response?.data?.error?.code;
          if (code === "CAR_ALREADY_BOOKED") {
            setWonStep("won");
          }
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

  const selectedCarObj = inStockCars?.data?.find((c) => c.id === selectedCarId);
  const selectedCarLabel = selectedCarObj
    ? `${selectedCarObj.year} ${selectedCarObj.make} ${selectedCarObj.model} (${selectedCarObj.reg_number})`
    : "Vehicle Selected";

  const showroomName = configData?.showroom_name || "Cars4";

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
                onClick={handleOpenWonModal}
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
                onClick={handleOpenWonModal}
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
        <div className="rounded-xl border border-success/20 bg-success-light p-4 space-y-2 text-xs">
          <div className="flex items-center justify-between font-semibold text-success">
            <span className="flex items-center gap-1.5">
              <Trophy className="h-4 w-4 text-success" />
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-success/20 text-ink">
            <div>
              <span className="text-ink-subtle">Purchased Car: </span>
              <span className="font-bold">
                {lead.won_car
                  ? `${lead.won_car.year} ${lead.won_car.make} ${lead.won_car.model}`
                  : "Vehicle Selected"}
              </span>
            </div>
            <div>
              <span className="text-ink-subtle">Final Sale Price: </span>
              <span className="font-bold font-mono text-success">
                {lead.won_price
                  ? `₹${Number(lead.won_price).toLocaleString("en-IN")}`
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Lost Details Banner (if already LOST) */}
      {currentStage === "lost" && (
        <div className="rounded-xl border border-danger/20 bg-danger-light p-4 space-y-2 text-xs">
          <div className="flex items-center justify-between font-semibold text-danger">
            <span className="flex items-center gap-1.5">
              <XCircle className="h-4 w-4 text-danger" />
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

          <p className="text-ink font-medium pt-1 border-t border-danger/20">
            &ldquo;{lead.lost_reason || "No reason specified"}&rdquo;
          </p>
        </div>
      )}

      {/* Extended Won Modal: Step 1 (Deal Info) -> Step 2 (Advance Sale Agreement) */}
      {isWonOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 pointer-events-auto overflow-y-auto">
          <div className="w-full max-w-lg my-8 rounded-2xl border border-line bg-card p-5 shadow-xl space-y-4 pointer-events-auto">
            {/* Modal Header with Stepper */}
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                  <Trophy className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-ink">
                    {wonStep === "won"
                      ? "Close Deal as Won"
                      : "Advance Sale Agreement"}
                  </h4>
                  <span className="text-[11px] font-medium text-ink-subtle">
                    Step {wonStep === "won" ? "1" : "2"} of 2 —{" "}
                    {wonStep === "won"
                      ? "Vehicle & Deal Price"
                      : "Token Advance & Payment"}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsWonOpen(false);
                  setWonStep("won");
                }}
                className="text-ink-subtle hover:text-ink transition-colors p-1 cursor-pointer rounded-lg hover:bg-hover"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Step Indicator Bar */}
            <div className="grid grid-cols-2 gap-2">
              <div
                className={`h-1.5 rounded-full transition-all ${
                  wonStep === "won" ? "bg-emerald-500" : "bg-emerald-500/40"
                }`}
              />
              <div
                className={`h-1.5 rounded-full transition-all ${
                  wonStep === "advance"
                    ? "bg-emerald-500"
                    : "bg-inset border border-line"
                }`}
              />
            </div>

            {/* STEP 1: WON FIELDS */}
            {wonStep === "won" && (
              <form onSubmit={handleProceedToAdvance} className="space-y-4">
                {/* Select Car from In-Stock vehicles */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-ink-muted">
                    Select Purchased Car <span className="text-danger">*</span>
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
                    Agreed Deal Price (₹) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={wonPrice}
                    onChange={(e) => setWonPrice(e.target.value)}
                    placeholder="e.g. 750000"
                    className="w-full rounded-xl border border-line bg-inset p-3 text-xs text-ink focus:border-accent focus:outline-none font-mono"
                  />
                  {wonPrice && Number(wonPrice) < 3000 && (
                    <p className="text-[11px] text-danger font-medium pt-0.5">
                      Agreed deal price must be at least ₹3,000
                    </p>
                  )}
                  {wonPrice && Number(wonPrice) >= 3000 && numberToWordsRupees(wonPrice) && (
                    <p className="text-[11px] text-ink-subtle italic font-sans pt-0.5">
                      &ldquo;{numberToWordsRupees(wonPrice)}&rdquo;
                    </p>
                  )}
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
                    placeholder="e.g. Customer agreed on cash payment, token today..."
                    className="w-full rounded-xl border border-line bg-inset p-3 text-xs text-ink focus:border-accent focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-line">
                  <button
                    type="button"
                    onClick={() => {
                      setIsWonOpen(false);
                      setWonStep("won");
                    }}
                    className="rounded-xl border border-line bg-surface px-4 py-2 text-xs font-semibold text-ink hover:bg-hover transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={
                      !selectedCarId || !wonPrice || Number(wonPrice) < 3000
                    }
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 px-4 py-2 text-xs font-bold text-white shadow-xs hover:shadow transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <span>Proceed to Prebooking</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: ADVANCE AGREEMENT FORM */}
            {wonStep === "advance" && (
              <form
                onSubmit={handleSubmitAdvance(onSubmitAdvance)}
                className="space-y-4"
              >
                {/* Read-only Summary Box */}
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-bold text-emerald-600 dark:text-emerald-400">
                    <span className="flex items-center gap-1">
                      <FileText className="h-3.5 w-3.5" />
                      Agreement Summary
                    </span>
                    <button
                      type="button"
                      onClick={() => setWonStep("won")}
                      className="text-[11px] underline text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 cursor-pointer font-semibold"
                    >
                      Edit Step 1
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-ink text-[11px] pt-1 border-t border-emerald-500/10">
                    <div>
                      <span className="text-ink-subtle block text-[10px] uppercase font-semibold">
                        Buyer Name
                      </span>
                      <span className="font-bold">
                        {lead.customer?.name || "Customer"}
                      </span>
                    </div>
                    <div>
                      <span className="text-ink-subtle block text-[10px] uppercase font-semibold">
                        Showroom / Seller
                      </span>
                      <span className="font-bold">{showroomName}</span>
                    </div>
                    <div>
                      <span className="text-ink-subtle block text-[10px] uppercase font-semibold">
                        Selected Vehicle
                      </span>
                      <span className="font-bold truncate block">
                        {selectedCarLabel}
                      </span>
                    </div>
                    <div>
                      <span className="text-ink-subtle block text-[10px] uppercase font-semibold">
                        Agreed Price
                      </span>
                      <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(wonPrice)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Advance Amount Received */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-ink-muted flex items-center justify-between">
                    <span>
                      Advance Amount Received (₹){" "}
                      <span className="text-danger">*</span>
                    </span>
                    {calculatedBalance !== null && (
                      <span className="text-[11px] font-mono font-bold text-accent">
                        Balance Due: {formatCurrency(String(calculatedBalance))}
                      </span>
                    )}
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 25000"
                    {...registerAdvance("advance_amount")}
                    className="w-full rounded-xl border border-line bg-inset p-3 text-xs text-ink focus:border-accent focus:outline-none font-mono"
                  />
                  {advanceErrors.advance_amount && (
                    <p className="text-[11px] text-danger font-medium">
                      {advanceErrors.advance_amount.message}
                    </p>
                  )}
                  {!advanceErrors.advance_amount && watchAdvanceAmount && wonPrice && Number(watchAdvanceAmount) > Number(wonPrice) && (
                    <p className="text-[11px] text-danger font-medium">
                      Advance amount cannot exceed agreed deal price ({formatCurrency(wonPrice)})
                    </p>
                  )}
                  {amountInWords && (
                    <p className="text-[11px] text-ink-subtle italic font-sans pt-0.5">
                      &ldquo;{amountInWords}&rdquo;
                    </p>
                  )}
                </div>

                {/* Payment Method */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-ink-muted">
                    Payment Method <span className="text-danger">*</span>
                  </label>
                  <CustomSelect
                    options={PAYMENT_METHOD_OPTIONS}
                    value={watchMethod}
                    onChange={(val) =>
                      setAdvanceValue("advance_method", val as PaymentMethod, {
                        shouldValidate: true,
                      })
                    }
                    placeholder="Select method..."
                    className="w-full"
                    buttonClassName="w-full min-h-[44px] bg-inset border border-line text-xs font-semibold text-ink rounded-xl hover:border-accent transition-all px-3"
                  />
                  {advanceErrors.advance_method && (
                    <p className="text-[11px] text-danger font-medium">
                      {advanceErrors.advance_method.message}
                    </p>
                  )}
                </div>

                {/* Receipt / Reference Number (Rt No.) */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-ink-muted flex items-center justify-between">
                    <span>Receipt / Reference No. (Rt No.)</span>
                    {watchMethod !== "cash" && (
                      <span className="text-[10px] text-amber-500 font-medium">
                        (Cheque / UTR / Txn ID recommended)
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    placeholder={
                      watchMethod === "cash"
                        ? "Optional receipt no."
                        : "e.g. UTR123456789 / CHQ-00123"
                    }
                    {...registerAdvance("advance_reference")}
                    className="w-full rounded-xl border border-line bg-inset p-3 text-xs text-ink focus:border-accent focus:outline-none font-mono"
                  />
                  {advanceErrors.advance_reference && (
                    <p className="text-[11px] text-danger font-medium">
                      {advanceErrors.advance_reference.message}
                    </p>
                  )}
                </div>

                {/* Date & Balance Due Days Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-ink-muted">
                      Receipt Date (dtd)
                    </label>
                    <input
                      type="date"
                      {...registerAdvance("advance_receipt_date")}
                      className="w-full rounded-xl border border-line bg-inset p-3 text-xs text-ink focus:border-accent focus:outline-none font-mono"
                    />
                    {advanceErrors.advance_receipt_date && (
                      <p className="text-[11px] text-danger font-medium">
                        {advanceErrors.advance_receipt_date.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-ink-muted">
                      Balance Deadline (Days)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 10"
                      {...registerAdvance("balance_due_days")}
                      className="w-full rounded-xl border border-line bg-inset p-3 text-xs text-ink focus:border-accent focus:outline-none font-mono"
                    />
                    {advanceErrors.balance_due_days && (
                      <p className="text-[11px] text-danger font-medium">
                        {advanceErrors.balance_due_days.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Step 2 Action Buttons */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-line">
                  <button
                    type="button"
                    onClick={() => setWonStep("won")}
                    disabled={createBookingMutation.isPending}
                    className="flex items-center gap-1 rounded-xl border border-line bg-surface px-4 py-2 text-xs font-semibold text-ink hover:bg-hover transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="submit"
                    disabled={createBookingMutation.isPending}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:shadow transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {createBookingMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Creating Prebooking…</span>
                      </>
                    ) : (
                      <span>Create Agreement</span>
                    )}
                  </button>
                </div>
              </form>
            )}
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
