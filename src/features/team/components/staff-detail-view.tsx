"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import type { StaffMember } from "../types/staff-types";
import { useStaffActions } from "../hooks/use-staff-actions";
import { StaffModal } from "./staff-modal";
import { ResetPinModal } from "./reset-pin-modal";
import { ConfirmModal } from "@/src/components/ui/confirm-modal";
import {
  ArrowLeft,
  User,
  Phone,
  Building2,
  Briefcase,
  Calendar,
  MapPin,
  Pencil,
  KeyRound,
  Power,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Camera,
  Loader2,
} from "lucide-react";

interface StaffDetailViewProps {
  staff: StaffMember;
  onBack: () => void;
}

export function StaffDetailView({ staff, onBack }: StaffDetailViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { deactivateStaff, activateStaff, updatePhoto } = useStaffActions();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isResetPinOpen, setIsResetPinOpen] = useState(false);
  const [isConfirmDeactivateOpen, setIsConfirmDeactivateOpen] = useState(false);
  const [isConfirmActivateOpen, setIsConfirmActivateOpen] = useState(false);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updatePhoto.mutate({ id: staff.id, file });
    }
  };

  const handleDeactivate = () => {
    deactivateStaff.mutate(staff.id, {
      onSuccess: () => {
        setIsConfirmDeactivateOpen(false);
        onBack();
      },
    });
  };

  const handleActivate = () => {
    activateStaff.mutate(staff.id, {
      onSuccess: () => {
        setIsConfirmActivateOpen(false);
        onBack();
      },
    });
  };

  return (
    <div className="space-y-6 select-none font-sans max-w-4xl">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between border-b border-line/40 pb-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-lg border border-line/70 bg-inset px-3.5 py-2 text-xs font-bold text-ink-muted hover:text-ink hover:bg-card transition-all cursor-pointer shadow-xs"
        >
          <ArrowLeft className="h-4 w-4 stroke-[2.5px]" />
          <span>Back to Staff Roster</span>
        </button>

        <div className="flex items-center gap-2">
          {staff.is_active ? (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">
              <CheckCircle2 className="h-3.5 w-3.5 stroke-[2.5px]" />
              <span>Active Roster</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md">
              <AlertCircle className="h-3.5 w-3.5 stroke-[2.5px]" />
              <span>Resigned / Inactive</span>
            </span>
          )}
        </div>
      </div>

      {/* Staff Profile Main Header Card */}
      <div className="rounded-xl border border-line/90 bg-card p-6 shadow-bento space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-line/40 pb-5">
          <div className="flex items-center gap-4">
            {/* Avatar Photo or Fallback Icon with Upload Control */}
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
                  !updatePhoto.isPending && fileInputRef.current?.click()
                }
                className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/15 border border-accent/30 text-accent font-bold text-2xl overflow-hidden shrink-0 shadow-xs cursor-pointer transition-all hover:opacity-90"
                title="Click photo to upload or update profile picture"
              >
                {staff.photo_url ? (
                  <Image
                    src={staff.photo_url}
                    alt={staff.name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <User className="h-8 w-8 stroke-[2.5px]" />
                )}

                {/* Hover Camera Overlay / Upload Spinner */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  {updatePhoto.isPending ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <Camera className="h-6 w-6 stroke-[2.5px]" />
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-bold text-ink tracking-tight font-sans">
                {staff.name}
              </h2>
              <div className="flex items-center gap-2.5 text-xs text-ink-muted">
                <span className="flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5 text-accent" />
                  <span className="font-semibold">
                    {staff.position || "Sales Executive"}
                  </span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-accent" />
                  <span className="font-semibold">
                    {staff.department_name || "Unassigned"}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setIsEditOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-inset px-3.5 py-2 text-xs font-bold text-ink hover:bg-card transition-all cursor-pointer"
            >
              <Pencil className="h-3.5 w-3.5 stroke-[2px]" />
              <span>Edit Profile</span>
            </button>

            <button
              type="button"
              onClick={() => setIsResetPinOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-accent/30 bg-accent/15 px-3.5 py-2 text-xs font-bold text-accent hover:bg-accent/25 transition-all cursor-pointer"
            >
              <KeyRound className="h-3.5 w-3.5 stroke-[2.5px]" />
              <span>Reset PIN</span>
            </button>

            {staff.is_active ? (
              <button
                type="button"
                onClick={() => setIsConfirmDeactivateOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-500/20 transition-all cursor-pointer"
              >
                <Power className="h-3.5 w-3.5 stroke-[2.5px]" />
                <span>Deactivate</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsConfirmActivateOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-500/20 transition-all cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5 stroke-[2.5px]" />
                <span>Reactivate Staff</span>
              </button>
            )}
          </div>
        </div>

        {/* Detailed Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Phone Card with Call & WhatsApp Buttons */}
          <div className="space-y-2 rounded-xl bg-inset p-4 border border-line/70 min-w-0">
            <span className="text-[10px] font-semibold text-ink-subtle uppercase tracking-wider flex items-center gap-1">
              <Phone className="h-3 w-3 text-accent shrink-0" />
              <span>Mobile Phone</span>
            </span>
            <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
              <span className="font-mono font-bold text-ink text-sm shrink-0">
                +91 {staff.phone}
              </span>
              <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                <a
                  href={`tel:+91${staff.phone}`}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-card border border-line text-ink-muted hover:text-ink hover:border-accent/40 transition-all font-bold text-xs shrink-0"
                  title={`Call +91 ${staff.phone}`}
                >
                  <Image
                    src="/icons/phonecall-icon.png"
                    alt="Call"
                    width={15}
                    height={15}
                    className="object-contain shrink-0"
                  />
                  <span>Call</span>
                </a>
                <a
                  href={`https://wa.me/91${staff.phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-card border border-line text-ink-muted hover:text-emerald-600 hover:border-emerald-500/40 transition-all font-bold text-xs shrink-0"
                  title={`WhatsApp chat +91 ${staff.phone}`}
                >
                  <Image
                    src="/icons/whatsappIcon.png"
                    alt="WhatsApp"
                    width={15}
                    height={15}
                    className="object-contain shrink-0"
                  />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Department Card */}
          <div className="space-y-1.5 rounded-xl bg-inset p-4 border border-line/70">
            <span className="text-[10px] font-semibold text-ink-subtle uppercase tracking-wider block flex items-center gap-1">
              <Building2 className="h-3 w-3 text-accent" />
              <span>Assigned Department</span>
            </span>
            <span className="font-sans font-bold text-ink block text-sm pt-1 truncate">
              {staff.department_name || "Unassigned"}
            </span>
          </div>

          {/* Position Card */}
          <div className="space-y-1.5 rounded-xl bg-inset p-4 border border-line/70">
            <span className="text-[10px] font-semibold text-ink-subtle uppercase tracking-wider block flex items-center gap-1">
              <Briefcase className="h-3 w-3 text-accent" />
              <span>Job Title / Position</span>
            </span>
            <span className="font-sans font-bold text-ink block text-sm pt-1 truncate">
              {staff.position || "—"}
            </span>
          </div>

          {/* Joined Date Card */}
          <div className="space-y-1.5 rounded-xl bg-inset p-4 border border-line/70">
            <span className="text-[10px] font-semibold text-ink-subtle uppercase tracking-wider block flex items-center gap-1">
              <Calendar className="h-3 w-3 text-accent" />
              <span>Date Joined</span>
            </span>
            <span className="font-mono font-bold text-ink block text-sm pt-1">
              {staff.joined_on || "—"}
            </span>
          </div>
        </div>

        {/* Gender & Address Details */}
        <div className="space-y-4 pt-2 border-t border-line/40">
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-ink-subtle uppercase tracking-wider block">
              Gender
            </label>
            <div className="rounded-lg border border-line/70 bg-inset px-3.5 py-2.5 text-xs font-semibold text-ink capitalize w-full sm:w-1/2">
              {staff.gender || "Unspecified"}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-ink-subtle uppercase tracking-wider block flex items-center gap-1">
              <MapPin className="h-3 w-3 text-accent" />
              <span>Residential Address</span>
            </label>
            <div className="rounded-lg border border-line/70 bg-inset px-3.5 py-3 text-xs font-medium text-ink leading-relaxed">
              {staff.address || "No residential address added."}
            </div>
          </div>
        </div>
      </div>

      {/* Prefilled Edit Modal */}
      <StaffModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        staff={staff}
      />

      {/* Reset PIN Modal */}
      <ResetPinModal
        isOpen={isResetPinOpen}
        onClose={() => setIsResetPinOpen(false)}
        staff={staff}
      />

      {/* Deactivate Confirm Modal */}
      <ConfirmModal
        isOpen={isConfirmDeactivateOpen}
        onClose={() => setIsConfirmDeactivateOpen(false)}
        onConfirm={handleDeactivate}
        title={`Deactivate "${staff.name}"?`}
        description="Marking this staff member as resigned will deactivate their access token. Attendance records will be preserved."
        confirmText="Deactivate (Resigned)"
        cancelText="Cancel"
        variant="danger"
        icon={<Power className="h-5 w-5 text-rose-500 stroke-[2.5px]" />}
      />

      {/* Reactivate Confirm Modal */}
      <ConfirmModal
        isOpen={isConfirmActivateOpen}
        onClose={() => setIsConfirmActivateOpen(false)}
        onConfirm={handleActivate}
        title={`Reactivate "${staff.name}"?`}
        description="Reactivating this staff member will restore their PIN login access."
        confirmText="Reactivate Staff"
        cancelText="Cancel"
        variant="danger"
        icon={<RefreshCw className="h-5 w-5 text-emerald-500 stroke-[2.5px]" />}
      />
    </div>
  );
}
