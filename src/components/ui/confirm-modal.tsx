/* eslint-disable security/detect-object-injection */
// src/components/ui/confirm-modal.tsx
"use client";

import React from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
  icon,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const variantBadgeStyles = {
    danger: "bg-rose-500/10 text-rose-600 border-rose-500/20",
    warning: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    info: "bg-accent-light text-accent border-accent/20",
  };

  const variantButtonStyles = {
    danger: "bg-rose-600 hover:bg-rose-700 text-white",
    warning: "bg-amber-600 hover:bg-amber-700 text-white",
    info: "bg-accent hover:bg-accent-hover text-inverse",
  };

  return (
    <>
      {/* Backdrop Mask */}
      <div
        onClick={isLoading ? undefined : onClose}
        className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Dialog Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none font-sans">
        <div className="relative w-full max-w-md rounded-2xl border border-line bg-card p-6 shadow-bento space-y-5 animate-in zoom-in-95 duration-200">
          {/* Close Icon */}
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="absolute right-4 top-4 rounded-xl p-1.5 text-ink-subtle hover:bg-inset hover:text-ink transition-all cursor-pointer disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Header Icon & Title */}
          <div className="flex items-start gap-4">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${variantBadgeStyles[variant]}`}
            >
              {icon || (
                <AlertTriangle className="h-5.5 w-5.5 stroke-[2.25px]" />
              )}
            </div>

            <div className="space-y-1 pt-0.5">
              <h3 className="text-base font-bold text-ink font-heading tracking-tight">
                {title}
              </h3>
              <p className="text-xs font-medium text-ink-muted leading-relaxed">
                {description}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              disabled={isLoading}
              onClick={onClose}
              className="w-full sm:w-auto min-h-10.5 inline-flex items-center justify-center rounded-xl border border-line bg-inset px-4 py-2.5 text-xs font-bold text-ink-muted hover:text-ink hover:bg-card transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {cancelText}
            </button>

            <button
              type="button"
              disabled={isLoading}
              onClick={onConfirm}
              className={`w-full sm:w-auto min-h-10.5 min-w-28 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all active:scale-95 cursor-pointer disabled:opacity-50 ${variantButtonStyles[variant]}`}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin stroke-[2.5px]" />
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
