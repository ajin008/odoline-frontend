"use client";

import { useState } from "react";
import { User, Calendar } from "lucide-react";
import { StaffMyProfile } from "@/src/features/team/components/staff-my-profile";
import { StaffAttendanceHeatmap } from "@/src/features/team/components/staff-attendance-heatmap";

type SettingsSubtab = "profile" | "attendance";

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
      <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-inset/80 border border-line w-full sm:w-fit overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveSubtab("profile")}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeSubtab === "profile"
              ? "bg-accent text-inverse shadow-xs font-bold"
              : "text-ink-subtle hover:text-ink hover:bg-card/50"
          }`}
        >
          <User className="h-3.5 w-3.5 shrink-0" />
          <span>My Profile</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubtab("attendance")}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeSubtab === "attendance"
              ? "bg-accent text-inverse shadow-xs font-bold"
              : "text-ink-subtle hover:text-ink hover:bg-card/50"
          }`}
        >
          <Calendar className="h-3.5 w-3.5 shrink-0" />
          <span>My Attendance</span>
        </button>
      </div>

      {/* 3. Subtab Active Content */}
      <div className="pt-1">
        {activeSubtab === "profile" ? (
          <StaffMyProfile />
        ) : (
          <StaffAttendanceHeatmap isMe={true} />
        )}
      </div>
    </div>
  );
}
