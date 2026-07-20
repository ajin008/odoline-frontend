// features/cars/components/car-card.tsx
import Link from "next/link";
import { ImagePlus, MapPin } from "lucide-react";
import type { Car } from "../api/cars-api";

export function CarCard({ car }: { car: Car }) {
  const isPurchasing = car.status.toLowerCase() === "purchasing";

  return (
    <Link
      href={`/owner/cars/${car.id}/intake`}
      className={[
        "group flex flex-col justify-between rounded-2xl border border-line bg-card overflow-hidden shadow-sm transition-all duration-300 select-none",
        "hover:border-accent hover:shadow-bento hover:-translate-y-0.5 active:scale-[0.98]",
      ].join(" ")}
    >
      {/* Upper Aspect Box Container — Premium Editorial Media Slot */}
      <div className="relative aspect-video w-full bg-inset border-b border-line/40 flex flex-col items-center justify-center gap-2 text-ink-subtle transition-colors duration-300 group-hover:bg-accent-light/30 group-hover:text-accent">
        <div className="p-3 rounded-xl bg-card border border-line shadow-sm transition-transform duration-300 group-hover:scale-105">
          <ImagePlus className="h-5 w-5 stroke-[2px]" />
        </div>
        <span className="text-[10px] font-mono font-medium tracking-wider uppercase opacity-75">
          No Media Attached
        </span>
      </div>

      {/* Lower Descriptive Detail Information Section */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-heading text-base font-semibold text-ink tracking-tight line-clamp-1 group-hover:text-accent transition-colors duration-200">
              {car.make} {car.model}
            </h3>

            {/* Conditional Status Badge: Uses warning yellow tokens if status is "purchasing" */}
            <span
              className={[
                "text-[9px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-md shrink-0 mt-0.5 border",
                isPurchasing
                  ? "bg-warning-light border-warning/10 text-warning"
                  : "bg-accent-light/60 border-accent/10 text-accent",
              ].join(" ")}
            >
              {car.status.replace("_", " ")}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-ink-subtle font-sans">
            <span className="bg-inset border border-line px-1.5 py-0.5 rounded text-[10px] font-mono font-medium text-ink-muted">
              {car.year}
            </span>
            <span>•</span>
            <span>{car.km_driven?.toLocaleString("en-IN") ?? "0"} km</span>
          </div>
        </div>

        {/* Lower Footer Data Section */}
        <div className="mt-5 pt-3 border-t border-line/50 flex items-center justify-between text-[11px] font-medium text-ink-muted font-sans">
          <div className="flex items-center gap-1 min-w-0">
            <MapPin className="h-3.5 w-3.5 text-ink-subtle shrink-0" />
            <span className="truncate tracking-tight font-mono text-[10px] font-medium text-ink-subtle uppercase">
              {car.reg_number || "NO-REG"}
            </span>
          </div>

          <span className="text-accent font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-1 group-hover:translate-x-0 text-xs">
            Resume →
          </span>
        </div>
      </div>
    </Link>
  );
}
