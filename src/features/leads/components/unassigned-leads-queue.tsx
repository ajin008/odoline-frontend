"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Clock,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Loader2,
  ChevronDown,
  X,
  ShieldAlert,
} from "lucide-react";
import {
  useUnassignedLeads,
  useAssignLead,
  useStaffLoad,
  useBulkAssign,
} from "../hooks/use-unassigned-leads";
import { useStaff } from "@/src/features/team/hooks/use-staff";
import { CustomSelect } from "@/src/components/ui/custom-select";
import { formatISTDateTime } from "@/src/lib/formatters";
import type { LeadPriority } from "../types/lead-types";

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

const SOURCE_LABELS: Record<string, string> = {
  walk_in: "Walk-In",
  whatsapp: "WhatsApp",
  phone: "Phone Call",
  referral: "Referral",
  instagram: "Instagram",
  olx: "OLX",
  other: "Other",
};

export function UnassignedLeadsQueue() {
  const { data: leads = [], isLoading, isError, refetch } = useUnassignedLeads();
  const { data: staffList = [] } = useStaff("active");
  const { data: staffLoadList = [] } = useStaffLoad();
  const assignMutation = useAssignLead();
  const bulkAssignMutation = useBulkAssign();

  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [assigningLeadId, setAssigningLeadId] = useState<string | null>(null);
  const [confirmAssignAllStaff, setConfirmAssignAllStaff] = useState<{
    id: string;
    name: string;
    loadCount: number;
  } | null>(null);

  // Map staff load count for picker display
  const loadMap = new Map<string, number>();
  staffLoadList.forEach((item) => {
    loadMap.set(item.staff_id, item.active_lead_count);
  });

  const repPickerOptions = staffList.map((staff) => {
    const activeCount = loadMap.get(staff.id) ?? 0;
    return {
      id: staff.id,
      name: staff.name,
      activeCount,
      label: `${staff.name} — ${activeCount} active`,
    };
  });

  const isAllSelected =
    leads.length > 0 && selectedLeadIds.length === leads.length;

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedLeadIds([]);
    } else {
      setSelectedLeadIds(leads.map((l) => l.id));
    }
  };

  const handleToggleSelectLead = (leadId: string) => {
    setSelectedLeadIds((prev) =>
      prev.includes(leadId)
        ? prev.filter((id) => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handleAssignSingle = (leadId: string, targetStaffId: string) => {
    if (!targetStaffId) return;
    setAssigningLeadId(leadId);
    assignMutation.mutate(
      { id: leadId, assignedTo: targetStaffId },
      {
        onSettled: () => {
          setAssigningLeadId(null);
        },
      }
    );
  };

  const handleBulkAssignSelected = (targetStaffId: string) => {
    if (!targetStaffId || selectedLeadIds.length === 0) return;
    const targetRep = repPickerOptions.find((r) => r.id === targetStaffId);

    bulkAssignMutation.mutate(
      {
        assigned_to: targetStaffId,
        lead_ids: selectedLeadIds,
        staffName: targetRep?.name,
      },
      {
        onSuccess: () => {
          setSelectedLeadIds([]);
        },
      }
    );
  };

  const handleConfirmAssignAll = () => {
    if (!confirmAssignAllStaff) return;

    bulkAssignMutation.mutate(
      {
        assigned_to: confirmAssignAllStaff.id,
        assign_all: true,
        staffName: confirmAssignAllStaff.name,
      },
      {
        onSuccess: () => {
          setConfirmAssignAllStaff(null);
          setSelectedLeadIds([]);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4 font-sans select-none animate-pulse">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-2xl border border-line bg-card p-4 space-y-3"
          >
            <div className="flex justify-between items-center">
              <div className="h-5 w-36 rounded bg-inset" />
              <div className="h-5 w-20 rounded bg-inset" />
            </div>
            <div className="h-4 w-48 rounded bg-inset" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5 font-sans select-none text-rose-600 space-y-3">
        <div className="flex items-center gap-2.5">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <h3 className="text-sm font-bold">Failed to load unassigned leads queue</h3>
        </div>
        <p className="text-xs text-rose-600/80">
          An error occurred while fetching the unassigned queue. Please check your connection and try again.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-card p-12 text-center max-w-md mx-auto my-6 select-none space-y-3">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
          <CheckCircle2 className="h-6 w-6 stroke-[2.25px]" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-ink font-heading">
            No unassigned leads 🎉
          </h3>
          <p className="text-xs text-ink-subtle">
            All customer leads are currently assigned to active sales representatives.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 font-sans select-none">
      {/* ------------------------------------------------------------- */}
      {/* HEADER CONTROL BAR (Select All + Queue Count + Assign All)   */}
      {/* ------------------------------------------------------------- */}
      <div className="rounded-2xl border border-line/60 bg-card p-3.5 sm:p-4 space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Checkbox: Select All & Queue Count */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs font-semibold text-ink hover:text-accent transition-colors cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={handleToggleSelectAll}
                className="h-4 w-4 rounded border-line text-accent focus:ring-accent cursor-pointer"
              />
              <span>Select All</span>
            </label>

            <span className="text-xs text-ink-subtle">·</span>
            <span className="text-xs font-bold text-ink font-mono">
              {leads.length} {leads.length === 1 ? "unassigned lead" : "unassigned leads"}
            </span>
          </div>

          {/* Option 1: Assign All to... Rep Picker (Server-side assign_all) */}
          <div className="relative shrink-0 w-full sm:w-auto">
            <select
              value=""
              onChange={(e) => {
                const staffId = e.target.value;
                if (!staffId) return;
                const rep = repPickerOptions.find((r) => r.id === staffId);
                if (rep) {
                  setConfirmAssignAllStaff({
                    id: rep.id,
                    name: rep.name,
                    loadCount: rep.activeCount,
                  });
                }
              }}
              disabled={bulkAssignMutation.isPending}
              className="w-full sm:w-auto h-8.5 appearance-none rounded-xl border border-line/60 bg-surface pl-3 pr-8 text-xs font-bold text-ink transition-colors hover:border-line focus:border-accent focus:outline-none cursor-pointer disabled:opacity-50"
            >
              <option value="">Assign all to...</option>
              {repPickerOptions.map((rep) => (
                <option key={rep.id} value={rep.id}>
                  {rep.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-subtle" />
          </div>
        </div>

        {/* Option 2: Multi-Select Bulk Action Bar (Visible when >= 1 selected) */}
        {selectedLeadIds.length > 0 && (
          <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-accent/10 border border-accent/30 text-xs text-accent font-bold animate-in fade-in-50">
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 shrink-0" />
              <span>{selectedLeadIds.length} selected</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value=""
                  onChange={(e) => handleBulkAssignSelected(e.target.value)}
                  disabled={bulkAssignMutation.isPending}
                  className="h-8 appearance-none rounded-lg bg-accent text-inverse font-bold px-3 pr-7 text-xs transition-opacity hover:opacity-90 cursor-pointer disabled:opacity-50"
                >
                  <option value="" className="bg-card text-ink font-semibold">
                    Assign selected to...
                  </option>
                  {repPickerOptions.map((rep) => (
                    <option key={rep.id} value={rep.id} className="bg-card text-ink font-semibold">
                      {rep.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-inverse" />
              </div>

              <button
                type="button"
                onClick={() => setSelectedLeadIds([])}
                className="text-ink-subtle hover:text-ink transition-colors p-1"
                title="Clear selection"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* UNASSIGNED QUEUE CARDS LIST                                    */}
      {/* ------------------------------------------------------------- */}
      <div className="rounded-2xl border border-line bg-card overflow-hidden divide-y divide-line/60 shadow-xs">
        {leads.map((lead) => {
          const customerName = lead.customer?.name || "Customer";
          const customerPhone = lead.customer?.phone || "N/A";
          const priority = PRIORITY_CONFIG[lead.priority] || PRIORITY_CONFIG.warm;
          const stageLabel = STAGE_LABELS[lead.stage] || lead.stage;
          const sourceLabel = SOURCE_LABELS[lead.source] || lead.source;

          const isSelected = selectedLeadIds.includes(lead.id);
          const isCurrentlyAssigning =
            assigningLeadId === lead.id && assignMutation.isPending;

          const createdDateStr = new Date(lead.created_at).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });

          const nextFu = lead.next_follow_up;
          const isOverdue = nextFu?.due_state === "overdue";
          const isDueToday = nextFu?.due_state === "due_today";

          return (
            <div
              key={lead.id}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 transition-colors font-sans ${
                isSelected ? "bg-accent/5" : "hover:bg-inset/50"
              }`}
            >
              {/* Left Column: Checkbox + Customer Info, Badges, Due State */}
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleToggleSelectLead(lead.id)}
                  className="mt-1 h-4 w-4 rounded border-line text-accent focus:ring-accent cursor-pointer shrink-0"
                />

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 font-bold shrink-0 text-sm">
                  {customerName.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0 space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      href={`/owner/sales/leads/${lead.id}`}
                      className="text-sm font-bold text-ink hover:text-accent truncate"
                    >
                      {customerName}
                    </Link>

                    <span
                      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${priority.bgClass} ${priority.textClass} ${priority.borderClass}`}
                    >
                      {priority.label}
                    </span>

                    <span className="inline-flex items-center rounded-md bg-surface border border-line px-2 py-0.5 text-[10px] font-medium text-ink">
                      {stageLabel}
                    </span>

                    <span className="inline-flex items-center rounded-md bg-inset border border-line/60 px-2 py-0.5 text-[10px] font-medium text-ink-subtle">
                      {sourceLabel}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-ink-subtle flex-wrap font-mono">
                    <span>{customerPhone}</span>
                    <span>·</span>
                    <span>Created: {createdDateStr}</span>

                    {nextFu && (
                      <>
                        <span>·</span>
                        <span
                          className={`inline-flex items-center gap-1 font-semibold text-[11px] ${
                            isOverdue
                              ? "text-rose-500 font-bold"
                              : isDueToday
                              ? "text-amber-500 font-bold"
                              : "text-ink-subtle"
                          }`}
                        >
                          <Clock className="h-3 w-3" />
                          <span>
                            {isOverdue
                              ? "Overdue"
                              : isDueToday
                              ? "Due Today"
                              : `Due ${formatISTDateTime(nextFu.due_at)}`}
                          </span>
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Per-card Single Assign Dropdown */}
              <div className="shrink-0 w-full sm:w-56">
                <CustomSelect
                  options={repPickerOptions.map((staff) => ({
                    value: staff.id,
                    label: staff.name,
                    description: `${staff.activeCount} active lead${staff.activeCount === 1 ? "" : "s"}`,
                    icon: <UserCheck className="h-3.5 w-3.5 text-accent" />,
                  }))}
                  value=""
                  disabled={isCurrentlyAssigning || bulkAssignMutation.isPending}
                  onChange={(staffId) => handleAssignSingle(lead.id, staffId)}
                  placeholder={isCurrentlyAssigning ? "Assigning..." : "Assign to sales rep..."}
                  className="w-full"
                  buttonClassName="w-full h-9 bg-surface text-xs font-semibold text-ink rounded-xl border border-line hover:border-accent"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* OPTION 1: ASSIGN ALL CONFIRMATION MODAL                       */}
      {/* ------------------------------------------------------------- */}
      {confirmAssignAllStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-line bg-card p-5 shadow-xl space-y-4 font-sans animate-in fade-in-50 zoom-in-95">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h4 className="text-sm font-bold text-ink flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-accent" />
                Confirm Bulk Assignment
              </h4>
              <button
                type="button"
                onClick={() => setConfirmAssignAllStaff(null)}
                className="text-ink-subtle hover:text-ink transition-colors p-1 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-ink">
              <p className="font-semibold text-sm">
                Assign all <span className="font-bold text-accent">{leads.length}</span> unassigned leads to{" "}
                <span className="font-bold">{confirmAssignAllStaff.name}</span>?
              </p>
              <p className="text-ink-subtle">
                Current active load for {confirmAssignAllStaff.name}:{" "}
                <span className="font-bold text-ink">{confirmAssignAllStaff.loadCount} leads</span>.
              </p>

              <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-amber-700 dark:text-amber-300 text-[11px] space-y-1">
                <p className="font-bold flex items-center gap-1">
                  <ShieldAlert className="h-3.5 w-3.5" /> Notice
                </p>
                <p>This action will assign all currently open unassigned leads to this representative server-side.</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmAssignAllStaff(null)}
                disabled={bulkAssignMutation.isPending}
                className="rounded-lg border border-line px-3.5 py-2 text-xs font-medium text-ink hover:bg-hover transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAssignAll}
                disabled={bulkAssignMutation.isPending}
                className="flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-inverse shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
              >
                {bulkAssignMutation.isPending && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                )}
                <span>Confirm &amp; Assign All</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
