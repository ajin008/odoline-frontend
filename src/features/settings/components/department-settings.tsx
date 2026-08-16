"use client";

import { useState } from "react";
import { useDepartments } from "../hooks/use-departments";
import { useDepartmentActions } from "../hooks/use-department-actions";
import { DepartmentModal } from "./department-modal";
import { ConfirmModal } from "@/src/components/ui/confirm-modal";
import type { Department } from "../types/department-types";
import { WEEKLY_HOLIDAY_LABELS } from "../types/department-types";
import {
  Layers,
  Plus,
  Clock,
  Calendar,
  Pencil,
  Power,
  RefreshCw,
  Users,
  CheckCircle2,
  PauseCircle,
  Building2,
} from "lucide-react";

function formatTime12h(timeStr: string) {
  if (!timeStr) return "—";
  const parts = timeStr.split(":");
  let h = parseInt(parts[0], 10);
  const m = parts[1] || "00";
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  h = h ? h : 12;
  const formattedHour = h < 10 ? `0${h}` : `${h}`;
  return `${formattedHour}:${m} ${ampm}`;
}

export function DepartmentSettings() {
  const [statusFilter, setStatusFilter] = useState<
    "active" | "inactive" | "all"
  >("active");
  const { data: departments = [], isLoading } = useDepartments(statusFilter);
  const { deactivateDepartment, activateDepartment } = useDepartmentActions();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);

  const [deactivateTarget, setDeactivateTarget] = useState<Department | null>(
    null
  );
  const [activateTarget, setActivateTarget] = useState<Department | null>(null);

  const handleOpenAdd = () => {
    setSelectedDept(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (dept: Department) => {
    setSelectedDept(dept);
    setIsModalOpen(true);
  };

  const handleConfirmDeactivate = () => {
    if (deactivateTarget) {
      deactivateDepartment.mutate(deactivateTarget.id, {
        onSuccess: () => setDeactivateTarget(null),
      });
    }
  };

  const handleConfirmActivate = () => {
    if (activateTarget) {
      activateDepartment.mutate(activateTarget.id, {
        onSuccess: () => setActivateTarget(null),
      });
    }
  };

  return (
    <div className="space-y-6 select-none font-sans max-w-5xl">
      {/* ------------------------------------------------------------- */}
      {/* HEADER SECTION & CTA                                          */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-line/40 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold text-ink tracking-tight font-sans">
              Showroom Departments
            </h2>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/30">
              {departments.length}
            </span>
          </div>
          <p className="text-xs text-ink-subtle">
            Configure shift schedules, operating hours, and weekly off days for
            showroom staff.
          </p>
        </div>

        {/* Add Department CTA */}
        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-xs font-bold text-inverse hover:bg-accent-hover active:scale-[0.98] transition-all cursor-pointer shrink-0 shadow-sm"
        >
          <Plus className="h-4 w-4 stroke-[2.5px]" />
          <span>Add Department</span>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Subtabs Navigation */}
      <div className="flex h-9 items-center gap-1 overflow-x-auto rounded-lg bg-inset p-1 border border-line/40 w-full sm:w-fit no-scrollbar shrink-0">
        <button
          type="button"
          onClick={() => setStatusFilter("active")}
          className={`flex-1 sm:flex-initial h-full text-center rounded-md px-3 sm:px-4 flex items-center justify-center gap-1.5 sm:gap-2 text-xs font-bold tracking-tight font-sans transition-all duration-200 cursor-pointer whitespace-nowrap ${
            statusFilter === "active"
              ? "bg-accent text-inverse shadow-xs"
              : "text-ink-muted hover:text-ink hover:bg-card/50"
          }`}
        >
          <CheckCircle2 className="h-3.5 w-3.5 stroke-[2.2px]" />
          <span>Active</span>
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter("inactive")}
          className={`flex-1 sm:flex-initial h-full text-center rounded-md px-3 sm:px-4 flex items-center justify-center gap-1.5 sm:gap-2 text-xs font-bold tracking-tight font-sans transition-all duration-200 cursor-pointer whitespace-nowrap ${
            statusFilter === "inactive"
              ? "bg-accent text-inverse shadow-xs"
              : "text-ink-muted hover:text-ink hover:bg-card/50"
          }`}
        >
          <PauseCircle className="h-3.5 w-3.5 stroke-[2.2px]" />
          <span>Inactive</span>
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter("all")}
          className={`flex-1 sm:flex-initial h-full text-center rounded-md px-3 sm:px-4 flex items-center justify-center gap-1.5 sm:gap-2 text-xs font-bold tracking-tight font-sans transition-all duration-200 cursor-pointer whitespace-nowrap ${
            statusFilter === "all"
              ? "bg-accent text-inverse shadow-xs"
              : "text-ink-muted hover:text-ink hover:bg-card/50"
          }`}
        >
          <Layers className="h-3.5 w-3.5 stroke-[2.2px]" />
          <span>All Departments</span>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* DEPARTMENT CARDS GRID LIST                                   */}
      {/* ------------------------------------------------------------- */}
      {isLoading ? (
        <div className="grid grid-cols-1 min-[540px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          <div className="h-36 rounded-xl bg-inset border border-line animate-pulse" />
          <div className="h-36 rounded-xl bg-inset border border-line animate-pulse" />
          <div className="h-36 rounded-xl bg-inset border border-line animate-pulse" />
        </div>
      ) : departments.length === 0 ? (
        /* Empty State */
        <div className="rounded-xl border border-dashed border-line bg-inset p-10 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-card border border-line text-ink-subtle">
            <Building2 className="h-6 w-6 stroke-[2px]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-ink font-sans">
              No {statusFilter} departments found
            </h3>
            <p className="text-xs text-ink-subtle max-w-sm mx-auto">
              Create showroom departments (e.g. Sales, Workshop, Refurbishment)
              to configure shift timings and weekly off days.
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-xs font-bold text-inverse hover:bg-accent-hover transition-all cursor-pointer mt-2 shadow-xs"
          >
            <Plus className="h-4 w-4 stroke-[2.5px]" />
            <span>Add First Department</span>
          </button>
        </div>
      ) : (
        /* Dynamic Compact Cards Grid */
        <div className="grid grid-cols-1 min-[540px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className={`bg-card border rounded-xl p-3.5 sm:p-4 shadow-xs transition-all duration-200 flex flex-col justify-between space-y-3 hover:border-accent/40 ${
                dept.is_active
                  ? "border-line"
                  : "border-line/60 bg-inset/30 opacity-80"
              }`}
            >
              {/* Card Header: Icon, Name, Status Badge & Actions */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="h-8 w-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0 mt-0.5">
                    <Building2 className="h-4 w-4 stroke-[2px]" />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <h3 className="text-xs sm:text-sm font-bold text-ink font-sans leading-tight line-clamp-2">
                      {dept.name}
                    </h3>
                    <div>
                      {dept.is_active ? (
                        <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>ACTIVE</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                          <span>INACTIVE</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(dept)}
                    className="p-1.5 rounded-lg text-ink-muted hover:text-ink bg-inset border border-line/40 hover:bg-card transition-colors cursor-pointer"
                    title="Edit Department"
                  >
                    <Pencil className="h-3.5 w-3.5 stroke-[2px]" />
                  </button>

                  {dept.is_active ? (
                    <button
                      type="button"
                      onClick={() => setDeactivateTarget(dept)}
                      className="p-1.5 rounded-lg text-rose-600 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-colors cursor-pointer"
                      title="Deactivate Department"
                    >
                      <Power className="h-3.5 w-3.5 stroke-[2.5px]" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActivateTarget(dept)}
                      className="p-1.5 rounded-lg text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors cursor-pointer"
                      title="Reactivate Department"
                    >
                      <RefreshCw className="h-3.5 w-3.5 stroke-[2.5px]" />
                    </button>
                  )}
                </div>
              </div>

              {/* Card Body: Shift Timings & Weekly Off Row Rows */}
              <div className="space-y-1.5 pt-0.5">
                {/* Shift Timings */}
                <div className="bg-inset/70 border border-line/60 rounded-lg px-2.5 py-1.5 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Clock className="h-3.5 w-3.5 text-accent shrink-0" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-subtle">
                      Shift
                    </span>
                  </div>
                  <span className="font-mono font-bold text-ink text-[11px] shrink-0">
                    {formatTime12h(dept.shift_start)} –{" "}
                    {formatTime12h(dept.shift_end)}
                  </span>
                </div>

                {/* Weekly Holiday */}
                <div className="bg-inset/70 border border-line/60 rounded-lg px-2.5 py-1.5 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Calendar className="h-3.5 w-3.5 text-accent shrink-0" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-subtle">
                      Off Day
                    </span>
                  </div>
                  <span className="font-sans font-bold text-ink text-[11px] shrink-0">
                    {WEEKLY_HOLIDAY_LABELS[dept.weekly_holiday] || "Sunday"}
                  </span>
                </div>
              </div>

              {/* Card Footer: Active Staff Count */}
              <div className="pt-2 border-t border-line/40 flex items-center justify-between text-xs">
                <span className="text-ink-subtle text-[11px] font-medium font-sans">
                  Assigned Personnel
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-500/20">
                  <Users className="h-3 w-3 text-accent shrink-0" />
                  <span>{dept.active_staff_count ?? 0} active</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Department Modal */}
      <DepartmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        department={selectedDept}
      />

      {/* Deactivate Confirm Modal */}
      <ConfirmModal
        isOpen={Boolean(deactivateTarget)}
        onClose={() => setDeactivateTarget(null)}
        onConfirm={handleConfirmDeactivate}
        title={`Deactivate "${deactivateTarget?.name}"?`}
        description={
          deactivateTarget?.active_staff_count &&
          deactivateTarget.active_staff_count > 0
            ? `Warning: This department currently has ${deactivateTarget.active_staff_count} active staff assigned. Reassign or deactivate them first before deactivating.`
            : "Deactivating this department will soft-delete it from active department lists. Historical records will be preserved."
        }
        confirmText="Deactivate Department"
        cancelText="Cancel"
        variant="danger"
        icon={<Power className="h-5 w-5 text-rose-500 stroke-[2.5px]" />}
      />

      {/* Activate Confirm Modal */}
      <ConfirmModal
        isOpen={Boolean(activateTarget)}
        onClose={() => setActivateTarget(null)}
        onConfirm={handleConfirmActivate}
        title={`Reactivate "${activateTarget?.name}"?`}
        description="Reactivating this department will restore it to active departments for staff assignments."
        confirmText="Reactivate Department"
        cancelText="Cancel"
        variant="danger"
        icon={<RefreshCw className="h-5 w-5 text-emerald-500 stroke-[2.5px]" />}
      />
    </div>
  );
}
