/* eslint-disable react-hooks/set-state-in-effect */
// features/cars/components/inventory-view.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CarList } from "./car-list";
import { PIPELINE_STATUSES } from "../status-config";

import { ChevronDown } from "lucide-react";

const SUB_TABS = [
  { key: "pipeline", label: "Pipeline", statuses: PIPELINE_STATUSES },
  { key: "in_stock", label: "In Stock", statuses: ["in_stock"] },
  { key: "booked", label: "Booked", statuses: ["booked"] },
  { key: "delivered", label: "Delivered", statuses: ["delivered"] },
] as const;

type TabKey = (typeof SUB_TABS)[number]["key"];

export function InventoryView() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabParam = searchParams.get("tab") as TabKey | null;

  const validInitialTab: TabKey =
    tabParam && SUB_TABS.some((t) => t.key === tabParam)
      ? tabParam
      : "pipeline";

  const [active, setActive] = useState<TabKey>(validInitialTab);
  // Default In Stock tab to newest_in_stock (Recently Added)
  const [stockSort, setStockSort] = useState<string>("newest_in_stock");

  useEffect(() => {
    if (tabParam && SUB_TABS.some((t) => t.key === tabParam)) {
      setActive(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (key: TabKey) => {
    setActive(key);
    router.replace(`/owner/inventory?tab=${key}`, { scroll: false });
  };

  const activeTab = SUB_TABS.find((t) => t.key === active) || SUB_TABS[0];

  return (
    <div className="space-y-5 select-none font-sans">
      {/* Sticky Header Block: Mobile-native sticky header */}
      <div className="sticky -top-5 z-20 bg-card/90 pt-1 pb-3 space-y-3 border-b border-line/60 -mx-4 sm:-mx-6 px-4 sm:px-6 backdrop-blur-md">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-ink font-sans">
            Inventory Registry
          </h1>
          <p className="mt-0.5 text-xs font-medium text-ink-muted">
            Track assets through pipeline states, processing channels, and live stock yards.
          </p>
        </div>

        {/* Sub-tabs Navigation & Sort Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          {/* Scrollable Sub-tabs */}
          <div className="flex gap-1 overflow-x-auto rounded-xl bg-inset p-1 border border-line w-full sm:w-auto no-scrollbar">
            {SUB_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={[
                  "flex-1 sm:flex-none text-center rounded-lg px-3 sm:px-4 py-1.5 text-xs font-bold tracking-tight font-sans transition-all duration-200 cursor-pointer whitespace-nowrap",
                  active === tab.key
                    ? "bg-accent text-inverse shadow-sm"
                    : "text-ink-muted hover:text-ink",
                ].join(" ")}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Colored Mobile-Optimized Sort Bar (Below tabs on mobile, inline on desktop) */}
          {active === "in_stock" && (
            <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto rounded-xl border border-accent/30 bg-accent/5 px-3 py-1.5 text-xs font-semibold text-accent shadow-2xs transition-colors">
              <span className="font-bold uppercase tracking-widest text-[10px] text-accent/80 shrink-0">
                Sort By
              </span>
              <div className="relative inline-flex items-center">
                <select
                  value={stockSort}
                  onChange={(e) => setStockSort(e.target.value)}
                  className="appearance-none bg-transparent pr-4 font-bold text-accent text-xs focus:outline-none cursor-pointer leading-none text-right sm:text-left"
                >
                  <option value="newest_in_stock" className="text-ink bg-card font-medium">Recently Added</option>
                  <option value="oldest_in_stock" className="text-ink bg-card font-medium">Oldest First</option>
                  <option value="price_high" className="text-ink bg-card font-medium">Price: High-Low</option>
                  <option value="price_low" className="text-ink bg-card font-medium">Price: Low-High</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-0 h-3.5 w-3.5 text-accent shrink-0" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grid Matrix Output Flow */}
      <div className="pt-1">
        <CarList
          statuses={[...activeTab.statuses]}
          sort={active === "in_stock" ? stockSort : undefined}
        />
      </div>
    </div>
  );
}
