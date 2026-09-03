// features/cars/status-config.ts
import { BADGE_VARIANT_STYLES, type BadgeVariant } from "@/src/components/ui/badge";

/** Display config for each car status: label + badge color classes. */
export const CAR_STATUS_CONFIG: Record<
  string,
  { label: string; badge: string; variant: BadgeVariant }
> = {
  draft: { label: "Draft", variant: "neutral", badge: BADGE_VARIANT_STYLES.neutral },
  purchasing: { label: "Purchasing", variant: "warning", badge: BADGE_VARIANT_STYLES.warning },
  in_refurbishment: { label: "In Refurbishment", variant: "info", badge: BADGE_VARIANT_STYLES.info },
  refurb_complete: { label: "Refurb Complete", variant: "info", badge: BADGE_VARIANT_STYLES.info },
  in_stock: { label: "In Stock", variant: "success", badge: BADGE_VARIANT_STYLES.success },
  booked: { label: "Booked", variant: "neutral", badge: BADGE_VARIANT_STYLES.neutral },
  delivered: { label: "Delivered", variant: "neutral", badge: BADGE_VARIANT_STYLES.neutral },
  closed: { label: "Closed", variant: "neutral", badge: BADGE_VARIANT_STYLES.neutral },
};

/** Which statuses count as "in the pipeline" (mid-intake, not yet in stock). */
export const PIPELINE_STATUSES = [
  "purchasing",
  "in_refurbishment",
  "refurb_complete",
];
