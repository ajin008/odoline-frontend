"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import type { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUpdateLead } from "../hooks/use-update-lead";
import type { Lead, LeadPriority, LeadSource } from "../types/lead-types";
import {
  X,
  Edit3,
  Loader2,
  Phone,
  User,
  Flame,
  Globe,
  IndianRupee,
  MessageSquare,
  AlertCircle,
} from "lucide-react";

const editLeadSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Customer name is required")
      .max(100, "Name cannot exceed 100 characters"),
    phone: z
      .string()
      .trim()
      .regex(/^\d{10}$/, "Phone must be a valid 10-digit number"),
    priority: z.enum(["very_hot", "hot", "warm", "cold"]),
    source: z.enum([
      "walk_in",
      "whatsapp",
      "phone",
      "referral",
      "instagram",
      "olx",
      "other",
    ]),
    source_note: z
      .string()
      .trim()
      .max(100, "source_note cannot exceed 100 characters")
      .optional()
      .nullable(),
    budget_min: z
      .string()
      .trim()
      .optional()
      .nullable()
      .refine(
        (val) => !val || (!isNaN(Number(val)) && Number(val) >= 0),
        "Invalid budget_min format"
      ),
    budget_max: z
      .string()
      .trim()
      .optional()
      .nullable()
      .refine(
        (val) => !val || (!isNaN(Number(val)) && Number(val) >= 0),
        "Invalid budget_max format"
      ),
    remark: z.string().trim().max(1000).optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (
      data.source === "other" &&
      (!data.source_note || !data.source_note.trim())
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "source_note is required when source is 'other'",
        path: ["source_note"],
      });
    }

    if (data.budget_min && data.budget_max) {
      const min = Number(data.budget_min);
      const max = Number(data.budget_max);
      if (!isNaN(min) && !isNaN(max) && min > max) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Minimum budget cannot exceed maximum budget",
          path: ["budget_max"],
        });
      }
    }
  });

type EditLeadFormData = z.infer<typeof editLeadSchema>;

interface EditLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead;
}

