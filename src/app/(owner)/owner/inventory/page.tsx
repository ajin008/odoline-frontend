// app/(owner)/owner/inventory/page.tsx
import { InventoryView } from "@/src/features/cars/components/inventory-view";

export default function InventoryPage() {
  return (
    <div className="space-y-6 select-none font-sans">
      {/* Header Section */}
      <div className="border-b border-line pb-4">
        <h1 className="text-xl font-bold tracking-tight text-ink font-sans">
          Inventory Registry
        </h1>
        <p className="mt-0.5 text-xs font-medium text-ink-muted">
          Track assets through pipeline states, processing channels, and live
          stock yards.
        </p>
      </div>

      {/* Main View Grid Container */}
      <InventoryView />
    </div>
  );
}
