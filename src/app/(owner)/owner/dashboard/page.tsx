import { DashboardStats } from "@/src/features/dashboard/components/DashboardStats";
import { FinancialSnapshot } from "@/src/features/dashboard/components/FinancialSnapshot";
import { NeedsAttention } from "@/src/features/dashboard/components/NeedsAttention";
import { QuickActions } from "@/src/features/dashboard/components/QuickActions";

export default function DashboardPage() {
  return (
    <div className="w-full space-y-6 select-none font-sans">
      {/* Primary Intake Quick Action Bar */}
      <QuickActions />

      {/* TIER 1: Executive KPI Metrics Strip (4 Horizontal Status Cards) */}
      <DashboardStats />

      {/* TIER 2: Analytics & Operational Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Column: Capital & Valuation Analytics (8 Columns) */}
        <div className="lg:col-span-8">
          <FinancialSnapshot />
        </div>

        {/* Right Sidebar Column: Operational Risks & Future Extension Slot (4 Columns) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Operational Risks & Action Items */}
          <NeedsAttention />
        </div>
      </div>
    </div>
  );
}
