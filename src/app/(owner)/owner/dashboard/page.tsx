import { DashboardStats } from "@/src/features/dashboard/components/DashboardStats";
import { FinancialSnapshot } from "@/src/features/dashboard/components/FinancialSnapshot";
import { NeedsAttention } from "@/src/features/dashboard/components/NeedsAttention";
import { QuickActions } from "@/src/features/dashboard/components/QuickActions";

export default function DashboardPage() {
  return (
    <div className="w-full space-y-6 select-none font-sans">
      {/* ------------------------------------------------------------- */}
      {/* INTEGRATED SINGLE-ROW DESKTOP GRID (3 BALANCED COLUMNS)       */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
        {/* Column 1: Yard Status 2x2 Grid */}
        <div className="rounded-xl border border-line/40 bg-card p-5 shadow-bento flex flex-col justify-between">
          <DashboardStats />
        </div>

        {/* Column 2: Financial Capital Snapshot */}
        <div className="rounded-xl border border-line/40 bg-card p-5 shadow-bento flex flex-col justify-between">
          <FinancialSnapshot />
        </div>

        {/* Column 3: Operational Attention & Risks */}
        <div className="rounded-xl border border-line/40 bg-card p-5 shadow-bento flex flex-col justify-between">
          <NeedsAttention />
        </div>
      </div>

      {/* Primary Intake Action */}
      <QuickActions />
    </div>
  );
}
