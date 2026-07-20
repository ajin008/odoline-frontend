// features/cars/components/inventory-view.tsx
"use client";

import { useState } from "react";
import { CarList } from "./car-list";
import { PIPELINE_STATUSES } from "../status-config";

const SUB_TABS = [
  { key: "pipeline", label: "Pipeline", statuses: PIPELINE_STATUSES },
  { key: "in_stock", label: "In Stock", statuses: ["in_stock"] },
  { key: "booked", label: "Booked", statuses: ["booked"] },
  { key: "delivered", label: "Delivered", statuses: ["delivered"] },
] as const;

export function InventoryView() {
  const [active, setActive] =
    useState<(typeof SUB_TABS)[number]["key"]>("pipeline");
  const activeTab = SUB_TABS.find((t) => t.key === active)!;

  return (
    <div className="space-y-6">
      {/* Sub-tabs: High-Fidelity Active Accent Navigation Wrapper */}
      <div className="flex gap-1 overflow-x-auto rounded-xl bg-inset p-1 border border-line max-w-max select-none no-scrollbar">
        {SUB_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
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

      {/* Grid Matrix output flow */}
      <CarList statuses={[...activeTab.statuses]} />
    </div>
  );
}
