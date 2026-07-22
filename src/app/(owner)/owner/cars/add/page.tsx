// app/(owner)/owner/cars/add/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { VehicleSellerForm } from "@/src/features/cars/components/vehicle-seller-form";

export default function OnboardPage() {
  const router = useRouter();

  return (
    <div className="space-y-6 select-none font-sans">
      {/* Back Button & Header Section */}
      <div className="flex flex-col items-start">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-4 inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-xs font-bold tracking-tight text-inverse shadow-sm transition-all hover:bg-accent-hover active:scale-[0.98]"
        >
          <ArrowLeft className="h-3.5 w-3.5 stroke-[2.5px]" />
          Back
        </button>

        <div className="w-full border-b border-line pb-4">
          <h1 className="font-heading text-xl font-bold text-ink">
            Add car to stock
          </h1>
          <p className="mt-0.5 text-xs font-medium text-ink-muted">
            Start with the vehicle and seller details.
          </p>
        </div>
      </div>

      <VehicleSellerForm />
    </div>
  );
}
