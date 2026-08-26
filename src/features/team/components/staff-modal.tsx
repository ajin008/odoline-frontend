/* eslint-disable react-hooks/incompatible-library */
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useDepartments } from "@/src/features/settings/hooks/use-departments";
import { useStaffActions } from "../hooks/use-staff-actions";
import type { StaffMember } from "../types/staff-types";
import { DatePicker } from "@/src/components/ui/date-picker";
import { FormSelect } from "@/src/components/ui/form-select";
import {
  X,
  UserPlus,
  UserCheck,
  AlertTriangle,
  Loader2,
  Calendar,
  Building2,
  Lock,
  Eye,
  EyeOff,
  UserCog,
} from "lucide-react";

const staffFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  pin: z.string().optional(),
  role: z.enum(["sales", "cro"]),
  gender: z.string().optional().nullable(),
  position: z.string().trim().max(100).optional().nullable(),
  department_id: z.string().optional().nullable(),
  joined_on: z.string().optional().nullable(),
  address: z.string().trim().optional().nullable(),
});

type StaffFormData = z.infer<typeof staffFormSchema>;

interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff?: StaffMember | null;
}

export function StaffModal({ isOpen, onClose, staff }: StaffModalProps) {
  const isEditing = Boolean(staff);
  const [showPin, setShowPin] = useState(false);
  const { data: departments = [], isLoading: isDeptLoading } =
    useDepartments("active");
  const { createStaff, updateStaff } = useStaffActions();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StaffFormData>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      pin: "",
      role: "sales",
      gender: "",
      position: "",
      department_id: "",
      joined_on: "",
      address: "",
    },
  });

  const joinedOnValue = watch("joined_on") || "";

  useEffect(() => {
    setShowPin(false);
    if (staff) {
      reset({
        name: staff.name,
        phone: staff.phone,
        pin: "",
        role: staff.role === "cro" ? "cro" : "sales",
        gender: staff.gender ?? "",
        position: staff.position ?? "",
        department_id: staff.department_id ?? "",
        joined_on: staff.joined_on ?? "",
        address: staff.address ?? "",
      });
    } else {
      reset({
        name: "",
        phone: "",
        pin: "",
        role: "sales",
        gender: "",
        position: "",
        department_id: "",
        joined_on: new Date().toISOString().split("T")[0],
        address: "",
      });
    }
  }, [staff, reset, isOpen]);

  if (!isOpen) return null;

  const isPending = createStaff.isPending || updateStaff.isPending;

  const onSubmit = (data: StaffFormData) => {
    if (!isEditing) {
      if (!data.pin || !/^\d{6}$/.test(data.pin)) {
        setError("pin", {
          type: "manual",
          message: "PIN must be exactly 6 numeric digits",
        });
        return;
      }
    }

    const payload = {
      name: data.name,
      phone: data.phone,
      role: data.role || "sales",
      gender: data.gender || null,
      position: data.position || null,
      department_id: data.department_id || null,
      joined_on: data.joined_on || null,
      address: data.address || null,
    };

    if (isEditing && staff) {
      updateStaff.mutate(
        { id: staff.id, payload },
        { onSuccess: () => onClose() }
      );
    } else {
      createStaff.mutate(
        { ...payload, pin: data.pin! },
        { onSuccess: () => onClose() }
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl rounded-2xl bg-card border border-line shadow-2xl overflow-hidden select-none font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-line px-6 py-4 bg-card">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-inverse shrink-0">
              {isEditing ? (
                <UserCheck className="h-4.5 w-4.5 stroke-[2.5px]" />
              ) : (
                <UserPlus className="h-4.5 w-4.5 stroke-[2.5px]" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-ink tracking-tight font-sans">
                {isEditing ? "Edit Staff Profile" : "Add Staff Member"}
              </h3>
              <p className="text-xs text-ink-subtle mt-0.5">
                {isEditing
                  ? "Update staff credentials, role, position, and department"
                  : "Create new staff login credentials, role, and profile details"}
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
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 space-y-4 max-h-[80vh] overflow-y-auto"
        >
          {/* Name & Phone Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink-muted block">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Rahul Sharma"
                {...register("name")}
                className="w-full rounded-lg border border-line bg-inset px-3.5 py-2.5 text-xs font-semibold text-ink focus:outline-none focus:border-accent"
              />
              {errors.name && (
                <p className="text-[11px] font-semibold text-rose-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Mobile Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink-muted block">
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-ink-subtle">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="9876543210"
                  {...register("phone")}
                  className="w-full rounded-lg border border-line bg-inset pl-11 pr-3.5 py-2.5 text-xs font-mono font-bold text-ink focus:outline-none focus:border-accent"
                />
              </div>
              {errors.phone && (
                <p className="text-[11px] font-semibold text-rose-500">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          {/* PIN Input (Only on Create mode) */}
          {!isEditing && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink-muted flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-accent" />
                <span>Assign 6-Digit PIN</span>{" "}
                <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPin ? "text" : "password"}
                  maxLength={6}
                  placeholder="e.g. 123456"
                  {...register("pin")}
                  className="w-full rounded-lg border border-line bg-inset pl-3.5 pr-10 py-2.5 text-xs font-mono font-bold text-ink tracking-widest focus:outline-none focus:border-accent"
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
              {errors.pin && (
                <p className="text-[11px] font-semibold text-rose-500">
                  {errors.pin.message}
                </p>
              )}
            </div>
          )}

          {/* Position & Gender Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Position / Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink-muted block">
                Position / Job Title
              </label>
              <input
                type="text"
                placeholder="e.g. Senior Sales Executive"
                {...register("position")}
                className="w-full rounded-lg border border-line bg-inset px-3.5 py-2.5 text-xs font-semibold text-ink focus:outline-none focus:border-accent"
              />
            </div>

            {/* Custom Gender Dropdown */}
            <FormSelect
              label="Gender"
              options={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
                { value: "other", label: "Other" },
              ]}
              placeholder="Select Gender"
              {...register("gender")}
              error={errors.gender?.message}
            />
          </div>

          {/* Role & Department Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Staff Role Selector */}
            <FormSelect
              label={
                <span className="flex items-center gap-1.5">
                  <UserCog className="h-3.5 w-3.5 text-accent" />
                  <span>Staff Role</span> <span className="text-rose-500">*</span>
                </span>
              }
              options={[
                { value: "sales", label: "Sales" },
                { value: "cro", label: "CRO — Customer Relations Officer" },
              ]}
              placeholder="Select Role"
              {...register("role")}
              error={errors.role?.message}
            />

            {/* Department Custom Dropdown (or Warning Alert if 0 Departments) */}
            <div className="space-y-1.5">
              {isDeptLoading ? (
                <div className="h-10 rounded-lg bg-inset border border-line animate-pulse" />
              ) : departments.length === 0 ? (
                <>
                  <label className="text-xs font-semibold text-ink-muted flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-accent" />
                    <span>Assigned Department</span>
                  </label>
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
                    <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-bold">No active departments found.</p>
                      <p className="text-[11px] text-amber-700 dark:text-amber-400">
                        Create showroom departments first in{" "}
                        <Link
                          href="/owner/settings?tab=department"
                          onClick={onClose}
                          className="underline font-bold hover:text-amber-900"
                        >
                          Settings → Department
                        </Link>
                        .
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <FormSelect
                  label={
                    <span className="flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-accent" />
                      <span>Assigned Department</span>
                    </span>
                  }
                  options={departments.map((dept) => ({
                    value: dept.id,
                    label: dept.name,
                  }))}
                  placeholder="No Department Assigned"
                  {...register("department_id")}
                  error={errors.department_id?.message}
                />
              )}
            </div>
          </div>

          {/* Date Joined Calendar Component */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink-muted flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-accent" />
              <span>Date Joined</span>
            </label>
            <DatePicker
              value={joinedOnValue}
              onChange={(dateStr) =>
                setValue("joined_on", dateStr, { shouldValidate: true })
              }
              align="left"
              fullWidth
              placeholder="Select date joined"
            />
          </div>

          {/* Address Textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink-muted block">
              Residential Address
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Door No. 42, MG Road, Kochi"
              {...register("address")}
              className="w-full rounded-lg border border-line bg-inset px-3.5 py-2 text-xs font-medium text-ink focus:outline-none focus:border-accent"
            />
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
              <span>
                {isEditing ? "Save Staff Profile" : "Create Staff User"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
