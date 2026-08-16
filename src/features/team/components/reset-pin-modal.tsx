"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, KeyRound, Loader2, Eye, EyeOff } from "lucide-react";
import type { StaffMember } from "../types/staff-types";
import { useStaffActions } from "../hooks/use-staff-actions";

const resetPinFormSchema = z.object({
  new_pin: z
    .string()
    .regex(/^\d{6}$/, "PIN must be exactly 6 numeric digits"),
});

type ResetPinFormData = z.infer<typeof resetPinFormSchema>;

interface ResetPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: StaffMember | null;
}

export function ResetPinModal({
  isOpen,
  onClose,
  staff,
}: ResetPinModalProps) {
  const [showPin, setShowPin] = useState(false);
  const { resetPin } = useStaffActions();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResetPinFormData>({
    resolver: zodResolver(resetPinFormSchema),
    defaultValues: { new_pin: "" },
  });

  if (!isOpen || !staff) return null;

  const onSubmit = (data: ResetPinFormData) => {
    resetPin.mutate(
      { id: staff.id, payload: data },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
      }
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl bg-card border border-line shadow-2xl overflow-hidden select-none font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-line px-5 py-4 bg-card">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15 text-accent border border-accent/30 shrink-0">
              <KeyRound className="h-4 w-4 stroke-[2.5px]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink tracking-tight font-sans">
                Reset PIN
              </h3>
              <p className="text-[11px] text-ink-subtle truncate max-w-[180px]">
                {staff.name} ({staff.phone})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-ink-subtle hover:bg-inset hover:text-ink transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink-muted block">
              New 6-Digit PIN <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPin ? "text" : "password"}
                maxLength={6}
                placeholder="e.g. 123456"
                {...register("new_pin")}
                className="w-full rounded-lg border border-line bg-inset pl-3.5 pr-10 py-2 text-xs font-mono font-bold text-ink tracking-widest text-center focus:outline-none focus:border-accent"
              />
              <button
                type="button"
                onClick={() => setShowPin((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink transition-colors cursor-pointer p-1 rounded-md hover:bg-card/60 flex items-center justify-center"
                title={showPin ? "Hide PIN" : "Show PIN"}
                aria-label={showPin ? "Hide PIN" : "Show PIN"}
              >
                {showPin ? (
                  <EyeOff className="h-4 w-4 stroke-[2px]" />
                ) : (
                  <Eye className="h-4 w-4 stroke-[2px]" />
                )}
              </button>
            </div>
            {errors.new_pin && (
              <p className="text-[11px] font-semibold text-rose-500">
                {errors.new_pin.message}
              </p>
            )}
          </div>

          <div className="pt-3 border-t border-line flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-line bg-inset px-3.5 py-1.5 text-xs font-bold text-ink-muted hover:text-ink transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={resetPin.isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-1.5 text-xs font-bold text-inverse hover:bg-accent-hover transition-all cursor-pointer disabled:opacity-50"
            >
              {resetPin.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Save New PIN</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
