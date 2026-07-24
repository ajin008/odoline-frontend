/* eslint-disable react-hooks/set-state-in-effect */
// features/cars/components/inventory-view.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CarList } from "./car-list";
import { PIPELINE_STATUSES } from "../status-config";

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
    <div className="space-y-6 select-none font-sans">
      {/* Sticky Header Block: Title & Filter Tabs remain fixed at top when scrolling */}
      <div className="sticky -top-6 z-20 bg-card pt-1 pb-4 space-y-4 border-b border-line/60 -mx-6 px-6 backdrop-blur-md">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-ink font-sans">
            Inventory Registry
          </h1>
          <p className="mt-0.5 text-xs font-medium text-ink-muted">
            Track assets through pipeline states, processing channels, and live stock yards.
          </p>
        </div>

        {/* Sub-tabs Navigation */}
        <div className="flex gap-1 overflow-x-auto rounded-xl bg-inset p-1 border border-line max-w-max no-scrollbar">
          {SUB_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={[
                "shrink-0 rounded-lg px-4 py-2 text-xs font-bold tracking-tight font-sans transition-all duration-200 cursor-pointer",
                active === tab.key
                  ? "bg-accent text-inverse shadow-sm"
                  : "text-ink-muted hover:text-ink",
              ].join(" ")}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Matrix Output Flow */}
      <div className="pt-1">
        <CarList statuses={[...activeTab.statuses]} />
      </div>
    </div>
  );
}
