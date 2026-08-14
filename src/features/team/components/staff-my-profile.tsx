"use client";

import { useMyProfile } from "../hooks/use-staff";
import {
  User,
  Phone,
  Building2,
  Calendar,
  Clock,
  Briefcase,
  ShieldCheck,
  Loader2,
  AlertCircle,
  MapPin,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
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
      <div className="rounded-2xl border border-line bg-card p-12 text-center space-y-3 font-sans select-none shadow-xs">
        <Loader2 className="h-7 w-7 text-accent animate-spin mx-auto" />
        <p className="text-xs font-semibold text-ink-muted">
          Loading your profile details…
        </p>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="rounded-2xl border border-danger/20 bg-state-danger-light p-6 text-center space-y-2 font-sans text-danger select-none">
        <AlertCircle className="h-6 w-6 mx-auto" />
        <p className="text-sm font-bold">Failed to load profile details</p>
        <p className="text-xs text-ink-subtle">
          Please check your connection or contact your administrator.
        </p>
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
    <div className="space-y-5 font-sans select-none">
      {/* 1. Pro SaaS Hero Banner & Profile Header */}
      <div className="relative overflow-hidden rounded-2xl border border-line bg-card shadow-bento">
        {/* Top Decorative Accent Line */}
        <div className="h-2 w-full bg-gradient-to-r from-accent via-purple-500 to-indigo-500" />

        <div className="p-5 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
            {/* Avatar Photo Container */}
            <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-2xl bg-accent/10 border-2 border-accent/20 text-accent font-bold text-2xl overflow-hidden shrink-0 shadow-md">
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

            {/* Title & Metadata Badges */}
            <div className="space-y-2 flex-1 min-w-0 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-ink truncate font-sans">
                    {profile.name}
                  </h2>
                  <p className="text-xs font-medium text-ink-subtle mt-0.5 flex items-center justify-center sm:justify-start gap-1.5 font-mono">
                    <Phone className="h-3.5 w-3.5 text-accent shrink-0" />
                    <span>{profile.phone}</span>
                  </p>
                </div>

                {/* Status Badges */}
                <div className="flex items-center justify-center sm:justify-end gap-2 flex-wrap pt-1 sm:pt-0">
                  <span className="inline-flex items-center gap-1 rounded-lg bg-accent/15 px-3 py-1 text-xs font-bold text-accent border border-accent/25 shadow-2xs">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {profile.role === "sales" ? "Sales Staff" : "Owner / Admin"}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/15 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Active Account
                  </span>
                </div>
              </div>

              {/* Quick Details Ribbon */}
              <div className="pt-2 border-t border-line/50 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-[11px] font-semibold text-ink-subtle uppercase tracking-wider block">
                    Position
                  </span>
                  <span className="font-bold text-ink truncate block">
                    {profile.position || "Sales Executive"}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-ink-subtle uppercase tracking-wider block">
                    Department
                  </span>
                  <span className="font-bold text-ink truncate block">
                    {profile.department_name || "General Sales"}
                  </span>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <span className="text-[11px] font-semibold text-ink-subtle uppercase tracking-wider block">
                    Joined Date
                  </span>
                  <span className="font-mono font-bold text-ink truncate block">
                    {formatDate(profile.joined_on)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Detailed Info Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Personal & Employment Details */}
        <div className="rounded-2xl border border-line bg-card p-5 space-y-4 shadow-bento">
          <div className="flex items-center gap-2 border-b border-line/60 pb-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10 border border-accent/20 text-accent">
              <User className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">Personal &amp; Employment</h3>
              <p className="text-[11px] text-ink-subtle">
                Personal identity and employment status
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2 rounded-xl bg-inset/40 border border-line/40">
              <span className="text-ink-subtle font-medium flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-accent" />
                Job Title / Position
              </span>
              <span className="font-bold text-ink sm:text-right">
                {profile.position || "Sales Executive"}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2 rounded-xl bg-inset/40 border border-line/40">
              <span className="text-ink-subtle font-medium flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-accent" />
                Gender
              </span>
              <span className="font-bold text-ink capitalize sm:text-right">
                {profile.gender || "Not specified"}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2 rounded-xl bg-inset/40 border border-line/40">
              <span className="text-ink-subtle font-medium flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-accent" />
                Date Joined
              </span>
              <span className="font-mono font-bold text-ink sm:text-right">
                {formatDate(profile.joined_on)}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 p-2 rounded-xl bg-inset/40 border border-line/40">
              <span className="text-ink-subtle font-medium flex items-center gap-1.5 shrink-0">
                <MapPin className="h-3.5 w-3.5 text-accent" />
                Residential Address
              </span>
              <span className="font-bold text-ink sm:text-right break-words max-w-full">
                {profile.address || "No address listed"}
              </span>
            </div>
          </div>
        </div>

        {/* Department Schedule & Shift Details */}
        <div className="rounded-2xl border border-line bg-card p-5 space-y-4 shadow-bento">
          <div className="flex items-center gap-2 border-b border-line/60 pb-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10 border border-accent/20 text-accent">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">Department &amp; Schedule</h3>
              <p className="text-[11px] text-ink-subtle">
                Shift timings and weekly holiday rules
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2 rounded-xl bg-inset/40 border border-line/40">
              <span className="text-ink-subtle font-medium flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-accent" />
                Assigned Department
              </span>
              <span className="font-bold text-ink sm:text-right">
                {profile.department_name || "General Sales"}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2 rounded-xl bg-inset/40 border border-line/40">
              <span className="text-ink-subtle font-medium flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-accent" />
                Standard Shift Hours
              </span>
              <span className="font-mono font-bold text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-md sm:text-right w-fit">
                {profile.shift_start && profile.shift_end
                  ? `${profile.shift_start} - ${profile.shift_end}`
                  : "09:30 AM - 07:00 PM"}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2 rounded-xl bg-inset/40 border border-line/40">
              <span className="text-ink-subtle font-medium flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                Weekly Off / Holiday
              </span>
              <span className="font-bold text-ink capitalize sm:text-right">
                {profile.weekly_holiday || "Sunday"}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2 rounded-xl bg-inset/40 border border-line/40">
              <span className="text-ink-subtle font-medium flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                System Clearance
              </span>
              <span className="font-mono font-bold text-ink sm:text-right">
                {profile.role === "sales" ? "Standard Sales Staff" : "Full Dealership Admin"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
