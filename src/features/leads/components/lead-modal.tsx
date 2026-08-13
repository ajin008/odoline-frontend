"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLeadActions } from "../hooks/use-lead-actions";
import { DatePicker } from "@/src/components/ui/date-picker";
import {
  createLeadFormSchema,
  LEAD_PRIORITY_OPTIONS,
  LEAD_SOURCE_OPTIONS,
  type CreateLeadFormData,
} from "../schemas/lead-schemas";
import {
  X,
  UserPlus,
  Loader2,
  Phone,
  User,
  Flame,
  Globe,
  IndianRupee,
  MessageSquare,
  CalendarDays,
} from "lucide-react";

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function LeadModal({ isOpen, onClose, onSuccess }: LeadModalProps) {
  const { createLead } = useLeadActions();

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<CreateLeadFormData>({
    resolver: zodResolver(createLeadFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      priority: "warm",
      source: "walk_in",
      source_note: "",
      budget_min: "",
      budget_max: "",
      remark: "",
      first_follow_up_at: "",
    },
  });

  const selectedSource = useWatch({ control, name: "source" });
  const selectedFollowUpDate = useWatch({ control, name: "first_follow_up_at" }) || "";

  useEffect(() => {
    if (isOpen) {
      reset({
        name: "",
        phone: "",
        priority: "warm",
        source: "walk_in",
        source_note: "",
        budget_min: "",
        budget_max: "",
        remark: "",
        first_follow_up_at: "",
      });
    }
  }, [isOpen, reset]);

  if (!isOpen) return null;

  const onSubmit = (data: CreateLeadFormData) => {
    let isoFollowUp: string | null = null;

    if (data.first_follow_up_at) {
      const dateStr = data.first_follow_up_at.split("T")[0];
      if (dateStr) {
        isoFollowUp = new Date(`${dateStr}T10:00:00.000Z`).toISOString();
      }
    }

    const payload = {
      name: data.name,
      phone: data.phone,
      priority: data.priority,
      source: data.source,
      source_note: data.source === "other" ? data.source_note : null,
      budget_min: data.budget_min || null,
      budget_max: data.budget_max || null,
      remark: data.remark || null,
      first_follow_up_at: isoFollowUp,
    };

    createLead.mutate(payload, {
      onSuccess: () => {
        reset();
        onClose();
        if (onSuccess) onSuccess();
      },
    });
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 pointer-events-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl rounded-xl bg-card border border-line shadow-2xl overflow-hidden font-sans max-h-[90vh] flex flex-col pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-line px-6 py-4 bg-card shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-inverse shrink-0">
              <UserPlus className="h-4.5 w-4.5 stroke-[2.5px]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-ink">Add New Lead</h2>
              <p className="text-xs text-ink-subtle">
                Enter buyer details to create a new customer lead
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-subtle hover:bg-hover hover:text-ink transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-130px)] touch-pan-y overscroll-contain">
            {/* Customer Details Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-muted flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-accent" />
                Customer Contact Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-ink flex items-center gap-1">
                    Customer Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rajesh Kumar"
                    {...register("name")}
                    className={`w-full rounded-lg border bg-surface px-3 py-2 text-sm text-ink outline-none transition-colors ${
                      errors.name
                        ? "border-danger focus:border-danger"
                        : "border-line focus:border-accent"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-[11px] text-danger font-medium">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-ink flex items-center gap-1">
                    Mobile Number <span className="text-danger">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-ink-subtle" />
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      maxLength={10}
                      {...register("phone")}
                      className={`w-full rounded-lg border bg-surface pl-9 pr-3 py-2 text-sm text-ink outline-none transition-colors ${
                        errors.phone
                          ? "border-danger focus:border-danger"
                          : "border-line focus:border-accent"
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-[11px] text-danger font-medium">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Classification Section */}
            <div className="space-y-3 pt-2 border-t border-line/60">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-muted flex items-center gap-1.5">
                <Flame className="h-3.5 w-3.5 text-accent" />
                Lead Classification &amp; Source
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Priority */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-ink">
                    Lead Priority
                  </label>
                  <select
                    {...register("priority")}
                    className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-accent"
                  >
                    {LEAD_PRIORITY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Source */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-ink flex items-center gap-1">
                    Lead Source <span className="text-danger">*</span>
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-2.5 h-4 w-4 text-ink-subtle" />
                    <select
                      {...register("source")}
                      className={`w-full rounded-lg border bg-surface pl-9 pr-3 py-2 text-sm text-ink outline-none transition-colors ${
                        errors.source
                          ? "border-danger focus:border-danger"
                          : "border-line focus:border-accent"
                      }`}
                    >
                      {LEAD_SOURCE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.source && (
                    <p className="text-[11px] text-danger font-medium">
                      {errors.source.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Conditional Source Note when source === "other" */}
              {selectedSource === "other" && (
                <div className="space-y-1 animate-in fade-in duration-200">
                  <label className="text-xs font-medium text-ink flex items-center gap-1">
                    Source Details <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Newspaper ad, Hoarding board..."
                    {...register("source_note")}
                    className={`w-full rounded-lg border bg-surface px-3 py-2 text-sm text-ink outline-none transition-colors ${
                      errors.source_note
                        ? "border-danger focus:border-danger"
                        : "border-line focus:border-accent"
                    }`}
                  />
                  {errors.source_note && (
                    <p className="text-[11px] text-danger font-medium">
                      {errors.source_note.message}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Budget & Schedule Section */}
            <div className="space-y-3 pt-2 border-t border-line/60">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-muted flex items-center gap-1.5">
                <IndianRupee className="h-3.5 w-3.5 text-accent" />
                Budget &amp; Follow-up Schedule
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Budget Min */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-ink">
                    Min Budget (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 500000"
                    {...register("budget_min")}
                    className={`w-full rounded-lg border bg-surface px-3 py-2 text-sm text-ink outline-none transition-colors ${
                      errors.budget_min
                        ? "border-danger focus:border-danger"
                        : "border-line focus:border-accent"
                    }`}
                  />
                  {errors.budget_min && (
                    <p className="text-[11px] text-danger font-medium">
                      {errors.budget_min.message}
                    </p>
                  )}
                </div>

                {/* Budget Max */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-ink">
                    Max Budget (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 800000"
                    {...register("budget_max")}
                    className={`w-full rounded-lg border bg-surface px-3 py-2 text-sm text-ink outline-none transition-colors ${
                      errors.budget_max
                        ? "border-danger focus:border-danger"
                        : "border-line focus:border-accent"
                    }`}
                  />
                  {errors.budget_max && (
                    <p className="text-[11px] text-danger font-medium">
                      {errors.budget_max.message}
                    </p>
                  )}
                </div>
              </div>

              {/* First Follow Up Date using existing DatePicker component */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-ink flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5 text-ink-subtle" />
                  First Follow-up Date
                </label>
                <DatePicker
                  value={selectedFollowUpDate.split("T")[0] || ""}
                  onChange={(dateStr) => {
                    setValue("first_follow_up_at", dateStr, {
                      shouldValidate: true,
                    });
                  }}
                  align="left"
                />
              </div>

              {/* Remark / Notes */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-ink flex items-center gap-1">
                  <MessageSquare className="h-3.5 w-3.5 text-ink-subtle" />
                  Initial Remark / Preferences
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Interested in automatic petrol SUV under 50k km..."
                  {...register("remark")}
                  className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-accent resize-none"
                />
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-line px-6 py-4 bg-card shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-line bg-surface px-4 py-2 text-xs font-semibold text-ink hover:bg-hover transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createLead.isPending}
              className="flex items-center gap-2 rounded-xl bg-accent px-5 py-2 text-xs font-semibold text-inverse shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {createLead.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin stroke-[2.5px]" />
                  Creating Lead...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 stroke-[2.5px]" />
                  Save Lead
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
