/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLeadActions } from "../hooks/use-lead-actions";
import { DatePicker } from "@/src/components/ui/date-picker";
import { parseISTDateTimeToUTC } from "@/src/lib/formatters";
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
  ChevronDown,
  Check,
  MessageCircle,
  PhoneCall,
  UserCheck,
  Camera,
  Car,
  Footprints,
  type LucideIcon,
} from "lucide-react";

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const SOURCE_CONFIG: Record<
  string,
  { label: string; icon: LucideIcon; colorBg: string; colorText: string }
> = {
  walk_in: {
    label: "Walk In",
    icon: Footprints,
    colorBg: "bg-purple-500/10",
    colorText: "text-purple-500",
  },
  whatsapp: {
    label: "WhatsApp",
    icon: MessageCircle,
    colorBg: "bg-emerald-500/10",
    colorText: "text-emerald-500",
  },
  phone: {
    label: "Phone Call",
    icon: PhoneCall,
    colorBg: "bg-blue-500/10",
    colorText: "text-blue-500",
  },
  referral: {
    label: "Referral",
    icon: UserCheck,
    colorBg: "bg-indigo-500/10",
    colorText: "text-indigo-500",
  },
  instagram: {
    label: "Instagram",
    icon: Camera,
    colorBg: "bg-pink-500/10",
    colorText: "text-pink-500",
  },
  olx: {
    label: "OLX",
    icon: Car,
    colorBg: "bg-amber-500/10",
    colorText: "text-amber-500",
  },
  other: {
    label: "Other",
    icon: Globe,
    colorBg: "bg-slate-500/10",
    colorText: "text-slate-500",
  },
};

const PRIORITY_CONFIG_MODAL: Record<
  string,
  { label: string; dotColor: string; textColor: string }
> = {
  very_hot: {
    label: "Very Hot",
    dotColor: "bg-red-500",
    textColor: "text-red-500",
  },
  hot: {
    label: "Hot",
    dotColor: "bg-amber-500",
    textColor: "text-amber-500",
  },
  warm: {
    label: "Warm",
    dotColor: "bg-yellow-500",
    textColor: "text-yellow-600 dark:text-yellow-400",
  },
  cold: {
    label: "Cold",
    dotColor: "bg-blue-500",
    textColor: "text-blue-500",
  },
};

function getSourceConfig(source: string | null | undefined) {
  if (source && Object.prototype.hasOwnProperty.call(SOURCE_CONFIG, source)) {
    return SOURCE_CONFIG[source as keyof typeof SOURCE_CONFIG];
  }
  return SOURCE_CONFIG.walk_in;
}

function getPriorityConfig(priority: string | null | undefined) {
  if (
    priority &&
    Object.prototype.hasOwnProperty.call(PRIORITY_CONFIG_MODAL, priority)
  ) {
    return PRIORITY_CONFIG_MODAL[
      priority as keyof typeof PRIORITY_CONFIG_MODAL
    ];
  }
  return PRIORITY_CONFIG_MODAL.warm;
}

function formatIndianNumber(value: string | null | undefined): string {
  if (!value) return "";
  const rawNum = value.replace(/[^0-9]/g, "");
  if (!rawNum) return "";
  const num = parseInt(rawNum, 10);
  if (isNaN(num)) return "";
  return num.toLocaleString("en-IN");
}

function parseRawNumber(value: string | null | undefined): string {
  if (!value) return "";
  return value.replace(/[^0-9]/g, "");
}

function getLakhText(value: string | null | undefined): string | null {
  const raw = parseRawNumber(value);
  if (!raw) return null;
  const num = parseInt(raw, 10);
  if (isNaN(num) || num <= 0) return null;

  if (num >= 10000000) {
    const crore = (num / 10000000).toFixed(2).replace(/\.00$/, "");
    return `₹${crore} Cr`;
  }
  if (num >= 100000) {
    const lakh = (num / 100000).toFixed(2).replace(/\.00$/, "");
    return `₹${lakh} Lakh`;
  }
  if (num >= 1000) {
    const k = (num / 1000).toFixed(1).replace(/\.0$/, "");
    return `₹${k}k`;
  }
  return `₹${num.toLocaleString("en-IN")}`;
}

