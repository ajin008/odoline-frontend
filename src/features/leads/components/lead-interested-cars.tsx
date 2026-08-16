"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useLinkCar, useUnlinkCar } from "../hooks/use-lead-cars";
import { carsApi, type Car } from "@/src/features/cars/api/cars-api";
import {
  Car as CarIcon,
  Plus,
  Trash2,
  ExternalLink,
  Loader2,
  X,
  Search,
  CheckCircle2,
} from "lucide-react";

interface LeadInterestedCarsProps {
  leadId: string;
  interestedCars?: Car[] | null;
  readOnly?: boolean;
}

function formatAskingPrice(amountStr?: string | null): string {
  if (!amountStr) return "N/A";
  const num = Number(amountStr);
  if (isNaN(num)) return amountStr;
  if (num >= 100000) {
    return `₹${(num / 100000).toFixed(1)}L`;
  }
  return `₹${num.toLocaleString("en-IN")}`;
}

export function LeadInterestedCars({
  leadId,
  interestedCars = [],
  readOnly = false,
}: LeadInterestedCarsProps) {
  const linkMutation = useLinkCar(leadId);
  const unlinkMutation = useUnlinkCar(leadId);

  // Modal & selection state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState("");
  const [pickerSearch, setPickerSearch] = useState("");
  const [confirmUnlinkCar, setConfirmUnlinkCar] = useState<Car | null>(null);

  // In-stock cars query for picker modal
  const { data: inStockCarsPage, isLoading: isLoadingCars } = useQuery({
    queryKey: ["cars", "in-stock-list"],
    queryFn: () => carsApi.getList({ statuses: ["in_stock"] }),
    enabled: isAddOpen,
  });

  const inStockCars = inStockCarsPage?.data || [];
  const linkedCars = interestedCars || [];

  // Filter out cars that are already linked
  const unlinkedInStockCars = inStockCars.filter(
    (c) => !linkedCars.some((lc) => lc.id === c.id)
  );

  const filteredInStockCars = unlinkedInStockCars.filter((c) => {
    if (!pickerSearch.trim()) return true;
    const q = pickerSearch.toLowerCase();
    return (
      c.make.toLowerCase().includes(q) ||
      c.model.toLowerCase().includes(q) ||
      c.reg_number.toLowerCase().includes(q) ||
      `${c.year}`.includes(q)
    );
  });

  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCarId) return;

    linkMutation.mutate(
      { car_id: selectedCarId },
      {
        onSuccess: () => {
          setIsAddOpen(false);
          setSelectedCarId("");
          setPickerSearch("");
        },
      }
    );
  };

  const handleUnlinkConfirm = () => {
    if (!confirmUnlinkCar) return;

    unlinkMutation.mutate(confirmUnlinkCar.id, {
      onSuccess: () => {
        setConfirmUnlinkCar(null);
      },
    });
  };

  return (
    <div className="rounded-2xl border border-line bg-card p-5 space-y-4 font-sans select-none">
      {/* Header & Add Button */}
      <div className="flex items-center justify-between gap-2 border-b border-line/60 pb-3">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-muted flex items-center gap-2">
            <CarIcon className="h-4 w-4 text-accent" />
            Interested Vehicles ({linkedCars.length})
          </h3>
          <p className="text-[11px] text-ink-subtle mt-0.5">
            Inventory vehicles this buyer is actively considering.
          </p>
        </div>

        {!readOnly && (
          <button
            type="button"
            onClick={() => {
              setIsAddOpen(true);
              setSelectedCarId("");
              setPickerSearch("");
            }}
            className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-inverse shadow-sm hover:opacity-90 transition-opacity cursor-pointer shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Vehicle</span>
          </button>
        )}
      </div>

      {/* Linked Vehicles Grid / List */}
      {linkedCars.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line bg-inset/40 p-6 text-center text-xs text-ink-subtle space-y-1">
          <p className="font-semibold text-ink">No Vehicles Linked Yet</p>
          <p className="text-[11px]">
            {readOnly
              ? "No inventory cars linked to this lead."
              : "Link inventory cars this customer is eyeing to track interest."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {linkedCars.map((car) => {
            const photoUrl = car.thumbnail_url || car.primary_photo_url || null;
            const stockHref = readOnly
              ? `/owner/inventory`
              : `/staff/stock/${car.id}`;

            return (
              <div
                key={car.id}
                className="group relative flex items-start gap-3 rounded-xl border border-line bg-inset/30 p-3 transition-all hover:border-accent/40 hover:bg-inset/60"
              >
                {/* Thumbnail Photo (if photo exists) */}
                {photoUrl && (
                  <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-inset border border-line relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photoUrl}
                      alt={`${car.make} ${car.model}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                {/* Car Details & Asking Price ONLY */}
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-1 pr-6">
                    <Link
                      href={stockHref}
                      className="text-xs font-bold text-ink hover:text-accent truncate block"
                    >
                      {car.year} {car.make} {car.model}
                    </Link>
                  </div>

                  <p className="text-[11px] font-mono text-ink-subtle truncate">
                    {car.reg_number} • {car.fuel_type || "Petrol"}
                    {car.km_driven
                      ? ` • ${car.km_driven.toLocaleString("en-IN")} km`
                      : ""}
                  </p>

                  <div className="flex items-center justify-between gap-2 pt-0.5">
                    <span className="inline-flex items-center gap-0.5 text-xs font-bold font-mono text-accent">
                      Asking: {formatAskingPrice(car.selling_price)}
                    </span>

                    <Link
                      href={stockHref}
                      className="text-[10px] font-semibold text-ink-subtle hover:text-ink flex items-center gap-0.5"
                    >
                      <span>Stock</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>

                {/* Remove Action Button */}
                {!readOnly && (
                  <button
                    type="button"
                    onClick={() => setConfirmUnlinkCar(car)}
                    className="absolute top-2.5 right-2.5 p-1 rounded-lg text-ink-subtle hover:text-danger hover:bg-card transition-colors cursor-pointer"
                    title="Remove from lead"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal 1: Add Interested Car Picker (Custom UI/UX) */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-line bg-card p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h4 className="text-sm font-bold text-ink flex items-center gap-2">
                <CarIcon className="h-4 w-4 text-accent" />
                Link Interested Vehicle
              </h4>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="text-ink-subtle hover:text-ink transition-colors p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleLinkSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-ink-muted">
                  Select In-Stock Vehicle *
                </label>

                {/* Quick Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-ink-subtle" />
                  <input
                    type="text"
                    placeholder="Search make, model, or reg no…"
                    value={pickerSearch}
                    onChange={(e) => setPickerSearch(e.target.value)}
                    className="w-full rounded-lg border border-line bg-inset py-2 pl-8 pr-3 text-xs text-ink placeholder:text-ink-subtle focus:border-accent focus:outline-none"
                  />
                </div>

                {isLoadingCars ? (
                  <div className="py-8 text-center text-xs text-ink-subtle flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-accent" />
                    Loading in-stock cars…
                  </div>
                ) : unlinkedInStockCars.length === 0 ? (
                  <p className="text-xs text-amber-500 py-4 text-center border border-dashed border-amber-500/30 rounded-lg bg-amber-500/5">
                    No unlinked in-stock vehicles available.
                  </p>
                ) : filteredInStockCars.length === 0 ? (
                  <p className="text-xs text-ink-subtle py-4 text-center border border-dashed border-line rounded-lg bg-inset/40">
                    No vehicles match &quot;{pickerSearch}&quot;.
                  </p>
                ) : (
                  /* Custom Scrollable Card Selector */
                  <div className="max-h-60 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                    {filteredInStockCars.map((car) => {
                      const isSelected = selectedCarId === car.id;
                      return (
                        <div
                          key={car.id}
                          onClick={() => setSelectedCarId(car.id)}
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                            isSelected
                              ? "border-accent bg-accent/10 text-ink shadow-xs"
                              : "border-line bg-inset/40 hover:bg-inset hover:border-line/80 text-ink"
                          }`}
                        >
                          <div className="space-y-0.5 min-w-0 pr-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-ink truncate">
                                {car.year} {car.make} {car.model}
                              </span>
                              <span className="inline-flex items-center rounded-md bg-surface border border-line px-1.5 py-0.5 text-[10px] font-mono text-ink-subtle">
                                {car.reg_number}
                              </span>
                            </div>
                            <p className="text-[11px] text-ink-subtle font-mono truncate">
                              {car.fuel_type || "Petrol"}
                              {car.km_driven
                                ? ` • ${car.km_driven.toLocaleString("en-IN")} km`
                                : ""}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs font-bold text-accent font-mono">
                              {formatAskingPrice(car.selling_price)}
                            </span>
                            <div
                              className={`flex h-4 w-4 items-center justify-center rounded-full border transition-colors ${
                                isSelected
                                  ? "border-accent bg-accent text-white"
                                  : "border-line/80 bg-card"
                              }`}
                            >
                              {isSelected && (
                                <CheckCircle2 className="h-3 w-3 stroke-[3]" />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="rounded-lg border border-line px-3.5 py-2 text-xs font-medium text-ink hover:bg-hover transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={linkMutation.isPending || !selectedCarId}
                  className="flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-inverse shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
                >
                  {linkMutation.isPending && (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  )}
                  <span>Link Vehicle</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Unlink Confirmation */}
      {confirmUnlinkCar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl border border-line bg-card p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h4 className="text-sm font-bold text-ink flex items-center gap-2">
                <Trash2 className="h-4 w-4 text-danger" />
                Unlink Interested Vehicle
              </h4>
              <button
                type="button"
                onClick={() => setConfirmUnlinkCar(null)}
                className="text-ink-subtle hover:text-ink transition-colors p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-ink leading-relaxed">
              Are you sure you want to remove{" "}
              <span className="font-bold text-ink">
                {confirmUnlinkCar.year} {confirmUnlinkCar.make}{" "}
                {confirmUnlinkCar.model}
              </span>{" "}
              from this lead&apos;s interested vehicles?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmUnlinkCar(null)}
                className="rounded-lg border border-line px-3.5 py-2 text-xs font-medium text-ink hover:bg-hover transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUnlinkConfirm}
                disabled={unlinkMutation.isPending}
                className="flex items-center gap-1.5 rounded-lg bg-danger px-4 py-2 text-xs font-semibold text-white shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
              >
                {unlinkMutation.isPending && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                )}
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
