/* eslint-disable security/detect-object-injection */
"use client";

import { useState } from "react";
import Image from "next/image";
import { useAttendanceOverview } from "@/src/features/attendance/hooks/use-attendance";
import type { AttendanceOverviewStaffEntry } from "@/src/features/attendance/types/attendance-types";
import { getTelUrl, getWhatsAppUrl } from "@/src/utils/phone";
import { DatePicker } from "@/src/components/ui/date-picker";
import { ManualAttendanceModal } from "./manual-attendance-modal";
import { toast } from "sonner";
import { formatLateness } from "@/src/lib/formatters";
import {
  CheckCircle2,
  UserX,
  Clock,
  Calendar,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Loader2,
  Building2,
  AlertCircle,
  Pencil,
} from "lucide-react";

/**
 * Returns today's IST date in 'YYYY-MM-DD' format.
 */
function getTodayISTDateString(): string {
  const now = new Date();
  const istOffsetMs = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(now.getTime() + istOffsetMs);
  const year = istDate.getUTCFullYear();
  const month = String(istDate.getUTCMonth() + 1).padStart(2, "0");
  const day = String(istDate.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Formats YYYY-MM-DD date string into readable label (e.g. "Sunday, Aug 9, 2026").
 */
function formatReadableDate(dateStr: string): string {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-").map(Number);
  const dateObj = new Date(y, m - 1, d);
  return dateObj.toLocaleDateString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Formats UTC ISO timestamp to IST 12-hour time string (e.g. "09:15 AM").
 */
function formatISTTime(isoString?: string | null): string {
  if (!isoString) return "";
  return new Date(isoString).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

interface TeamOverviewProps {
  onSelectStaff?: (staffId: string) => void;
}

export function TeamOverview({ onSelectStaff }: TeamOverviewProps = {}) {
  const todayIst = getTodayISTDateString();
  const [selectedDate, setSelectedDate] = useState<string>(todayIst);
  const [activeListTab, setActiveListTab] = useState<
    "present" | "absent" | "late"
  >("present");

  const [editTargetStaff, setEditTargetStaff] =
    useState<AttendanceOverviewStaffEntry | null>(null);

  const isFutureDate = selectedDate > todayIst;

  const { data: overview, isLoading, isError } = useAttendanceOverview(selectedDate);

  const handleShiftDate = (days: number) => {
    const [y, m, d] = selectedDate.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d);
    dateObj.setDate(dateObj.getDate() + days);
    const newY = dateObj.getFullYear();
    const newM = String(dateObj.getMonth() + 1).padStart(2, "0");
    const newD = String(dateObj.getDate()).padStart(2, "0");
    setSelectedDate(`${newY}-${newM}-${newD}`);
  };

  const handleRowClick = (staff: AttendanceOverviewStaffEntry) => {
    if (isFutureDate) {
      toast.error("Cannot record or edit attendance for a future date.");
      return;
    }
    setEditTargetStaff(staff);
  };

  const handleItemClick = (staff: AttendanceOverviewStaffEntry) => {
    if (onSelectStaff) {
      onSelectStaff(staff.id);
    } else {
      handleRowClick(staff);
    }
  };

  const counts = overview?.counts ?? { present: 0, absent: 0, late: 0 };
  const currentList: AttendanceOverviewStaffEntry[] =
    overview?.[activeListTab] ?? [];

  return (
    <div className="space-y-4 sm:space-y-6 select-none font-sans max-w-5xl">
      {/* ------------------------------------------------------------- */}
      {/* 1. DATE FILTER HEADER & NAVIGATION BAR                         */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-card border border-line/60 rounded-xl p-2.5 sm:p-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-accent shrink-0" />
            <h2 className="text-xs sm:text-sm font-bold text-ink font-sans">
              {formatReadableDate(selectedDate)}
            </h2>
          </div>
          {selectedDate === todayIst && (
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              TODAY
            </span>
          )}
          {isFutureDate && (
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 border border-rose-500/20">
              FUTURE
            </span>
          )}
        </div>

        {/* Custom DatePicker & Day Stepping Controls */}
        <div className="flex items-center gap-1.5 justify-between sm:justify-end w-full sm:w-auto">
          <button
            type="button"
            onClick={() => handleShiftDate(-1)}
            className="h-8.5 w-8.5 flex items-center justify-center rounded-xl bg-surface border border-line/60 hover:border-line active:scale-95 text-ink-muted hover:text-ink transition-colors cursor-pointer shrink-0"
            title="Previous Day"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Premium Custom Calendar Popover */}
          <div className="flex-1 sm:flex-initial flex justify-center sm:justify-end">
            <DatePicker
              value={selectedDate}
              onChange={(newDate) => setSelectedDate(newDate)}
              align="right"
            />
          </div>

          <button
            type="button"
            onClick={() => handleShiftDate(1)}
            className="h-8.5 w-8.5 flex items-center justify-center rounded-xl bg-surface border border-line/60 hover:border-line active:scale-95 text-ink-muted hover:text-ink transition-colors cursor-pointer shrink-0"
            title="Next Day"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {selectedDate !== todayIst && (
            <button
              type="button"
              onClick={() => setSelectedDate(todayIst)}
              className="h-8.5 px-3 flex items-center justify-center gap-1 rounded-xl bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-colors cursor-pointer text-xs font-bold shrink-0"
              title="Reset to Today"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Today</span>
            </button>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. ATTENDANCE SUMMARY COUNTS BAR                              */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        {/* Count Card 1: Present */}
        <div
          onClick={() => setActiveListTab("present")}
          className={`rounded-xl p-3 sm:p-4 space-y-1 sm:space-y-2 border-0 transition-all cursor-pointer text-center sm:text-left ${
            activeListTab === "present"
              ? "shadow-sm scale-[1.01]"
              : "opacity-85 hover:opacity-100"
          }`}
          style={{ backgroundColor: "#d8f1b7" }}
        >
          <div className="flex items-center justify-center sm:justify-between text-emerald-900">
            <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider truncate text-emerald-950/80">
              Present
            </span>
            <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[2.5px] hidden sm:block text-emerald-800" />
          </div>
          <div className="flex flex-col sm:flex-row items-center sm:items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-950">
              {isLoading ? "…" : counts.present}
            </span>
            <span className="text-[9px] sm:text-[11px] hidden sm:inline text-emerald-900/70">
              Clocked-in
            </span>
          </div>
        </div>

        {/* Count Card 2: Absent */}
        <div
          onClick={() => setActiveListTab("absent")}
          className={`rounded-xl p-3 sm:p-4 space-y-1 sm:space-y-2 border-0 transition-all cursor-pointer text-center sm:text-left ${
            activeListTab === "absent"
              ? "shadow-sm scale-[1.01]"
              : "opacity-85 hover:opacity-100"
          }`}
          style={{ backgroundColor: "#f2b5ba" }}
        >
          <div className="flex items-center justify-center sm:justify-between text-rose-900">
            <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider truncate text-rose-950/80">
              Absent
            </span>
            <UserX className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[2.5px] hidden sm:block text-rose-800" />
          </div>
          <div className="flex flex-col sm:flex-row items-center sm:items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-bold font-mono text-rose-950">
              {isLoading ? "…" : counts.absent}
            </span>
            <span className="text-[9px] sm:text-[11px] hidden sm:inline text-rose-900/70">
              Excl. off
            </span>
          </div>
        </div>

        {/* Count Card 3: Late Coming */}
        <div
          onClick={() => setActiveListTab("late")}
          className={`rounded-xl p-3 sm:p-4 space-y-1 sm:space-y-2 border-0 transition-all cursor-pointer text-center sm:text-left ${
            activeListTab === "late"
              ? "shadow-sm scale-[1.01]"
              : "opacity-85 hover:opacity-100"
          }`}
          style={{ backgroundColor: "#fae9cf" }}
        >
          <div className="flex items-center justify-center sm:justify-between text-amber-900">
            <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider truncate text-amber-950/80">
              Late
            </span>
            <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[2.5px] hidden sm:block text-amber-800" />
          </div>
          <div className="flex flex-col sm:flex-row items-center sm:items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-bold font-mono text-amber-950">
              {isLoading ? "…" : counts.late}
            </span>
            <span className="text-[9px] sm:text-[11px] hidden sm:inline text-amber-900/70">
              Subset present
            </span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. STAFF LIST SECTION WITH SUB-TAB CONTROL & CLICK TO EDIT    */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-card border border-line/60 rounded-xl overflow-hidden">
        {/* Sub-Tab Selector Header */}
        <div className="p-3 sm:px-5 sm:py-3.5 bg-inset border-b border-line flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <h3 className="text-xs sm:text-sm font-bold text-ink capitalize font-sans">
              {activeListTab} Staff List
            </h3>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/30">
              {currentList.length}
            </span>
          </div>

          {/* Sub-tab segmented pill buttons */}
          <div className="grid grid-cols-3 sm:inline-flex items-center gap-1 bg-card p-1 rounded-xl border border-line/60">
            <button
              type="button"
              onClick={() => setActiveListTab("present")}
              className={`px-3.5 py-1.5 text-xs font-bold font-sans rounded-lg transition-all cursor-pointer text-center whitespace-nowrap ${
                activeListTab === "present"
                  ? "bg-accent text-inverse font-bold"
                  : "text-ink-muted hover:text-ink font-medium"
              }`}
            >
              Present ({counts.present})
            </button>

            <button
              type="button"
              onClick={() => setActiveListTab("absent")}
              className={`px-3.5 py-1.5 text-xs font-bold font-sans rounded-lg transition-all cursor-pointer text-center whitespace-nowrap ${
                activeListTab === "absent"
                  ? "bg-accent text-inverse font-bold"
                  : "text-ink-muted hover:text-ink font-medium"
              }`}
            >
              Absent ({counts.absent})
            </button>

            <button
              type="button"
              onClick={() => setActiveListTab("late")}
              className={`px-3.5 py-1.5 text-xs font-bold font-sans rounded-lg transition-all cursor-pointer text-center whitespace-nowrap ${
                activeListTab === "late"
                  ? "bg-accent text-inverse font-bold"
                  : "text-ink-muted hover:text-ink font-medium"
              }`}
            >
              Late ({counts.late})
            </button>
          </div>
        </div>

        {/* Scrollable Staff List */}
        <div className="max-h-140 overflow-y-auto divide-y divide-line/60 p-3 sm:p-0">
          {isLoading ? (
            <div className="p-8 text-center space-y-2">
              <Loader2 className="h-6 w-6 text-accent animate-spin mx-auto" />
              <p className="text-xs text-ink-muted">
                Loading attendance data...
              </p>
            </div>
          ) : isError ? (
            <div className="p-8 text-center space-y-2 text-danger">
              <AlertCircle className="h-6 w-6 mx-auto" />
              <p className="text-xs font-semibold">
                Failed to load attendance overview
              </p>
            </div>
          ) : currentList.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-inset border border-line text-ink-subtle">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <p className="text-xs font-bold text-ink">
                No staff members in {activeListTab} list
              </p>
              <p className="text-[11px] text-ink-subtle max-w-xs mx-auto">
                {activeListTab === "present" &&
                  "No staff members clocked in for this date."}
                {activeListTab === "absent" &&
                  "All active staff are present or on weekly holiday."}
                {activeListTab === "late" &&
                  "No staff members arrived late for their shift."}
              </p>
            </div>
          ) : (
            currentList.map((staff) => (
              <div key={staff.id} className="py-2.5 sm:py-0">
                {/* MOBILE VIEW CARD (sm:hidden) */}
                <div
                  onClick={() => handleItemClick(staff)}
                  className="sm:hidden rounded-xl border border-line/60 bg-card p-3 space-y-3 transition-all cursor-pointer hover:border-line"
                >
                  {/* Card Top: Staff Name, Dept & Status Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectStaff?.(staff.id);
                        }}
                        className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-inset border border-line text-ink font-bold font-sans text-xs shrink-0 overflow-hidden cursor-pointer hover:border-accent hover:opacity-90 transition-all"
                        title={`View ${staff.name}'s profile`}
                      >
                        {staff.photo_url ? (
                          <Image
                            src={staff.photo_url}
                            alt={staff.name}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        ) : (
                          staff.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <h4
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectStaff?.(staff.id);
                          }}
                          className="text-xs font-bold text-ink font-sans hover:text-accent cursor-pointer transition-colors"
                          title={`View ${staff.name}'s profile`}
                        >
                          {staff.name}
                        </h4>
                        {staff.department_name && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-ink-muted bg-inset border border-line/60 px-1.5 py-0.2 rounded">
                            <Building2 className="h-2.5 w-2.5 text-accent" />
                            <span>{staff.department_name}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status Badge & Edit Action */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {activeListTab === "absent" ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-md">
                          <UserX className="h-3 w-3" />
                          <span>Absent</span>
                        </span>
                      ) : staff.minutes_late && staff.minutes_late > 0 ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold font-mono text-amber-700 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                          <Clock className="h-3 w-3 text-amber-600" />
                          <span>{formatLateness(staff.minutes_late)}</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                          On Time
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(staff);
                        }}
                        disabled={isFutureDate}
                        className="p-1 rounded-md bg-inset border border-line/70 text-ink-muted hover:text-ink disabled:opacity-40"
                        title={
                          isFutureDate
                            ? "Future dates cannot be edited"
                            : "Edit Attendance"
                        }
                      >
                        <Pencil className="h-3 w-3 stroke-[2px]" />
                      </button>
                    </div>
                  </div>

                  {/* Mobile Contact Bar with Direct Action Buttons */}
                  <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-inset border border-line/50 text-xs">
                    <span className="font-mono font-semibold text-ink text-[11px]">
                      {staff.phone}
                    </span>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <a
                        href={getTelUrl(staff.phone)}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-card border border-line/80 text-[11px] font-bold text-ink hover:bg-inset"
                      >
                        <Image
                          src="/icons/phonecall-icon.png"
                          alt="Call"
                          width={13}
                          height={13}
                          className="object-contain"
                        />
                        <span>Call</span>
                      </a>

                      <a
                        href={getWhatsAppUrl(staff.phone)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-bold text-emerald-700 hover:bg-emerald-500/20"
                      >
                        <Image
                          src="/icons/whatsappIcon.png"
                          alt="WhatsApp"
                          width={13}
                          height={13}
                          className="object-contain"
                        />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  {/* Mobile Shift Timings Panel (Present/Late) */}
                  {activeListTab !== "absent" && (
                    <div className="grid grid-cols-2 gap-2 text-center p-2 rounded-lg bg-inset/60 border border-line/40 font-mono text-[11px]">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-ink-subtle block font-sans font-bold">
                          Clock In
                        </span>
                        <span className="font-bold text-ink">
                          {formatISTTime(staff.clock_in_at) || "—"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-ink-subtle block font-sans font-bold">
                          Clock Out
                        </span>
                        <span className="font-bold text-ink">
                          {formatISTTime(staff.clock_out_at) || "Active Shift"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* DESKTOP VIEW ROW (hidden sm:flex) */}
                <div
                  onClick={() => handleItemClick(staff)}
                  className="hidden sm:flex p-4 px-5 items-center justify-between gap-3 transition-colors cursor-pointer hover:bg-inset/40"
                >
                  {/* Left: Staff Identity & Phone Actions */}
                  <div className="flex items-center gap-3">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectStaff?.(staff.id);
                      }}
                      className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-inset border border-line/80 text-ink font-bold font-sans text-xs shrink-0 overflow-hidden cursor-pointer hover:border-accent hover:opacity-90 transition-all"
                      title={`View ${staff.name}'s profile`}
                    >
                      {staff.photo_url ? (
                        <Image
                          src={staff.photo_url}
                          alt={staff.name}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      ) : (
                        staff.name.charAt(0).toUpperCase()
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectStaff?.(staff.id);
                          }}
                          className="text-xs font-bold text-ink font-sans hover:text-accent cursor-pointer transition-colors"
                          title={`View ${staff.name}'s profile`}
                        >
                          {staff.name}
                        </h4>
                        {staff.department_name && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-ink-muted bg-inset border border-line/60 px-2 py-0.5 rounded-md">
                            <Building2 className="h-3 w-3 text-accent" />
                            <span>{staff.department_name}</span>
                          </span>
                        )}
                      </div>

                      {/* Phone Number with Phone & WhatsApp Action Icons */}
                      <div className="flex items-center gap-2 text-[11px] text-ink-muted">
                        <span className="font-mono font-semibold text-ink">
                          {staff.phone}
                        </span>

                        <div className="flex items-center gap-1 shrink-0">
                          <a
                            href={getTelUrl(staff.phone)}
                            onClick={(e) => e.stopPropagation()}
                            className="flex h-6 w-6 items-center justify-center rounded-md border border-line/70 bg-card hover:border-accent/40 hover:bg-inset transition-all cursor-pointer p-0.5"
                            title={`Call ${staff.phone}`}
                          >
                            <Image
                              src="/icons/phonecall-icon.png"
                              alt="Call"
                              width={14}
                              height={14}
                              className="object-contain"
                            />
                          </a>

                          <a
                            href={getWhatsAppUrl(staff.phone)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex h-6 w-6 items-center justify-center rounded-md border border-line/70 bg-card hover:border-emerald-500/40 hover:bg-inset transition-all cursor-pointer p-0.5"
                            title={`WhatsApp chat ${staff.phone}`}
                          >
                            <Image
                              src="/icons/whatsappIcon.png"
                              alt="WhatsApp"
                              width={14}
                              height={14}
                              className="object-contain"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Clock Times / Lateness or Absent Status & Edit Action */}
                  <div className="flex items-center gap-3">
                    {activeListTab === "absent" ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-md">
                        <UserX className="h-3.5 w-3.5" />
                        <span>Absent Today</span>
                      </span>
                    ) : (
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-3 text-xs font-mono text-ink font-bold">
                          <span>
                            In: {formatISTTime(staff.clock_in_at) || "—"}
                          </span>
                          <span>•</span>
                          <span>
                            Out:{" "}
                            {formatISTTime(staff.clock_out_at) || "Active Shift"}
                          </span>
                        </div>

                        {staff.minutes_late && staff.minutes_late > 0 ? (
                          <span className="text-[10px] font-bold font-mono text-amber-700 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                            {formatLateness(staff.minutes_late)}
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                            On Time Arrival
                          </span>
                        )}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(staff);
                      }}
                      disabled={isFutureDate}
                      className="p-1.5 rounded-lg border border-line/70 bg-card hover:bg-inset text-ink-muted hover:text-ink disabled:opacity-40 transition-colors cursor-pointer"
                      title={
                        isFutureDate
                          ? "Future dates cannot be edited"
                          : "Edit Attendance"
                      }
                    >
                      <Pencil className="h-3.5 w-3.5 stroke-[2px]" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Owner Manual Attendance Edit Modal */}
      <ManualAttendanceModal
        isOpen={Boolean(editTargetStaff)}
        onClose={() => setEditTargetStaff(null)}
        staff={editTargetStaff}
        date={selectedDate}
      />
    </div>
  );
}
