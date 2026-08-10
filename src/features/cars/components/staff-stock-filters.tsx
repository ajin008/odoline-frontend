"use client";

import { useState, useEffect } from "react";
import { Search, X, RotateCcw, Fuel, IndianRupee } from "lucide-react";

const FUEL_OPTIONS = [
  { value: "", label: "All Fuel Types" },
  { value: "petrol", label: "Petrol" },
  { value: "diesel", label: "Diesel" },
  { value: "electric", label: "Electric" },
  { value: "hybrid", label: "Hybrid" },
  { value: "cng", label: "CNG" },
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

  const hasActiveFilters = Boolean(
    search || fuelType || minPrice !== undefined || maxPrice !== undefined
  );

  return (
    <div className="rounded-xl border border-line bg-card p-3.5 sm:p-4 space-y-3 font-sans select-none">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Prominent Search Bar Input — Spacious & Full Width on Mobile & Tablets */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-ink-subtle stroke-[2.25px]" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search make, model, registration number..."
            className="w-full rounded-lg border border-line bg-inset py-2.5 sm:py-3 pl-10 pr-9 text-xs sm:text-sm font-medium text-ink placeholder:text-ink-subtle focus:border-accent focus:bg-card focus:outline-none transition-all"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                onSearchChange("");
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink cursor-pointer p-0.5"
            >
              <X className="h-4 w-4 stroke-[2.5px]" />
            </button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* Fuel Type Dropdown */}
          <div className="relative flex-1 sm:flex-initial">
            <Fuel className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle pointer-events-none stroke-[2px]" />
            <select
              value={fuelType}
              onChange={(e) => onFuelTypeChange(e.target.value)}
              className="w-full sm:w-auto rounded-lg border border-line bg-inset py-2.5 pl-9 pr-8 text-xs font-semibold text-ink appearance-none focus:border-accent focus:bg-card focus:outline-none transition-all cursor-pointer"
            >
              {FUEL_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Min Price Input */}
          <div className="relative w-28 sm:w-32">
            <IndianRupee className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-subtle pointer-events-none stroke-[2px]" />
            <input
              type="number"
              placeholder="Min Price"
              value={minPrice ?? ""}
              onChange={(e) =>
                onMinPriceChange(
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              className="w-full rounded-lg border border-line bg-inset py-2.5 pl-8 pr-2.5 text-xs font-semibold text-ink placeholder:text-ink-subtle focus:border-accent focus:bg-card focus:outline-none transition-all"
            />
          </div>

          <span className="text-xs text-ink-subtle hidden sm:inline">-</span>

          {/* Max Price Input */}
          <div className="relative w-28 sm:w-32">
            <IndianRupee className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-subtle pointer-events-none stroke-[2px]" />
            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice ?? ""}
              onChange={(e) =>
                onMaxPriceChange(
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              className="w-full rounded-lg border border-line bg-inset py-2.5 pl-8 pr-2.5 text-xs font-semibold text-ink placeholder:text-ink-subtle focus:border-accent focus:bg-card focus:outline-none transition-all"
            />
          </div>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                onReset();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5 stroke-[2.25px]" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
