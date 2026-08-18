"use client";

import { useState, useEffect, useRef } from "react";
import { useDebounce } from "use-debounce";
import { useInfiniteLeads } from "../hooks/use-infinite-leads";
import { useStaff } from "@/src/features/team/hooks/use-staff";
import { LeadCard } from "./lead-card";
import type { LeadPriority } from "../types/lead-types";
import { CustomSelect } from "@/src/components/ui/custom-select";
import {
  Users,
  User,
  Loader2,
  AlertTriangle,
  Flame,
  CheckCircle2,
  XCircle,
  Filter,
  Search,
  X,
  ChevronDown,
  Check,
} from "lucide-react";

type LeadStatusTab = "active" | "won" | "lost";

const PRIORITY_OPTIONS: {
  label: string;
  value: LeadPriority | "all";
  dotColor?: string;
}[] = [
  { label: "All Priorities", value: "all" },
  { label: "Very Hot", value: "very_hot", dotColor: "bg-red-500" },
  { label: "Hot", value: "hot", dotColor: "bg-amber-500" },
  { label: "Warm", value: "warm", dotColor: "bg-yellow-500" },
  { label: "Cold", value: "cold", dotColor: "bg-blue-500" },
];

export interface LeadListProps {
  showStaffFilter?: boolean;
  showAssignedRep?: boolean;
  baseHref?: string;
}

