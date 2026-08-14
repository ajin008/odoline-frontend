"use client";

import { useMyProfile } from "../hooks/use-staff";
import {
  User,
  Phone,
  Building2,
  Calendar,
  Clock,
  Briefcase,
  Shield,
  Loader2,
  AlertCircle,
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
      <div className="rounded-xl border border-line bg-card p-10 text-center space-y-3 font-sans select-none">
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
    <div className="space-y-6 font-sans select-none">
      {/* 1. Profile Banner & Avatar Header */}
      <div className="rounded-2xl border border-line bg-card p-6 shadow-bento space-y-5">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          {/* Photo / Avatar */}
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-accent/10 border border-accent/20 text-accent font-bold text-xl overflow-hidden shrink-0 shadow-sm">
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

          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h2 className="text-lg font-bold text-ink truncate">
                {profile.name}
              </h2>
              <span className="inline-flex items-center gap-1 rounded-md bg-accent/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent border border-accent/20 w-fit mx-auto sm:mx-0">
                <Shield className="h-3 w-3" />
                {profile.role === "sales" ? "Sales Staff" : "Owner / Admin"}
              </span>
            </div>

            <p className="text-xs text-ink-subtle flex items-center justify-center sm:justify-start gap-1.5 font-mono">
              <Phone className="h-3.5 w-3.5 text-ink-muted" />
              <span>{profile.phone}</span>
            </p>

            {profile.position && (
              <p className="text-xs font-semibold text-ink-muted flex items-center justify-center sm:justify-start gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-accent" />
                <span>{profile.position}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 2. Detail Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Employment & Personal Info */}
        <div className="rounded-2xl border border-line bg-card p-5 space-y-4 shadow-bento">
          <div className="flex items-center gap-2 border-b border-line/60 pb-3">
            <User className="h-4 w-4 text-accent" />
            <h3 className="text-sm font-bold text-ink">Personal Details</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-start justify-between gap-2">
              <span className="text-ink-subtle font-medium">
                Position / Role
              </span>
              <span className="font-semibold text-ink text-right">
                {profile.position || "Sales Staff"}
              </span>
            </div>

            <div className="flex items-start justify-between gap-2">
              <span className="text-ink-subtle font-medium">Gender</span>
              <span className="font-semibold text-ink capitalize text-right">
                {profile.gender || "—"}
              </span>
            </div>

            <div className="flex items-start justify-between gap-2">
              <span className="text-ink-subtle font-medium">Date Joined</span>
              <span className="font-mono font-semibold text-ink text-right">
                {formatDate(profile.joined_on)}
              </span>
            </div>

            <div className="flex items-start justify-between gap-2">
              <span className="text-ink-subtle font-medium">Address</span>
              <span className="font-semibold text-ink text-right max-w-50 truncate">
                {profile.address || "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Department & Shift Schedule */}
        <div className="rounded-2xl border border-line bg-card p-5 space-y-4 shadow-bento">
          <div className="flex items-center gap-2 border-b border-line/60 pb-3">
            <Building2 className="h-4 w-4 text-accent" />
            <h3 className="text-sm font-bold text-ink">
              Department &amp; Shift
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-start justify-between gap-2">
              <span className="text-ink-subtle font-medium">Department</span>
              <span className="font-semibold text-ink text-right">
                {profile.department_name || "General Sales"}
              </span>
            </div>

            <div className="flex items-start justify-between gap-2">
              <span className="text-ink-subtle font-medium flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-accent" />
                Shift Hours
              </span>
              <span className="font-mono font-semibold text-ink text-right">
                {profile.shift_start && profile.shift_end
                  ? `${profile.shift_start} - ${profile.shift_end}`
                  : "09:30 AM - 07:00 PM"}
              </span>
            </div>

            <div className="flex items-start justify-between gap-2">
              <span className="text-ink-subtle font-medium flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-accent" />
                Weekly Holiday
              </span>
              <span className="font-semibold text-ink capitalize text-right">
                {profile.weekly_holiday || "Sunday"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
