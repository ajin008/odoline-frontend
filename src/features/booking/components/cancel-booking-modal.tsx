/* eslint-disable react-hooks/incompatible-library */
"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Loader2, X, Info, IndianRupee } from "lucide-react";
import { CustomSelect } from "@/src/components/ui/custom-select";
import { useCancelBooking } from "../hooks/use-booking-actions";
import {
  createCancelBookingSchema,
  type CancelBookingFormValues,
} from "../schemas/booking-schemas";
import type { CancelReasonCode } from "../types/booking-types";

export interface CancelBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  bookingNumber: string;
  amountPaid: string; // the advance paid string
}

const REASON_OPTIONS: { value: CancelReasonCode; label: string }[] = [
  { value: "buyer_backed_out", label: "Buyer backed out" },
  { value: "loan_rejected", label: "Loan rejected" },
  { value: "found_another_car", label: "Found another car" },
  { value: "price_issue", label: "Price issue" },
  { value: "other", label: "Other" },
];

export function CancelBookingModal({
  isOpen,
  onClose,
  bookingId,
  bookingNumber,
  amountPaid,
}: CancelBookingModalProps) {
  const [mounted, setMounted] = useState(false);
  const cancelBookingMutation = useCancelBooking();

  const amountPaidNum = Number(amountPaid) || 0;
  const cancelSchema = createCancelBookingSchema(amountPaidNum);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<CancelBookingFormValues>({
    resolver: zodResolver(cancelSchema),
    defaultValues: {
      cancel_reason_code: "buyer_backed_out",
      cancel_reason_note: "",
      refund_amount: amountPaid,
    },
  });

  const selectedReason = watch("cancel_reason_code");
  const refundAmountInput = watch("refund_amount");

  // Calculate live retained amount
  const refundNum = Number(refundAmountInput);
  const isRefundValid =
    !isNaN(refundNum) && refundNum >= 0 && refundNum <= amountPaidNum;
  const retainedNum = isRefundValid
    ? Math.max(0, amountPaidNum - refundNum)
    : 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      reset({
        cancel_reason_code: "buyer_backed_out",
        cancel_reason_note: "",
        refund_amount: amountPaid,
      });
    }
  }, [isOpen, amountPaid, reset]);

  if (!isOpen || !mounted) return null;

  const onSubmit = (values: CancelBookingFormValues) => {
    cancelBookingMutation.mutate(
      {
        id: bookingId,
        payload: {
          cancel_reason_code: values.cancel_reason_code as CancelReasonCode,
          cancel_reason_note: values.cancel_reason_note?.trim() || undefined,
          refund_amount: values.refund_amount,
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const formatRupees = (num: number) => `₹${num.toLocaleString("en-IN")}`;

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 select-none font-sans">
      {/* Backdrop */}
      <div
        onClick={cancelBookingMutation.isPending ? undefined : onClose}
        className="fixed inset-0 bg-ink/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-line bg-card p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
        {/* Close Icon */}
        <button
          type="button"
          disabled={cancelBookingMutation.isPending}
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-ink-subtle hover:bg-inset hover:text-ink transition-all cursor-pointer disabled:opacity-50"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header Icon & Title */}
        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border bg-rose-500/10 text-rose-600 border-rose-500/20">
            <AlertTriangle className="h-5.5 w-5.5 stroke-[2.25px]" />
          </div>

          <div className="space-y-1 pt-0.5 min-w-0">
            <h3 className="text-base font-bold text-ink font-sans tracking-tight truncate">
              Cancel Booking <span className="font-mono">{bookingNumber}</span>
            </h3>
            <p className="text-xs font-medium text-rose-600 dark:text-rose-400 leading-relaxed bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
              Cancelling releases the car back to stock and marks the lead as
              lost. This cannot be undone.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Reason Code Dropdown */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-ink">
              Cancellation Reason <span className="text-rose-500">*</span>
            </label>
            <Controller
              name="cancel_reason_code"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  options={REASON_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select a reason"
                  className="w-full"
                  buttonClassName="w-full h-10 border-line text-xs font-medium"
                />
              )}
            />
            {errors.cancel_reason_code && (
              <p className="text-[11px] font-semibold text-rose-500">
                {errors.cancel_reason_code.message}
              </p>
            )}
          </div>

          {/* Reason Note */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-ink">
              Reason Note{" "}
              {selectedReason === "other" ? (
                <span className="text-rose-500">*</span>
              ) : (
                <span className="text-ink-subtle font-normal">(Optional)</span>
              )}
            </label>
            <input
              type="text"
              {...register("cancel_reason_note")}
              placeholder="Add a note…"
              className="w-full px-3 py-2 rounded-xl bg-inset border border-line text-xs text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
            />
            {errors.cancel_reason_note && (
              <p className="text-[11px] font-semibold text-rose-500">
                {errors.cancel_reason_note.message}
              </p>
            )}
          </div>

          {/* Refund Amount Input */}
          <div className="space-y-2 pt-1 border-t border-line/50">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-ink">
                Refund Amount (₹) <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] font-medium text-ink-subtle flex items-center gap-1">
                <Info className="h-3 w-3" />
                Advance paid: {formatRupees(amountPaidNum)}
              </span>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ink-subtle">
                <IndianRupee className="h-3.5 w-3.5" />
              </div>
              <input
                type="text"
                {...register("refund_amount")}
                placeholder="0"
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-inset border border-line text-xs font-mono font-bold text-ink focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
              />
            </div>
            {errors.refund_amount && (
              <p className="text-[11px] font-semibold text-rose-500">
                {errors.refund_amount.message}
              </p>
            )}

            {/* Live Retained Amount Readout */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-inset border border-line/60 text-xs">
              <span className="font-semibold text-ink-muted">
                Retained by showroom:
              </span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {formatRupees(retainedNum)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-3">
            <button
              type="button"
              disabled={cancelBookingMutation.isPending}
              onClick={onClose}
              className="w-full sm:w-auto h-10 inline-flex items-center justify-center rounded-xl border border-line bg-inset px-4 text-xs font-bold text-ink-muted hover:text-ink hover:bg-card transition-all cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={cancelBookingMutation.isPending}
              className="w-full sm:w-auto h-10 inline-flex items-center justify-center gap-2 rounded-xl px-5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              {cancelBookingMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin stroke-[2.5px]" />
              ) : (
                "Confirm Cancellation"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
