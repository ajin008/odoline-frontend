"use client";

import { useMyProfile } from "../hooks/use-staff";
import { Loader2, AlertCircle } from "lucide-react";
import Image from "next/image";

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function StaffMyProfile() {
  const { data: profile, isLoading, isError } = useMyProfile();

  if (isLoading) {
    return (
      <div className="py-16 text-center space-y-3 font-sans select-none">
        <Loader2 className="h-6 w-6 text-accent animate-spin mx-auto" />
        <p className="text-xs text-ink-muted">Loading profile details…</p>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="rounded-xl border border-danger/20 bg-state-danger-light p-6 text-center space-y-2 font-sans text-danger select-none">
        <AlertCircle className="h-6 w-6 mx-auto" />
        <p className="text-xs font-semibold">Failed to load profile details</p>
      </div>
    );
  }

  const initials = profile.name
    ? profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "ST";

  return (
    <div className="w-full space-y-6 font-sans select-none text-ink">
      {/* 1. Clean Native Profile Header */}
      <div className="rounded-2xl border border-line bg-card p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 text-center sm:text-left">
          {/* Avatar */}
          <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-accent/10 border border-accent/20 text-accent font-bold text-xl overflow-hidden shrink-0">
            {profile.photo_url ? (
              <Image
                src={profile.photo_url}
                alt={profile.name}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <span>{initials}</span>
            )}
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight text-ink font-sans">
              {profile.name}
            </h2>
            <p className="text-xs font-semibold text-accent">
              {profile.position || "Sales Staff"}{" "}
              <span className="text-ink-subtle font-normal">
                · {profile.department_name || "General Sales"}
              </span>
            </p>
            <p className="text-xs text-ink-subtle font-mono pt-0.5">
              {profile.phone}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Group 1: Personal Details Card */}
      <div className="rounded-2xl border border-line bg-card p-5 space-y-3">
        <h3 className="text-xs font-bold text-ink-subtle uppercase tracking-wider pb-1">
          Personal Information
        </h3>

        <div className="divide-y divide-line/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2.5 gap-1">
            <span className="text-xs font-medium text-ink-subtle">
              Full Name
            </span>
            <span className="text-xs font-semibold text-ink sm:text-right">
              {profile.name}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2.5 gap-1">
            <span className="text-xs font-medium text-ink-subtle">
              Mobile Phone
            </span>
            <span className="text-xs font-semibold text-ink font-mono sm:text-right">
              {profile.phone}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2.5 gap-1">
            <span className="text-xs font-medium text-ink-subtle">
              Position
            </span>
            <span className="text-xs font-semibold text-ink sm:text-right">
              {profile.position || "Sales Staff"}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2.5 gap-1">
            <span className="text-xs font-medium text-ink-subtle">
              Gender
            </span>
            <span className="text-xs font-semibold text-ink capitalize sm:text-right">
              {profile.gender || "—"}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2.5 gap-1">
            <span className="text-xs font-medium text-ink-subtle">
              Date Joined
            </span>
            <span className="text-xs font-semibold text-ink font-mono sm:text-right">
              {formatDate(profile.joined_on)}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start justify-between py-2.5 gap-1">
            <span className="text-xs font-medium text-ink-subtle shrink-0">
              Address
            </span>
            <span className="text-xs font-semibold text-ink sm:text-right max-w-xs break-words">
              {profile.address || "—"}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Group 2: Workstation Schedule Card */}
      <div className="rounded-2xl border border-line bg-card p-5 space-y-3">
        <h3 className="text-xs font-bold text-ink-subtle uppercase tracking-wider pb-1">
          Workstation &amp; Shift Schedule
        </h3>

        <div className="divide-y divide-line/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2.5 gap-1">
            <span className="text-xs font-medium text-ink-subtle">
              Department
            </span>
            <span className="text-xs font-semibold text-ink sm:text-right">
              {profile.department_name || "General Sales"}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2.5 gap-1">
            <span className="text-xs font-medium text-ink-subtle">
              Shift Hours
            </span>
            <span className="text-xs font-semibold text-ink font-mono sm:text-right">
              {profile.shift_start && profile.shift_end
                ? `${profile.shift_start} - ${profile.shift_end}`
                : "09:30 AM - 07:00 PM"}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2.5 gap-1">
            <span className="text-xs font-medium text-ink-subtle">
              Weekly Off
            </span>
            <span className="text-xs font-semibold text-ink capitalize sm:text-right">
              {profile.weekly_holiday || "Sunday"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
