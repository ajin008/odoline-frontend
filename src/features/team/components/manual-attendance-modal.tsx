/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { useUpsertManualAttendance } from "@/src/features/attendance/hooks/use-attendance";
import type { AttendanceOverviewStaffEntry } from "@/src/features/attendance/types/attendance-types";
import {
  X,
  Clock,
  User,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Building2,
} from "lucide-react";

interface ManualAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: AttendanceOverviewStaffEntry | null;
  date: string; // YYYY-MM-DD from Overview filter
}

function getTodayISTDateString(): string {
  const now = new Date();
  const istOffsetMs = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(now.getTime() + istOffsetMs);
  const year = istDate.getUTCFullYear();
  const month = String(istDate.getUTCMonth() + 1).padStart(2, "0");
  const day = String(istDate.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatReadableDate(dateStr: string): string {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-").map(Number);
  const dateObj = new Date(y, m - 1, d);
  return dateObj.toLocaleDateString("en-IN", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function isoToISTTimeString(isoString?: string | null): string {
  if (!isoString) return "";
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return "";
  const istOffsetMs = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(d.getTime() + istOffsetMs);
  const hours = String(istDate.getUTCHours()).padStart(2, "0");
  const minutes = String(istDate.getUTCMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function ManualAttendanceModal({
  isOpen,
  onClose,
  staff,
  date,
}: ManualAttendanceModalProps) {
  const todayIst = getTodayISTDateString();
  const isFutureDate = date > todayIst;

  const [clockInTime, setClockInTime] = useState<string>("");
  const [clockOutTime, setClockOutTime] = useState<string>("");

  const upsertManual = useUpsertManualAttendance(date);

  useEffect(() => {
    if (isOpen && staff) {
      setClockInTime(isoToISTTimeString(staff.clock_in_at));
      setClockOutTime(isoToISTTimeString(staff.clock_out_at));
    }
  }, [isOpen, staff]);

  if (!isOpen || !staff) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFutureDate) return;

    upsertManual.mutate(
      {
        staff_id: staff.id,
        date,
        clock_in_at: clockInTime || null,
        clock_out_at: clockOutTime || null,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 font-sans select-none">
      <div className="relative w-full max-w-md bg-card border border-line rounded-2xl p-6 shadow-bento space-y-5 animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-line/40 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-accent stroke-[2.5px]" />
              <h2 className="text-base font-bold text-ink font-sans">
                Edit Attendance Record
              </h2>
            </div>
            <p className="text-xs text-ink-subtle flex items-center gap-1 font-mono">
              <Calendar className="h-3 w-3 text-accent" />
              <span>Target Date: {formatReadableDate(date)}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-ink-subtle hover:text-ink hover:bg-inset transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Target Staff Summary Card */}
        <div className="rounded-xl border border-line/70 bg-inset p-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent font-bold text-sm">
              <User className="h-5 w-5 stroke-[2.5px]" />
            </div>
            <div className="min-w-0">
              <span className="font-bold text-sm text-ink block truncate font-sans">
                {staff.name}
              </span>
              <span className="text-xs text-ink-subtle flex items-center gap-1 font-sans">
                <Building2 className="h-3 w-3 text-accent shrink-0" />
                <span className="truncate">
                  {staff.department_name || "Unassigned"}
                </span>
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/30 shrink-0">
            +91 {staff.phone}
          </span>
        </div>

        {/* Future Date Warning Notice */}
        {isFutureDate ? (
          <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3.5 flex items-start gap-2.5 text-xs text-rose-700">
            <AlertTriangle className="h-4 w-4 shrink-0 stroke-[2.5px] mt-0.5 text-rose-600" />
            <div className="space-y-0.5">
              <span className="font-bold block">Future Date Selection</span>
              <p className="text-[11px] leading-normal text-rose-600/90">
                Attendance cannot be recorded or edited for a future day. Select
                today or a past date on the Overview filter.
              </p>
            </div>
          </div>
        ) : null}

        {/* Time Entry Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {/* Clock-In Time */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-ink-subtle uppercase tracking-wider pl-0.5">
                Clock-In Time
              </label>
              <input
                type="time"
                value={clockInTime}
                onChange={(e) => setClockInTime(e.target.value)}
                disabled={isFutureDate}
                className="w-full rounded-xl border border-line bg-inset px-3 py-2.5 text-xs font-mono font-bold text-ink outline-none transition-all focus:border-accent focus:bg-card focus:ring-2 focus:ring-accent/20 disabled:opacity-50"
              />
            </div>

            {/* Clock-Out Time */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-ink-subtle uppercase tracking-wider pl-0.5">
                Clock-Out Time
              </label>
              <input
                type="time"
                value={clockOutTime}
                onChange={(e) => setClockOutTime(e.target.value)}
                disabled={isFutureDate}
                className="w-full rounded-xl border border-line bg-inset px-3 py-2.5 text-xs font-mono font-bold text-ink outline-none transition-all focus:border-accent focus:bg-card focus:ring-2 focus:ring-accent/20 disabled:opacity-50"
              />
            </div>
          </div>

          <p className="text-[11px] text-ink-subtle font-mono border-t border-line/40 pt-3">
            • Note: Manual corrections override geofence rules and stamp source as
            <span className="font-bold text-ink ml-1">&quot;manual&quot;</span>.
          </p>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-line bg-inset px-4 py-2 text-xs font-bold text-ink hover:bg-card transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isFutureDate || upsertManual.isPending}
              className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-5 py-2 text-xs font-bold text-inverse hover:bg-accent-hover transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              <CheckCircle2 className="h-4 w-4 stroke-[2.5px]" />
              <span>
                {upsertManual.isPending ? "Saving..." : "Save Attendance"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
