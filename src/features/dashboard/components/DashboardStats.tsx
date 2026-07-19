// features/dashboard/components/dashboard-stats.tsx
"use client";

import { Car, CalendarCheck, Truck, Wrench } from "lucide-react";
import { useDashboardStats } from "../hooks/use-dashboard-stats";
import { StatCard } from "./stat-card";

export function DashboardStats() {
  const { data, isLoading, isError } = useDashboardStats();

  if (isError) {
    return (
      <div className="p-4 rounded-xl border border-danger/20 bg-danger-light">
        <p className="text-sm font-medium text-danger font-sans">
          Couldn&apos;t load terminal stats. Please refresh to try again.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 select-none">
      <StatCard
        label="Total stock"
        value={data?.total_stock ?? 0}
        icon={Car}
        href="/owner/inventory?status=in_stock"
        loading={isLoading}
      />
      <StatCard
        label="Booked"
        value={data?.booked ?? 0}
        icon={CalendarCheck}
        href="/owner/inventory?status=booked"
        loading={isLoading}
      />
      <StatCard
        label="Delivered this month"
        value={data?.delivered_this_month ?? 0}
        icon={Truck}
        href="/owner/inventory?status=delivered"
        loading={isLoading}
      />
      <StatCard
        label="In refurbishment"
        value={data?.in_refurbishment ?? 0}
        icon={Wrench}
        href="/owner/inventory?status=in_refurbishment"
        loading={isLoading}
      />
    </div>
  );
}
