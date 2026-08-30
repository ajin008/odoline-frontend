"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  editAgreementSchema,
  type EditAgreementFormValues,
} from "../schemas/booking-schemas";
import { useEditAgreement } from "../hooks/use-booking-actions";
import type {
  BookingDetail,
  EditAgreementPayload,
} from "../types/booking-types";
import { X, Loader2, Info, Edit3 } from "lucide-react";

interface EditAgreementModalProps {
  booking: BookingDetail;
  isOpen: boolean;
  onClose: () => void;
}

function formatCurrency(amountStr: string | null | undefined): string {
  if (!amountStr) return "₹0";
  const num = Number(amountStr);
  if (isNaN(num)) return amountStr;
  return `₹${num.toLocaleString("en-IN")}`;
}

export function EditAgreementModal({
  booking,
  isOpen,
  onClose,
}: EditAgreementModalProps) {
  const editAgreementMutation = useEditAgreement();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditAgreementFormValues>({
    resolver: zodResolver(editAgreementSchema),
    defaultValues: {
      advance_receipt_no: booking.advance_receipt_no || "",
      advance_receipt_date: booking.advance_receipt_date || "",
      balance_due_days: booking.balance_due_days
        ? String(booking.balance_due_days)
        : "",
    },
  });

  useEffect(() => {
    if (isOpen && booking) {
      reset({
        advance_receipt_no: booking.advance_receipt_no || "",
        advance_receipt_date: booking.advance_receipt_date || "",
        balance_due_days: booking.balance_due_days
          ? String(booking.balance_due_days)
          : "",
      });
    }
  }, [isOpen, booking, reset]);

  if (!isOpen) return null;

  const onSubmit = (values: EditAgreementFormValues) => {
    const payload: EditAgreementPayload = {
      advance_receipt_no: values.advance_receipt_no?.trim() || null,
      advance_receipt_date: values.advance_receipt_date || null,
      balance_due_days: values.balance_due_days
        ? Number(values.balance_due_days)
        : null,
    };

    editAgreementMutation.mutate(
      { id: booking.id, payload },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const isPending = editAgreementMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 pointer-events-auto overflow-y-auto">
      <div className="w-full max-w-md my-8 rounded-2xl border border-line bg-card p-5 shadow-xl space-y-4 pointer-events-auto font-sans select-none animate-in fade-in duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <Edit3 className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-ink">
                Edit Agreement Details
              </h4>
              <span className="text-[11px] font-medium text-ink-subtle">
                Booking #{booking.booking_number}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="text-ink-subtle hover:text-ink transition-colors p-1 cursor-pointer rounded-lg hover:bg-hover disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Read-only Ledger Notice Box */}
        <div className="rounded-xl border border-line bg-inset/50 p-3.5 space-y-1.5 text-xs">
          <div className="flex items-center justify-between font-medium text-ink">
            <span>
              Advance Received:{" "}
              <strong className="font-mono text-emerald-600 dark:text-emerald-400">
                {formatCurrency(booking.amount_paid)}
              </strong>
            </span>
            <span className="text-[11px] text-ink-subtle font-mono">
              Agreed: {formatCurrency(booking.agreed_price)}
            </span>
          </div>
          <div className="flex items-start gap-1.5 text-[11px] text-ink-subtle leading-normal pt-1 border-t border-line/40">
            <Info className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" />
            <span>
              Advance payment amount &amp; method can&apos;t be edited (ledger
              money).
            </span>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Advance Receipt Reference No. */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-ink-muted">
              Advance Receipt No. (Rt No.)
            </label>
            <input
              type="text"
              placeholder="e.g. 62382372324234"
              {...register("advance_receipt_no")}
              disabled={isPending}
              className="w-full rounded-xl border border-line bg-inset p-3 text-xs text-ink focus:border-accent focus:outline-hidden font-mono"
            />
            {errors.advance_receipt_no && (
              <p className="text-[11px] text-danger font-medium">
                {errors.advance_receipt_no.message}
              </p>
            )}
          </div>

          {/* Receipt Date (dtd) */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-ink-muted">
              Receipt Date (dtd)
            </label>
            <input
              type="date"
              {...register("advance_receipt_date")}
              disabled={isPending}
              className="w-full rounded-xl border border-line bg-inset p-3 text-xs text-ink focus:border-accent focus:outline-hidden font-mono"
            />
            {errors.advance_receipt_date && (
              <p className="text-[11px] text-danger font-medium">
                {errors.advance_receipt_date.message}
              </p>
            )}
          </div>

          {/* Balance Deadline (Working Days) */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-ink-muted">
              Balance Deadline (Working Days)
            </label>
            <input
              type="number"
              placeholder="e.g. 20"
              {...register("balance_due_days")}
              disabled={isPending}
              className="w-full rounded-xl border border-line bg-inset p-3 text-xs text-ink focus:border-accent focus:outline-hidden font-mono"
            />
            {errors.balance_due_days && (
              <p className="text-[11px] text-danger font-medium">
                {errors.balance_due_days.message}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-line">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="rounded-xl border border-line bg-surface px-4 py-2 text-xs font-semibold text-ink hover:bg-hover transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-1.5 rounded-xl bg-accent text-inverse px-4 py-2 text-xs font-bold shadow-xs hover:opacity-95 transition-opacity cursor-pointer disabled:opacity-50"
            >
              {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Save Details</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
