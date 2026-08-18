/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useRef, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  RotateCcw,
} from "lucide-react";

interface DatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (dateStr: string) => void;
  className?: string;
  align?: "left" | "right" | "center";
  fullWidth?: boolean;
  placeholder?: string;
}

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

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getMonthName(monthIndex: number): string {
  const norm = ((Math.floor(monthIndex) % 12) + 12) % 12;
  switch (norm) {
    case 0:
      return "January";
    case 1:
      return "February";
    case 2:
      return "March";
    case 3:
      return "April";
    case 4:
      return "May";
    case 5:
      return "June";
    case 6:
      return "July";
    case 7:
      return "August";
    case 8:
      return "September";
    case 9:
      return "October";
    case 10:
      return "November";
    case 11:
      return "December";
    default:
      return "";
  }
}

export function DatePicker({
  value,
  onChange,
  className = "",
  align = "left",
  fullWidth = false,
  placeholder,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const todayIst = getTodayISTDateString();

  // Parse currently selected date or fallback to today
  const selectedDateStr = value || todayIst;
  const [selY, selM, selD] = selectedDateStr.split("-").map(Number);

  // Month being viewed in calendar view (default to selected month)
  const [viewYear, setViewYear] = useState<number>(
    selY || new Date().getFullYear()
  );
  const [viewMonth, setViewMonth] = useState<number>(
    selM ? selM - 1 : new Date().getMonth()
  );

  // Sync view year/month when value changes externally
  useEffect(() => {
    if (value) {
      const [y, m] = value.split("-").map(Number);
      if (y && m) {
        setViewYear(y);
        setViewMonth(m - 1);
      }
    }
  }, [value]);

  // Close calendar popover on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Calendar month math
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
  const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sun
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  // Navigate months
  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  // Select a specific day
  const handleSelectDay = (
    year: number,
    monthZeroIndexed: number,
    day: number
  ) => {
    const formattedY = year;
    const formattedM = String(monthZeroIndexed + 1).padStart(2, "0");
    const formattedD = String(day).padStart(2, "0");
    const dateStr = `${formattedY}-${formattedM}-${formattedD}`;
    onChange(dateStr);
    setIsOpen(false);
  };

  // Reset to today
  const handleSelectToday = () => {
    onChange(todayIst);
    const [y, m] = todayIst.split("-").map(Number);
    setViewYear(y);
    setViewMonth(m - 1);
    setIsOpen(false);
  };

  // Generate calendar grid cells (42 days total for 6 rows x 7 days)
  const daysGrid: Array<{
    day: number;
    month: number;
    year: number;
    isCurrentMonth: boolean;
    dateStr: string;
  }> = [];

  // Previous month trailing days
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const prevDay = daysInPrevMonth - i;
    const prevMonthIdx = viewMonth === 0 ? 11 : viewMonth - 1;
    const prevYearNum = viewMonth === 0 ? viewYear - 1 : viewYear;
    const dateStr = `${prevYearNum}-${String(prevMonthIdx + 1).padStart(
      2,
      "0"
    )}-${String(prevDay).padStart(2, "0")}`;
    daysGrid.push({
      day: prevDay,
      month: prevMonthIdx,
      year: prevYearNum,
      isCurrentMonth: false,
      dateStr,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(
      2,
      "0"
    )}-${String(d).padStart(2, "0")}`;
    daysGrid.push({
      day: d,
      month: viewMonth,
      year: viewYear,
      isCurrentMonth: true,
      dateStr,
    });
  }

  // Next month leading days
  const remainingCells = 42 - daysGrid.length;
  for (let d = 1; d <= remainingCells; d++) {
    const nextMonthIdx = viewMonth === 11 ? 0 : viewMonth + 1;
    const nextYearNum = viewMonth === 11 ? viewYear + 1 : viewYear;
    const dateStr = `${nextYearNum}-${String(nextMonthIdx + 1).padStart(
      2,
      "0"
    )}-${String(d).padStart(2, "0")}`;
    daysGrid.push({
      day: d,
      month: nextMonthIdx,
      year: nextYearNum,
      isCurrentMonth: false,
      dateStr,
    });
  }

  let alignClasses = "left-0 sm:left-0";
  if (align === "right") {
    alignClasses = "right-0 sm:right-0";
  } else if (align === "center") {
    alignClasses = "left-1/2 -translate-x-1/2";
  }

  return (
    <div
      ref={containerRef}
      className={`relative ${fullWidth ? "w-full block" : "inline-block"} ${className}`}
    >
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center ${
          fullWidth ? "w-full justify-between" : "gap-2.5"
        } h-8.5 px-3 rounded-xl bg-surface border border-line/60 hover:border-line focus:border-accent focus:bg-card focus:ring-2 focus:ring-accent/20 active:scale-[0.99] text-ink transition-all cursor-pointer font-sans`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <CalendarIcon className="h-4 w-4 text-accent stroke-[2.5px] shrink-0" />
          <span className="text-xs font-semibold font-sans text-ink truncate">
            {value ? formatReadableDate(selectedDateStr) : (placeholder || "Select Date")}
          </span>
        </div>
        <ChevronDown
          className={`h-3.5 w-3.5 text-ink-subtle shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Custom Bento Calendar Dropdown Popover */}
      {isOpen && (
        <div
          className={`absolute top-full mt-1.5 z-50 w-[280px] sm:w-[290px] max-w-[calc(100vw-2.5rem)] rounded-2xl border border-line bg-card p-3.5 sm:p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150 font-sans space-y-3 ${alignClasses}`}
        >
          {/* Header Controls: Month Navigation & Today Shortcut */}
          <div className="flex items-center justify-between border-b border-line/60 pb-3">
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-ink font-sans">
                {getMonthName(viewMonth)} {viewYear}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleSelectToday}
                className="inline-flex items-center gap-1 text-[10px] font-bold font-mono text-accent bg-accent/15 hover:bg-accent/25 px-2 py-1 rounded-md transition-all cursor-pointer mr-1"
                title="Jump to Today"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Today</span>
              </button>

              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-inset transition-colors cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-inset transition-colors cursor-pointer"
                title="Next Month"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Weekday Header */}
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

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {daysGrid.map((cell) => {
              const isSelected = cell.dateStr === selectedDateStr;
              const isToday = cell.dateStr === todayIst;

              return (
                <button
                  key={cell.dateStr}
                  type="button"
                  onClick={() =>
                    handleSelectDay(cell.year, cell.month, cell.day)
                  }
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-sans transition-all cursor-pointer ${
                    !cell.isCurrentMonth
                      ? "text-ink-subtle/30 hover:text-ink-subtle"
                      : isSelected
                      ? "bg-accent text-inverse font-bold shadow-xs scale-105"
                      : isToday
                      ? "ring-1 ring-accent text-accent font-bold bg-accent/10 hover:bg-accent/20"
                      : "text-ink hover:bg-inset font-medium"
                  }`}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
