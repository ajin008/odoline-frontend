"use client";

import { useState, useRef } from "react";
import { useMe } from "@/src/features/auth/hooks/use-me";
import { useUpdatePhoto } from "@/src/features/auth/hooks/use-update-photo";
import { useConfig } from "../hooks/use-config";
import { ChangePinModal } from "./change-pin-modal";
import {
  User,
  Phone,
  ShieldCheck,
  Building2,
  Lock,
  KeyRound,
  MapPin,
  Camera,
  Loader2,
} from "lucide-react";

export function ProfileSettings() {
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: user, isLoading: isUserLoading } = useMe();
  const { data: config, isLoading: isConfigLoading } = useConfig();
  const updatePhotoMutation = useUpdatePhoto();

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updatePhotoMutation.mutate(file);
    }
  };

  const isLoading = isUserLoading || isConfigLoading;

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse max-w-2xl font-sans">
        <div className="h-44 rounded-xl bg-inset border border-line" />
        <div className="h-64 rounded-xl bg-inset border border-line" />
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
      {/* PART 1: USER PROFILE (READONLY WITH PHOTO ACTION)             */}
      {/* ------------------------------------------------------------- */}
      <div className="rounded-xl border border-line bg-card p-4 sm:p-6 space-y-5">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-line pb-4">
          <div className="flex items-center gap-3.5">
            {/* Interactive Profile Photo Avatar */}
            <div className="relative group shrink-0">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handlePhotoSelect}
              />
              <div
                onClick={() =>
                  !updatePhotoMutation.isPending &&
                  fileInputRef.current?.click()
                }
                className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-accent text-inverse overflow-hidden border border-line cursor-pointer transition-all hover:opacity-90 shadow-xs"
                title="Click to upload or change profile photo"
              >
                {user?.photo_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={user.photo_url}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-7 w-7 stroke-[2.5px]" />
                )}

                {/* Hover overlay indicator */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  {updatePhotoMutation.isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Camera className="h-5 w-5 stroke-[2.5px]" />
                  )}
                </div>
              </div>
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
                Click photo avatar to update profile picture
              </p>
            </div>
          </div>

          {/* Bright, High-Contrast Active Session Badge */}
          <span className="text-[11px] font-bold text-white bg-emerald-600 border border-emerald-500 px-2.5 py-1 rounded-md inline-flex items-center gap-1.5 self-start sm:self-auto">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
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
            <div className="rounded-lg border border-line bg-inset px-3.5 py-2.5 text-xs font-medium text-ink flex items-center justify-between">
              <span>{user?.name || "—"}</span>
              <Lock className="h-3 w-3 text-ink-subtle/40 shrink-0 ml-2" />
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink-muted block">
              Phone Number
            </label>
            <div className="rounded-lg border border-line bg-inset px-3.5 py-2.5 text-xs font-medium text-ink flex items-center justify-between">
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
            <div className="rounded-lg border border-line bg-inset px-3.5 py-2.5 text-xs font-medium text-ink flex items-center justify-between">
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
            <div className="rounded-lg border border-line bg-inset px-3.5 py-2.5 text-xs font-medium text-ink-muted flex items-center justify-between">
              <span className="truncate">{formattedLastLogin}</span>
              <Lock className="h-3 w-3 text-ink-subtle/40 shrink-0 ml-2" />
            </div>
          </div>
        </div>

        {/* Change PIN Action Row */}
        <div className="pt-3 border-t border-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 text-xs text-ink-muted">
            <KeyRound className="h-4 w-4 text-ink-subtle" />
            <span className="font-semibold text-ink-muted">Security PIN</span>
          </div>

          <button
            type="button"
            onClick={() => setIsPinModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-xs font-bold text-inverse hover:bg-accent-hover active:scale-[0.98] transition-all duration-200 w-full sm:w-auto justify-center cursor-pointer"
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
      <div className="rounded-xl border border-line bg-card p-4 sm:p-6 space-y-5">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-line pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-inset border border-line text-accent shrink-0">
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

          <span className="text-[10px] font-sans font-semibold uppercase tracking-wider border border-line px-2 py-0.5 rounded-md bg-inset text-ink-subtle self-start sm:self-auto">
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
            <div className="rounded-lg border border-line bg-inset px-3.5 py-2.5 text-xs font-bold text-ink flex items-center justify-between">
              <span>{config?.showroom_name || "Cars4 Showroom"}</span>
              <Lock className="h-3 w-3 text-ink-subtle/40 shrink-0 ml-2" />
            </div>
          </div>

          {/* Showroom Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink-muted block">
              Primary Address
            </label>
            <div className="rounded-lg border border-line bg-inset px-3.5 py-2.5 text-xs font-medium text-ink flex items-center justify-between">
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
            <div className="rounded-lg border border-line bg-inset px-3.5 py-2.5 text-xs font-medium text-ink flex items-center justify-between">
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
