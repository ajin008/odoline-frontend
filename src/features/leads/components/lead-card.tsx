"use client";

import Link from "next/link";
import type { Lead, LeadPriority } from "../types/lead-types";
import {
  User,
  UserX,
  Phone,
  Globe,
  IndianRupee,
  Calendar,
  CheckCircle2,
  XCircle,
  Car as CarIcon,
} from "lucide-react";

interface LeadCardProps {
  lead: Lead;
  onClick?: () => void;
  showAssignedRep?: boolean;
  href?: string;
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

function formatCurrency(amountStr?: string | null): string {
  if (!amountStr) return "";
  const num = Number(amountStr);
  if (isNaN(num)) return amountStr;
  if (num >= 100000) {
    return `₹${(num / 100000).toFixed(1)}L`;
  }
  return `₹${num.toLocaleString("en-IN")}`;
}

export function LeadCard({ lead, onClick, showAssignedRep, href }: LeadCardProps) {
  const isWon = lead.stage === "won";
  const isLost = lead.stage === "lost";
  const priority = PRIORITY_CONFIG[lead.priority] || PRIORITY_CONFIG.warm;
  const linkTarget = href || `/staff/leads/${lead.id}`;

  const customerName = lead.customer?.name || "Customer";
  const customerPhone = lead.customer?.phone || "N/A";
  const stageLabel = STAGE_LABELS[lead.stage] || lead.stage;
  const sourceLabel = SOURCE_LABELS[lead.source] || lead.source;

  const minBudget = formatCurrency(lead.budget_min);
  const maxBudget = formatCurrency(lead.budget_max);
  let budgetDisplay = "";
  if (minBudget && maxBudget) {
    budgetDisplay = `${minBudget} - ${maxBudget}`;
  } else if (minBudget) {
    budgetDisplay = `From ${minBudget}`;
  } else if (maxBudget) {
    budgetDisplay = `Up to ${maxBudget}`;
  }

  // Format dates
  const createdDateStr = new Date(lead.created_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const wonDateStr = lead.won_at
    ? new Date(lead.won_at).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  const lostDateStr = lead.lost_at
    ? new Date(lead.lost_at).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  const cardContent = (
    <div className="group relative flex flex-col justify-between rounded-xl border border-line bg-card p-4 transition-all duration-200 hover:border-accent/40 hover:shadow-md select-none font-sans cursor-pointer h-full">
      <div className="space-y-3">
        {/* Header: Customer Name & Status / Priority Badge */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-inset border border-line text-ink-subtle shrink-0 group-hover:border-accent/30 group-hover:text-accent transition-colors">
              <User className="h-4 w-4 stroke-[2px]" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-ink truncate font-sans group-hover:text-accent transition-colors">
                {customerName}
              </h3>
              <div className="flex items-center gap-1 text-xs text-ink-subtle">
                <Phone className="h-3 w-3 shrink-0" />
                <span className="truncate">{customerPhone}</span>
              </div>
            </div>
          </div>

          {/* Badges based on stage status */}
          {isWon ? (
            <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 shrink-0">
              <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
              <span>Won Deal</span>
            </span>
          ) : isLost ? (
            <span className="inline-flex items-center gap-1 rounded-md border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400 shrink-0">
              <XCircle className="h-3 w-3 text-rose-600 dark:text-rose-400" />
              <span>Lost Lead</span>
            </span>
          ) : (
            <span
              className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${priority.bgClass} ${priority.textClass} ${priority.borderClass} shrink-0`}
            >
              {priority.label}
            </span>
          )}
        </div>

        {/* WON CARD Variant Specific Details */}
        {isWon && (
          <div className="rounded-md border border-emerald-500/20 bg-emerald-500/5 p-2.5 space-y-1.5 text-xs">
            <div className="flex items-center justify-between gap-1">
              <span className="font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                <CarIcon className="h-3.5 w-3.5" />
                {lead.won_car
                  ? `${lead.won_car.year} ${lead.won_car.make} ${lead.won_car.model}`
                  : "Purchased Vehicle"}
              </span>
            </div>

            {lead.won_car?.reg_number && (
              <p className="text-[11px] font-mono text-ink-subtle">
                Reg: {lead.won_car.reg_number}
              </p>
            )}

            {lead.won_price && (
              <div className="flex items-center justify-between text-xs pt-1 border-t border-emerald-500/15">
                <span className="text-ink-subtle">Deal Amount:</span>
                <span className="font-bold text-ink font-mono">
                  {formatCurrency(lead.won_price)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* LOST CARD Variant Specific Details */}
        {isLost && (
          <div className="rounded-md border border-rose-500/20 bg-rose-500/5 p-2.5 space-y-1 text-xs">
            <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 block">
              Reason for Loss:
            </span>
            <p className="text-xs text-ink italic leading-relaxed">
              &ldquo;{lead.lost_reason || "No reason specified"}&rdquo;
            </p>
          </div>
        )}

        {/* ACTIVE CARD Details (Stage, Source, Budget) */}
        {!isWon && !isLost && (
          <>
            <div className="flex items-center gap-2 text-xs">
              <span className="inline-flex items-center rounded-md bg-surface border border-line px-2 py-0.5 font-medium text-ink">
                {stageLabel}
              </span>
              <span className="inline-flex items-center gap-1 text-ink-muted">
                <Globe className="h-3 w-3 text-ink-subtle" />
                {sourceLabel}
                {lead.source_note && (
                  <span className="text-ink-subtle italic">
                    ({lead.source_note})
                  </span>
                )}
              </span>
            </div>

            {budgetDisplay && (
              <div className="flex items-center gap-1.5 text-xs text-ink-muted bg-inset/50 rounded-md p-2 border border-line/40">
                <IndianRupee className="h-3.5 w-3.5 text-accent shrink-0" />
                <span className="font-semibold text-ink font-mono">
                  {budgetDisplay}
                </span>
              </div>
            )}

            {lead.remark && (
              <p className="text-xs text-ink-subtle line-clamp-2 italic">
                &ldquo;{lead.remark}&rdquo;
              </p>
            )}
          </>
        )}
      </div>

      {/* Footer Date Line & Optional Assigned Rep Badge */}
      <div className="mt-4 pt-3 border-t border-line/50 flex items-center justify-between gap-2 text-[11px] text-ink-subtle">
        <div className="flex items-center gap-1 min-w-0">
          <Calendar className="h-3 w-3 shrink-0" />
          <span className="truncate">
            {isWon && wonDateStr ? (
              `Closed Won ${wonDateStr}`
            ) : isLost && lostDateStr ? (
              `Closed Lost ${lostDateStr}`
            ) : (
              `Added ${createdDateStr}`
            )}
          </span>
        </div>

        {showAssignedRep && (
          lead.assigned_rep?.name ? (
            <span className="inline-flex items-center gap-1 font-semibold text-accent bg-accent/10 border border-accent/25 px-2 py-0.5 rounded-md text-[11px] shrink-0 max-w-[160px] shadow-2xs">
              <User className="h-3 w-3 text-accent shrink-0 stroke-[2.25px]" />
              <span className="truncate">Rep: {lead.assigned_rep.name}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 font-medium text-ink-subtle bg-inset border border-line/60 px-2 py-0.5 rounded-md text-[11px] shrink-0 shadow-2xs">
              <UserX className="h-3 w-3 text-ink-subtle/70 shrink-0 stroke-[2px]" />
              <span>Unassigned</span>
            </span>
          )
        )}
      </div>
    </div>
  );

  if (onClick) {
    return <div onClick={onClick}>{cardContent}</div>;
  }

  return (
    <Link href={linkTarget} className="block h-full">
      {cardContent}
    </Link>
  );
}
