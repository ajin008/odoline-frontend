"use client";

import { useState } from "react";
import Image from "next/image";
import type { StaffMember } from "../types/staff-types";
import { useStaffActions } from "../hooks/use-staff-actions";
import { StaffModal } from "./staff-modal";
import { ResetPinModal } from "./reset-pin-modal";
import { ConfirmModal } from "@/src/components/ui/confirm-modal";
import {
  X,
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
} from "lucide-react";

interface StaffDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: StaffMember | null;
}

export function StaffDetailModal({
  isOpen,
  onClose,
  staff,
}: StaffDetailModalProps) {
  const { deactivateStaff, activateStaff } = useStaffActions();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isResetPinOpen, setIsResetPinOpen] = useState(false);
  const [isConfirmDeactivateOpen, setIsConfirmDeactivateOpen] = useState(false);
  const [isConfirmActivateOpen, setIsConfirmActivateOpen] = useState(false);

  if (!isOpen || !staff) return null;

  const handleDeactivate = () => {
    deactivateStaff.mutate(staff.id, {
      onSuccess: () => {
        setIsConfirmDeactivateOpen(false);
        onClose();
      },
    });
  };

  const handleActivate = () => {
    activateStaff.mutate(staff.id, {
      onSuccess: () => {
        setIsConfirmActivateOpen(false);
        onClose();
      },
    });
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-lg rounded-2xl bg-card border border-line shadow-2xl overflow-hidden select-none font-sans"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-line px-6 py-4 bg-card">
            <div className="flex items-center gap-3">
              {/* Avatar Photo or Fallback Placeholder */}
              <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 border border-accent/30 text-accent font-bold text-lg overflow-hidden shrink-0">
                {staff.photo_url ? (
                  <Image
                    src={staff.photo_url}
                    alt={staff.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <User className="h-6 w-6 stroke-[2.5px]" />
                )}
              </div>

              <div>
                <h3 className="text-base font-bold text-ink tracking-tight font-sans">
                  {staff.name}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-semibold text-ink-muted">
                    {staff.position || "Sales Staff"}
                  </span>
                  {staff.is_active ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                      <CheckCircle2 className="h-3 w-3 stroke-[2.5px]" />
                      <span>Active</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                      <AlertCircle className="h-3 w-3 stroke-[2.5px]" />
                      <span>Resigned</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-subtle hover:bg-inset hover:text-ink transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Profile Detail Content */}
          <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            {/* Quick Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              {/* Phone */}
              <div className="space-y-1.5 rounded-lg bg-inset p-3 border border-line/70">
                <span className="text-[10px] font-semibold text-ink-subtle uppercase tracking-wider block flex items-center gap-1">
                  <Phone className="h-3 w-3 text-accent" />
                  <span>Mobile Phone</span>
                </span>
                <div className="flex items-center justify-between gap-1.5">
                  <span className="font-mono font-bold text-ink text-[11px] truncate">
                    +91 {staff.phone}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <a
                      href={`tel:+91${staff.phone}`}
                      className="flex h-6 w-6 items-center justify-center rounded-md border border-line/70 bg-card hover:border-accent/40 hover:bg-inset transition-all cursor-pointer p-0.5"
                      title={`Call +91 ${staff.phone}`}
                    >
                      <Image
                        src="/icons/phonecall-icon.png"
                        alt="Call"
                        width={14}
                        height={14}
                        className="object-contain"
                      />
                    </a>
                    <a
                      href={`https://wa.me/91${staff.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-6 w-6 items-center justify-center rounded-md border border-line/70 bg-card hover:border-emerald-500/40 hover:bg-inset transition-all cursor-pointer p-0.5"
                      title={`WhatsApp chat +91 ${staff.phone}`}
                    >
                      <Image
                        src="/icons/whatsappIcon.png"
                        alt="WhatsApp"
                        width={14}
                        height={14}
                        className="object-contain"
                      />
                    </a>
                  </div>
                </div>
              </div>

              {/* Department */}
              <div className="space-y-1 rounded-lg bg-inset p-3 border border-line/70">
                <span className="text-[10px] font-semibold text-ink-subtle uppercase tracking-wider block flex items-center gap-1">
                  <Building2 className="h-3 w-3 text-accent" />
                  <span>Department</span>
                </span>
                <span className="font-sans font-bold text-ink block text-[11px] truncate">
                  {staff.department_name || "Unassigned"}
                </span>
              </div>

              {/* Position */}
              <div className="space-y-1 rounded-lg bg-inset p-3 border border-line/70">
                <span className="text-[10px] font-semibold text-ink-subtle uppercase tracking-wider block flex items-center gap-1">
                  <Briefcase className="h-3 w-3 text-accent" />
                  <span>Position</span>
                </span>
                <span className="font-sans font-bold text-ink block text-[11px] truncate">
                  {staff.position || "—"}
                </span>
              </div>

              {/* Joined Date */}
              <div className="space-y-1 rounded-lg bg-inset p-3 border border-line/70">
                <span className="text-[10px] font-semibold text-ink-subtle uppercase tracking-wider block flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-accent" />
                  <span>Joined Date</span>
                </span>
                <span className="font-mono font-bold text-ink block text-[11px]">
                  {staff.joined_on || "—"}
                </span>
              </div>
            </div>

            {/* Gender & Address */}
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-ink-subtle uppercase tracking-wider block">
                  Gender
                </label>
                <div className="rounded-lg border border-line/70 bg-inset px-3.5 py-2 text-xs font-semibold text-ink capitalize">
                  {staff.gender || "Unspecified"}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-ink-subtle uppercase tracking-wider block flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-accent" />
                  <span>Address</span>
                </label>
                <div className="rounded-lg border border-line/70 bg-inset px-3.5 py-2.5 text-xs font-medium text-ink leading-relaxed">
                  {staff.address || "No residential address added."}
                </div>
              </div>
            </div>

            {/* Actions Row */}
            <div className="pt-4 border-t border-line flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-inset px-3 py-1.5 text-xs font-bold text-ink hover:bg-card transition-all cursor-pointer"
                >
                  <Pencil className="h-3.5 w-3.5 stroke-[2px]" />
                  <span>Edit Profile</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsResetPinOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-accent/30 bg-accent/15 px-3 py-1.5 text-xs font-bold text-accent hover:bg-accent/25 transition-all cursor-pointer"
                >
                  <KeyRound className="h-3.5 w-3.5 stroke-[2.5px]" />
                  <span>Reset PIN</span>
                </button>
              </div>

              {staff.is_active ? (
                <button
                  type="button"
                  onClick={() => setIsConfirmDeactivateOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-500/20 transition-all cursor-pointer"
                >
                  <Power className="h-3.5 w-3.5 stroke-[2.5px]" />
                  <span>Deactivate (Resigned)</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsConfirmActivateOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-600 hover:bg-emerald-500/20 transition-all cursor-pointer"
                >
                  <RefreshCw className="h-3.5 w-3.5 stroke-[2.5px]" />
                  <span>Reactivate Staff</span>
                </button>
              )}
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
    </>
  );
}
