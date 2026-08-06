"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Layers, Clock, Calendar, Loader2 } from "lucide-react";
import type { Department } from "../types/department-types";
import { WEEKLY_HOLIDAY_LABELS } from "../types/department-types";
import { useDepartmentActions } from "../hooks/use-department-actions";

const departmentFormSchema = z
  .object({
    name: z.string().trim().min(1, "Department name is required").max(100),
    shift_start: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Enter valid start time (HH:MM)"),
    shift_end: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Enter valid end time (HH:MM)"),
    weekly_holiday: z.number().int().min(0).max(6),
  })
  .refine(
    (data) => {
      const [startH, startM] = data.shift_start.split(":").map(Number);
      const [endH, endM] = data.shift_end.split(":").map(Number);
      return endH * 60 + endM > startH * 60 + startM;
    },
    {
      message: "Shift end time must be after shift start time",
      path: ["shift_end"],
    }
  );

type DepartmentFormData = z.infer<typeof departmentFormSchema>;

interface DepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  department?: Department | null;
}

export function DepartmentModal({
  isOpen,
  onClose,
  department,
}: DepartmentModalProps) {
  const isEditing = Boolean(department);
  const { createDepartment, updateDepartment } = useDepartmentActions();

  const formatTimeInput = (timeStr?: string) => (timeStr ? timeStr.slice(0, 5) : "");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentFormSchema),
    defaultValues: {
      name: "",
      shift_start: "09:00",
      shift_end: "18:00",
      weekly_holiday: 0,
    },
  });

  useEffect(() => {
    if (department) {
      reset({
        name: department.name,
        shift_start: formatTimeInput(department.shift_start),
        shift_end: formatTimeInput(department.shift_end),
        weekly_holiday: department.weekly_holiday,
      });
    } else {
      reset({
        name: "",
        shift_start: "09:00",
        shift_end: "18:00",
        weekly_holiday: 0,
      });
    }
  }, [department, reset, isOpen]);

  if (!isOpen) return null;

  const isPending =
    createDepartment.isPending || updateDepartment.isPending;

  const onSubmit = (data: DepartmentFormData) => {
    if (isEditing && department) {
      updateDepartment.mutate(
        { id: department.id, payload: data },
        { onSuccess: () => onClose() }
      );
    } else {
      createDepartment.mutate(data, { onSuccess: () => onClose() });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl bg-card border border-line shadow-2xl overflow-hidden select-none font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-line px-6 py-4 bg-card">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-inverse shrink-0">
              <Layers className="h-4.5 w-4.5 stroke-[2.5px]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink tracking-tight font-sans">
                {isEditing ? "Edit Department" : "Add New Department"}
              </h3>
              <p className="text-xs text-ink-subtle mt-0.5">
                Set department name, shift timings, and weekly holiday
              </p>
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Department Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink-muted block">
              Department Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Sales, Workshop Refurbishment, Accounts"
              {...register("name")}
              className="w-full rounded-lg border border-line bg-inset px-3.5 py-2.5 text-xs font-semibold text-ink focus:outline-none focus:border-accent"
            />
            {errors.name && (
              <p className="text-[11px] font-semibold text-rose-500">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Shift Timing Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Shift Start */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink-muted flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-ink-subtle" />
                <span>Shift Start Time</span> <span className="text-rose-500">*</span>
              </label>
              <input
                type="time"
                {...register("shift_start")}
                className="w-full rounded-lg border border-line bg-inset px-3.5 py-2 text-xs font-mono font-bold text-ink focus:outline-none focus:border-accent"
              />
              {errors.shift_start && (
                <p className="text-[11px] font-semibold text-rose-500">
                  {errors.shift_start.message}
                </p>
              )}
            </div>

            {/* Shift End */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink-muted flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-ink-subtle" />
                <span>Shift End Time</span> <span className="text-rose-500">*</span>
              </label>
              <input
                type="time"
                {...register("shift_end")}
                className="w-full rounded-lg border border-line bg-inset px-3.5 py-2 text-xs font-mono font-bold text-ink focus:outline-none focus:border-accent"
              />
              {errors.shift_end && (
                <p className="text-[11px] font-semibold text-rose-500">
                  {errors.shift_end.message}
                </p>
              )}
            </div>
          </div>

          {/* Weekly Holiday Select */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink-muted flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-ink-subtle" />
              <span>Weekly Holiday</span> <span className="text-rose-500">*</span>
            </label>
            <select
              {...register("weekly_holiday", { valueAsNumber: true })}
              className="w-full rounded-lg border border-line bg-inset px-3.5 py-2.5 text-xs font-bold text-ink focus:outline-none focus:border-accent"
            >
              {Object.entries(WEEKLY_HOLIDAY_LABELS).map(([val, label]) => (
                <option key={val} value={val}>
                  {label}
                </option>
              ))}
            </select>
            {errors.weekly_holiday && (
              <p className="text-[11px] font-semibold text-rose-500">
                {errors.weekly_holiday.message}
              </p>
            )}
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-line flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-line bg-inset px-4 py-2 text-xs font-bold text-ink-muted hover:text-ink hover:bg-card transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2 text-xs font-bold text-inverse hover:bg-accent-hover active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
            >
              {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>{isEditing ? "Save Changes" : "Create Department"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
