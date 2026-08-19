"use client";

import { useState } from "react";
import { useStaffHeatmap, useMyHeatmap } from "@/src/features/attendance/hooks/use-attendance";
import type {
  StaffHeatmapDayEntry,
  StaffHeatmapDayStatus,
} from "@/src/features/attendance/types/attendance-types";
import { formatLateness } from "@/src/lib/formatters";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Clock,
  AlertCircle,
} from "lucide-react";

interface StaffAttendanceHeatmapProps {
  staffId?: string;
  isMe?: boolean;
}

/**
 * Returns today's IST month in 'YYYY-MM' format.
 */
function getTodayISTMonthString(): string {
  const now = new Date();
  const istOffsetMs = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(now.getTime() + istOffsetMs);
  const year = istDate.getUTCFullYear();
  const month = String(istDate.getUTCMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

/**
 * Formats YYYY-MM into readable month label (e.g. "August 2026").
 */
function formatReadableMonth(monthStr: string): string {
  if (!monthStr) return "";
  const [y, m] = monthStr.split("-").map(Number);
  const dateObj = new Date(y, m - 1, 1);
  return dateObj.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}

/**
 * Formats UTC ISO timestamp to IST 12-hour time string (e.g. "09:15 AM").
 */
function formatISTTime(isoString?: string | null): string {
  if (!isoString) return "—";
  return new Date(isoString).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Safe status style resolver to satisfy strict linters and ensure clean UI.
 */
function getStatusStyle(status: StaffHeatmapDayStatus): string {
  switch (status) {
    case "full":
      return "bg-emerald-600 text-white font-bold hover:bg-emerald-700";
    case "half":
      return "bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-500/40 hover:bg-emerald-500/30";
    case "late":
      return "bg-amber-500 text-white font-bold hover:bg-amber-600";
    case "incomplete":
      return "bg-purple-600 text-white font-bold hover:bg-purple-700";
    case "absent":
      return "bg-rose-600 text-white font-bold hover:bg-rose-700";
    case "holiday":
      return "bg-neutral-state text-neutral-state-text font-bold border border-line/40 hover:opacity-90";
    case "future":
    default:
      return "bg-future-state border border-line/50 text-ink-subtle/50 opacity-60 cursor-not-allowed";
  }
}

/**
 * Safe status label resolver for details tooltips & legend.
 */
function getStatusLabel(status: StaffHeatmapDayStatus): string {
  switch (status) {
    case "full":
      return "Full Day (On Time)";
    case "half":
      return "Half Day";
    case "late":
      return "Late Coming";
    case "incomplete":
      return "Incomplete Shift (No Clock-Out)";
    case "absent":
      return "Absent";
    case "holiday":
      return "Weekly Off (Holiday)";
    case "future":
      return "Future Day";
    default:
      return status;
  }
}

export function StaffAttendanceHeatmap({
  staffId,
  isMe = false,
}: StaffAttendanceHeatmapProps) {
  const todayMonth = getTodayISTMonthString();
  const [selectedMonth, setSelectedMonth] = useState<string>(todayMonth);
  const [activeDayHover, setActiveDayHover] =
    useState<StaffHeatmapDayEntry | null>(null);

  const staffHeatmapQuery = useStaffHeatmap(
    staffId || "",
    selectedMonth
  );
  const myHeatmapQuery = useMyHeatmap(selectedMonth);

  const { data: heatmapData, isLoading, isError } =
    isMe || !staffId ? myHeatmapQuery : staffHeatmapQuery;

  // Shift month +/- 1 month
  const handleShiftMonth = (delta: number) => {
    const [y, m] = selectedMonth.split("-").map(Number);
    const dateObj = new Date(y, m - 1 + delta, 1);
    const newY = dateObj.getFullYear();
    const newM = String(dateObj.getMonth() + 1).padStart(2, "0");
    setSelectedMonth(`${newY}-${newM}`);
  };

  const daysList: StaffHeatmapDayEntry[] = heatmapData?.days ?? [];

  // Compute starting day of week for day 1 of selected month
  let startingDayOfWeek = 0;
  if (selectedMonth) {
    const [y, m] = selectedMonth.split("-").map(Number);
    startingDayOfWeek = new Date(y, m - 1, 1).getDay();
  }

  // Generate leading empty padding cells for proper calendar alignment
  const emptyPaddingCells = Array.from({ length: startingDayOfWeek });

  return (
    <div className="space-y-4 rounded-xl border border-line/60 bg-card p-5 font-sans select-none">
      {/* ------------------------------------------------------------- */}
      {/* 1. HEADER & MONTH PICKER CONTROLS                             */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-line/40 pb-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-accent" />
            <h3 className="text-sm font-bold text-ink font-sans">
              Monthly Attendance Heatmap
            </h3>
          </div>
          <p className="text-xs text-ink-subtle">
            Read-time shift performance, punctuality, and attendance log history.
          </p>
        </div>

        {/* Month Selector Controls */}
        <div className="flex items-center gap-1.5 bg-inset p-1 rounded-xl border border-line/60 self-stretch sm:self-auto justify-between sm:justify-end">
          <button
            type="button"
            onClick={() => handleShiftMonth(-1)}
            className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-card transition-colors cursor-pointer"
            title="Previous Month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-1 px-2">
            <span className="text-xs font-bold font-mono text-ink">
              {formatReadableMonth(selectedMonth)}
            </span>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => e.target.value && setSelectedMonth(e.target.value)}
              className="sr-only"
              id={`month-picker-${staffId}`}
            />
          </div>

          <button
            type="button"
            onClick={() => handleShiftMonth(1)}
            className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-card transition-colors cursor-pointer"
            title="Next Month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. LEGEND BAR                                                 */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-ink-muted pt-1">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-md bg-emerald-600 shrink-0" />
          <span>Full Day</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-md bg-emerald-500/20 border border-emerald-500/40 shrink-0" />
          <span>Half Day</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-md bg-amber-500 shrink-0" />
          <span>Late</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-md bg-purple-600 shrink-0" />
          <span>Incomplete</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-md bg-rose-600 shrink-0" />
          <span>Absent</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-md bg-neutral-state border border-line/40 shrink-0" />
          <span>Weekly Off</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-md bg-future-state border border-line/50 opacity-80 shrink-0" />
          <span>Future</span>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. CALENDAR HEATMAP GRID                                      */}
      {/* ------------------------------------------------------------- */}
      {isLoading ? (
        <div className="p-8 text-center space-y-2">
          <Loader2 className="h-6 w-6 text-accent animate-spin mx-auto" />
          <p className="text-xs text-ink-muted">Loading monthly heatmap data...</p>
        </div>
      ) : isError ? (
        <div className="p-8 text-center space-y-2 text-danger">
          <AlertCircle className="h-6 w-6 mx-auto" />
          <p className="text-xs font-semibold">Failed to load attendance heatmap</p>
        </div>
      ) : (
        <div className="space-y-2 pt-2">
          {/* Weekday Labels Header */}
          <div className="grid grid-cols-7 text-center">
            {WEEKDAYS.map((day) => (
              <span
                key={day}
                className="text-[10px] font-mono font-bold text-ink-subtle uppercase"
              >
                {day}
              </span>
            ))}
          </div>

          {/* Calendar Heatmap Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Leading Empty Alignment Cells */}
            {emptyPaddingCells.map((_, i) => (
              <div key={`empty-${i}`} className="h-10 sm:h-12 rounded-xl bg-transparent" />
            ))}

            {/* Monthly Day Cells */}
            {daysList.map((entry) => {
              const dayNum = parseInt(entry.date.split("-")[2], 10);
              const style = getStatusStyle(entry.status);

              return (
                <button
                  key={entry.date}
                  type="button"
                  onClick={() =>
                    setActiveDayHover(
                      activeDayHover?.date === entry.date ? null : entry
                    )
                  }
                  onMouseEnter={() => setActiveDayHover(entry)}
                  className={`relative flex flex-col items-center justify-center h-10 sm:h-12 rounded-xl transition-all cursor-pointer ${style}`}
                >
                  <span className="text-xs font-mono font-bold">{dayNum}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. DAY DETAIL POPOVER / TOOLTIP PANEL                         */}
      {/* ------------------------------------------------------------- */}
      {activeDayHover && (
        <div className="rounded-xl border border-line bg-inset p-3.5 space-y-2 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-mono text-ink">
              {activeDayHover.date}
            </span>
            <span className="text-xs font-bold text-ink">
              {getStatusLabel(activeDayHover.status)}
            </span>
          </div>

          {activeDayHover.status !== "future" &&
            activeDayHover.status !== "holiday" &&
            activeDayHover.status !== "absent" && (
              <div className="flex items-center justify-between text-xs font-mono text-ink-muted border-t border-line/40 pt-2">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-accent" />
                  <span>
                    In: {formatISTTime(activeDayHover.clock_in_at)} • Out:{" "}
                    {formatISTTime(activeDayHover.clock_out_at)}
                  </span>
                </div>
                {activeDayHover.minutes_late ? (
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {formatLateness(activeDayHover.minutes_late)}
                  </span>
                ) : null}
              </div>
            )}
        </div>
      )}
    </div>
  );
}
