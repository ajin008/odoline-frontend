"use client";

import { useState, useRef } from "react";
import { useMe } from "@/src/features/auth/hooks/use-me";
import {
  useUpdatePhoto,
  useRemovePhoto,
} from "@/src/features/auth/hooks/use-update-photo";
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
  Trash2,
} from "lucide-react";

export function ProfileSettings() {
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: user, isLoading: isUserLoading } = useMe();
  const { data: config, isLoading: isConfigLoading } = useConfig();
  const updatePhotoMutation = useUpdatePhoto();
  const removePhotoMutation = useRemovePhoto();

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

  return (
    <div className="space-y-6 select-none font-sans max-w-4xl">
      {/* ------------------------------------------------------------- */}
      {/* PART 1: USER PROFILE (READONLY WITH PHOTO ACTION)             */}
      {/* ------------------------------------------------------------- */}
      <div className="rounded-xl border border-line/60 bg-card p-5 sm:p-6 space-y-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-line/40 pb-5">
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
                  !removePhotoMutation.isPending &&
                  fileInputRef.current?.click()
                }
                className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 text-accent font-bold text-xl overflow-hidden shrink-0 cursor-pointer transition-all hover:opacity-90"
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
                  {updatePhotoMutation.isPending ||
                  removePhotoMutation.isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Camera className="h-5 w-5 stroke-[2.5px]" />
                  )}
                </div>
              </div>

              {/* Quick Remove Trash Icon Badge */}
              {user?.photo_url && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removePhotoMutation.mutate();
                  }}
                  disabled={
                    removePhotoMutation.isPending ||
                    updatePhotoMutation.isPending
                  }
                  className="absolute -top-1 -right-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-white shadow-md hover:bg-rose-700 transition-all cursor-pointer disabled:opacity-50"
                  title="Remove profile photo"
                >
                  <Trash2 className="h-3 w-3 stroke-[2.5px]" />
                </button>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-ink tracking-tight font-sans">
                  {user?.name || "User Account Profile"}
                </h3>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-accent/10 text-accent border border-accent/20 px-2 py-0.5 rounded-md">
                  {user?.role || "Owner"}
                </span>
              </div>
              <p className="text-xs text-ink-muted">
                Click photo avatar to update profile picture
              </p>

              {user?.photo_url && (
                <div className="pt-0.5">
                  <button
                    type="button"
                    onClick={() => removePhotoMutation.mutate()}
                    disabled={
                      removePhotoMutation.isPending ||
                      updatePhotoMutation.isPending
                    }
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-500 hover:text-rose-600 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {removePhotoMutation.isPending ? (
                      <Loader2 className="h-3 w-3 animate-spin text-rose-500" />
                    ) : (
                      <Trash2 className="h-3 w-3 stroke-[2.5px]" />
                    )}
                    <span>Remove current photo</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Clean SaaS Active Session Badge */}
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5 self-start sm:self-auto">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active Session
          </span>
        </div>

        {/* Readonly Form Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-subtle block">
              Full Name
            </label>
            <div className="h-9.5 rounded-xl border border-line/60 bg-surface px-3.5 text-xs font-semibold text-ink flex items-center justify-between">
              <span>{user?.name || "—"}</span>
              <Lock className="h-3 w-3 text-ink-subtle/40 shrink-0 ml-2" />
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-subtle block">
              Phone Number
            </label>
            <div className="h-9.5 rounded-xl border border-line/60 bg-surface px-3.5 text-xs font-semibold text-ink flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-accent shrink-0" />
                <span className="font-mono">+91 {user?.phone || "—"}</span>
              </div>
              <Lock className="h-3 w-3 text-ink-subtle/40 shrink-0 ml-2" />
            </div>
          </div>

          {/* Access Role */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-subtle block">
              Access Privileges
            </label>
            <div className="h-9.5 rounded-xl border border-line/60 bg-surface px-3.5 text-xs font-semibold text-ink flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-accent shrink-0" />
                <span className="capitalize">{user?.role} Access</span>
              </div>
              <Lock className="h-3 w-3 text-ink-subtle/40 shrink-0 ml-2" />
            </div>
          </div>
        </div>

        {/* Change PIN Action Row */}
        <div className="pt-4 border-t border-line/40 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-ink-muted">
            <KeyRound className="h-4 w-4 text-accent shrink-0" />
            <span className="font-medium text-ink-muted">
              Security PIN used for quick authentication &amp; terminal actions
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsPinModalOpen(true)}
            className="h-8.5 px-4 rounded-xl bg-accent text-inverse hover:bg-accent-hover font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer w-full sm:w-auto shrink-0"
          >
            <KeyRound className="h-3.5 w-3.5" />
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
      <div className="rounded-xl border border-line/60 bg-card p-5 sm:p-6 space-y-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-line/40 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 text-accent shrink-0">
              <Building2 className="h-4.5 w-4.5 stroke-[2.5px]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink tracking-tight font-sans">
                Showroom Registry Information
              </h3>
              <p className="text-xs text-ink-muted mt-0.5">
                Official dealership identity &amp; primary contact details
              </p>
            </div>
          </div>

          <span className="text-[10px] font-mono font-bold uppercase tracking-wider border border-line/60 px-2 py-0.5 rounded-md bg-inset text-ink-subtle self-start sm:self-auto">
            Read-Only
          </span>
        </div>

        {/* Readonly Showroom Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Showroom Name */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-subtle block">
              Showroom Name
            </label>
            <div className="h-9.5 rounded-xl border border-line/60 bg-surface px-3.5 text-xs font-semibold text-ink flex items-center justify-between">
              <span>{config?.showroom_name || "Cars4 Showroom"}</span>
              <Lock className="h-3 w-3 text-ink-subtle/40 shrink-0 ml-2" />
            </div>
          </div>

          {/* Showroom Phone */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-subtle block">
              Contact Phone
            </label>
            <div className="h-9.5 rounded-xl border border-line/60 bg-surface px-3.5 text-xs font-semibold text-ink flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-accent shrink-0" />
                <span className="font-mono">
                  {config?.showroom_phone1
                    ? `+91 ${config.showroom_phone1}`
                    : "—"}
                </span>
              </div>
              <Lock className="h-3 w-3 text-ink-subtle/40 shrink-0 ml-2" />
            </div>
          </div>

          {/* Showroom Address (Wide Spanning Field) */}
          <div className="space-y-1 sm:col-span-2">
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-subtle block flex items-center gap-1">
              <MapPin className="h-3 w-3 text-accent shrink-0" />
              <span>Primary Address</span>
            </label>
            <div className="rounded-xl border border-line/60 bg-surface px-3.5 py-2.5 text-xs font-medium text-ink flex items-center justify-between">
              <span className="leading-relaxed break-words flex-1 pr-2">
                {config?.showroom_address || "—"}
              </span>
              <Lock className="h-3 w-3 text-ink-subtle/40 shrink-0 ml-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
