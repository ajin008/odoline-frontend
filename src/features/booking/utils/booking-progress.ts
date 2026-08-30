import type { BookingStatus } from "../types/booking-types";

export type MilestoneState = "done" | "current" | "upcoming";

export interface BookingMilestoneStage {
  id: "agreement" | "order" | "settlement" | "delivery";
  label: string;
  shortLabel: string;
  state: MilestoneState;
}

export const BOOKING_STAGES = [
  { id: "agreement", label: "Advance Agreement", shortLabel: "Agreement" },
  { id: "order", label: "Order Form", shortLabel: "Order" },
  { id: "settlement", label: "Settlement", shortLabel: "Settlement" },
  { id: "delivery", label: "Vehicle Delivery", shortLabel: "Delivery" },
] as const;

export function getBookingMilestones(
  status: BookingStatus,
  hasOrderForm: boolean = false
): {
  stages: BookingMilestoneStage[];
  isCancelled: boolean;
} {
  const isCancelled = status === "cancelled";

  let currentIndex = 0;
  switch (status) {
    case "prebooked":
      currentIndex = 0;
      break;
    case "offer":
      currentIndex = 1;
      break;
    case "settlement":
      currentIndex = 2;
      break;
    case "delivered":
      currentIndex = 3;
      break;
    case "closed":
      currentIndex = 4;
      break;
    case "cancelled":
    default:
      currentIndex = 0;
      break;
  }

  const stages: BookingMilestoneStage[] = BOOKING_STAGES.map(
    (stage, index) => {
      let state: MilestoneState = "upcoming";

      if (stage.id === "agreement") {
        state = !isCancelled ? "done" : "upcoming";
      } else if (stage.id === "order") {
        if (hasOrderForm || status === "offer" || status === "closed" || (index < currentIndex && currentIndex > 1)) {
          state = "done";
        } else {
          state = "upcoming";
        }
      } else {
        if (status === "closed" || index < currentIndex) {
          state = "done";
        } else if (index === currentIndex && !isCancelled) {
          state = "current";
        }
      }

      return {
        ...stage,
        state,
      };
    }
  );

  return { stages, isCancelled };
}

