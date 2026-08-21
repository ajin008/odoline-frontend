/* eslint-disable security/detect-object-injection */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { leadApi } from "../api/lead-api";
import { queryKeys } from "@/src/lib/query-keys";
import { DatePicker } from "@/src/components/ui/date-picker";
import type { LeadPriority } from "../types/lead-types";
import { toast } from "sonner";
import {
  X,
  Loader2,
  CheckCircle2,
  PhoneOff,
  XCircle,
  Ban,
  Calendar,
  ClipboardCheck,
  User,
  ShoppingBag,
  Tag,
  CreditCard,
  RefreshCw,
  SearchX,
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react";

import { parseISTDateTimeToUTC } from "@/src/lib/formatters";

export interface FollowUpTarget {
  id: string;
  lead_id: string;
  lead?: {
    stage?: string | null;
    priority?: LeadPriority | null;
    customer?: {
      name?: string;
      phone?: string;
    } | null;
  } | null;
}

interface FollowUpOutcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  followUp: FollowUpTarget | null;
  onSuccess?: () => void;
}

type OutcomeChoice = "reached" | "no_answer" | "lost" | "cancelled";
type QuickPickChoice = "tomorrow" | "2days" | "1week" | "custom";

const LOST_REASONS = [
  "Bought elsewhere",
  "Price too high",
  "Loan rejected",
  "Changed mind / no longer buying",
  "Car model not available",
  "Other",
];

const LOST_REASON_ICONS: Record<string, LucideIcon> = {
  "Bought elsewhere": ShoppingBag,
  "Price too high": Tag,
  "Loan rejected": CreditCard,
  "Changed mind / no longer buying": RefreshCw,
  "Car model not available": SearchX,
  Other: MoreHorizontal,
};

function getTodayISTDateString(): string {
  const now = new Date();
  const istOffsetMs = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(now.getTime() + istOffsetMs);
  const year = istDate.getUTCFullYear();
  const month = String(istDate.getUTCMonth() + 1).padStart(2, "0");
  const day = String(istDate.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getQuickPickISODate(
  pick: QuickPickChoice,
  customDateStr: string,
  customTimeStr: string = "10:00"
): string {
  const istOffsetMs = 5.5 * 60 * 60 * 1000;
  const nowIST = new Date(Date.now() + istOffsetMs);
  let dateStr = nowIST.toISOString().split("T")[0];

  if (pick === "tomorrow") {
    const tom = new Date(Date.now() + 24 * 60 * 60 * 1000 + istOffsetMs);
    dateStr = tom.toISOString().split("T")[0];
  } else if (pick === "2days") {
    const d2 = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + istOffsetMs);
    dateStr = d2.toISOString().split("T")[0];
  } else if (pick === "1week") {
    const d7 = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + istOffsetMs);
    dateStr = d7.toISOString().split("T")[0];
  } else if (pick === "custom" && customDateStr) {
    dateStr = customDateStr;
  }
  return parseISTDateTimeToUTC(dateStr, customTimeStr || "10:00");
}

interface ApiError {
  response?: {
    data?: {
      error?: {
        message?: string;
      };
    };
  };
}

