"use client";

import { useState } from "react";
import { User, Calendar, TrendingUp } from "lucide-react";
import { StaffMyProfile } from "@/src/features/team/components/staff-my-profile";
import { StaffAttendanceHeatmap } from "@/src/features/team/components/staff-attendance-heatmap";
import { StaffMyPerformance } from "@/src/features/sales/components/staff-my-performance";

type SettingsSubtab = "profile" | "attendance" | "performance";

export default function StaffSettingPage() {
  const [activeSubtab, setActiveSubtab] = useState<SettingsSubtab>("profile");

  return (
    <div className="w-full space-y-5 font-sans select-none">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line/60 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-ink font-sans">
              Staff Settings &amp; Profile
            </h1>
          </div>
          <p className="text-xs text-ink-subtle">
            Manage your personal profile, department shift schedule, and monthly
            attendance heatmap.
          </p>
        </div>
      </div>

      {/* 2. Segmented Subtabs Control Bar (Responsive w-fit on Desktop, Full-width scrollable on Mobile) */}
      <div className="flex h-9 items-center gap-1 overflow-x-auto rounded-lg bg-inset p-1 border border-line/40 w-full sm:w-fit no-scrollbar shrink-0">
        <button
          type="button"
          onClick={() => setActiveSubtab("profile")}
          className={`flex-1 sm:flex-initial h-full text-center rounded-md px-3 sm:px-4 flex items-center justify-center gap-1.5 sm:gap-2 text-xs font-bold tracking-tight transition-all duration-200 cursor-pointer whitespace-nowrap ${
            activeSubtab === "profile"
              ? "bg-accent text-inverse shadow-xs"
              : "text-ink-muted hover:text-ink"
          }`}
        >
          <User
            className={`h-3.5 w-3.5 shrink-0 ${
              activeSubtab === "profile" ? "stroke-[2.5px]" : "stroke-[2px]"
            }`}
          />
          <span>Profile</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubtab("attendance")}
          className={`flex-1 sm:flex-initial h-full text-center rounded-md px-3 sm:px-4 flex items-center justify-center gap-1.5 sm:gap-2 text-xs font-bold tracking-tight transition-all duration-200 cursor-pointer whitespace-nowrap ${
            activeSubtab === "attendance"
              ? "bg-accent text-inverse shadow-xs"
              : "text-ink-muted hover:text-ink"
          }`}
        >
          <Calendar
            className={`h-3.5 w-3.5 shrink-0 ${
              activeSubtab === "attendance" ? "stroke-[2.5px]" : "stroke-[2px]"
            }`}
          />
          <span>Attendance</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubtab("performance")}
          className={`flex-1 sm:flex-initial h-full text-center rounded-md px-3 sm:px-4 flex items-center justify-center gap-1.5 sm:gap-2 text-xs font-bold tracking-tight transition-all duration-200 cursor-pointer whitespace-nowrap ${
            activeSubtab === "performance"
              ? "bg-accent text-inverse shadow-xs"
              : "text-ink-muted hover:text-ink"
          }`}
        >
          <TrendingUp
            className={`h-3.5 w-3.5 shrink-0 ${
              activeSubtab === "performance" ? "stroke-[2.5px]" : "stroke-[2px]"
            }`}
          />
          <span>Performance</span>
        </button>
      </div>

      {/* 3. Subtab Active Content */}
      <div className="pt-1">
        {activeSubtab === "profile" && <StaffMyProfile />}
        {activeSubtab === "attendance" && <StaffAttendanceHeatmap isMe={true} />}
        {activeSubtab === "performance" && <StaffMyPerformance />}
      </div>
    </div>
  );
}
