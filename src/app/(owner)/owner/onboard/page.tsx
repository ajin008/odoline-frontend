// app/(owner)/owner/onboard/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { VehicleSellerForm } from "@/src/features/cars/components/vehicle-seller-form";

export default function OnboardPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div>
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <h1 className="font-heading text-2xl font-semibold tracking-tight text-ink">
          Add car to stock
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Start with the vehicle and seller details.
        </p>
      </div>
      <VehicleSellerForm />
    </div>
  );
}
