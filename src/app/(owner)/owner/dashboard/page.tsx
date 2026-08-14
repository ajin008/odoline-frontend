import { DashboardStats } from "@/src/features/dashboard/components/DashboardStats";
import { FinancialSnapshot } from "@/src/features/dashboard/components/FinancialSnapshot";
import { NeedsAttention } from "@/src/features/dashboard/components/NeedsAttention";
import { QuickActions } from "@/src/features/dashboard/components/QuickActions";
import { OwnerFunnelDashboard } from "@/src/features/leads/components/owner-funnel-dashboard";

export default function DashboardPage() {
  return (
    <div className="w-full space-y-6 select-none font-sans">
      {/* Primary Intake Quick Action Bar */}
      <QuickActions />

      {/* TIER 1: Executive KPI Metrics Strip (4 Horizontal Status Cards) */}
      <DashboardStats />

      {/* TIER 2: CRM Sales Funnel & Monthly Conversion Section */}
      <OwnerFunnelDashboard />

      {/* TIER 3: Analytics & Operational Grid (70% / 30% Ratio) */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-5 items-stretch">
        {/* Capital Overview (70% Width) */}
        <div className="lg:col-span-7 flex">
          <FinancialSnapshot />
        </div>

        {/* Operational Attention & Risks (30% Width) */}
        <div className="lg:col-span-3 flex">
          <NeedsAttention />
        </div>
      </div>
    </div>
  );
}
