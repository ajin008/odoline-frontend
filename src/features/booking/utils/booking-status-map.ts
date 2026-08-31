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

export const RC_OVERDUE_THRESHOLD_DAYS = 14;

export interface RcTransferBadgeConfig {
  label: string;
  badgeColor: string;
  isOverdue: boolean;
  daysCount: number;
}

export function getRcTransferBadgeConfig(
  deliveredAtStr?: string | null,
  updatedAtStr?: string | null
): RcTransferBadgeConfig {
  const dateStr = deliveredAtStr || updatedAtStr;
  if (!dateStr) {
    return {
      label: "RC Pending",
      badgeColor:
        "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
      isOverdue: false,
      daysCount: 0,
    };
  }

  const deliveredDate = new Date(dateStr);
  const now = new Date();
  const diffTime = Math.max(0, now.getTime() - deliveredDate.getTime());
  const daysCount = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const isOverdue = daysCount >= RC_OVERDUE_THRESHOLD_DAYS;

  if (isOverdue) {
    return {
      label: daysCount > 0 ? `RC Overdue (${daysCount}d)` : "RC Overdue",
      badgeColor:
        "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
      isOverdue: true,
      daysCount,
    };
  }

  return {
    label: daysCount > 0 ? `RC Pending (${daysCount}d)` : "RC Pending",
    badgeColor:
      "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
    isOverdue: false,
    daysCount,
  };
}

export interface BalanceOverdueBadgeConfig {
  label: string;
  badgeColor: string;
  isOverdue: boolean;
  daysOverdue: number;
}

export function getBalanceOverdueBadgeConfig(
  status: BookingStatus,
  prebookedAtStr?: string | null,
  balanceDueDays?: number | null,
  balanceDueStr?: string | null
): BalanceOverdueBadgeConfig | null {
  // Only applies to prebooked group (prebooked, offer, settlement)
  if (status !== "prebooked" && status !== "offer" && status !== "settlement") {
    return null;
  }

  // Must have balance_due_days and prebooked_at
  if (!balanceDueDays || balanceDueDays <= 0 || !prebookedAtStr) {
    return null;
  }

  // Must owe balance
  const balanceDue = Number(balanceDueStr || 0);
  if (balanceDue <= 0) {
    return null;
  }

  const prebookedDate = new Date(prebookedAtStr);
  if (isNaN(prebookedDate.getTime())) {
    return null;
  }

  // Deadline = prebooked_at + balance_due_days (in calendar days)
  const deadline = new Date(prebookedDate.getTime() + balanceDueDays * 24 * 60 * 60 * 1000);
  const now = new Date();

  if (now <= deadline) {
    return null; // Not overdue yet
  }

  const diffTime = now.getTime() - deadline.getTime();
  const daysOverdue = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return {
    label: daysOverdue > 0 ? `Balance Overdue (${daysOverdue}d)` : "Balance Overdue",
    badgeColor:
      "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 font-semibold",
    isOverdue: true,
    daysOverdue,
  };
}

export const EDITABLE_BOOKING_STATUSES: BookingStatus[] = ["prebooked", "offer"];

export function isBookingEditable(status?: BookingStatus | string | null): boolean {
  if (!status) return false;
  return (EDITABLE_BOOKING_STATUSES as string[]).includes(status);
}