export function FollowUpOutcomeModal({
  isOpen,
  onClose,
  followUp,
  onSuccess,
}: FollowUpOutcomeModalProps) {
  const queryClient = useQueryClient();

  const [outcomeChoice, setOutcomeChoice] = useState<OutcomeChoice>("reached");
  const [note, setNote] = useState("");

  // Reschedule / Next Date State
  const [quickPick, setQuickPick] = useState<QuickPickChoice>("tomorrow");
  const [customDate, setCustomDate] = useState(getTodayISTDateString());
  const [customTime, setCustomTime] = useState("10:00");

  // Mark Lost State
  const [selectedLostReason, setSelectedLostReason] = useState(LOST_REASONS[0]);
  const [customLostReason, setCustomLostReason] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setOutcomeChoice("reached");
      setNote("");
      setQuickPick("tomorrow");
      setCustomDate(getTodayISTDateString());
      setSelectedLostReason(LOST_REASONS[0]);
      setCustomLostReason("");
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen || !followUp) return null;

  const customerName = followUp.lead?.customer?.name || "Customer";
  const customerPhone = followUp.lead?.customer?.phone;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUp) return;

    const leadId = followUp.lead_id;
    const fuId = followUp.id;

    setIsSubmitting(true);

    let stageAutoAdvanced = false;

    try {
      if (outcomeChoice === "reached") {
        // Choice A: Reached customer — set next follow-up
        const chosenNextISO = getQuickPickISODate(quickPick, customDate, customTime);

        // 1. Mark current follow-up as DONE
        await leadApi.updateFollowUp(leadId, fuId, {
          status: "done",
          outcome_note: note.trim() || undefined,
        });

        // 2. Schedule next follow-up
        await leadApi.scheduleFollowUp(leadId, {
          due_at: chosenNextISO,
        });

        // 3. Log activity note (if provided)
        if (note.trim()) {
          await leadApi.logActivity(leadId, {
            type: "note",
            note: `Follow-up outcome: ${note.trim()}`,
          });
        }

        // 4. Auto stage change (§8.8 Rule 1):
        // ONLY IF lead's CURRENT stage === 'new', auto advance to 'contacted'.
        // IF stage is anything else ('contacted', 'test_drive', 'discussion'), DO NOT change stage!
        let currentStage = followUp.lead?.stage;
        if (!currentStage) {
          try {
            const leadDetail = await leadApi.getById(leadId);
            currentStage = leadDetail.stage;
          } catch {
            // fallback if getById fails
          }
        }

        if (currentStage === "new") {
          await leadApi.changeStage(leadId, {
            to_stage: "contacted",
            notes: "Auto-advanced: reached on follow-up",
          });
          stageAutoAdvanced = true;
        }
      } else if (outcomeChoice === "no_answer") {
        // Choice B: No Answer — reschedule follow-up (NO stage change)
        const chosenISO = getQuickPickISODate(quickPick, customDate, customTime);

        // 1. Update current follow-up due_at (keep status open)
        await leadApi.updateFollowUp(leadId, fuId, {
          due_at: chosenISO,
        });

        // 2. Log activity call attempt
        const logNote = note.trim()
          ? `No answer: ${note.trim()}`
          : "No answer — rescheduled";

        await leadApi.logActivity(leadId, {
          type: "call",
          note: logNote,
        });
      } else if (outcomeChoice === "lost") {
        // Choice C (§8.8 Rule 2): Not Interested / Lost — Mark Lead Lost
        const finalReason =
          selectedLostReason === "Other"
            ? customLostReason.trim()
            : selectedLostReason;

        if (!finalReason) {
          toast.error("Please specify reason for loss");
          setIsSubmitting(false);
          return;
        }

        // 1. Mark current follow-up as DONE
        await leadApi.updateFollowUp(leadId, fuId, {
          status: "done",
          outcome_note: note.trim() || undefined,
        });

        // 2. Change stage to lost
        await leadApi.changeStage(leadId, {
          to_stage: "lost",
          lost_reason: finalReason,
          notes: note.trim() || undefined,
        });
      } else if (outcomeChoice === "cancelled") {
        // Choice D: Cancel reminder (NO stage change)
        await leadApi.updateFollowUp(leadId, fuId, {
          status: "cancelled",
        });
      }

      const successMsg = stageAutoAdvanced
        ? "Follow-up recorded & lead auto-advanced to Contacted!"
        : "Follow-up result recorded successfully";
      toast.success(successMsg);

      // Invalidate all required caches
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.followUps.all }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.leads.detail(leadId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.leads.followUps(leadId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.leads.activities(leadId),
        }),
        queryClient.invalidateQueries({ queryKey: queryKeys.leads.all }),
      ]);

      onClose();
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      const message =
        apiErr.response?.data?.error?.message ||
        "Failed to log follow-up outcome";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-110 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 pointer-events-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl bg-card border border-line shadow-2xl overflow-hidden font-sans max-h-[90vh] flex flex-col pointer-events-auto select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-line px-5 py-4 bg-card shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-inverse shrink-0">
              <ClipboardCheck className="h-4.5 w-4.5 stroke-[2.5px]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink">
                Record Follow-up Result
              </h3>
              <p className="text-xs text-ink-subtle flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{customerName}</span>
                {customerPhone && (
                  <span className="font-mono text-[11px]">
                    ({customerPhone})
                  </span>
                )}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-subtle hover:bg-hover hover:text-ink transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="p-5 space-y-4 overflow-y-auto max-h-[calc(90vh-130px)] touch-pan-y overscroll-contain">
            {/* Step 1: Choice Selector Cards */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink uppercase tracking-wider">
                What happened? (Select Outcome)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* Reached */}
                <button
                  type="button"
                  onClick={() => setOutcomeChoice("reached")}
                  className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    outcomeChoice === "reached"
                      ? "bg-emerald-500/10 border-emerald-500/50 text-ink ring-1 ring-emerald-500/30 shadow-xs"
                      : "bg-inset/40 border-line/60 text-ink-muted hover:border-line hover:text-ink hover:bg-inset"
                  }`}
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-ink">
                      Reached Customer
                    </p>
                    <p className="text-[10px] text-ink-subtle leading-tight mt-0.5">
                      Connected &amp; set next follow-up
                    </p>
                  </div>
                </button>

                {/* No Answer */}
                <button
                  type="button"
                  onClick={() => setOutcomeChoice("no_answer")}
                  className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    outcomeChoice === "no_answer"
                      ? "bg-amber-500/10 border-amber-500/50 text-ink ring-1 ring-amber-500/30 shadow-xs"
                      : "bg-inset/40 border-line/60 text-ink-muted hover:border-line hover:text-ink hover:bg-inset"
                  }`}
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/15 text-amber-500 shrink-0">
                    <PhoneOff className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-ink">
                      No Answer / Busy
                    </p>
                    <p className="text-[10px] text-ink-subtle leading-tight mt-0.5">
                      Log attempt &amp; reschedule
                    </p>
                  </div>
                </button>

                {/* Mark Lost */}
                <button
                  type="button"
                  onClick={() => setOutcomeChoice("lost")}
                  className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    outcomeChoice === "lost"
                      ? "bg-red-500/10 border-red-500/50 text-ink ring-1 ring-red-500/30 shadow-xs"
                      : "bg-inset/40 border-line/60 text-ink-muted hover:border-line hover:text-ink hover:bg-inset"
                  }`}
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/15 text-red-500 shrink-0">
                    <XCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-ink">
                      Not Interested / Lost
                    </p>
                    <p className="text-[10px] text-ink-subtle leading-tight mt-0.5">
                      Close follow-up &amp; mark lost
                    </p>
                  </div>
                </button>

                {/* Cancel Reminder */}
                <button
                  type="button"
                  onClick={() => setOutcomeChoice("cancelled")}
                  className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    outcomeChoice === "cancelled"
                      ? "bg-slate-500/10 border-slate-500/50 text-ink ring-1 ring-slate-500/30 shadow-xs"
                      : "bg-inset/40 border-line/60 text-ink-muted hover:border-line hover:text-ink hover:bg-inset"
                  }`}
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-500/15 text-slate-500 shrink-0">
                    <Ban className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-ink">
                      Cancel Reminder
                    </p>
                    <p className="text-[10px] text-ink-subtle leading-tight mt-0.5">
                      No longer needed
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Dynamic Step 2 Fields based on selected choice */}
            {outcomeChoice === "reached" && (
              <div className="space-y-3 pt-2 border-t border-line/60 animate-in fade-in duration-200">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-ink">
                    Outcome / Conversation Note (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g. Customer interested in Skoda Slavia, asked to call back..."
                    className="w-full rounded-xl border border-line bg-surface p-3 text-xs text-ink placeholder:text-ink-subtle/60 focus:border-accent focus:outline-none resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-ink flex items-center justify-between">
                    <span>Schedule Next Follow-up</span>
                    <span className="text-[10px] text-accent font-normal">
                      Default: 10:00 AM
                    </span>
                  </label>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {(
                      [
                        { id: "tomorrow", label: "Tomorrow" },
                        { id: "2days", label: "+2 Days" },
                        { id: "1week", label: "+1 Week" },
                        { id: "custom", label: "Custom Date" },
                      ] as const
                    ).map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setQuickPick(p.id)}
                        className={`px-2.5 py-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer text-center ${
                          quickPick === p.id
                            ? "bg-accent/15 border-accent text-accent font-bold shadow-xs"
                            : "bg-surface border-line text-ink-subtle hover:text-ink"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>

                  {quickPick === "custom" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      <DatePicker
                        value={customDate}
                        onChange={(d) => setCustomDate(d)}
                        align="left"
                      />
                      <input
                        type="time"
                        value={customTime}
                        onChange={(e) => setCustomTime(e.target.value || "10:00")}
                        className="w-full h-10 rounded-xl border border-line bg-surface px-3 py-2 text-xs font-semibold text-ink focus:border-accent focus:outline-none cursor-pointer font-mono"
                      />
                    </div>
                  ) : (
                    <div className="pt-1 flex items-center justify-between gap-2">
                      <span className="text-[11px] font-medium text-ink-subtle">
                        Follow-up Time (IST):
                      </span>
                      <input
                        type="time"
                        value={customTime}
                        onChange={(e) => setCustomTime(e.target.value || "10:00")}
                        className="w-36 h-9 rounded-lg border border-line bg-surface px-3 py-1 text-xs font-semibold text-ink focus:border-accent focus:outline-none cursor-pointer font-mono"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {outcomeChoice === "no_answer" && (
              <div className="space-y-3 pt-2 border-t border-line/60 animate-in fade-in duration-200">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-ink flex items-center justify-between">
                    <span>Reschedule Follow-up Date</span>
                    <span className="text-[10px] text-amber-500 font-normal">
                      Keeps reminder open
                    </span>
                  </label>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {(
                      [
                        { id: "tomorrow", label: "Tomorrow" },
                        { id: "2days", label: "+2 Days" },
                        { id: "1week", label: "+1 Week" },
                        { id: "custom", label: "Custom Date" },
                      ] as const
                    ).map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setQuickPick(p.id)}
                        className={`px-2.5 py-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer text-center ${
                          quickPick === p.id
                            ? "bg-amber-500/15 border-amber-500 text-amber-500 font-bold shadow-xs"
                            : "bg-surface border-line text-ink-subtle hover:text-ink"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>

                  {quickPick === "custom" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      <DatePicker
                        value={customDate}
                        onChange={(d) => setCustomDate(d)}
                        align="left"
                      />
                      <input
                        type="time"
                        value={customTime}
                        onChange={(e) => setCustomTime(e.target.value || "10:00")}
                        className="w-full h-10 rounded-xl border border-line bg-surface px-3 py-2 text-xs font-semibold text-ink focus:border-accent focus:outline-none cursor-pointer font-mono"
                      />
                    </div>
                  ) : (
                    <div className="pt-1 flex items-center justify-between gap-2">
                      <span className="text-[11px] font-medium text-ink-subtle">
                        Follow-up Time (IST):
                      </span>
                      <input
                        type="time"
                        value={customTime}
                        onChange={(e) => setCustomTime(e.target.value || "10:00")}
                        className="w-36 h-9 rounded-lg border border-line bg-surface px-3 py-1 text-xs font-semibold text-ink focus:border-accent focus:outline-none cursor-pointer font-mono"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-ink">
                    Attempt Note (Optional)
                  </label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g. Phone rang out, sent follow-up SMS..."
                    className="w-full rounded-xl border border-line bg-surface p-2.5 text-xs text-ink outline-none focus:border-accent"
                  />
                </div>
              </div>
            )}

            {outcomeChoice === "lost" && (
              <div className="space-y-3 pt-2 border-t border-line/60 animate-in fade-in duration-200">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-ink">
                    Reason for Loss <span className="text-danger">*</span>
                  </label>

                  <div className="grid grid-cols-2 gap-2">
                    {LOST_REASONS.map((reason) => {
                      const isSelected = selectedLostReason === reason;
                      const Icon = LOST_REASON_ICONS[reason] || MoreHorizontal;

                      return (
                        <button
                          key={reason}
                          type="button"
                          onClick={() => setSelectedLostReason(reason)}
                          className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? "bg-red-500/10 border-red-500/50 text-ink ring-1 ring-red-500/30 shadow-xs"
                              : "bg-inset/40 border-line/60 text-ink-muted hover:border-line hover:text-ink hover:bg-inset"
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5 text-red-500 shrink-0" />
                          <span className="text-xs font-medium truncate">
                            {reason}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {selectedLostReason === "Other" && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-ink">
                      Specify Reason <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      value={customLostReason}
                      onChange={(e) => setCustomLostReason(e.target.value)}
                      placeholder="Enter loss details..."
                      className="w-full rounded-xl border border-line bg-surface p-2.5 text-xs text-ink outline-none focus:border-accent"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-medium text-ink">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g. Bought a Creta from rival showroom..."
                    className="w-full rounded-xl border border-line bg-surface p-2.5 text-xs text-ink outline-none focus:border-accent resize-none"
                  />
                </div>
              </div>
            )}

            {outcomeChoice === "cancelled" && (
              <div className="pt-2 border-t border-line/60 animate-in fade-in duration-200">
                <div className="rounded-xl border border-slate-500/20 bg-slate-500/10 p-3.5 text-xs text-ink space-y-1">
                  <p className="font-bold flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                    <Ban className="h-4 w-4" />
                    Cancel Follow-up Reminder
                  </p>
                  <p className="text-[11px] text-ink-subtle">
                    This will cancel this reminder task without modifying the
                    lead status.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-line px-5 py-4 bg-card shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-line bg-surface px-4 py-2 text-xs font-semibold text-ink hover:bg-hover transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center gap-1.5 rounded-xl px-5 py-2 text-xs font-semibold text-white shadow-xs transition-opacity disabled:opacity-50 cursor-pointer ${
                outcomeChoice === "reached"
                  ? "bg-emerald-500 hover:bg-emerald-600"
                  : outcomeChoice === "no_answer"
                  ? "bg-amber-500 hover:bg-amber-600"
                  : outcomeChoice === "lost"
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-slate-600 hover:bg-slate-700"
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Logging Outcome...</span>
                </>
              ) : (
                <>
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    {outcomeChoice === "reached"
                      ? "Confirm & Schedule Next"
                      : outcomeChoice === "no_answer"
                      ? "Reschedule Follow-up"
                      : outcomeChoice === "lost"
                      ? "Confirm & Mark Lost"
                      : "Cancel Reminder"}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
