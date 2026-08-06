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
  CheckCircle2,
  AlertCircle,
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
    <div className="space-y-6 select-none font-sans max-w-4xl">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-line/40 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-ink tracking-tight font-sans">
              Showroom Departments
            </h2>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/30">
              {departments.length}
            </span>
          </div>
          <p className="text-xs text-ink-subtle">
            Manage shift schedules, working hours, and weekly holidays for staff
            rosters
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Status Filter Sub-pills */}
          <div className="flex items-center gap-1 bg-inset p-1 rounded-lg border border-line/40 text-xs font-bold font-sans">
            <button
              type="button"
              onClick={() => setStatusFilter("active")}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                statusFilter === "active"
                  ? "bg-accent text-inverse shadow-xs"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              Active
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("inactive")}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                statusFilter === "inactive"
                  ? "bg-accent text-inverse shadow-xs"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              Inactive
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                statusFilter === "all"
                  ? "bg-accent text-inverse shadow-xs"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              All
            </button>
          </div>

          {/* Add Department Action Button */}
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-xs font-bold text-inverse hover:bg-accent-hover active:scale-[0.98] transition-all cursor-pointer shrink-0 shadow-xs"
          >
            <Plus className="h-4 w-4 stroke-[2.5px]" />
            <span>Add Department</span>
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-40 rounded-xl bg-inset border border-line animate-pulse" />
          <div className="h-40 rounded-xl bg-inset border border-line animate-pulse" />
        </div>
      ) : departments.length === 0 ? (
        /* Empty State */
        <div className="rounded-xl border border-dashed border-line bg-inset p-8 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-card border border-line text-ink-subtle">
            <Layers className="h-6 w-6 stroke-[2px]" />
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
            className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-xs font-bold text-inverse hover:bg-accent-hover transition-all cursor-pointer mt-2"
          >
            <Plus className="h-4 w-4 stroke-[2.5px]" />
            <span>Add First Department</span>
          </button>
        </div>
      ) : (
        /* Department Grid Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className={`rounded-xl border p-5 space-y-4 shadow-bento transition-all ${
                dept.is_active
                  ? "border-line/90 bg-card hover:border-accent/30"
                  : "border-line/50 opacity-75 bg-inset/50"
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 border-b border-line/60 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-ink tracking-tight font-sans">
                      {dept.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {dept.is_active ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                        <CheckCircle2 className="h-3 w-3 stroke-[2.5px]" />
                        <span>Active Roster</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                        <AlertCircle className="h-3 w-3 stroke-[2.5px]" />
                        <span>Deactivated</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(dept)}
                    className="p-1.5 rounded-md text-ink-muted hover:text-ink hover:bg-inset transition-colors cursor-pointer"
                    title="Edit Department"
                  >
                    <Pencil className="h-3.5 w-3.5 stroke-[2px]" />
                  </button>

                  {dept.is_active ? (
                    <button
                      type="button"
                      onClick={() => setDeactivateTarget(dept)}
                      className="p-1.5 rounded-md text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Deactivate Department"
                    >
                      <Power className="h-3.5 w-3.5 stroke-[2.5px]" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActivateTarget(dept)}
                      className="p-1.5 rounded-md text-emerald-600 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                      title="Reactivate Department"
                    >
                      <RefreshCw className="h-3.5 w-3.5 stroke-[2.5px]" />
                    </button>
                  )}
                </div>
              </div>

              {/* Department Timing Details */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                {/* Shift Hours */}
                <div className="space-y-1 rounded-lg bg-inset p-3 border border-line/70">
                  <span className="text-[10px] font-semibold text-ink-subtle uppercase tracking-wider block flex items-center gap-1">
                    <Clock className="h-3 w-3 text-accent" />
                    <span>Shift Timings</span>
                  </span>
                  <span className="font-mono font-bold text-ink block text-[11px]">
                    {formatTime12h(dept.shift_start)} –{" "}
                    {formatTime12h(dept.shift_end)}
                  </span>
                </div>

                {/* Weekly Holiday */}
                <div className="space-y-1 rounded-lg bg-inset p-3 border border-line/70">
                  <span className="text-[10px] font-semibold text-ink-subtle uppercase tracking-wider block flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-accent" />
                    <span>Weekly Off Day</span>
                  </span>
                  <span className="font-sans font-bold text-ink block text-[11px]">
                    {WEEKLY_HOLIDAY_LABELS[dept.weekly_holiday] || "Sunday"}
                  </span>
                </div>
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
        description="Deactivating this department will soft-delete it from active rosters. Historical records will be preserved."
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
        description="Reactivating this department will restore it to the active rosters for staff assignments."
        confirmText="Reactivate Department"
        cancelText="Cancel"
        variant="danger"
        icon={<RefreshCw className="h-5 w-5 text-emerald-500 stroke-[2.5px]" />}
      />
    </div>
  );
}
