"use client";

import Image from "next/image";
import type { StaffMember } from "../types/staff-types";
import { User, Building2, Briefcase, ChevronRight, Users } from "lucide-react";

interface StaffListProps {
  staffList: StaffMember[];
  isLoading: boolean;
  emptyTitle: string;
  emptyDescription: string;
  onSelectStaff: (staff: StaffMember) => void;
  onAddClick?: () => void;
}

export function StaffList({
  staffList,
  isLoading,
  emptyTitle,
  emptyDescription,
  onSelectStaff,
  onAddClick,
}: StaffListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-20 rounded-xl bg-inset border border-line animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (staffList.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-line bg-inset p-8 text-center space-y-3">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-card border border-line text-ink-subtle">
          <Users className="h-6 w-6 stroke-[2px]" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-ink font-sans">{emptyTitle}</h3>
          <p className="text-xs text-ink-subtle max-w-sm mx-auto">
            {emptyDescription}
          </p>
        </div>
        {onAddClick && (
          <button
            type="button"
            onClick={onAddClick}
            className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-xs font-bold text-inverse hover:bg-accent-hover transition-all cursor-pointer mt-2"
          >
            <span>Add First Staff Member</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2.5 max-h-[68vh] overflow-y-auto pr-1 no-scrollbar select-none font-sans">
      {staffList.map((staff) => (
        <div
          key={staff.id}
          onClick={() => onSelectStaff(staff)}
          className="relative group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-line/90 bg-card hover:border-accent/40 hover:bg-card-hover shadow-bento transition-all cursor-pointer"
        >
          {/* Left: Avatar + Name + Position */}
          <div className="flex items-center gap-3.5 min-w-0 flex-1 pr-16 sm:pr-0">
            {/* Avatar Photo + Active Status Indicator Dot */}
            <div className="relative shrink-0">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 border border-accent/30 text-accent font-bold overflow-hidden">
                {staff.photo_url ? (
                  <Image
                    src={staff.photo_url}
                    alt={staff.name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <User className="h-5 w-5 stroke-[2.5px]" />
                )}
              </div>

              {/* Green dot indicator for active staff */}
              {staff.is_active && (
                <span
                  className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-card shadow-xs"
                  title="Active Staff Member"
                />
              )}
            </div>

            <div className="space-y-0.5 min-w-0">
              <h4 className="text-sm font-bold text-ink tracking-tight font-sans truncate group-hover:text-accent transition-colors">
                {staff.name}
              </h4>

              <div className="flex items-center gap-2 text-xs text-ink-muted">
                <span className="flex items-center gap-1">
                  <Briefcase className="h-3 w-3 text-ink-subtle" />
                  <span className="truncate">
                    {staff.position || "Sales Staff"}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Right: Active Badge (Desktop: after profile area) + Department Badge + Call & WhatsApp Actions */}
          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2.5 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-line/40 min-w-0">
            {/* Active / Inactive Badge (Top Right on Mobile, after profile area on Desktop) */}
            <div className="absolute top-3.5 right-3.5 sm:static shrink-0 z-10">
              {staff.is_active ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Active</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 rounded-md">
                  <span>Inactive</span>
                </span>
              )}
            </div>

            {/* Department Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-inset border border-line/70 text-[11px] font-bold text-ink-muted shrink-0">
              <Building2 className="h-3 w-3 text-accent shrink-0" />
              <span className="truncate max-w-[95px] sm:max-w-[110px]">
                {staff.department_name || "Unassigned"}
              </span>
            </div>

            {/* Call & WhatsApp Quick Action Buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Direct Phone Call Action */}
              <a
                href={`tel:+91${staff.phone}`}
                onClick={(e) => e.stopPropagation()}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-line/70 bg-inset hover:bg-card hover:border-accent/40 transition-all cursor-pointer overflow-hidden p-1.5"
                title={`Call +91 ${staff.phone}`}
              >
                <Image
                  src="/icons/phonecall-icon.png"
                  alt="Call"
                  width={18}
                  height={18}
                  className="object-contain"
                />
              </a>

              {/* WhatsApp Chat Action */}
              <a
                href={`https://wa.me/91${staff.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-line/70 bg-inset hover:bg-card hover:border-emerald-500/40 transition-all cursor-pointer overflow-hidden p-1.5"
                title={`WhatsApp chat +91 ${staff.phone}`}
              >
                <Image
                  src="/icons/whatsappIcon.png"
                  alt="WhatsApp"
                  width={18}
                  height={18}
                  className="object-contain"
                />
              </a>
            </div>

            <ChevronRight className="h-4 w-4 text-ink-subtle group-hover:text-accent group-hover:translate-x-0.5 transition-all hidden sm:block ml-1" />
          </div>
        </div>
      ))}
    </div>
  );
}