export function LeadModal({ isOpen, onClose, onSuccess }: LeadModalProps) {
  const { createLead } = useLeadActions();

  // Custom Dropdown Open States
  const [isSourceOpen, setIsSourceOpen] = useState(false);
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [followUpTime, setFollowUpTime] = useState("10:00");

  const sourceRef = useRef<HTMLDivElement>(null);
  const priorityRef = useRef<HTMLDivElement>(null);

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
  const selectedPriority = useWatch({ control, name: "priority" });
  const selectedFollowUpDate =
    useWatch({ control, name: "first_follow_up_at" }) || "";
  const budgetMinRaw = useWatch({ control, name: "budget_min" }) || "";
  const budgetMaxRaw = useWatch({ control, name: "budget_max" }) || "";

  useEffect(() => {
    if (isOpen) {
      setFollowUpTime("10:00");
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

  // Outside click listener for custom dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sourceRef.current &&
        !sourceRef.current.contains(event.target as Node)
      ) {
        setIsSourceOpen(false);
      }
      if (
        priorityRef.current &&
        !priorityRef.current.contains(event.target as Node)
      ) {
        setIsPriorityOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const onSubmit = (data: CreateLeadFormData) => {
    let isoFollowUp: string | null = null;

    if (data.first_follow_up_at) {
      const parts = data.first_follow_up_at.split("T");
      const dateStr = parts[0];
      const timeStr = parts[1] || followUpTime || "10:00";
      if (dateStr) {
        isoFollowUp = parseISTDateTimeToUTC(dateStr, timeStr);
      }
    }

    const payload = {
      name: data.name,
      phone: data.phone,
      priority: data.priority,
      source: data.source,
      source_note: data.source === "other" ? data.source_note : null,
      budget_min: parseRawNumber(data.budget_min) || null,
      budget_max: parseRawNumber(data.budget_max) || null,
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

  const currentSourceConfig = getSourceConfig(selectedSource);
  const currentPriorityConfig = getPriorityConfig(selectedPriority);

  const SourceIcon = currentSourceConfig.icon;

  const minLakhBadge = getLakhText(budgetMinRaw);
  const maxLakhBadge = getLakhText(budgetMaxRaw);

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 pointer-events-auto"
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
                {/* Custom Priority Dropdown */}
                <div className="space-y-1 relative" ref={priorityRef}>
                  <label className="text-xs font-medium text-ink">
                    Lead Priority
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsPriorityOpen(!isPriorityOpen);
                      setIsSourceOpen(false);
                    }}
                    className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink flex items-center justify-between shadow-xs hover:border-accent transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${currentPriorityConfig.dotColor}`}
                      />
                      <span className="font-semibold text-xs">
                        {currentPriorityConfig.label}
                      </span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-ink-subtle" />
                  </button>

                  {isPriorityOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1 z-30 rounded-xl border border-line bg-card p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-150 space-y-0.5">
                      {LEAD_PRIORITY_OPTIONS.map((opt) => {
                        const isSelected = selectedPriority === opt.value;
                        const pConfig = getPriorityConfig(opt.value);

                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              setValue("priority", opt.value, {
                                shouldValidate: true,
                              });
                              setIsPriorityOpen(false);
                            }}
                            className={`w-full flex items-center justify-between rounded-lg px-2.5 py-2 text-xs transition-colors cursor-pointer ${
                              isSelected
                                ? "bg-accent/15 font-bold text-accent"
                                : "hover:bg-inset text-ink"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className={`h-2.5 w-2.5 rounded-full ${pConfig.dotColor}`}
                              />
                              <span>{opt.label}</span>
                            </div>
                            {isSelected && (
                              <Check className="h-3.5 w-3.5 text-accent" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Custom Rich Lead Source Dropdown */}
                <div className="space-y-1 relative" ref={sourceRef}>
                  <label className="text-xs font-medium text-ink flex items-center gap-1">
                    Lead Source <span className="text-danger">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSourceOpen(!isSourceOpen);
                      setIsPriorityOpen(false);
                    }}
                    className={`w-full rounded-lg border bg-surface px-3 py-2 text-sm text-ink flex items-center justify-between shadow-xs hover:border-accent transition-colors cursor-pointer ${
                      errors.source ? "border-danger" : "border-line"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-md ${currentSourceConfig.colorBg} ${currentSourceConfig.colorText}`}
                      >
                        <SourceIcon className="h-3.5 w-3.5" />
                      </div>
                      <span className="font-semibold text-xs">
                        {currentSourceConfig.label}
                      </span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-ink-subtle" />
                  </button>

                  {isSourceOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1 z-30 rounded-xl border border-line bg-card p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-150 space-y-0.5 max-h-56 overflow-y-auto">
                      {LEAD_SOURCE_OPTIONS.map((opt) => {
                        const isSelected = selectedSource === opt.value;
                        const srcConfig = getSourceConfig(opt.value);
                        const IconComponent = srcConfig.icon;

                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              setValue("source", opt.value, {
                                shouldValidate: true,
                              });
                              setIsSourceOpen(false);
                            }}
                            className={`w-full flex items-center justify-between rounded-lg px-2.5 py-2 text-xs transition-colors cursor-pointer ${
                              isSelected
                                ? "bg-accent/15 font-bold text-accent"
                                : "hover:bg-inset text-ink"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`flex h-6 w-6 items-center justify-center rounded-md ${srcConfig.colorBg} ${srcConfig.colorText}`}
                              >
                                <IconComponent className="h-3.5 w-3.5" />
                              </div>
                              <span>{opt.label}</span>
                            </div>
                            {isSelected && (
                              <Check className="h-3.5 w-3.5 text-accent" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

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
                {/* Min Budget (Formatted with Indian Comma Separator) */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-ink">
                      Min Budget (₹)
                    </label>
                    {minLakhBadge && (
                      <span className="text-[10px] font-bold font-mono text-accent bg-accent/10 px-1.5 py-0.2 rounded border border-accent/20">
                        {minLakhBadge}
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="e.g. 5,00,000"
                    value={formatIndianNumber(budgetMinRaw)}
                    onChange={(e) => {
                      const raw = parseRawNumber(e.target.value);
                      setValue("budget_min", raw, { shouldValidate: true });
                    }}
                    className={`w-full rounded-lg border bg-surface px-3 py-2 text-sm text-ink outline-none transition-colors font-mono ${
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

                {/* Max Budget (Formatted with Indian Comma Separator) */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-ink">
                      Max Budget (₹)
                    </label>
                    {maxLakhBadge && (
                      <span className="text-[10px] font-bold font-mono text-accent bg-accent/10 px-1.5 py-0.2 rounded border border-accent/20">
                        {maxLakhBadge}
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="e.g. 8,00,000"
                    value={formatIndianNumber(budgetMaxRaw)}
                    onChange={(e) => {
                      const raw = parseRawNumber(e.target.value);
                      setValue("budget_max", raw, { shouldValidate: true });
                    }}
                    className={`w-full rounded-lg border bg-surface px-3 py-2 text-sm text-ink outline-none transition-colors font-mono ${
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

              {/* First Follow Up Date & Time */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-ink flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5 text-ink-subtle" />
                    First Follow-up Date &amp; Time
                  </span>
                  <span className="text-[10px] text-ink-subtle font-mono">
                    (IST)
                  </span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <DatePicker
                    value={selectedFollowUpDate.split("T")[0] || ""}
                    onChange={(dateStr) => {
                      const curTime = followUpTime || "10:00";
                      setValue(
                        "first_follow_up_at",
                        dateStr ? `${dateStr}T${curTime}` : "",
                        {
                          shouldValidate: true,
                        }
                      );
                    }}
                    align="left"
                  />
                  <input
                    type="time"
                    value={followUpTime}
                    onChange={(e) => {
                      const timeVal = e.target.value || "10:00";
                      setFollowUpTime(timeVal);
                      const dateStr = selectedFollowUpDate.split("T")[0];
                      if (dateStr) {
                        setValue(
                          "first_follow_up_at",
                          `${dateStr}T${timeVal}`,
                          {
                            shouldValidate: true,
                          }
                        );
                      }
                    }}
                    className="w-full h-10 rounded-xl border border-line bg-inset px-3 py-2 text-xs font-semibold text-ink focus:border-accent focus:outline-none cursor-pointer font-mono"
                  />
                </div>
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
              className="rounded-xl border border-line bg-surface px-4 py-2 text-xs font-semibold text-ink hover:bg-hover transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createLead.isPending}
              className="flex items-center gap-2 rounded-xl bg-accent px-5 py-2 text-xs font-semibold text-inverse shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
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
