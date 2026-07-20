// features/cars/status-config.ts

/** Display config for each car status: label + badge color classes. */
export const CAR_STATUS_CONFIG: Record<
  string,
  { label: string; badge: string }
> = {
  draft: { label: "Draft", badge: "bg-zinc-100 text-zinc-600" },
  purchasing: { label: "Docs Pending", badge: "bg-amber-100 text-amber-700" },
  in_refurbishment: { label: "In Refurb", badge: "bg-blue-100 text-blue-700" },
  refurb_complete: { label: "Refurb Done", badge: "bg-teal-100 text-teal-700" },
  in_stock: { label: "In Stock", badge: "bg-green-100 text-green-700" },
  booked: { label: "Booked", badge: "bg-purple-100 text-purple-700" },
  delivered: { label: "Delivered", badge: "bg-zinc-100 text-zinc-600" },
  closed: { label: "Closed", badge: "bg-zinc-100 text-zinc-500" },
};

/** Which statuses count as "in the pipeline" (mid-intake, not yet in stock). */
export const PIPELINE_STATUSES = [
  "purchasing",
  "in_refurbishment",
  "refurb_complete",
];
