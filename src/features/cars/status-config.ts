// features/cars/status-config.ts

/** Display config for each car status: label + badge color classes. */
export const CAR_STATUS_CONFIG: Record<
  string,
  { label: string; badge: string }
> = {
  draft: { label: "Draft", badge: "bg-zinc-600 text-white font-bold" },
  purchasing: { label: "Purchasing", badge: "bg-amber-500 text-white font-bold" },
  in_refurbishment: { label: "In Refurbishment", badge: "bg-indigo-600 text-white font-bold" },
  refurb_complete: { label: "Refurb Complete", badge: "bg-teal-600 text-white font-bold" },
  in_stock: { label: "In Stock", badge: "bg-emerald-600 text-white font-bold" },
  booked: { label: "Booked", badge: "bg-purple-600 text-white font-bold" },
  delivered: { label: "Delivered", badge: "bg-zinc-800 text-white font-bold" },
  closed: { label: "Closed", badge: "bg-zinc-700 text-white font-bold" },
};

/** Which statuses count as "in the pipeline" (mid-intake, not yet in stock). */
export const PIPELINE_STATUSES = [
  "purchasing",
  "in_refurbishment",
  "refurb_complete",
];
