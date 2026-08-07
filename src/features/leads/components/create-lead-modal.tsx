"use client";

import { X, UserPlus, Sparkles } from "lucide-react";

interface CreateLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateLeadModal({ isOpen, onClose }: CreateLeadModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Card Structure */}
      <div className="relative w-full max-w-md bg-card border border-line rounded-2xl shadow-bento p-6 space-y-5 z-10 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-line/40 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-light text-accent shrink-0">
              <UserPlus className="h-5 w-5 stroke-[2.25px]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink font-sans tracking-tight">
                Create New Lead
              </h3>
              <p className="text-xs text-ink-muted">
                Register customer enquiry &amp; contact details
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-subtle hover:bg-inset hover:text-ink transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Placeholder Structure */}
        <div className="space-y-4 py-2">
          <div className="rounded-xl border border-dashed border-line bg-inset p-5 text-center space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-accent text-xs font-bold font-sans">
              <Sparkles className="h-4 w-4" />
              <span>Lead Registration Form</span>
            </div>
            <p className="text-xs text-ink-subtle leading-relaxed">
              Form inputs for Customer Name, Mobile Number, Car Interest, and Budget range will be connected here.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-line bg-inset px-4 py-2.5 text-xs font-bold text-ink hover:bg-card transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-accent px-5 py-2.5 text-xs font-bold text-inverse hover:bg-accent-hover transition-colors cursor-pointer"
          >
            Save Lead (Placeholder)
          </button>
        </div>
      </div>
    </div>
  );
}
