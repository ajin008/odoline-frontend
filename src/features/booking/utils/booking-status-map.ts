import type { BookingStatus } from "../types/booking-types";
import { BADGE_VARIANT_STYLES } from "@/src/components/ui/badge";

export interface BookingStatusConfig {
  label: string;
  badgeColor: string;
}

const statusConfigMap = new Map<BookingStatus, BookingStatusConfig>([
  [
    "prebooked",
    {
      label: "Prebooked",
      badgeColor: BADGE_VARIANT_STYLES.success,
    },
  ],
  [
    "offer",
    {
      label: "Offer & Accessories",
      badgeColor: BADGE_VARIANT_STYLES.info,
    },
  ],
  [
    "settlement",
    {
      label: "Settlement Pending",
      badgeColor: BADGE_VARIANT_STYLES.warning,
    },
  ],
  [
    "delivered",
    {
      label: "Vehicle Delivered",
      badgeColor: BADGE_VARIANT_STYLES.neutral,
    },
  ],
  [
    "closed",
    {
      label: "Closed Sale",
      badgeColor: BADGE_VARIANT_STYLES.neutral,
    },
  ],
  [
    "cancelled",
    {
      label: "Cancelled",
      badgeColor: BADGE_VARIANT_STYLES.danger,
    },
  ],
]);

export function getBookingStatusConfig(
  status: BookingStatus
): BookingStatusConfig {
  return (
    statusConfigMap.get(status) ?? {
      label: status,
      badgeColor: BADGE_VARIANT_STYLES.neutral,
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
      badgeColor: BADGE_VARIANT_STYLES.info,
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
      badgeColor: BADGE_VARIANT_STYLES.warning,
      isOverdue: true,
      daysCount,
    };
  }

  return {
    label: daysCount > 0 ? `RC Pending (${daysCount}d)` : "RC Pending",
    badgeColor: BADGE_VARIANT_STYLES.info,
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
    badgeColor: BADGE_VARIANT_STYLES.warning,
    isOverdue: true,
    daysOverdue,
  };
}

export const EDITABLE_BOOKING_STATUSES: BookingStatus[] = ["prebooked", "offer"];

export function isBookingEditable(status?: BookingStatus | string | null): boolean {
  if (!status) return false;
  return (EDITABLE_BOOKING_STATUSES as string[]).includes(status);
}
