"use client";

import { useState, useEffect } from "react";
import { Search, X, RotateCcw, SlidersHorizontal, Fuel, Flame, Zap, Leaf } from "lucide-react";
import { CustomSelect, type CustomSelectOption } from "@/src/components/ui/custom-select";

const FUEL_OPTIONS: CustomSelectOption<string>[] = [
  { value: "", label: "All Fuel Types" },
  { value: "petrol", label: "Petrol", icon: <Fuel className="h-3.5 w-3.5 text-blue-500" /> },
  { value: "diesel", label: "Diesel", icon: <Fuel className="h-3.5 w-3.5 text-amber-500" /> },
  { value: "electric", label: "Electric (EV)", icon: <Zap className="h-3.5 w-3.5 text-purple-500" /> },
  { value: "hybrid", label: "Hybrid", icon: <Leaf className="h-3.5 w-3.5 text-teal-500" /> },
  { value: "cng", label: "CNG", icon: <Flame className="h-3.5 w-3.5 text-emerald-500" /> },
];

interface StaffStockFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  fuelType: string;
  onFuelTypeChange: (value: string) => void;
  minPrice?: number;
  onMinPriceChange: (value?: number) => void;
  maxPrice?: number;
  onMaxPriceChange: (value?: number) => void;
  onReset: () => void;
}

export function StaffStockFilters({
  search,
  onSearchChange,
  fuelType,
  onFuelTypeChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  onReset,
}: StaffStockFiltersProps) {
  const [searchInput, setSearchInput] = useState(search);
  const [prevSearch, setPrevSearch] = useState(search);

  if (search !== prevSearch) {
    setPrevSearch(search);
    setSearchInput(search);
  }

  // Debounce search input by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(searchInput);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, onSearchChange]);

  const activeFilterCount = [
    Boolean(search),
    Boolean(fuelType),
    minPrice !== undefined,
    maxPrice !== undefined,
  ].filter(Boolean).length;

  return (
    <div className="space-y-3 font-sans select-none">
      {/* 1. Primary Custom Search Bar */}
      <div className="relative w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-subtle pointer-events-none stroke-[2px] shrink-0" />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search vehicles by make, model, variant, or registration..."
          className="w-full h-11 rounded-xl border border-line bg-card pl-10 pr-10 text-xs sm:text-sm font-medium text-ink outline-none transition-all focus:border-accent placeholder:text-ink-subtle/70 shadow-none focus:shadow-none focus:ring-0"
        />
        {searchInput && (
          <button
            type="button"
            onClick={() => {
              setSearchInput("");
              onSearchChange("");
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink transition-colors cursor-pointer p-1"
            title="Clear search"
          >
            <X className="h-4 w-4 stroke-[2px]" />
          </button>
        )}
      </div>

      {/* 2. Custom Filter Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-0.5">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none max-w-full">
          <span className="text-[11px] font-bold text-ink-subtle uppercase tracking-wider flex items-center gap-1.5 shrink-0 mr-1">
            <SlidersHorizontal className="h-3.5 w-3.5 text-accent shrink-0" />
            <span className="hidden sm:inline">Filters:</span>
          </span>

          {/* Custom Select Dropdown: Fuel Type */}
          <CustomSelect
            options={FUEL_OPTIONS}
            value={fuelType}
            onChange={onFuelTypeChange}
            placeholder="All Fuel Types"
            searchable={false}
            className="shrink-0"
            buttonClassName={`h-8 px-3 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
              fuelType
                ? "bg-accent/15 border-accent text-accent font-bold"
                : "bg-card border-line/70 text-ink-subtle hover:text-ink hover:border-line"
            }`}
          />

          {/* Custom Price Range Inputs Group */}
          <div className="flex items-center gap-1 bg-card border border-line rounded-lg p-1 h-8 shrink-0">
            <span className="text-[11px] font-bold text-ink-subtle px-1">₹</span>
            <input
              type="number"
              placeholder="Min"
              value={minPrice ?? ""}
              onChange={(e) =>
                onMinPriceChange(
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              className="w-16 h-full bg-transparent text-xs font-mono font-semibold text-ink placeholder:text-ink-subtle/60 outline-none"
            />
            <span className="text-ink-subtle/40 text-xs">-</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice ?? ""}
              onChange={(e) =>
                onMaxPriceChange(
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              className="w-16 h-full bg-transparent text-xs font-mono font-semibold text-ink placeholder:text-ink-subtle/60 outline-none"
            />
          </div>
        </div>

        {/* Active Filter Counter & Reset Control */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2 shrink-0 pt-1 sm:pt-0">
            <span className="text-[11px] font-bold text-accent bg-accent/15 px-2 py-0.5 rounded-md border border-accent/20">
              {activeFilterCount} active filter{activeFilterCount > 1 ? "s" : ""}
            </span>

            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                onReset();
              }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-danger hover:underline cursor-pointer px-1 py-0.5"
            >
              <RotateCcw className="h-3 w-3 stroke-[2.5px]" />
              <span>Reset</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
