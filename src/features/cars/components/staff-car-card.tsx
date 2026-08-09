"use client";

import Link from "next/link";
import { Car as CarIcon, Gauge, Fuel, ShieldCheck, ChevronRight } from "lucide-react";
import type { Car } from "../api/cars-api";
import { formatIndianNumber } from "@/src/lib/formatters";

export function StaffCarCard({ car }: { car: Car }) {
  const photoUrl = car.primary_photo_url || car.thumbnail_url;
  const priceDisplay = car.selling_price
    ? `₹${formatIndianNumber(Number(car.selling_price))}`
    : "Price on Request";

  return (
    <Link
      href={`/staff/stock/${car.id}`}
      className="group flex flex-col rounded-xl border border-line bg-card overflow-hidden transition-all duration-200 hover:border-accent/60 active:scale-[0.99] select-none"
    >
      {/* Thumbnail Header Image Container */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-inset">
        {photoUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={photoUrl}
            alt={`${car.make} ${car.model}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center text-ink-subtle">
            <CarIcon className="h-10 w-10 stroke-[1.5px] opacity-40 mb-1" />
            <span className="text-[11px] font-medium font-sans">No Photo Available</span>
          </div>
        )}

        {/* Reg Number Pill */}
        <div className="absolute top-2.5 left-2.5 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-mono font-bold text-white backdrop-blur-md">
          {car.reg_number || "NO-REG"}
        </div>

        {/* Status Badge */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-md bg-emerald-500/90 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-md uppercase tracking-wider">
          <ShieldCheck className="h-3 w-3 stroke-[2.5px]" />
          <span>IN STOCK</span>
        </div>
      </div>

      {/* Details Container */}
      <div className="flex flex-1 flex-col justify-between p-3.5 space-y-3">
        <div>
          <p className="text-[10px] font-mono font-bold tracking-widest text-ink-muted uppercase">
            {car.make}
          </p>
          <h3 className="text-sm font-bold text-ink font-heading group-hover:text-accent transition-colors leading-snug">
            {car.model} <span className="text-xs font-normal text-ink-subtle">({car.year})</span>
          </h3>
        </div>

        {/* Specifications Pills Grid */}
        <div className="grid grid-cols-2 gap-1.5 text-xs text-ink-subtle font-sans">
          {car.km_driven !== null && (
            <div className="flex items-center gap-1.5 rounded-md bg-inset px-2.5 py-1 text-[11px]">
              <Gauge className="h-3 w-3 text-ink-muted shrink-0" />
              <span className="truncate">{formatIndianNumber(car.km_driven)} KM</span>
            </div>
          )}

          {car.fuel_type && (
            <div className="flex items-center gap-1.5 rounded-md bg-inset px-2.5 py-1 text-[11px] capitalize">
              <Fuel className="h-3 w-3 text-ink-muted shrink-0" />
              <span className="truncate">{car.fuel_type}</span>
            </div>
          )}
        </div>

        {/* Price & CTA Footer */}
        <div className="flex items-center justify-between border-t border-line/60 pt-2.5">
          <div>
            <span className="text-[9px] font-mono font-bold tracking-wider text-ink-muted uppercase block">
              Asking Price
            </span>
            <span className="text-base font-extrabold text-accent font-sans">
              {priceDisplay}
            </span>
          </div>

          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-light text-accent transition-transform group-hover:translate-x-0.5">
            <ChevronRight className="h-3.5 w-3.5 stroke-[2.5px]" />
          </div>
        </div>
      </div>
    </Link>
  );
}
