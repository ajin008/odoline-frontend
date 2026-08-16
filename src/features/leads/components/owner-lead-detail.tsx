"use client";

import { useState } from "react";
import Link from "next/link";
import { useLead } from "../hooks/use-lead";
import { useLeadStageHistory } from "../hooks/use-lead-stage";
import { useAssignLead } from "../hooks/use-unassigned-leads";
import { useStaff } from "@/src/features/team/hooks/use-staff";
import { LeadActivityTimeline } from "./lead-activity-timeline";
import { LeadFollowUps } from "./lead-follow-ups";
import { LeadInterestedCars } from "./lead-interested-cars";
import type { LeadPriority } from "../types/lead-types";
import {
  ArrowLeft,
  User,
  Phone,
  Globe,
  IndianRupee,
  Calendar,
  MessageSquare,
  AlertTriangle,
  UserCheck,
  History,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Loader2,
  X,
  Flame,
} from "lucide-react";

interface OwnerLeadDetailProps {
  leadId: string;
}

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

const STAGE_STEPS = [
  { key: "new", label: "New Lead" },
  { key: "contacted", label: "Contacted" },
  { key: "test_drive", label: "Test Drive" },
  { key: "discussion", label: "Discussion" },
  { key: "won", label: "Won" },
] as const;

const STAGE_LABELS: Record<string, string> = {
  new: "New Lead",
  contacted: "Contacted",
  test_drive: "Test Drive",
  discussion: "Discussion",
  won: "Won",
  lost: "Lost",
};

const SOURCE_LABELS: Record<string, string> = {
  walk_in: "Walk In",
  whatsapp: "WhatsApp",
  phone: "Phone Call",
  referral: "Referral",
  instagram: "Instagram",
  olx: "OLX",
  other: "Other",
};

function formatCurrency(amountStr: string | null): string {
  if (!amountStr) return "";
  const num = Number(amountStr);
  if (isNaN(num)) return amountStr;
  if (num >= 100000) {
    return `₹${(num / 100000).toFixed(1)}L`;
  }
  return `₹${num.toLocaleString("en-IN")}`;
}

