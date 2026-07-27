"use client";

import Link from "next/link";
import { Car, CalendarCheck, Truck, Wrench } from "lucide-react";
import { useDashboardStats } from "../hooks/use-dashboard-stats";

export function DashboardStats() {
  const { data, isLoading, isError } = useDashboardStats();

  if (isError) return null;

  const statsList = [
    {
      label: "Total Stock",
      value: data?.total_stock ?? 0,
      icon: Car,
      href: "/owner/inventory?tab=in_stock",
    },
    {
      label: "Booked",
      value: data?.booked ?? 0,
      icon: CalendarCheck,
      href: "/owner/inventory?tab=booked",
    },
    {
      label: "In Refurb",
      value: data?.in_refurbishment ?? 0,
      icon: Wrench,
      href: "/owner/inventory?tab=in_refurbishment",
    },
    {
      label: "Delivered",
      value: data?.delivered_this_month ?? 0,
      icon: Truck,
      href: "/owner/inventory?tab=delivered",
    },
  ];

  return (
    <div className="flex flex-col h-full space-y-3 select-none font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line/40 pb-2">
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-ink-muted">
          Yard Inventory Status
        </h2>
        <span className="text-[10px] font-mono text-ink-subtle uppercase">
          Live Count
        </span>
      </div>

      {/* 2x2 Minimalist Grid */}
      <div className="grid grid-cols-2 gap-3 flex-1">
        {statsList.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="group relative flex flex-col justify-between rounded-lg border border-line/40 bg-inset p-3.5 transition-all duration-200 hover:border-accent/40 hover:bg-card active:scale-[0.98]"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-ink-muted group-hover:text-ink transition-colors truncate">
                  {stat.label}
                </span>
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-card border border-line/40 text-ink-muted group-hover:text-accent group-hover:border-accent/30 transition-colors">
                  <Icon className="h-3.5 w-3.5 stroke-[2px]" />
                </div>
              </div>

              <div className="mt-3">
                {isLoading ? (
                  <div className="h-7 w-12 animate-pulse rounded-md bg-card border border-line/40" />
                ) : (
                  <span className="font-heading text-2xl font-bold tracking-tight text-ink block leading-none">
                    {stat.value}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
