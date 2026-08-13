"use client";

import Link from "next/link";
import { useLead } from "../hooks/use-lead";
import { LeadActivityTimeline } from "./lead-activity-timeline";
import { LeadFollowUps } from "./lead-follow-ups";
import { LeadStageControl } from "./lead-stage-control";
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
} from "lucide-react";

interface LeadDetailProps {
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

export function LeadDetail({ leadId }: LeadDetailProps) {
  const { data: lead, isLoading, isError } = useLead(leadId);

  if (isLoading) {
    return (
      <div className="w-full space-y-5 font-sans select-none">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 animate-pulse rounded-xl bg-inset border border-line" />
          <div className="h-6 w-48 animate-pulse rounded-lg bg-inset border border-line" />
        </div>
        <div className="h-28 animate-pulse rounded-2xl bg-inset border border-line" />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="h-65 animate-pulse rounded-2xl bg-inset border border-line lg:col-span-2" />
          <div className="h-65 animate-pulse rounded-2xl bg-inset border border-line" />
        </div>
      </div>
    );
  }

  if (isError || !lead) {
    return (
      <div className="w-full space-y-5 font-sans select-none">
        <Link
          href="/staff/leads"
          className="inline-flex items-center gap-2 text-xs font-semibold text-ink-subtle hover:text-ink transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Leads
        </Link>

        <div className="rounded-2xl border border-danger/20 bg-state-danger-light p-8 text-center max-w-md mx-auto space-y-3">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-card border border-danger/20 text-danger">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-danger font-sans">
            Lead Not Found
          </h3>
          <p className="text-xs text-ink-subtle">
            The lead does not exist or you do not have permission to view it.
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

  return (
    <div className="w-full space-y-5 font-sans select-none">
      {/* Top Bar Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line/60 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/staff/leads"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-card border border-line text-ink-subtle hover:bg-hover hover:text-ink transition-colors shrink-0"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-ink font-sans">
                {customerName}
              </h1>
              <span
                className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${priority.bgClass} ${priority.textClass} ${priority.borderClass}`}
              >
                {priority.label}
              </span>
              <span className="inline-flex items-center rounded-md bg-surface border border-line px-2 py-0.5 text-xs font-medium text-ink">
                {stageLabel}
              </span>
            </div>
            <p className="text-xs text-ink-subtle mt-0.5">
              Lead ID: <span className="font-mono">{lead.id}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Buyer Stage Stepper Pipeline Component */}
      <LeadStageControl lead={lead} />

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Left Column: Customer Details, Budget, and Interested Vehicles */}
        <div className="space-y-5 lg:col-span-2">
          {/* Customer Information Card */}
          <div className="rounded-xl border border-line bg-card p-5 space-y-4">
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
                    className="font-semibold text-accent hover:underline text-sm flex items-center gap-1.5"
                  >
                    <Phone className="h-3.5 w-3.5" />
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
          <div className="rounded-xl border border-line bg-card p-5 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-muted flex items-center gap-2">
              <IndianRupee className="h-4 w-4 text-accent" />
              Budget &amp; Requirements
            </h3>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <span className="text-ink-subtle">Target Budget Range</span>
                <p className="font-semibold text-ink text-sm font-mono">
                  {budgetDisplay}
                </p>
              </div>

              {lead.remark ? (
                <div className="space-y-1">
                  <span className="text-ink-subtle flex items-center gap-1">
                    <MessageSquare className="h-3.5 w-3.5" />
                    Initial Remark / Notes
                  </span>
                  <div className="rounded-lg border border-line/60 bg-inset p-3 text-ink text-xs leading-relaxed">
                    {lead.remark}
                  </div>
                </div>
              ) : (
                <p className="text-ink-subtle italic">No remark provided.</p>
              )}
            </div>
          </div>

          {/* Interested Vehicles Component (M:N Lead ↔ Car Junction) */}
          <LeadInterestedCars
            leadId={lead.id}
            interestedCars={lead.interested_cars}
          />
        </div>

        {/* Right Column: Follow-ups Schedule & Activity Timeline */}
        <div className="space-y-5">
          {/* Follow-up Schedule Section */}
          <LeadFollowUps leadId={lead.id} nextFollowUp={lead.next_follow_up} />

          {/* Activity Audit Log & Timeline Component */}
          <LeadActivityTimeline
            leadId={lead.id}
            customerPhone={lead.customer?.phone}
          />
        </div>
      </div>
    </div>
  );
}
