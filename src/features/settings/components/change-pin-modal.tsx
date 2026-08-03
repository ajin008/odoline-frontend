"use client";

import { useState } from "react";
import { useChangePin } from "@/src/features/auth/hooks/use-change-pin";
import { KeyRound, X, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface ChangePinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChangePinModal({ isOpen, onClose }: ChangePinModalProps) {
  const changePinMutation = useChangePin();

  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmNewPin, setConfirmNewPin] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation 1: Length & format
    if (!/^\d{6}$/.test(currentPin)) {
      setErrorMsg("Current PIN must be 6 digits.");
      return;
    }
    if (!/^\d{6}$/.test(newPin)) {
      setErrorMsg("New PIN must be 6 digits.");
      return;
    }

    // Validation 2: New PIN mismatch
    if (newPin !== confirmNewPin) {
      setErrorMsg("New PIN and Confirm PIN do not match.");
      return;
    }

    // Validation 3: Same PIN check
    if (currentPin === newPin) {
      setErrorMsg("New PIN must be different from your current PIN.");
      return;
    }

    try {
      await changePinMutation.mutateAsync({
        current_pin: currentPin,
        new_pin: newPin,
      });

      toast.success("Security PIN changed successfully!");
      setCurrentPin("");
      setNewPin("");
      setConfirmNewPin("");
      onClose();
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      const msg =
        axiosError.response?.data?.message ||
        "Failed to change PIN. Please check current PIN.";
      setErrorMsg(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-xs select-none font-sans animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md bg-card border border-line/40 rounded-xl p-5 sm:p-6 shadow-bento space-y-5 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line/40 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-inverse shadow-xs">
              <KeyRound className="h-4 w-4 stroke-[2.5px]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink tracking-tight font-sans">
                Change Security PIN
              </h3>
              <p className="text-[11px] text-ink-subtle">
                Update your 6-digit owner terminal authentication PIN
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-line/40 bg-inset text-ink-subtle hover:text-ink transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
            {errorMsg}
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current PIN */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink-muted">
              Current PIN
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                maxLength={6}
                value={currentPin}
                onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter current 6-digit PIN"
                className="w-full rounded-xl border border-line/40 bg-inset px-3.5 py-2.5 text-xs font-mono tracking-widest text-ink focus:outline-none focus:border-accent"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink cursor-pointer"
              >
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* New PIN */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink-muted">
              New PIN
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                maxLength={6}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter new 6-digit PIN"
                className="w-full rounded-xl border border-line/40 bg-inset px-3.5 py-2.5 text-xs font-mono tracking-widest text-ink focus:outline-none focus:border-accent"
                required
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink cursor-pointer"
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Confirm New PIN */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink-muted">
              Confirm New PIN
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                maxLength={6}
                value={confirmNewPin}
                onChange={(e) => setConfirmNewPin(e.target.value.replace(/\D/g, ""))}
                placeholder="Re-enter new 6-digit PIN"
                className="w-full rounded-xl border border-line/40 bg-inset px-3.5 py-2.5 text-xs font-mono tracking-widest text-ink focus:outline-none focus:border-accent"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink cursor-pointer"
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-line/40 bg-inset px-4 py-2 text-xs font-bold text-ink-muted hover:text-ink cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={changePinMutation.isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-xs font-bold text-inverse shadow-xs hover:bg-accent-hover transition-colors cursor-pointer disabled:opacity-50"
            >
              {changePinMutation.isPending ? (
                <span className="animate-spin h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full" />
              ) : (
                <ShieldCheck className="h-4 w-4 stroke-[2.5px]" />
              )}
              <span>Update PIN</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
