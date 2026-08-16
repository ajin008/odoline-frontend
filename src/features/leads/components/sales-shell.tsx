/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { OwnerFunnelDashboard } from "./owner-funnel-dashboard";
import { UnassignedLeadsQueue } from "./unassigned-leads-queue";
import { LeadList } from "./lead-list";
import { useUnassignedLeads } from "../hooks/use-unassigned-leads";
import { Filter, UserCheck, Users } from "lucide-react";

const SALES_TABS = [
  { key: "overview", label: "Overview", icon: Filter },
  { key: "all", label: "All Leads", icon: Users },
  { key: "unassigned", label: "Unassigned", icon: UserCheck },
] as const;

type SalesTabKey = (typeof SALES_TABS)[number]["key"];

export function SalesShell() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { data: unassignedLeads = [] } = useUnassignedLeads();
  const unassignedCount = unassignedLeads.length;

  const tabParam = searchParams.get("tab") as SalesTabKey | null;
  const initialTab: SalesTabKey =
    tabParam && SALES_TABS.some((t) => t.key === tabParam)
      ? tabParam
      : "overview";

  const [activeTab, setActiveTab] = useState<SalesTabKey>(initialTab);

  useEffect(() => {
    if (tabParam && SALES_TABS.some((t) => t.key === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (key: SalesTabKey) => {
    setActiveTab(key);
    router.replace(`/owner/sales?tab=${key}`, { scroll: false });
  };

  return (
    <div className="w-full space-y-4 select-none font-sans max-w-6xl">
      {/* ------------------------------------------------------------- */}
      {/* SALES HEADER & SUBTABS NAVIGATION                             */}
      {/* ------------------------------------------------------------- */}
      <div className="sticky -top-4 z-20 bg-card/95 backdrop-blur-md -mx-4 sm:-mx-6 px-4 sm:px-6 pt-1 sm:pt-2 pb-3 border-b border-line/40 space-y-2.5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-ink font-sans">
            Sales &amp; CRM Pipeline
          </h1>
          <p className="mt-0.5 text-xs font-medium text-ink-muted">
            Track dealership-wide lead conversion metrics, sales stage breakdown, and unassigned lead queues.
          </p>
        </div>

        {/* Subtabs Bar below heading */}
        <div className="flex h-9 items-center gap-1 overflow-x-auto rounded-lg bg-inset p-1 border border-line/40 w-full sm:w-fit no-scrollbar shrink-0">
          {SALES_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={[
                  "flex-1 sm:flex-initial h-full text-center rounded-md px-3 sm:px-4 flex items-center justify-center gap-1.5 sm:gap-2 text-xs font-bold tracking-tight font-sans transition-all duration-200 cursor-pointer whitespace-nowrap",
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
                {tab.key === "unassigned" && unassignedCount > 0 && (
                  <span
                    className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold transition-colors ${
                      isActive
                        ? "bg-inverse/20 text-inverse"
                        : "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {unassignedCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* ACTIVE SUBTAB CONTENT VIEW                                    */}
      {/* ------------------------------------------------------------- */}
      <div className="pt-0.5">
        {/* OVERVIEW SUBTAB: Render Existing CRM Funnel & Conversion Dashboard */}
        {activeTab === "overview" && <OwnerFunnelDashboard />}

        {activeTab === "all" && (
          <LeadList
            showStaffFilter={true}
            showAssignedRep={true}
            baseHref="/owner/sales/leads"
          />
        )}

        {/* UNASSIGNED SUBTAB: Unassigned Lead Reassignment Queue */}
        {activeTab === "unassigned" && <UnassignedLeadsQueue />}
      </div>
    </div>
  );
}
