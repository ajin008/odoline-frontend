/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SalesOverviewDashboard } from "./sales-overview-dashboard";
import { CompletedSalesList } from "./completed-sales-list";
import { IndianRupee, TrendingUp } from "lucide-react";

const SALES_SUBTABS = [
  { key: "overview", label: "Overview", icon: TrendingUp },
  { key: "completed", label: "Completed Sales", icon: IndianRupee },
] as const;

type SalesSubtabKey = (typeof SALES_SUBTABS)[number]["key"];

export function OwnerSalesShell() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const subtabParam = searchParams.get("subtab") as SalesSubtabKey | null;
  const initialSubtab: SalesSubtabKey =
    subtabParam && SALES_SUBTABS.some((t) => t.key === subtabParam)
      ? subtabParam
      : "overview";

  const [activeSubtab, setActiveSubtab] =
    useState<SalesSubtabKey>(initialSubtab);

  useEffect(() => {
    if (subtabParam && SALES_SUBTABS.some((t) => t.key === subtabParam)) {
      setActiveSubtab(subtabParam);
    }
  }, [subtabParam]);

  const handleSubtabChange = (key: SalesSubtabKey) => {
    setActiveSubtab(key);
    router.replace(`/owner/sales?subtab=${key}`, { scroll: false });
  };

  return (
    <div className="w-full space-y-5 select-none font-sans max-w-6xl">
      {/* ------------------------------------------------------------- */}
      {/* HEADER & SUBTABS NAVIGATION BAR                               */}
      {/* ------------------------------------------------------------- */}
      <div className="sticky -top-4 z-20 bg-card/95 backdrop-blur-md -mx-4 sm:-mx-6 px-4 sm:px-6 pt-1 sm:pt-2 pb-3 border-b border-line/40 space-y-2.5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-ink font-sans">
            Dealership Sales &amp; Revenue
          </h1>
          <p className="mt-0.5 text-xs font-medium text-ink-muted">
            Track closed car sales records, rep deal attributions, and finalized
            delivery logs.
          </p>
        </div>

        {/* Subtabs Bar below heading */}
        <div className="flex h-9 items-center gap-1 overflow-x-auto rounded-lg bg-inset p-1 border border-line/40 w-full sm:w-fit no-scrollbar shrink-0">
          {SALES_SUBTABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubtab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => handleSubtabChange(tab.key)}
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
              </button>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* ACTIVE SUBTAB CONTENT VIEW                                    */}
      {/* ------------------------------------------------------------- */}
      <div className="pt-0.5">
        {activeSubtab === "completed" && <CompletedSalesList />}
        {activeSubtab === "overview" && <SalesOverviewDashboard />}
      </div>
    </div>
  );
}
