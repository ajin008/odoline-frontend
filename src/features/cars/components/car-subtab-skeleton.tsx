// src/features/cars/components/car-subtab-skeleton.tsx
export function CarSubtabSkeleton() {
  return (
    <div className="space-y-6 select-none animate-pulse font-sans w-full">
      {/* Top Header Back Button Row Skeleton */}
      <div className="flex items-center justify-between gap-4">
        <div className="h-9 w-36 rounded-lg bg-inset border border-line/60" />
        <div className="h-9 w-9 rounded-lg bg-inset border border-line/60" />
      </div>

      {/* Car Profile Banner Header Skeleton */}
      <div className="rounded-xl border border-line bg-card p-5 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="h-5 w-48 sm:w-64 rounded-md bg-inset" />
            <div className="flex items-center gap-2">
              <div className="h-4 w-24 rounded-md bg-inset" />
              <div className="h-4.5 w-1.5 rounded-full bg-inset/40" />
              <div className="h-4 w-12 rounded-md bg-inset" />
              <div className="h-4.5 w-1.5 rounded-full bg-inset/40" />
              <div className="h-4 w-32 rounded-md bg-inset" />
            </div>
          </div>
          <div className="h-6 w-24 rounded-md bg-inset shrink-0" />
        </div>
      </div>

      {/* Sub-tabs Segmented Switch Skeleton (Vehicle & Seller | Documents | Refurbishment) */}
      <div className="flex gap-1.5 rounded-lg bg-inset p-1 border border-line w-full sm:w-fit">
        <div className="h-8 w-32 rounded-md bg-card border border-line/40 shadow-xs" />
        <div className="h-8 w-28 rounded-md bg-inset/50" />
        <div className="h-8 w-32 rounded-md bg-inset/50" />
      </div>

      {/* Active Subtab Main Card Content Skeleton */}
      <div className="rounded-xl border border-line bg-card p-5 sm:p-6 space-y-6">
        {/* Section Title Header */}
        <div className="space-y-2 border-b border-line/50 pb-4">
          <div className="h-4 w-40 rounded-md bg-inset" />
          <div className="h-3 w-72 max-w-full rounded-md bg-inset" />
        </div>

        {/* Input Fields Grid Placeholder */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-28 rounded-md bg-inset" />
              <div className="h-10 w-full rounded-lg bg-inset border border-line/40" />
            </div>
          ))}
        </div>

        {/* Form Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-line/50">
          <div className="h-10 w-28 rounded-lg bg-inset border border-line/60" />
          <div className="h-10 w-36 rounded-lg bg-accent/20 border border-accent/30" />
        </div>
      </div>
    </div>
  );
}
