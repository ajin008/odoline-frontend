// app/(owner)/owner/dashboard/page.tsx
import { DashboardStats } from "@/src/features/dashboard/components/DashboardStats";
import { QuickActions } from "@/src/features/dashboard/components/QuickActions";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Editorial context sub-header anchor layout */}
      <div>
        <p className="text-sm font-medium text-ink-muted font-sans">
          Here&apos;s a live overview of your terminal metrics and stock status
          today.
        </p>
      </div>

      <DashboardStats />
      <QuickActions />

      {/* QuickActions, RecentStock come next */}
    </div>
  );
}
