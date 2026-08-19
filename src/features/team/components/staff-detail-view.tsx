"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import type { StaffMember } from "../types/staff-types";
import { useStaffActions } from "../hooks/use-staff-actions";
import { StaffModal } from "./staff-modal";
import { ResetPinModal } from "./reset-pin-modal";
import { StaffAttendanceHeatmap } from "./staff-attendance-heatmap";
import { ConfirmModal } from "@/src/components/ui/confirm-modal";
import { toast } from "sonner";
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
  Trash2,
  Copy,
  Check,
} from "lucide-react";

interface StaffDetailViewProps {
  staff: StaffMember;
  onBack: () => void;
}

export function StaffDetailView({ staff, onBack }: StaffDetailViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { deactivateStaff, activateStaff, updatePhoto, removePhoto } =
    useStaffActions();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isResetPinOpen, setIsResetPinOpen] = useState(false);
  const [isConfirmDeactivateOpen, setIsConfirmDeactivateOpen] = useState(false);
  const [isConfirmActivateOpen, setIsConfirmActivateOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyPhone = () => {
    if (!staff?.phone) return;
    const textToCopy = `+91${staff.phone}`;
    navigator.clipboard.writeText(textToCopy);
    toast.success(`Copied ${textToCopy} to clipboard!`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
    <div className="space-y-5 select-none font-sans max-w-4xl">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Staff List</span>
        </button>

        <div className="flex items-center gap-2">
          {staff.is_active ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Active Staff</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>Resigned / Inactive</span>
            </span>
          )}
        </div>
      </div>

      {/* Staff Profile Main Header Card */}
      <div className="rounded-xl border border-line/60 bg-card p-5 sm:p-6 space-y-6">
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
                  !updatePhoto.isPending &&
                  !removePhoto.isPending &&
                  fileInputRef.current?.click()
                }
                className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 text-accent font-bold text-xl overflow-hidden shrink-0 cursor-pointer transition-all hover:opacity-90"
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
                  <User className="h-7 w-7 stroke-[2.5px]" />
                )}

                {/* Hover Camera Overlay / Upload Spinner */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  {updatePhoto.isPending || removePhoto.isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Camera className="h-5 w-5 stroke-[2.5px]" />
                  )}
                </div>
              </div>

              {/* Quick Remove Trash Icon Badge */}
              {staff.photo_url && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removePhoto.mutate(staff.id);
                  }}
                  disabled={removePhoto.isPending || updatePhoto.isPending}
                  className="absolute -top-1 -right-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-white shadow-md hover:bg-rose-700 transition-all cursor-pointer disabled:opacity-50"
                  title="Remove staff profile photo"
                >
                  <Trash2 className="h-3 w-3 stroke-[2.5px]" />
                </button>
              )}
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-bold text-ink tracking-tight font-sans">
                {staff.name}
              </h2>
              <div className="flex items-center gap-2 text-xs text-ink-muted flex-wrap">
                <span className="inline-flex items-center gap-1 font-medium bg-inset border border-line/60 px-2 py-0.5 rounded-md">
                  <Briefcase className="h-3 w-3 text-accent shrink-0" />
                  <span>{staff.position || "Sales Executive"}</span>
                </span>
                <span className="inline-flex items-center gap-1 font-medium bg-inset border border-line/60 px-2 py-0.5 rounded-md">
                  <Building2 className="h-3 w-3 text-accent shrink-0" />
                  <span>{staff.department_name || "Unassigned"}</span>
                </span>
              </div>

              {staff.photo_url && (
                <div className="pt-0.5">
                  <button
                    type="button"
                    onClick={() => removePhoto.mutate(staff.id)}
                    disabled={removePhoto.isPending || updatePhoto.isPending}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-500 hover:text-rose-600 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {removePhoto.isPending ? (
                      <Loader2 className="h-3 w-3 animate-spin text-rose-500" />
                    ) : (
                      <Trash2 className="h-3 w-3 stroke-[2.5px]" />
                    )}
                    <span>Remove profile photo</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Restrained SaaS Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setIsEditOpen(true)}
              className="h-8.5 px-3 rounded-xl border border-line/60 bg-surface hover:border-line text-ink text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Pencil className="h-3.5 w-3.5" />
              <span>Edit Profile</span>
            </button>

            <button
              type="button"
              onClick={() => setIsResetPinOpen(true)}
              className="h-8.5 px-3 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <KeyRound className="h-3.5 w-3.5" />
              <span>Reset PIN</span>
            </button>

            {staff.is_active ? (
              <button
                type="button"
                onClick={() => setIsConfirmDeactivateOpen(true)}
                className="h-8.5 px-3 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Power className="h-3.5 w-3.5" />
                <span>Deactivate</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsConfirmActivateOpen(true)}
                className="h-8.5 px-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Reactivate</span>
              </button>
            )}
          </div>
        </div>

        {/* Unified Profile Details Grid */}
        <div className="space-y-4">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-ink-subtle pb-2 border-b border-line/40">
            Staff Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            {/* Mobile Phone Field */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-subtle flex items-center gap-1">
                <Phone className="h-3 w-3 text-accent shrink-0" />
                <span>Mobile Phone</span>
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono font-bold text-ink text-sm">
                  +91 {staff.phone}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleCopyPhone}
                    className="h-7 px-2 text-[11px] rounded-lg border border-line/60 bg-surface hover:border-line text-ink-muted hover:text-ink font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    title={`Copy +91 ${staff.phone}`}
                  >
                    {copied ? (
                      <Check className="h-3 w-3 text-emerald-500" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>

                  <a
                    href={`tel:+91${staff.phone}`}
                    className="h-7 px-2 text-[11px] rounded-lg border border-line/60 bg-surface hover:border-line text-ink-muted hover:text-ink font-semibold flex items-center gap-1 transition-colors"
                    title={`Call +91 ${staff.phone}`}
                  >
                    <Image
                      src="/icons/phonecall-icon.png"
                      alt="Call"
                      width={12}
                      height={12}
                      className="object-contain shrink-0"
                    />
                    <span>Call</span>
                  </a>

                  <a
                    href={`https://wa.me/91${staff.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-7 px-2 text-[11px] rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 font-semibold flex items-center gap-1 transition-colors"
                    title={`WhatsApp chat +91 ${staff.phone}`}
                  >
                    <Image
                      src="/icons/whatsappIcon.png"
                      alt="WhatsApp"
                      width={12}
                      height={12}
                      className="object-contain shrink-0"
                    />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Assigned Department Field */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-subtle flex items-center gap-1">
                <Building2 className="h-3 w-3 text-accent shrink-0" />
                <span>Assigned Department</span>
              </span>
              <p className="text-sm font-semibold text-ink">
                {staff.department_name || "Unassigned"}
              </p>
            </div>

            {/* Job Title Field */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-subtle flex items-center gap-1">
                <Briefcase className="h-3 w-3 text-accent shrink-0" />
                <span>Job Title / Position</span>
              </span>
              <p className="text-sm font-semibold text-ink">
                {staff.position || "—"}
              </p>
            </div>

            {/* Date Joined Field */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-subtle flex items-center gap-1">
                <Calendar className="h-3 w-3 text-accent shrink-0" />
                <span>Date Joined</span>
              </span>
              <p className="text-sm font-mono font-semibold text-ink">
                {staff.joined_on || "—"}
              </p>
            </div>

            {/* Gender Field */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-subtle block">
                Gender
              </span>
              <p className="text-sm font-semibold text-ink capitalize">
                {staff.gender || "Unspecified"}
              </p>
            </div>

            {/* Residential Address Field */}
            <div className="space-y-1 sm:col-span-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-subtle flex items-center gap-1">
                <MapPin className="h-3 w-3 text-accent shrink-0" />
                <span>Residential Address</span>
              </span>
              <p className="text-xs font-medium text-ink leading-relaxed">
                {staff.address || "No residential address added."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Per-Staff Monthly Attendance Heatmap */}
      <StaffAttendanceHeatmap staffId={staff.id} />

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
