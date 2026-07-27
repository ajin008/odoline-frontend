// features/cars/components/car-list.tsx
"use client";

import { useCars } from "../hooks/use-cars";
import { CarCard } from "./car-card";
import { PackageOpen } from "lucide-react";

export function CarList({
  statuses,
  sort,
}: {
  statuses?: string[];
  sort?: string;
}) {
  const { data: cars, isLoading, isError } = useCars(statuses, sort);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-[280px] animate-pulse rounded-2xl bg-inset border border-line"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 rounded-xl border border-danger/20 bg-state-danger-light">
        <p className="text-sm font-medium text-danger font-sans">
          Could not safely sync database status pools. Please check logs.
        </p>
      </div>
    );
  }

  if (!cars || cars.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-ink-subtle/30 bg-card p-12 text-center max-w-md mx-auto my-6 select-none">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-inset text-ink-subtle border border-line mx-auto mb-4">
          <PackageOpen className="h-5 w-5 stroke-[1.5px]" />
        </div>
        <p className="text-sm font-semibold text-ink font-sans tracking-tight">
          No cars registered here
        </p>
        <p className="mt-1 text-xs text-ink-subtle font-sans">
          New terminal arrivals added by managers will display inside this
          container category.
        </p>
      </div>
    );
  }

  return (
    /* Shifted seamlessly into modern 5-column architectural layout */
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {cars.map((car) => (
        <CarCard key={car.id} car={car} />
      ))}
    </div>
  );
}
