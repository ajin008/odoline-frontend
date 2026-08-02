/* eslint-disable react-hooks/set-state-in-effect */
// features/cars/components/inventory-view.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";
import { CarList } from "./car-list";
import { PIPELINE_STATUSES } from "../status-config";

import { ChevronDown, Search, X } from "lucide-react";

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

  // Search — debounced so we don't fire a request on every keystroke.
  const [searchInput, setSearchInput] = useState("");
  const [search] = useDebounce(searchInput, 400);

  useEffect(() => {
    if (tabParam && SUB_TABS.some((t) => t.key === tabParam)) {
      setActive(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (key: TabKey) => {
    setActive(key);
    if (key !== "in_stock") setSearchInput("");
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          {/* Scrollable Sub-tabs Container (h-9 Height) */}
          <div className="flex h-9 items-center gap-1 overflow-x-auto rounded-lg bg-inset p-1 border border-line/40 w-full sm:w-auto no-scrollbar shrink-0">
            {SUB_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={[
                  "flex-1 sm:flex-none h-full text-center rounded-md px-3 sm:px-4 flex items-center justify-center text-xs font-bold tracking-tight font-sans transition-all duration-200 cursor-pointer whitespace-nowrap",
                  active === tab.key
                    ? "bg-accent text-inverse shadow-xs"
                    : "text-ink-muted hover:text-ink",
                ].join(" ")}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* In Stock-only controls: search + sort */}
          {active === "in_stock" && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 shrink-0">
              {/* Search — make/model only, scoped to in_stock cars */}
              <div className="relative h-9">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-subtle stroke-[2px]" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search by make or model"
                  className="h-9 w-full sm:w-56 rounded-lg border border-line/40 bg-card pl-9 pr-8 text-xs font-medium text-ink placeholder:text-ink-subtle focus:border-accent focus:outline-none transition-colors"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => setSearchInput("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="h-3.5 w-3.5 stroke-[2px]" />
                  </button>
                )}
              </div>

              {/* Sort Option Control (h-9 Height matching Subtab box height) */}
              <div className="flex h-9 items-center justify-between sm:justify-start gap-1.5 shrink-0 rounded-lg border border-line/40 bg-card px-3 text-xs font-medium text-ink-muted transition-colors hover:border-line">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-subtle shrink-0">
                  Sort:
                </span>
                <div className="relative inline-flex items-center">
                  <select
                    value={stockSort}
                    onChange={(e) => setStockSort(e.target.value)}
                    className="appearance-none bg-transparent pr-4 font-bold text-ink text-xs focus:outline-none cursor-pointer leading-none text-right sm:text-left"
                  >
                    <option value="newest_in_stock" className="text-ink bg-card">Recently Added</option>
                    <option value="oldest_in_stock" className="text-ink bg-card">Oldest First</option>
                    <option value="price_high" className="text-ink bg-card">Price: High-Low</option>
                    <option value="price_low" className="text-ink bg-card">Price: Low-High</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-0 h-3.5 w-3.5 text-ink-subtle shrink-0 stroke-[2.25px]" />
                </div>
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
          search={active === "in_stock" ? search : undefined}
        />
      </div>
    </div>
  );
}
