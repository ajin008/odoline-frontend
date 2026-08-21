"use client";

import { useState } from "react";
import {
  useLeadFollowUps,
  useScheduleFollowUp,
} from "../hooks/use-lead-follow-ups";
import type {
  FollowUp,
  NextFollowUpInfo,
  FollowUpDueState,
} from "../types/lead-types";
import { DatePicker } from "@/src/components/ui/date-picker";
import { FollowUpOutcomeModal } from "./follow-up-outcome-modal";
import { formatISTDateTime, parseISTDateTimeToUTC } from "@/src/lib/formatters";
import {
  CalendarCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  Plus,
  Loader2,
  X,
  ClipboardCheck,
} from "lucide-react";

interface LeadFollowUpsProps {
  leadId: string;
  nextFollowUp?: NextFollowUpInfo | null;
  readOnly?: boolean;
}

const DUE_STATE_CONFIG: Record<
  FollowUpDueState,
  { label: string; bgClass: string; textClass: string; borderClass: string }
> = {
  overdue: {
    label: "Overdue",
    bgClass: "bg-red-500/10",
    textClass: "text-red-500",
    borderClass: "border-red-500/20",
  },
  due_today: {
    label: "Due Today",
    bgClass: "bg-amber-500/10",
    textClass: "text-amber-500",
    borderClass: "border-amber-500/20",
  },
  upcoming: {
    label: "Upcoming",
    bgClass: "bg-blue-500/10",
    textClass: "text-blue-500",
    borderClass: "border-blue-500/20",
  },
  none: {
    label: "No Reminder",
    bgClass: "bg-inset",
    textClass: "text-ink-subtle",
    borderClass: "border-line",
  },
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

export function LeadFollowUps({
  leadId,
  nextFollowUp,
  readOnly = false,
}: LeadFollowUpsProps) {
  const { data: followUps, isLoading, isError } = useLeadFollowUps(leadId);
  const scheduleMutation = useScheduleFollowUp(leadId);

  // Modals state
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState(getTodayISTDateString());
  const [scheduleTime, setScheduleTime] = useState("10:00");

  // Outcome Modal State
  const [selectedOutcomeFu, setSelectedOutcomeFu] = useState<FollowUp | null>(null);

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isoDateTime = parseISTDateTimeToUTC(scheduleDate, scheduleTime || "10:00");

    scheduleMutation.mutate(
      { due_at: isoDateTime },
      {
        onSuccess: () => {
          setIsScheduleOpen(false);
          setScheduleTime("10:00");
        },
      }
    );
  };

  const openFollowUps = followUps?.filter((f) => f.status === "open") || [];
  const activeNextFollowUp = openFollowUps[0];
  const dueStateConfig =
    DUE_STATE_CONFIG[nextFollowUp?.due_state || "none"] ||
    DUE_STATE_CONFIG.none;

  if (isLoading) {
    return (
      <div className="rounded-xl border border-line bg-card p-5 space-y-3 font-sans select-none">
        <div className="h-4 w-32 animate-pulse rounded bg-inset" />
        <div className="h-16 animate-pulse rounded-lg bg-inset" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-danger/20 bg-state-danger-light p-4 text-xs font-medium text-danger font-sans select-none">
        Failed to load follow-up reminders.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-line bg-card p-5 space-y-4 font-sans select-none">
      {/* Header & Schedule Button */}
      <div className="flex items-center justify-between gap-2 border-b border-line/60 pb-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-muted flex items-center gap-2">
          <CalendarCheck className="h-4 w-4 text-accent" />
          Follow-up Reminders
        </h3>

        {!readOnly && (
          <button
            type="button"
            onClick={() => setIsScheduleOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-inverse shadow-xs hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Schedule</span>
          </button>
        )}
      </div>

      {/* Prominent Next Follow-up Banner */}
      {nextFollowUp && activeNextFollowUp ? (
        <div
          className={`rounded-lg border p-4 space-y-3 ${dueStateConfig.bgClass} ${dueStateConfig.borderClass}`}
        >
          <div className="flex items-center justify-between gap-2">
            <span
              className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${dueStateConfig.bgClass} ${dueStateConfig.textClass} ${dueStateConfig.borderClass}`}
            >
              {dueStateConfig.label}
            </span>

            {!readOnly && (
              <button
                type="button"
                onClick={() => setSelectedOutcomeFu(activeNextFollowUp)}
                className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-inverse shadow-xs hover:opacity-90 transition-opacity cursor-pointer"
              >
                <ClipboardCheck className="h-3.5 w-3.5" />
                <span>Record Result</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-ink">
            <Calendar className="h-4 w-4 text-accent shrink-0" />
            <span>
              Due: {formatISTDateTime(nextFollowUp.due_at)}
            </span>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-line bg-inset/40 p-4 text-center text-xs text-ink-subtle space-y-1">
          <p className="font-semibold text-ink">No Open Follow-up</p>
          <p className="text-[11px]">
            Schedule a reminder date to keep this lead active and tracked.
          </p>
        </div>
      )}

      {/* History & Closed Follow-ups */}
      {isLoading ? (
        <div className="py-4 flex items-center justify-center gap-2 text-xs text-ink-subtle">
          <Loader2 className="h-4 w-4 animate-spin text-accent" />
          Loading follow-ups…
        </div>
      ) : isError ? (
        <p className="text-xs text-danger text-center py-2">
          Could not load follow-up list.
        </p>
      ) : followUps && followUps.length > 0 ? (
        <div className="space-y-2 pt-2 border-t border-line/50">
          <span className="text-[11px] font-semibold text-ink-subtle uppercase tracking-wider">
            All Reminders ({followUps.length})
          </span>

          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {followUps.map((fu) => {
              const dueStr = formatISTDateTime(fu.due_at);

              if (fu.status === "open") {
                return (
                  <div
                    key={fu.id}
                    className="flex items-center justify-between gap-2 p-2.5 rounded-lg border border-line bg-inset/40 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-accent shrink-0" />
                      <span className="font-medium text-ink">{dueStr}</span>
                      <span className="text-[10px] font-bold text-amber-500 uppercase">
                        (Open)
                      </span>
                    </div>

                    {!readOnly ? (
                      <button
                        type="button"
                        onClick={() => setSelectedOutcomeFu(fu)}
                        className="flex items-center gap-1 rounded-md bg-accent hover:opacity-90 text-inverse px-2.5 py-1 text-xs font-bold shadow-xs transition-all cursor-pointer shrink-0"
                      >
                        <ClipboardCheck className="h-3 w-3" />
                        <span>Record Result</span>
                      </button>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded shrink-0 uppercase tracking-wider">
                        Pending Rep Action
                      </span>
                    )}
                  </div>
                );
              }

              return (
                <div
                  key={fu.id}
                  className="space-y-1 p-2.5 rounded-lg border border-line/50 bg-card text-xs opacity-75"
                >
                  <div className="flex items-center justify-between text-ink-subtle">
                    <span className="flex items-center gap-1.5">
                      {fu.status === "done" ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-danger shrink-0" />
                      )}
                      <span className="font-medium text-ink">{dueStr}</span>
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider">
                      {fu.status}
                    </span>
                  </div>

                  {fu.outcome_note && (
                    <p className="text-[11px] text-ink italic pl-5">
                      &ldquo;{fu.outcome_note}&rdquo;
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* Modal 1: Schedule New Follow-up */}
      {isScheduleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-xl border border-line bg-card p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h4 className="text-sm font-bold text-ink flex items-center gap-2">
                <CalendarCheck className="h-4 w-4 text-accent" />
                Schedule Follow-up
              </h4>
              <button
                type="button"
                onClick={() => setIsScheduleOpen(false)}
                className="text-ink-subtle hover:text-ink transition-colors p-1 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-ink-muted flex items-center justify-between">
                  <span>Follow-up Date &amp; Time (IST)</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <DatePicker
                    value={scheduleDate}
                    onChange={(d) => setScheduleDate(d)}
                    align="left"
                  />
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value || "10:00")}
                    className="w-full h-10 rounded-xl border border-line bg-inset px-3 py-2 text-xs font-semibold text-ink focus:border-accent focus:outline-none cursor-pointer font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsScheduleOpen(false)}
                  className="rounded-lg border border-line px-3.5 py-2 text-xs font-medium text-ink hover:bg-hover transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={scheduleMutation.isPending}
                  className="flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-inverse shadow-xs hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
                >
                  {scheduleMutation.isPending && (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  )}
                  <span>Save Follow-up</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Outcome Modal */}
      <FollowUpOutcomeModal
        isOpen={!!selectedOutcomeFu}
        onClose={() => setSelectedOutcomeFu(null)}
        followUp={selectedOutcomeFu}
      />
    </div>
  );
}
