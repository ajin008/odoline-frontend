import type { BookingStatus } from "../types/booking-types";

export interface BookingStatusConfig {
  label: string;
  badgeColor: string;
}

const statusConfigMap = new Map<BookingStatus, BookingStatusConfig>([
  [
    "prebooked",
    {
      label: "Prebooked",
      badgeColor:
        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    },
  ],
  [
    "offer",
    {
      label: "Offer & Accessories",
      badgeColor:
        "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    },
  ],
  [
    "settlement",
    {
      label: "Settlement Pending",
      badgeColor:
        "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    },
  ],
  [
    "delivered",
    {
      label: "Vehicle Delivered",
      badgeColor:
        "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    },
  ],
  [
    "closed",
    {
      label: "Closed Sale",
      badgeColor:
        "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
    },
  ],
  [
    "cancelled",
    {
      label: "Cancelled",
      badgeColor:
        "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    },
  ],
]);

export function getBookingStatusConfig(
  status: BookingStatus
): BookingStatusConfig {
  return (
    statusConfigMap.get(status) ?? {
      label: status,
      badgeColor:
        "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
    }
  );
}

