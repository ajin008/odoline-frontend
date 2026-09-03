"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";
import type { Car } from "../api/cars-api";
import { Badge } from "@/src/components/ui/badge";

interface DocCompletenessBadgeProps {
  car: Car;
  variant?: "overlay" | "inline";
  className?: string;
}

export function DocCompletenessBadge({
  car,
  className = "",
}: DocCompletenessBadgeProps) {
  // Read FIX-7a fields (fallback to progress_summary if not directly attached)
  const pendingCount =
    typeof car.pending_docs_count === "number"
      ? car.pending_docs_count
      : car.progress_summary?.documents?.pending_required ?? 0;

  const isComplete =
    car.docs_complete ??
    (car.progress_summary?.documents?.is_complete ||
      car.progress_summary?.documents?.hard_docs_complete);

  const missingDocs = car.pending_docs || [];

  const isPending = pendingCount > 0;

  if (!isPending && !isComplete) {
    return null;
  }

  if (isPending) {
    const label = `${pendingCount} doc${pendingCount === 1 ? "" : "s"} pending`;
    const tooltip =
      missingDocs.length > 0
        ? `Missing: ${missingDocs.join(", ")}`
        : "Required documents pending";

    return (
      <Badge
        variant="warning"
        title={tooltip}
        className={["cursor-help", className].join(" ")}
      >
        <AlertCircle className="h-3 w-3 stroke-[2.25px] shrink-0" />
        <span>{label}</span>
      </Badge>
    );
  }

  // Quiet, understated green badge for docs complete
  return (
    <Badge
      variant="success"
      title="All required documents uploaded"
      className={className}
    >
      <CheckCircle2 className="h-3 w-3 stroke-[2.25px] shrink-0" />
      <span>Docs ✓</span>
    </Badge>
  );
}
