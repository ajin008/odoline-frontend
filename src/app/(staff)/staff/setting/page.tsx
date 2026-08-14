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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line/60 pb-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-ink font-sans">
            Staff Settings &amp; Profile
          </h1>
          <p className="text-xs text-ink-muted">
            View personal profile details, department schedule, and attendance record.
          </p>
        </div>
      </div>

      {/* Segmented Subtabs Bar */}
      <div className="flex items-center gap-1.5 border-b border-line/60 pb-3">
        <button
          type="button"
          onClick={() => setActiveSubtab("profile")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
            activeSubtab === "profile"
              ? "bg-accent text-inverse shadow-xs font-bold"
              : "bg-card border border-line text-ink-subtle hover:text-ink"
          }`}
        >
          <User className="h-3.5 w-3.5" />
          <span>My Profile</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubtab("attendance")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
            activeSubtab === "attendance"
              ? "bg-accent text-inverse shadow-xs font-bold"
              : "bg-card border border-line text-ink-subtle hover:text-ink"
          }`}
        >
          <Calendar className="h-3.5 w-3.5" />
          <span>My Attendance</span>
        </button>
      </div>

      {/* Subtab Content */}
      <div>
        {activeSubtab === "profile" ? (
          <StaffMyProfile />
        ) : (
          <StaffAttendanceHeatmap isMe={true} />
        )}
      </div>
    </div>
  );
}
