"use client";

import { useState } from "react";
import { useMe } from "@/src/features/auth/hooks/use-me";
import { useConfig } from "../hooks/use-config";
import { ChangePinModal } from "./change-pin-modal";
import { User, Phone, ShieldCheck, Building2, Lock, KeyRound, MapPin } from "lucide-react";

export function ProfileSettings() {
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const { data: user, isLoading: isUserLoading } = useMe();
  const { data: config, isLoading: isConfigLoading } = useConfig();

  const isLoading = isUserLoading || isConfigLoading;

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse max-w-2xl font-sans">
        <div className="h-44 rounded-xl bg-inset border border-line/40" />
        <div className="h-64 rounded-xl bg-inset border border-line/40" />
      </div>
    );
  }

  const formattedLastLogin = user?.last_login_at
    ? new Date(user.last_login_at).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Active Session";

  return (
    <div className="space-y-6 select-none font-sans max-w-2xl">
      {/* ------------------------------------------------------------- */}
      {/* PART 1: USER PROFILE (READONLY)                               */}
      {/* ------------------------------------------------------------- */}
      <div className="rounded-xl border border-line/40 bg-card p-4 sm:p-6 space-y-5 shadow-bento">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-line/40 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-inverse shadow-xs shrink-0">
              <User className="h-5 w-5 stroke-[2.5px]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-bold text-ink tracking-tight font-sans">
                  {user?.name || "User Account Profile"}
                </h3>
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider bg-accent/15 text-accent border border-accent/30 px-2 py-0.5 rounded-md">
                  {user?.role || "Owner"}
                </span>
              </div>
              <p className="text-xs text-ink-subtle mt-0.5">
                Personal credentials and authentication state
              </p>
            </div>
          </div>

          <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md inline-flex items-center gap-1.5 self-start sm:self-auto">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active Session
          </span>
        </div>

        {/* Readonly Form Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink-muted block">
              Full Name
            </label>
            <div className="rounded-xl border border-line/40 bg-inset px-3.5 py-2.5 text-xs font-medium text-ink flex items-center justify-between">
              <span>{user?.name || "—"}</span>
              <Lock className="h-3 w-3 text-ink-subtle/40 shrink-0 ml-2" />
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink-muted block">
              Phone Number
            </label>
            <div className="rounded-xl border border-line/40 bg-inset px-3.5 py-2.5 text-xs font-medium text-ink flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-ink-subtle" />
                <span>+91 {user?.phone || "—"}</span>
              </div>
              <Lock className="h-3 w-3 text-ink-subtle/40 shrink-0 ml-2" />
            </div>
          </div>

          {/* Access Role */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink-muted block">
              Access Privileges
            </label>
            <div className="rounded-xl border border-line/40 bg-inset px-3.5 py-2.5 text-xs font-medium text-ink flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                <span className="capitalize font-semibold">{user?.role} Access</span>
              </div>
              <Lock className="h-3 w-3 text-ink-subtle/40 shrink-0 ml-2" />
            </div>
          </div>

          {/* Last Login */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink-muted block">
              Last Authentication
            </label>
            <div className="rounded-xl border border-line/40 bg-inset px-3.5 py-2.5 text-xs font-medium text-ink-muted flex items-center justify-between">
              <span className="truncate">{formattedLastLogin}</span>
              <Lock className="h-3 w-3 text-ink-subtle/40 shrink-0 ml-2" />
            </div>
          </div>
        </div>

        {/* Change PIN Action Row */}
        <div className="pt-3 border-t border-line/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 text-xs text-ink-muted">
            <KeyRound className="h-4 w-4 text-ink-subtle" />
            <span className="font-semibold text-ink-muted">Security PIN</span>
          </div>

          <button
            type="button"
            onClick={() => setIsPinModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-xs font-bold text-inverse shadow-xs hover:bg-accent-hover active:scale-[0.98] transition-all duration-200 w-full sm:w-auto justify-center cursor-pointer"
          >
            <KeyRound className="h-3.5 w-3.5 stroke-[2.5px]" />
            <span>Change Security PIN</span>
          </button>
        </div>
      </div>

      <ChangePinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
      />

      {/* ------------------------------------------------------------- */}
      {/* PART 2: SHOWROOM INFORMATION (READONLY)                       */}
      {/* ------------------------------------------------------------- */}
      <div className="rounded-xl border border-line/40 bg-card p-4 sm:p-6 space-y-5 shadow-bento">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-line/40 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-inset border border-line/40 text-accent shrink-0">
              <Building2 className="h-4.5 w-4.5 stroke-[2.5px]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink tracking-tight font-sans">
                Showroom Registry Information
              </h3>
              <p className="text-xs text-ink-subtle mt-0.5">
                Official dealership identity &amp; primary contact details
              </p>
            </div>
          </div>

          <span className="text-[10px] font-sans font-semibold uppercase tracking-wider border border-line/40 px-2 py-0.5 rounded-md bg-inset text-ink-subtle self-start sm:self-auto">
            Read-Only
          </span>
        </div>

        {/* Readonly Showroom Fields Stacked Row by Row */}
        <div className="space-y-4">
          {/* Showroom Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink-muted block">
              Showroom Name
            </label>
            <div className="rounded-xl border border-line/40 bg-inset px-3.5 py-2.5 text-xs font-bold text-ink flex items-center justify-between">
              <span>{config?.showroom_name || "Cars4 Showroom"}</span>
              <Lock className="h-3 w-3 text-ink-subtle/40 shrink-0 ml-2" />
            </div>
          </div>

          {/* Showroom Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink-muted block">
              Primary Address
            </label>
            <div className="rounded-xl border border-line/40 bg-inset px-3.5 py-2.5 text-xs font-medium text-ink flex items-center justify-between">
              <div className="flex items-start gap-2.5 flex-1 pr-2">
                <MapPin className="h-3.5 w-3.5 text-ink-subtle shrink-0 mt-0.5" />
                <span className="leading-relaxed break-words flex-1">
                  {config?.showroom_address || "—"}
                </span>
              </div>
              <Lock className="h-3 w-3 text-ink-subtle/40 shrink-0 ml-2" />
            </div>
          </div>

          {/* Showroom Phone */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink-muted block">
              Contact Phone
            </label>
            <div className="rounded-xl border border-line/40 bg-inset px-3.5 py-2.5 text-xs font-medium text-ink flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-ink-subtle" />
                <span>{config?.showroom_phone1 ? `+91 ${config.showroom_phone1}` : "—"}</span>
              </div>
              <Lock className="h-3 w-3 text-ink-subtle/40 shrink-0 ml-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
