"use client";

/* eslint-disable security/detect-object-injection */
import { formatISTDateTime } from "@/src/lib/formatters";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useActionFollowUps } from "@/src/features/leads/hooks/use-lead-follow-ups";
import type { LeadPriority, FollowUp } from "@/src/features/leads/types/lead-types";
import { FollowUpOutcomeModal } from "@/src/features/leads/components/follow-up-outcome-modal";
import {
  ArrowRight,
  Clock,
  CheckCircle2,
  Loader2,
  Calendar,
  ClipboardCheck,
} from "lucide-react";

type BucketType = "today" | "overdue" | "upcoming";

const PRIORITY_CONFIG: Record<
  LeadPriority,
  { label: string; bgClass: string; textClass: string; borderClass: string }
> = {
  very_hot: {
    label: "Very Hot",
    bgClass: "bg-red-500/10",
    textClass: "text-red-500",
    borderClass: "border-red-500/20",
  },
  hot: {
    label: "Hot",
    bgClass: "bg-amber-500/10",
    textClass: "text-amber-500",
    borderClass: "border-amber-500/20",
  },
  warm: {
    label: "Warm",
    bgClass: "bg-yellow-500/10",
    textClass: "text-yellow-600 dark:text-yellow-400",
    borderClass: "border-yellow-500/20",
  },
  cold: {
    label: "Cold",
    bgClass: "bg-blue-500/10",
    textClass: "text-blue-500",
    borderClass: "border-blue-500/20",
  },
};

const STAGE_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  test_drive: "Test Drive",
  discussion: "Discussion",
  won: "Won",
  lost: "Lost",
};

function getStageLabel(stage?: string | null): string {
  if (!stage) return "New";
  if (Object.prototype.hasOwnProperty.call(STAGE_LABELS, stage)) {
    return STAGE_LABELS[stage as keyof typeof STAGE_LABELS];
  }
  return stage;
}