export function EditLeadModal({ isOpen, onClose, lead }: EditLeadModalProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const updateMutation = useUpdateLead(lead.id);

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setServerError(null);
    }
  }

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<EditLeadFormData>({
    resolver: zodResolver(editLeadSchema),
    defaultValues: {
      name: lead.customer?.name || "",
      phone: lead.customer?.phone || "",
      priority: lead.priority || "warm",
      source: lead.source || "walk_in",
      source_note: lead.source_note || "",
      budget_min: lead.budget_min || "",
      budget_max: lead.budget_max || "",
      remark: lead.remark || "",
    },
  });

  const selectedSource = useWatch({ control, name: "source" });

  useEffect(() => {
    if (isOpen && lead) {
      reset({
        name: lead.customer?.name || "",
        phone: lead.customer?.phone || "",
        priority: lead.priority || "warm",
        source: lead.source || "walk_in",
        source_note: lead.source_note || "",
        budget_min: lead.budget_min || "",
        budget_max: lead.budget_max || "",
        remark: lead.remark || "",
      });
    }
  }, [isOpen, lead, reset]);

  if (!isOpen) return null;

  const onSubmit = (data: EditLeadFormData) => {
    setServerError(null);

    updateMutation.mutate(
      {
        name: data.name,
        phone: data.phone,
        priority: data.priority as LeadPriority,
        source: data.source as LeadSource,
        source_note: data.source === "other" ? data.source_note : null,
        budget_min: data.budget_min?.trim() ? data.budget_min.trim() : null,
        budget_max: data.budget_max?.trim() ? data.budget_max.trim() : null,
        remark: data.remark?.trim() ? data.remark.trim() : null,
      },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (err: unknown) => {
          const axiosErr = err as AxiosError<{
            code?: string;
            message?: string;
            error?: { code?: string; message?: string };
          }>;
          const code =
            axiosErr?.response?.data?.error?.code ||
            axiosErr?.response?.data?.code;
          const msg =
            axiosErr?.response?.data?.error?.message ||
            axiosErr?.response?.data?.message ||
            axiosErr?.message;

          if (
            code === "PHONE_ALREADY_EXISTS" ||
            msg?.includes("already exists")
          ) {
            setServerError("A customer with this phone number already exists.");
          } else {
            setServerError(
              msg || "Failed to update lead details. Please try again."
            );
          }
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/40 backdrop-blur-xs animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Card Structure */}
      <div className="relative w-full max-w-lg bg-card border border-line rounded-2xl shadow-bento p-6 space-y-5 z-10 animate-in zoom-in-95 duration-200 font-sans select-none max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-line/50 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent shrink-0 border border-accent/25">
              <Edit3 className="h-5 w-5 stroke-[2.25px]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink font-sans tracking-tight">
                Edit Lead Details
              </h3>
              <p className="text-xs text-ink-subtle">
                Update customer contact info, priority, budget &amp; remarks
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

        {/* Server Error Alert */}
        {serverError && (
          <div className="flex items-center gap-2 rounded-xl border border-rose-500/25 bg-rose-500/10 p-3 text-xs font-semibold text-rose-600 dark:text-rose-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Customer Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-accent" />
                Customer Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                {...register("name")}
                placeholder="e.g. Rahul Sharma"
                className="w-full rounded-xl border border-line bg-card px-3.5 py-2 text-xs font-semibold text-ink placeholder:text-ink-subtle focus:border-accent focus:outline-hidden"
              />
              {errors.name && (
                <p className="text-[11px] font-semibold text-rose-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-accent" />
                Mobile Phone <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                maxLength={10}
                {...register("phone")}
                placeholder="10-digit number"
                className="w-full rounded-xl border border-line bg-card px-3.5 py-2 text-xs font-mono font-semibold text-ink placeholder:text-ink-subtle focus:border-accent focus:outline-hidden"
              />
              {errors.phone && (
                <p className="text-[11px] font-semibold text-rose-500">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          {/* Priority & Source */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink flex items-center gap-1.5">
                <Flame className="h-3.5 w-3.5 text-accent" />
                Lead Priority
              </label>
              <select
                {...register("priority")}
                className="w-full rounded-xl border border-line bg-card px-3 py-2 text-xs font-semibold text-ink focus:border-accent focus:outline-hidden cursor-pointer"
              >
                <option value="very_hot">Very Hot 🔥 (Highest)</option>
                <option value="hot">Hot ⚡ (High)</option>
                <option value="warm">Warm ☀️ (Medium)</option>
                <option value="cold">Cold ❄️ (Low)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-accent" />
                Enquiry Source
              </label>
              <select
                {...register("source")}
                className="w-full rounded-xl border border-line bg-card px-3 py-2 text-xs font-semibold text-ink focus:border-accent focus:outline-hidden cursor-pointer"
              >
                <option value="walk_in">Walk In</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="phone">Phone Call</option>
                <option value="referral">Referral</option>
                <option value="instagram">Instagram</option>
                <option value="olx">OLX</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Source Note (if Other selected) */}
          {selectedSource === "other" && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink">
                Source Details / Note <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                {...register("source_note")}
                placeholder="Specify source details (e.g. Newspaper Ad)"
                className="w-full rounded-xl border border-line bg-card px-3.5 py-2 text-xs font-semibold text-ink focus:border-accent focus:outline-hidden"
              />
              {errors.source_note && (
                <p className="text-[11px] font-semibold text-rose-500">
                  {errors.source_note.message}
                </p>
              )}
            </div>
          )}

          {/* Budget Range */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink flex items-center gap-1.5">
              <IndianRupee className="h-3.5 w-3.5 text-accent" />
              Budget Range (₹)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                {...register("budget_min")}
                placeholder="Min (e.g. 400000)"
                className="w-full rounded-xl border border-line bg-card px-3.5 py-2 text-xs font-mono font-semibold text-ink placeholder:text-ink-subtle focus:border-accent focus:outline-hidden"
              />
              <input
                type="text"
                {...register("budget_max")}
                placeholder="Max (e.g. 700000)"
                className="w-full rounded-xl border border-line bg-card px-3.5 py-2 text-xs font-mono font-semibold text-ink placeholder:text-ink-subtle focus:border-accent focus:outline-hidden"
              />
            </div>
            {errors.budget_max && (
              <p className="text-[11px] font-semibold text-rose-500">
                {errors.budget_max.message}
              </p>
            )}
          </div>

          {/* Remark / Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5 text-accent" />
              Initial Remark / Notes
            </label>
            <textarea
              rows={3}
              {...register("remark")}
              placeholder="Add customer requirements or preference details..."
              className="w-full rounded-xl border border-line bg-card px-3.5 py-2 text-xs font-medium text-ink placeholder:text-ink-subtle focus:border-accent focus:outline-hidden resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-line/50">
            <button
              type="button"
              onClick={onClose}
              disabled={updateMutation.isPending}
              className="rounded-xl border border-line bg-inset px-4 py-2 text-xs font-bold text-ink hover:bg-card transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-5 py-2 text-xs font-bold text-inverse hover:bg-accent-hover active:scale-95 transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Saving Changes…</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
