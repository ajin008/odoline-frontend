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
      {/* SUBTABS NAVIGATION (Placed directly BELOW the heading)        */}
      {/* ------------------------------------------------------------- */}
      <div className="flex items-center gap-1.5 overflow-x-auto rounded-xl bg-inset p-1.5 border border-line/40 w-fit no-scrollbar">
        <button
          type="button"
          onClick={() => setStatusFilter("active")}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold font-sans transition-all duration-200 cursor-pointer whitespace-nowrap ${
            statusFilter === "active"
              ? "bg-accent text-inverse shadow-xs"
              : "text-ink-muted hover:text-ink hover:bg-card/50"
          }`}
        >
          <CheckCircle2 className="h-3.5 w-3.5 stroke-[2.2px]" />
          <span>Active </span>
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter("inactive")}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold font-sans transition-all duration-200 cursor-pointer whitespace-nowrap ${
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
          className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold font-sans transition-all duration-200 cursor-pointer whitespace-nowrap ${
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-44 rounded-xl bg-inset border border-line animate-pulse" />
          <div className="h-44 rounded-xl bg-inset border border-line animate-pulse" />
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
        /* Bento Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className={`bg-card border rounded-xl p-5 shadow-bento transition-all duration-200 flex flex-col justify-between space-y-4 hover:border-accent/40 ${
                dept.is_active
                  ? "border-line"
                  : "border-line/60 bg-inset/30 opacity-80"
              }`}
            >
              {/* Card Header: Icon, Name, Status Badge & Actions */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                    <Building2 className="h-5 w-5 stroke-[2px]" />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-ink font-sans truncate">
                        {dept.name}
                      </h3>
                    </div>
                    <div>
                      {dept.is_active ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>ACTIVE</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 border border-amber-500/20">
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
                    className="p-2 rounded-lg text-ink-muted hover:text-ink bg-inset border border-line/40 hover:bg-card transition-colors cursor-pointer"
                    title="Edit Department"
                  >
                    <Pencil className="h-3.5 w-3.5 stroke-[2px]" />
                  </button>

                  {dept.is_active ? (
                    <button
                      type="button"
                      onClick={() => setDeactivateTarget(dept)}
                      className="p-2 rounded-lg text-rose-600 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-colors cursor-pointer"
                      title="Deactivate Department"
                    >
                      <Power className="h-3.5 w-3.5 stroke-[2.5px]" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActivateTarget(dept)}
                      className="p-2 rounded-lg text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors cursor-pointer"
                      title="Reactivate Department"
                    >
                      <RefreshCw className="h-3.5 w-3.5 stroke-[2.5px]" />
                    </button>
                  )}
                </div>
              </div>

              {/* Card Body: Chips for Shift Timings, Weekly Off, Staff */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {/* Shift Timings */}
                <div className="bg-inset/70 border border-line/60 rounded-lg p-2.5 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-accent shrink-0" />
                  <div className="min-w-0">
                    <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-ink-subtle leading-none">
                      Shift Hours
                    </span>
                    <span className="text-xs font-mono font-bold text-ink mt-0.5 block truncate">
                      {formatTime12h(dept.shift_start)} –{" "}
                      {formatTime12h(dept.shift_end)}
                    </span>
                  </div>
                </div>

                {/* Weekly Off */}
                <div className="bg-inset/70 border border-line/60 rounded-lg p-2.5 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-accent shrink-0" />
                  <div className="min-w-0">
                    <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-ink-subtle leading-none">
                      Weekly Holiday
                    </span>
                    <span className="text-xs font-sans font-bold text-ink mt-0.5 block truncate">
                      {WEEKLY_HOLIDAY_LABELS[dept.weekly_holiday] || "Sunday"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer: Active Staff Count */}
              <div className="pt-2 border-t border-line/40 flex items-center justify-between text-xs">
                <span className="text-ink-subtle text-[11px] font-medium font-sans">
                  Assigned Personnel
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-sky-500/10 text-sky-700 border border-sky-500/20">
                  <Users className="h-3.5 w-3.5 text-accent shrink-0" />
                  <span>{dept.active_staff_count ?? 0} active staff</span>
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