export default function StaffFollowUpsPage() {
  const searchParams = useSearchParams();
  const bucketParam = searchParams.get("bucket") as BucketType | null;
  const [activeBucket, setActiveBucket] = useState<BucketType>(() => {
    return bucketParam && ["today", "overdue", "upcoming"].includes(bucketParam)
      ? bucketParam
      : "today";
  });
  const [prevBucketParam, setPrevBucketParam] = useState(bucketParam);

  if (bucketParam !== prevBucketParam) {
    setPrevBucketParam(bucketParam);
    if (bucketParam && ["today", "overdue", "upcoming"].includes(bucketParam)) {
      setActiveBucket(bucketParam);
    }
  }

  const [selectedOutcomeFu, setSelectedOutcomeFu] = useState<FollowUp | null>(null);

  const { data: todayList } = useActionFollowUps("today");
  const { data: overdueList } = useActionFollowUps("overdue");
  const { data: upcomingList } = useActionFollowUps("upcoming");

  const currentQuery =
    activeBucket === "today"
      ? todayList
      : activeBucket === "overdue"
      ? overdueList
      : upcomingList;

  const overdueCount = overdueList?.length || 0;

  const handleCall = (phone?: string) => {
    if (phone) {
      const cleanPhone = phone.replace(/\D/g, "");
      window.open(`tel:${cleanPhone}`, "_self");
    }
  };

  const handleWhatsApp = (phone?: string) => {
    if (phone) {
      let cleanPhone = phone.replace(/\D/g, "");
      if (cleanPhone.length === 10) {
        cleanPhone = `91${cleanPhone}`;
      }
      window.open(`https://wa.me/${cleanPhone}`, "_blank");
    }
  };

  return (
    <div className="w-full space-y-5 font-sans select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line/60 pb-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-ink font-sans">
            Follow-up Action List
          </h1>
          <p className="text-xs text-ink-muted">
            Daily task list for customer outreach, call reminders, and
            follow-ups.
          </p>
        </div>
      </div>

      {/* Segmented Subtabs Control Bar */}
      <div className="flex h-9 items-center gap-1 overflow-x-auto rounded-lg bg-inset p-1 border border-line/40 w-full sm:w-fit no-scrollbar shrink-0">
        <button
          type="button"
          onClick={() => setActiveBucket("today")}
          className={`flex-1 sm:flex-initial min-w-0 h-full text-center rounded-md px-2 sm:px-4 flex items-center justify-center gap-1 sm:gap-2 text-xs tracking-tight transition-all duration-200 cursor-pointer whitespace-nowrap ${
            activeBucket === "today"
              ? "bg-accent text-inverse shadow-xs font-bold"
              : "text-ink-muted hover:text-ink hover:bg-card/50 font-medium"
          }`}
        >
          <Clock className="h-3.5 w-3.5 shrink-0" />
          <span>Today</span>
          {todayList && todayList.length > 0 && (
            <span
              className={`ml-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-mono font-bold shrink-0 ${
                activeBucket === "today"
                  ? "bg-inverse/20 text-inverse"
                  : "bg-line/60 text-ink-muted"
              }`}
            >
              {todayList.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveBucket("overdue")}
          className={`flex-1 sm:flex-initial min-w-0 h-full text-center rounded-md px-2 sm:px-4 flex items-center justify-center gap-1 sm:gap-2 text-xs tracking-tight transition-all duration-200 cursor-pointer whitespace-nowrap ${
            activeBucket === "overdue"
              ? "bg-accent text-inverse shadow-xs font-bold"
              : "text-ink-muted hover:text-ink hover:bg-card/50 font-medium"
          }`}
        >
          <Clock className="h-3.5 w-3.5 shrink-0" />
          <span>Overdue</span>
          {overdueCount > 0 && (
            <span className="ml-0.5 rounded-md bg-rose-500 text-white px-1.5 py-0.5 text-[10px] font-mono font-bold shadow-xs shrink-0">
              {overdueCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveBucket("upcoming")}
          className={`flex-1 sm:flex-initial min-w-0 h-full text-center rounded-md px-2 sm:px-4 flex items-center justify-center gap-1 sm:gap-2 text-xs tracking-tight transition-all duration-200 cursor-pointer whitespace-nowrap ${
            activeBucket === "upcoming"
              ? "bg-accent text-inverse shadow-xs font-bold"
              : "text-ink-muted hover:text-ink hover:bg-card/50 font-medium"
          }`}
        >
          <Calendar className="h-3.5 w-3.5 shrink-0" />
          <span>Upcoming</span>
          {upcomingList && upcomingList.length > 0 && (
            <span
              className={`ml-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-mono font-bold shrink-0 ${
                activeBucket === "upcoming"
                  ? "bg-inverse/20 text-inverse"
                  : "bg-line/60 text-ink-muted"
              }`}
            >
              {upcomingList.length}
            </span>
          )}
        </button>
      </div>

      {/* Action List Grid / Items */}
      {!currentQuery ? (
        <div className="py-12 text-center text-xs text-ink-subtle flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-accent" />
          Loading follow-up list…
        </div>
      ) : currentQuery.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line bg-card p-10 text-center max-w-md mx-auto my-6 select-none space-y-2">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-inset text-emerald-500 border border-line">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <p className="text-sm font-bold text-ink">
            {activeBucket === "today"
              ? "Nothing due today 🎉"
              : activeBucket === "overdue"
              ? "No overdue follow-ups 🎉"
              : "No upcoming follow-ups scheduled"}
          </p>
          <p className="text-xs text-ink-subtle">
            All customer follow-ups for this category are up to date.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-line bg-card overflow-hidden divide-y divide-line/60 shadow-xs">
          {currentQuery.map((fu) => {
            const customerName = fu.lead?.customer?.name || "Customer";
            const customerPhone = fu.lead?.customer?.phone || "N/A";
            const leadPriority = fu.lead?.priority || "warm";
            const priority =
              PRIORITY_CONFIG[leadPriority] || PRIORITY_CONFIG.warm;
            const stageLabel = getStageLabel(fu.lead?.stage);

            const dueStr = formatISTDateTime(fu.due_at);

            return (
              <div
                key={fu.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3.5 sm:p-4 transition-colors hover:bg-inset/50 font-sans"
              >
                {/* Left Column: Customer Avatar, Details, Badges & Due Date */}
                <div className="flex items-start sm:items-center justify-between sm:justify-start gap-2.5 sm:gap-3 min-w-0 flex-1 w-full sm:w-auto">
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                    <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 text-accent font-bold shrink-0 text-xs sm:text-sm">
                      {customerName.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0 space-y-0.5 flex-1">
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                        <Link
                          href={`/staff/leads/${fu.lead_id}`}
                          className="text-xs sm:text-sm font-bold text-ink hover:text-accent truncate"
                        >
                          {customerName}
                        </Link>
                        <span
                          className={`inline-flex items-center rounded-md border px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider ${priority.bgClass} ${priority.textClass} ${priority.borderClass}`}
                        >
                          {priority.label}
                        </span>
                        <span className="inline-flex items-center rounded-md bg-surface border border-line px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-medium text-ink">
                          {stageLabel}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] sm:text-xs text-ink-subtle flex-wrap">
                        <span className="font-mono font-medium">{customerPhone}</span>
                        <span className="text-line">•</span>
                        <span
                          className={`flex items-center gap-1 font-mono text-[10px] sm:text-[11px] ${
                            activeBucket === "overdue"
                              ? "text-rose-500 dark:text-rose-400 font-semibold"
                              : "text-ink-subtle"
                          }`}
                        >
                          <Clock
                            className={`h-3 w-3 shrink-0 ${
                              activeBucket === "overdue"
                                ? "text-rose-500 dark:text-rose-400"
                                : "text-accent"
                            }`}
                          />
                          Due: {dueStr}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Arrow Link (Visible top-right on mobile only) */}
                  <Link
                    href={`/staff/leads/${fu.lead_id}`}
                    className="sm:hidden flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-card hover:bg-hover text-ink-subtle hover:text-ink transition-colors shrink-0"
                    title="View Lead Details"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                {/* Right Column: Outreach Actions & Record Result Button */}
                <div className="flex items-center gap-1.5 sm:gap-2 justify-between sm:justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-line/40 w-full sm:w-auto">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleCall(customerPhone)}
                      className="flex items-center justify-center gap-1 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 px-2.5 sm:px-2.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer"
                      title="Call Customer"
                    >
                      <Image
                        src="/icons/phonecall-icon.png"
                        alt="Call"
                        width={14}
                        height={14}
                        className="h-3.5 w-3.5 object-contain shrink-0"
                      />
                      <span>Call</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleWhatsApp(customerPhone)}
                      className="flex items-center justify-center gap-1 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 px-2.5 sm:px-2.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer"
                      title="WhatsApp Customer"
                    >
                      <Image
                        src="/icons/whatsappIcon.png"
                        alt="WhatsApp"
                        width={14}
                        height={14}
                        className="h-3.5 w-3.5 object-contain shrink-0"
                      />
                      <span>WhatsApp</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2 flex-1 sm:flex-initial justify-end">
                    <button
                      type="button"
                      onClick={() => setSelectedOutcomeFu(fu)}
                      className="flex items-center justify-center gap-1 rounded-lg bg-accent hover:opacity-90 active:scale-[0.98] text-inverse px-3 sm:px-3 py-1.5 text-xs font-bold shadow-xs transition-all cursor-pointer w-full sm:w-auto shrink-0"
                    >
                      <ClipboardCheck className="h-3.5 w-3.5 shrink-0" />
                      <span>Record Result</span>
                    </button>

                    {/* Desktop Arrow Link (Visible on sm: screens and up) */}
                    <Link
                      href={`/staff/leads/${fu.lead_id}`}
                      className="hidden sm:flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-card hover:bg-hover text-ink-subtle hover:text-ink transition-colors shrink-0"
                      title="View Lead Details"
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
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
