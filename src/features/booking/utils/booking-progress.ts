import type { BookingStatus } from "../types/booking-types";

export type MilestoneState = "done" | "current" | "upcoming";

export interface BookingMilestoneStage {
  id: "agreement" | "order" | "settlement" | "close";
  label: string;
  shortLabel: string;
  state: MilestoneState;
  isClickable: boolean;
}

export const BOOKING_STAGES = [
  { id: "agreement", label: "Advance Agreement", shortLabel: "Agreement" },
  { id: "order", label: "Order Form", shortLabel: "Order Form" },
  { id: "settlement", label: "Settlement & Delivery", shortLabel: "Settlement & Delivery" },
  { id: "close", label: "Close (RC Transfer)", shortLabel: "Close" },
] as const;

export function getBookingMilestones(
  status: BookingStatus,
  hasOrderForm: boolean = false
): {
  stages: BookingMilestoneStage[];
  isCancelled: boolean;
} {
  const isCancelled = status === "cancelled";

  // Reachable index rule:
  // prebooked / offer / settlement -> reachable up to index 2 (Settlement & Delivery)
  // delivered / closed -> reachable up to index 3 (Close)
  let maxReachableIndex = 0;
  if (status === "closed" || status === "delivered") {
    maxReachableIndex = 3;
  } else if (status === "prebooked" || status === "offer" || status === "settlement") {
    maxReachableIndex = 2;
  }

  const stages: BookingMilestoneStage[] = BOOKING_STAGES.map(
    (stage, index) => {
      let state: MilestoneState = "upcoming";

      if (stage.id === "agreement") {
        state = !isCancelled ? "done" : "upcoming";
      } else if (stage.id === "order") {
        if (hasOrderForm || status === "offer" || status === "delivered" || status === "closed") {
          state = "done";
        } else {
          state = "upcoming";
        }
      } else if (stage.id === "settlement") {
        if (status === "delivered" || status === "closed") {
          state = "done";
        } else if (!isCancelled) {
          state = "current";
        }
      } else if (stage.id === "close") {
        if (status === "closed") {
          state = "done";
        } else if (status === "delivered" && !isCancelled) {
          state = "current";
        } else {
          state = "upcoming";
        }
      }

      // A milestone is clickable if index <= maxReachableIndex and not cancelled
      const isClickable = !isCancelled && index <= maxReachableIndex;

      return {
        ...stage,
        state,
        isClickable,
      };
    }
  );

  return { stages, isCancelled };
}
