// app/(owner)/owner/inventory/page.tsx
import { InventoryView } from "@/src/features/cars/components/inventory-view";

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-line pb-4">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-ink">
          Inventory Registry
        </h1>
        <p className="mt-1 text-sm font-medium text-ink-muted font-sans">
          Track assets through pipeline states, processing channels, and live
          stock yards.
        </p>
      </div>
      <InventoryView />
    </div>
  );
}