export function OwnerLeadDetail({ leadId }: OwnerLeadDetailProps) {
  const { data: lead, isLoading, isError } = useLead(leadId);
  const { data: stageHistory = [] } = useLeadStageHistory(leadId);
  const { data: staffList = [] } = useStaff("active");
  const assignMutation = useAssignLead();

  const [isAuditExpanded, setIsAuditExpanded] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState("");

  if (isLoading) {
    return (
      <div className="w-full space-y-5 font-sans select-none max-w-6xl">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 animate-pulse rounded-xl bg-inset border border-line" />
          <div className="h-6 w-48 animate-pulse rounded-lg bg-inset border border-line" />
        </div>
        <div className="h-28 animate-pulse rounded-2xl bg-inset border border-line" />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <div className="h-65 animate-pulse rounded-2xl bg-inset border border-line lg:col-span-7" />
          <div className="h-65 animate-pulse rounded-2xl bg-inset border border-line lg:col-span-5" />
        </div>
      </div>
    );
  }

  if (isError || !lead) {
    return (
      <div className="w-full space-y-5 font-sans select-none max-w-6xl">
        <Link
          href="/owner/sales?tab=all"
          className="inline-flex items-center gap-2 text-xs font-semibold text-ink-subtle hover:text-ink transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to All Leads
        </Link>

        <div className="rounded-2xl border border-danger/20 bg-state-danger-light p-8 text-center max-w-md mx-auto space-y-3">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-card border border-danger/20 text-danger">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-danger font-sans">
            Lead Not Found
          </h3>
          <p className="text-xs text-ink-subtle">
            The requested lead does not exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  const priority = PRIORITY_CONFIG[lead.priority] || PRIORITY_CONFIG.warm;
  const customerName = lead.customer?.name || "Customer";
  const customerPhone = lead.customer?.phone || "N/A";
  const stageLabel = STAGE_LABELS[lead.stage] || lead.stage;
  const sourceLabel = SOURCE_LABELS[lead.source] || lead.source;

  const isWon = lead.stage === "won";
  const isLost = lead.stage === "lost";

  const minBudget = formatCurrency(lead.budget_min);
  const maxBudget = formatCurrency(lead.budget_max);
  let budgetDisplay = "Not specified";
  if (minBudget && maxBudget) {
    budgetDisplay = `${minBudget} - ${maxBudget}`;
  } else if (minBudget) {
    budgetDisplay = `From ${minBudget}`;
  } else if (maxBudget) {
    budgetDisplay = `Up to ${maxBudget}`;
  }

  const createdDateStr = new Date(lead.created_at).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const getStepStatus = (stepKey: string) => {
    if (isLost) return "lost";
    if (lead.stage === stepKey) return "current";

    const stageOrder = ["new", "contacted", "test_drive", "discussion", "won"];
    const currentIndex = stageOrder.indexOf(lead.stage);
    const stepIndex = stageOrder.indexOf(stepKey);

    if (currentIndex > stepIndex || lead.stage === "won") return "completed";
    return "upcoming";
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaffId) return;

    assignMutation.mutate(
      { id: lead.id, assignedTo: selectedStaffId },
      {
        onSuccess: () => {
          setIsAssignOpen(false);
        },
      }
    );
  };

  return (
    <div className="w-full space-y-5 font-sans select-none max-w-6xl">
      {/* ------------------------------------------------------------- */}
      {/* BREADCRUMB & TOP HEADER UNIT                                  */}
      {/* ------------------------------------------------------------- */}
      <div className="rounded-2xl border border-line/60 bg-card p-4 sm:p-5 space-y-3.5 shadow-xs">
        {/* Row 1: Breadcrumb Navigation Link */}
        <div className="flex items-center justify-between gap-2 border-b border-line/40 pb-2.5">
          <Link
            href="/owner/sales?tab=all"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-subtle hover:text-accent transition-colors group cursor-pointer min-w-0"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform shrink-0" />
            <span className="truncate">Sales &amp; CRM</span>
            <span className="text-line shrink-0">/</span>
            <span className="shrink-0">Leads</span>
            <span className="text-line shrink-0">/</span>
            <span className="text-ink font-bold truncate">{customerName}</span>
          </Link>

          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 text-[10px] sm:text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider shrink-0">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Read-Only Owner View</span>
          </span>
        </div>

        {/* Row 2: Customer Title + Badges + Unified Staff Action Card */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-0.5">
          {/* Title & Badges */}
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-ink font-sans truncate">
                {customerName}
              </h1>

              <span
                className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${priority.bgClass} ${priority.textClass} ${priority.borderClass}`}
              >
                {priority.label}
              </span>

              <span className="inline-flex items-center rounded-md bg-surface border border-line/60 px-2.5 py-0.5 text-xs font-semibold text-ink">
                {stageLabel}
              </span>
            </div>

            <p className="text-[11px] text-ink-subtle font-mono truncate">
              ID: <span className="font-mono text-ink-muted">{lead.id}</span>
            </p>
          </div>

          {/* Unified Single Staff Card + Reassign Action Button */}
          <div className="flex items-center gap-3 bg-inset/70 border border-line/60 p-2 pl-3.5 rounded-xl shrink-0 w-full md:w-auto justify-between md:justify-start shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-card border border-line/60 text-accent shrink-0">
                <UserCheck className="h-4 w-4" />
              </div>
              <div className="min-w-0 text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-subtle block">
                  Assigned Staff
                </span>
                <span className="text-xs font-bold text-ink truncate block">
                  {lead.assigned_rep?.name || "Unassigned"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedStaffId(lead.assigned_to || "");
                setIsAssignOpen(true);
              }}
              className="flex items-center gap-1.5 rounded-lg bg-accent text-inverse hover:opacity-90 px-3 py-1.5 text-xs font-bold shadow-xs transition-all cursor-pointer shrink-0"
            >
              <span>Reassign</span>
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SALES PIPELINE STAGE STEPPER BANNER & AUDIT LOG               */}
      {/* ------------------------------------------------------------- */}
      <div className="rounded-2xl border border-line/60 bg-card p-4 sm:p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between gap-2 border-b border-line/50 pb-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-muted flex items-center gap-2">
            <History className="h-4 w-4 text-accent" />
            Sales Pipeline Stage Audit Trail
          </h3>

          <button
            type="button"
            onClick={() => setIsAuditExpanded((prev) => !prev)}
            className="flex items-center gap-1 text-xs font-bold text-accent hover:underline cursor-pointer"
          >
            <span>
              {isAuditExpanded ? "Hide Audit History" : "View Audit History"}
            </span>
            {isAuditExpanded ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        {/* Responsive Visual Stage Stepper */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 overflow-x-auto no-scrollbar">
          {STAGE_STEPS.map((step) => {
            const status = getStepStatus(step.key);

            let containerClass = "bg-inset/60 border-line/60 text-ink-subtle";
            let icon = null;

            if (status === "completed") {
              containerClass =
                "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold";
              icon = (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              );
            } else if (status === "current") {
              containerClass =
                "bg-accent text-inverse font-bold shadow-xs border-accent";
              icon = <Flame className="h-3.5 w-3.5 text-inverse shrink-0" />;
            } else if (status === "lost") {
              containerClass =
                "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400 font-bold opacity-60";
              icon = <XCircle className="h-3.5 w-3.5 text-rose-500 shrink-0" />;
            }

            return (
              <div
                key={step.key}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center text-xs transition-all ${containerClass}`}
              >
                <div className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider">
                  {icon}
                  <span>
                    {status === "completed"
                      ? "Done"
                      : status === "current"
                      ? "Active Stage"
                      : status === "lost"
                      ? "Terminated"
                      : "Upcoming"}
                  </span>
                </div>
                <span className="mt-1 truncate font-semibold">
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Collapsible Stage Audit History Table */}
        {isAuditExpanded && (
          <div className="pt-2 border-t border-line/50 space-y-2">
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider">
              Stage History Transitions ({stageHistory.length})
            </h4>

            {stageHistory.length === 0 ? (
              <p className="text-xs text-ink-subtle italic py-2">
                No stage history recorded yet.
              </p>
            ) : (
              <div className="max-h-48 overflow-y-auto rounded-xl border border-line/60 bg-inset/30 divide-y divide-line/40 text-xs">
                {stageHistory.map((h) => {
                  const transitionDateStr = new Date(
                    h.created_at
                  ).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <div
                      key={h.id}
                      className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-inset/60"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 font-semibold text-ink">
                          <span className="uppercase text-[10px] text-ink-subtle">
                            {h.from_stage || "None"}
                          </span>
                          <span>→</span>
                          <span className="uppercase text-[10px] text-accent font-bold">
                            {h.to_stage}
                          </span>
                        </div>
                        {h.notes && (
                          <p className="text-[11px] text-ink-muted italic">
                            &ldquo;{h.notes}&rdquo;
                          </p>
                        )}
                      </div>

                      <div className="text-[11px] text-ink-subtle sm:text-right shrink-0">
                        <p className="font-medium text-ink">
                          Changed by: {h.changed_by?.name || "System"}
                        </p>
                        <p className="font-mono text-[10px]">
                          {transitionDateStr}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MAIN TWO-COLUMN LAYOUT (60% / 40% Desktop Split)               */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Left Column: Customer Details, Budget, Interested Vehicles (60%) */}
        <div className="space-y-5 lg:col-span-7">
          {/* Customer Information Card */}
          <div className="rounded-2xl border border-line/60 bg-card p-5 space-y-4 shadow-xs">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-muted flex items-center gap-2">
              <User className="h-4 w-4 text-accent" />
              Customer Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-ink-subtle">Full Name</span>
                <p className="font-semibold text-ink text-sm">{customerName}</p>
              </div>

              <div className="space-y-1">
                <span className="text-ink-subtle">Mobile Phone</span>
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${customerPhone}`}
                    className="font-semibold text-ink hover:text-accent font-mono text-sm flex items-center gap-1.5 transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5 text-accent" />
                    {customerPhone}
                  </a>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-ink-subtle">Lead Source</span>
                <p className="font-semibold text-ink flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-ink-subtle" />
                  {sourceLabel}
                  {lead.source_note && (
                    <span className="text-ink-subtle font-normal">
                      ({lead.source_note})
                    </span>
                  )}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-ink-subtle">Created On</span>
                <p className="font-semibold text-ink flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-ink-subtle" />
                  {createdDateStr}
                </p>
              </div>
            </div>
          </div>

          {/* Budget & Requirements Card */}
          <div className="rounded-2xl border border-line/60 bg-card p-5 space-y-4 shadow-xs">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-muted flex items-center gap-2">
              <IndianRupee className="h-4 w-4 text-accent" />
              Budget &amp; Requirements
            </h3>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <span className="text-ink-subtle">Target Budget Range</span>
                <p className="font-bold text-ink text-base font-mono">
                  {budgetDisplay}
                </p>
              </div>

              {/* Won Deal Summary Card */}
              {isWon && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5 text-xs">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      Closed Won Deal
                    </span>
                    {lead.won_price && (
                      <span className="font-bold font-mono text-sm text-emerald-700 dark:text-emerald-300">
                        {formatCurrency(lead.won_price)}
                      </span>
                    )}
                  </div>

                  {lead.won_car && (
                    <div className="pt-2 border-t border-emerald-500/20 text-xs text-ink space-y-1">
                      <p className="font-bold">
                        Purchased Vehicle: {lead.won_car.year}{" "}
                        {lead.won_car.make} {lead.won_car.model}
                      </p>
                      <p className="font-mono text-ink-subtle text-[11px]">
                        Registration: {lead.won_car.reg_number}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Lost Lead Summary Card */}
              {isLost && (
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 space-y-1.5">
                  <span className="font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5 text-xs">
                    <XCircle className="h-4 w-4 text-rose-500" />
                    Closed Lost Lead
                  </span>
                  <p className="text-xs text-ink italic leading-relaxed">
                    Reason: &ldquo;
                    {lead.lost_reason || "No specific reason logged."}&rdquo;
                  </p>
                </div>
              )}

              {lead.remark ? (
                <div className="space-y-1">
                  <span className="text-ink-subtle flex items-center gap-1">
                    <MessageSquare className="h-3.5 w-3.5" />
                    Initial Remark / Notes
                  </span>
                  <div className="rounded-xl border border-line/60 bg-inset/50 p-3 text-ink text-xs leading-relaxed font-medium">
                    {lead.remark}
                  </div>
                </div>
              ) : (
                <p className="text-ink-subtle italic">
                  No initial remark provided.
                </p>
              )}
            </div>
          </div>

          {/* Interested Vehicles Component (Read-Only) */}
          <LeadInterestedCars
            leadId={lead.id}
            interestedCars={lead.interested_cars}
            readOnly={true}
          />
        </div>

        {/* Right Column: Follow-ups & Activity Timeline (40%) */}
        <div className="space-y-5 lg:col-span-5">
          {/* Follow-up Schedule Section (Read-Only) */}
          <LeadFollowUps
            leadId={lead.id}
            nextFollowUp={lead.next_follow_up}
            readOnly={true}
          />

          {/* Activity Audit Log & Timeline Component (Read-Only) */}
          <LeadActivityTimeline
            leadId={lead.id}
            customerPhone={lead.customer?.phone}
            readOnly={true}
          />
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* OWNER REASSIGNMENT MODAL                                      */}
      {/* ------------------------------------------------------------- */}
      {isAssignOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-line bg-card p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h4 className="text-sm font-bold text-ink flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-accent" />
                Reassign Sales Representative
              </h4>
              <button
                type="button"
                onClick={() => setIsAssignOpen(false)}
                className="text-ink-subtle hover:text-ink transition-colors p-1 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-ink-muted">
                  Select Active Sales Representative *
                </label>
                <select
                  value={selectedStaffId}
                  onChange={(e) => setSelectedStaffId(e.target.value)}
                  className="w-full rounded-xl border border-line bg-inset p-2.5 text-xs font-semibold text-ink focus:border-accent focus:outline-none cursor-pointer"
                  required
                >
                  <option value="">Select sales staff member...</option>
                  {staffList.map((staff) => (
                    <option key={staff.id} value={staff.id}>
                      {staff.name} ({staff.position || "Sales Exec"})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAssignOpen(false)}
                  className="rounded-lg border border-line px-3.5 py-2 text-xs font-medium text-ink hover:bg-hover transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={assignMutation.isPending || !selectedStaffId}
                  className="flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-inverse shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
                >
                  {assignMutation.isPending && (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  )}
                  <span>Confirm Reassignment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