export function LeadList({
  showStaffFilter = false,
  showAssignedRep = false,
  baseHref,
}: LeadListProps = {}) {
  const [activeTab, setActiveTab] = useState<LeadStatusTab>("active");
  const [selectedPriority, setSelectedPriority] = useState<
    LeadPriority | undefined
  >(undefined);
  const [selectedStaffId, setSelectedStaffId] = useState<string | undefined>(
    undefined
  );
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);
  const priorityDropdownRef = useRef<HTMLDivElement | null>(null);

  // Fetch active staff when staff filter is enabled
  const { data: staffList = [] } = useStaff("active");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        priorityDropdownRef.current &&
        !priorityDropdownRef.current.contains(event.target as Node)
      ) {
        setIsPriorityDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search input & 350ms debounced value via use-debounce
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch] = useDebounce(searchInput.trim(), 350);

  // When switching away from 'active' tab, clear priority filter
  const handleTabChange = (tab: LeadStatusTab) => {
    setActiveTab(tab);
    if (tab !== "active") {
      setSelectedPriority(undefined);
    }
  };

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteLeads({
    status: activeTab,
    priority: activeTab === "active" ? selectedPriority : undefined,
    search: debouncedSearch || undefined,
    assigned_to: selectedStaffId,
  });

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "400px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const leads = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="space-y-4 font-sans select-none">
      {/* 1. Header Control Section: Status Subtabs (Row 1) & Filters Bar (Row 2) */}
      <div className="space-y-3 border-b border-line/60 pb-3">
        {/* Row 1: Status Subtabs with Accent Color */}
        <div className="flex h-9 items-center gap-1 overflow-x-auto rounded-lg bg-inset p-1 border border-line/40 w-full sm:w-fit no-scrollbar shrink-0">
          <button
            type="button"
            onClick={() => handleTabChange("active")}
            className={`flex-1 sm:flex-initial h-full text-center rounded-md px-3 sm:px-4 flex items-center justify-center gap-1.5 sm:gap-2 text-xs font-bold tracking-tight transition-all duration-200 cursor-pointer whitespace-nowrap ${
              activeTab === "active"
                ? "bg-accent text-inverse shadow-xs font-bold"
                : "text-ink-muted hover:text-ink hover:bg-card/50 font-medium"
            }`}
          >
            <Flame className="h-3.5 w-3.5 shrink-0" />
            <span>Active Leads</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("won")}
            className={`flex-1 sm:flex-initial h-full text-center rounded-md px-3 sm:px-4 flex items-center justify-center gap-1.5 sm:gap-2 text-xs font-bold tracking-tight transition-all duration-200 cursor-pointer whitespace-nowrap ${
              activeTab === "won"
                ? "bg-emerald-600 text-white shadow-xs font-bold"
                : "text-ink-muted hover:text-ink hover:bg-card/50 font-medium"
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
            <span>Won Deals</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("lost")}
            className={`flex-1 sm:flex-initial h-full text-center rounded-md px-3 sm:px-4 flex items-center justify-center gap-1.5 sm:gap-2 text-xs font-bold tracking-tight transition-all duration-200 cursor-pointer whitespace-nowrap ${
              activeTab === "lost"
                ? "bg-rose-600 text-white shadow-xs font-bold"
                : "text-ink-muted hover:text-ink hover:bg-card/50 font-medium"
            }`}
          >
            <XCircle className="h-3.5 w-3.5 shrink-0" />
            <span>Lost Leads</span>
          </button>
        </div>

        {/* Row 2: Search Bar & Staff Filter & Priority Dropdown */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-0.5">
          {/* Debounced Search Bar */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-subtle pointer-events-none shrink-0" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search name or phone..."
              className="w-full h-8.5 rounded-xl border border-line/60 bg-surface pl-9 pr-8 text-xs text-ink outline-none transition-colors focus:border-accent placeholder:text-ink-subtle/60 font-medium"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink transition-colors cursor-pointer p-0.5"
                title="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Filters Group: Staff Filter & Priority Select Dropdown */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
            {/* Owner Staff Filter Dropdown */}
            {showStaffFilter && (
              <CustomSelect
                options={[
                  { value: "", label: "All staff" },
                  ...staffList.map((staff) => ({
                    value: staff.id,
                    label: staff.name,
                  })),
                ]}
                value={selectedStaffId || ""}
                onChange={(val) => setSelectedStaffId(val ? String(val) : undefined)}
                icon={<User className="h-3.5 w-3.5" />}
                className="w-full sm:w-44"
              />
            )}

            {/* Priority Select Dropdown (Active Tab Only) */}
            {activeTab === "active" && (
              <div ref={priorityDropdownRef} className="relative shrink-0 w-full sm:w-44">
                <button
                  type="button"
                  onClick={() => setIsPriorityDropdownOpen((prev) => !prev)}
                  className={`w-full h-8.5 rounded-xl border px-3 text-xs font-semibold flex items-center justify-between gap-2 transition-all cursor-pointer ${
                    selectedPriority
                      ? "border-accent/40 bg-accent/10 text-accent font-bold"
                      : "border-line/60 bg-surface text-ink hover:border-line"
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <Filter className="h-3.5 w-3.5 text-accent shrink-0" />
                    <span className="truncate">
                      {selectedPriority
                        ? PRIORITY_OPTIONS.find((p) => p.value === selectedPriority)?.label
                        : "All Priorities"}
                    </span>
                  </div>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-ink-subtle transition-transform duration-200 shrink-0 ${
                      isPriorityDropdownOpen ? "rotate-180 text-accent" : ""
                    }`}
                  />
                </button>

                {/* Custom Priority Dropdown Popover */}
                {isPriorityDropdownOpen && (
                  <div className="absolute right-0 top-full mt-1.5 z-40 w-44 rounded-xl border border-line bg-card p-1 shadow-lg space-y-0.5 animate-in fade-in-50 zoom-in-95">
                    {PRIORITY_OPTIONS.map((opt) => {
                      const isSelected =
                        opt.value === "all"
                          ? selectedPriority === undefined
                          : selectedPriority === opt.value;

                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setSelectedPriority(
                              opt.value === "all"
                                ? undefined
                                : (opt.value as LeadPriority)
                            );
                            setIsPriorityDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-accent/10 text-accent font-bold"
                              : "text-ink hover:bg-inset"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {opt.dotColor && (
                              <span
                                className={`h-2 w-2 rounded-full ${opt.dotColor} shrink-0`}
                              />
                            )}
                            <span>{opt.label}</span>
                          </div>
                          {isSelected && (
                            <Check className="h-3.5 w-3.5 text-accent stroke-[2.5px]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Loading State Skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="h-[180px] animate-pulse rounded-xl bg-inset border border-line"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="p-4 rounded-lg border border-danger/20 bg-state-danger-light">
          <div className="flex items-center gap-2 text-danger">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <p className="text-sm font-medium font-sans">
              Failed to load customer leads. Please try refreshing.
            </p>
          </div>
        </div>
      ) : leads.length === 0 ? (
        /* 3. Empty States Per Search Query or Status Tab */
        debouncedSearch ? (
          <div className="rounded-xl border border-dashed border-line bg-card p-10 text-center max-w-md mx-auto my-6 select-none space-y-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-inset text-ink-subtle border border-line mx-auto">
              <Search className="h-5 w-5 text-accent" />
            </div>
            <p className="text-sm font-bold text-ink">
              No leads match &ldquo;{debouncedSearch}&rdquo;
            </p>
            <p className="text-xs text-ink-subtle">
              Try searching by another name or phone number, or clear your search query.
            </p>
            <button
              type="button"
              onClick={() => setSearchInput("")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-accent hover:bg-hover transition-colors cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
              Clear search
            </button>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-line bg-card p-10 text-center max-w-md mx-auto my-6 select-none">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-inset text-ink-subtle border border-line mx-auto mb-3">
              {activeTab === "won" ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              ) : activeTab === "lost" ? (
                <XCircle className="h-5 w-5 text-rose-500" />
              ) : (
                <Users className="h-5 w-5 stroke-[1.5px]" />
              )}
            </div>
            <p className="text-sm font-semibold text-ink font-sans tracking-tight">
              {activeTab === "active"
                ? "No active leads"
                : activeTab === "won"
                ? "No won deals yet"
                : "No lost leads"}
            </p>
            <p className="mt-1 text-xs text-ink-subtle font-sans">
              {activeTab === "active"
                ? selectedPriority
                  ? `No active leads matching '${selectedPriority.replace("_", " ")}' priority.`
                  : "All buyer leads have been closed or no leads have been created."
                : activeTab === "won"
                ? "Closed won buyer deals will appear here."
                : "Closed lost leads will appear here."}
            </p>
          </div>
        )
      ) : (
        /* 4. Leads Grid List */
        <div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {leads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                showAssignedRep={showAssignedRep}
                href={baseHref ? `${baseHref}/${lead.id}` : undefined}
              />
            ))}
          </div>

          {/* Infinite-scroll sentinel + status row */}
          <div ref={sentinelRef} className="flex items-center justify-center py-8">
            {isFetchingNextPage ? (
              <div className="flex items-center gap-2 text-xs font-medium text-ink-subtle font-sans">
                <Loader2 className="h-4 w-4 animate-spin text-accent" />
                Loading more leads…
              </div>
            ) : !hasNextPage ? (
              <p className="text-[11px] font-mono uppercase tracking-widest text-ink-subtle">
                End of {activeTab} leads list
              </p>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
