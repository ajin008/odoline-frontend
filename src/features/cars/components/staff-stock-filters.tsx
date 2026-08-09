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
    <div className="rounded-xl border border-line bg-card p-3.5 space-y-3 font-sans select-none">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Search Bar Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle stroke-[2.25px]" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search make, model, registration number..."
            className="w-full rounded-lg border border-line bg-inset py-2 pl-9 pr-8 text-xs font-medium text-ink placeholder:text-ink-subtle focus:border-accent focus:bg-card focus:outline-none transition-all"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                onSearchChange("");
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink cursor-pointer"
            >
              <X className="h-3.5 w-3.5 stroke-[2.5px]" />
            </button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Fuel Type Dropdown */}
          <div className="relative">
            <Fuel className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-subtle pointer-events-none stroke-[2px]" />
            <select
              value={fuelType}
              onChange={(e) => onFuelTypeChange(e.target.value)}
              className="rounded-lg border border-line bg-inset py-2 pl-8 pr-7 text-xs font-semibold text-ink appearance-none focus:border-accent focus:bg-card focus:outline-none transition-all cursor-pointer"
            >
              {FUEL_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Min Price Input */}
          <div className="relative w-28">
            <IndianRupee className="absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-ink-subtle pointer-events-none stroke-[2px]" />
            <input
              type="number"
              placeholder="Min Price"
              value={minPrice ?? ""}
              onChange={(e) =>
                onMinPriceChange(
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              className="w-full rounded-lg border border-line bg-inset py-2 pl-7 pr-2 text-xs font-semibold text-ink placeholder:text-ink-subtle focus:border-accent focus:bg-card focus:outline-none transition-all"
            />
          </div>

          <span className="text-xs text-ink-subtle">-</span>

          {/* Max Price Input */}
          <div className="relative w-28">
            <IndianRupee className="absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-ink-subtle pointer-events-none stroke-[2px]" />
            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice ?? ""}
              onChange={(e) =>
                onMaxPriceChange(
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              className="w-full rounded-lg border border-line bg-inset py-2 pl-7 pr-2 text-xs font-semibold text-ink placeholder:text-ink-subtle focus:border-accent focus:bg-card focus:outline-none transition-all"
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
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
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
