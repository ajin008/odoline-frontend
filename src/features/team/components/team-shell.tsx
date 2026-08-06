/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useStaff } from "../hooks/use-staff";
import { StaffList } from "./staff-list";
import { StaffDetailView } from "./staff-detail-view";
import { TeamOverview } from "./team-overview";
import { StaffModal } from "./staff-modal";
import type { StaffMember } from "../types/staff-types";
import { BarChart3, CheckCircle2, UserX, UserPlus } from "lucide-react";

const TEAM_TABS = [
  { key: "overview", label: "Overview", icon: BarChart3 },
  { key: "active", label: "Active Staff", icon: CheckCircle2 },
  { key: "inactive", label: "Inactive Staff", icon: UserX },
] as const;

type TeamTabKey = (typeof TEAM_TABS)[number]["key"];

export function TeamShell() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabParam = searchParams.get("tab") as TeamTabKey | null;
  const initialTab: TeamTabKey =
    tabParam && TEAM_TABS.some((t) => t.key === tabParam)
      ? tabParam
      : "overview";

  const [activeTab, setActiveTab] = useState<TeamTabKey>(initialTab);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Fetch staff list for active tab
  const staffStatusFilter = activeTab === "inactive" ? "inactive" : "active";
  const { data: staffList = [], isLoading } = useStaff(staffStatusFilter);

  useEffect(() => {
    if (tabParam && TEAM_TABS.some((t) => t.key === tabParam)) {
      setActiveTab(tabParam);
      setSelectedStaff(null); // reset detail view on tab switch
    }
  }, [tabParam]);

  const handleTabChange = (key: TeamTabKey) => {
    setActiveTab(key);
    setSelectedStaff(null);
    router.replace(`/owner/team?tab=${key}`, { scroll: false });
  };

  return (
    <div className="w-full space-y-6 select-none font-sans max-w-5xl">
      {/* ------------------------------------------------------------- */}
      {/* TEAM HEADER & SUBTABS NAVIGATION (UX PATTERN MATCHING SETTINGS) */}
      {/* ------------------------------------------------------------- */}
      <div className="space-y-4 border-b border-line/40 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-ink font-sans">
            Team &amp; Attendance Hub
          </h1>
          <p className="mt-0.5 text-xs font-medium text-ink-muted">
            Manage dealership staff rosters, attendance logs, department assignments, and active staff profiles.
          </p>
        </div>

        {/* Subtabs Bar below heading */}
        <div className="flex gap-1 overflow-x-auto rounded-lg bg-inset p-1 border border-line/40 w-fit no-scrollbar">
          {TEAM_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={[
                  "flex items-center gap-2 rounded-md px-3.5 py-1.5 text-xs font-bold tracking-tight font-sans transition-all duration-200 cursor-pointer whitespace-nowrap",
                  isActive
                    ? "bg-accent text-inverse shadow-xs"
                    : "text-ink-muted hover:text-ink",
                ].join(" ")}
              >
                <Icon
                  className={`h-3.5 w-3.5 ${
                    isActive ? "stroke-[2.5px]" : "stroke-[2px]"
                  }`}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* ACTIVE SUBTAB CONTENT VIEW                                    */}
      {/* ------------------------------------------------------------- */}
      <div>
        {/* OVERVIEW SUBTAB */}
        {activeTab === "overview" && <TeamOverview />}

        {/* ACTIVE / INACTIVE STAFF SUBTABS */}
        {activeTab !== "overview" && (
          selectedStaff ? (
            /* In-Page Subtab Detail View */
            <StaffDetailView
              staff={selectedStaff}
              onBack={() => setSelectedStaff(null)}
            />
          ) : (
            /* Roster List View */
            <div className="space-y-4">
              {/* Add Staff Top Action Bar */}
              {activeTab === "active" && (
                <div className="flex justify-end pb-1">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-xs font-bold text-inverse hover:bg-accent-hover active:scale-[0.98] transition-all cursor-pointer shadow-xs"
                  >
                    <UserPlus className="h-4 w-4 stroke-[2.5px]" />
                    <span>Add Staff</span>
                  </button>
                </div>
              )}

              <StaffList
                staffList={staffList}
                isLoading={isLoading}
                emptyTitle={
                  activeTab === "active"
                    ? "No active staff members found"
                    : "No inactive staff members"
                }
                emptyDescription={
                  activeTab === "active"
                    ? "Add your sales executive team members to set up their PIN logins and department rosters."
                    : "Staff members marked as resigned will appear in this inactive list."
                }
                onSelectStaff={(staff) => setSelectedStaff(staff)}
                onAddClick={
                  activeTab === "active" ? () => setIsAddModalOpen(true) : undefined
                }
              />
            </div>
          )
        )}
      </div>

      {/* Add Staff Modal */}
      <StaffModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
