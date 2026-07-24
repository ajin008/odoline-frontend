// app/(owner)/owner/inventory/page.tsx
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { InventoryView } from "@/src/features/cars/components/inventory-view";

export default function InventoryPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center rounded-2xl border border-line bg-card">
          <Loader2 className="h-6 w-6 animate-spin text-ink-muted" />
        </div>
      }
    >
      <InventoryView />
    </Suspense>
  );
}
