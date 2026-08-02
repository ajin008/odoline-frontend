"use client";

import Link from "next/link";
import { Car, CalendarCheck, Truck, Wrench, ArrowUpRight } from "lucide-react";
import { useDashboardStats } from "../hooks/use-dashboard-stats";

export function DashboardStats() {
  const { data, isLoading, isError } = useDashboardStats();

  if (isError) return null;

  const statsList = [
    {
      label: "Total Stock",
      value: data?.total_stock ?? 0,
      icon: Car,
      color: "text-blue-600 bg-blue-500/10 border-blue-500/20",
      href: "/owner/inventory?tab=in_stock",
    },
    {
      label: "Booked",
      value: data?.booked ?? 0,
      icon: CalendarCheck,
      color: "text-purple-600 bg-purple-500/10 border-purple-500/20",
      href: "/owner/inventory?tab=booked",
    },
    {
      label: "In Refurbish",
      value: data?.in_refurbishment ?? 0,
      icon: Wrench,
      color: "text-amber-600 bg-amber-500/10 border-amber-500/20",
      href: "/owner/inventory?tab=in_refurbishment",
    },
    {
      label: "Delivered",
      value: data?.delivered_this_month ?? 0,
      icon: Truck,
      color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
      href: "/owner/inventory?tab=delivered",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 select-none font-sans">
      {statsList.map((stat) => {
        const Icon = stat.icon;
        return (
          <Link
            key={stat.label}
            href={stat.href}
            className="group relative flex flex-col justify-between rounded-2xl border border-line bg-card p-4 transition-all duration-200 hover:border-accent/50 hover:shadow-sm active:scale-[0.98]"
          >
            <div className="flex items-center justify-between">
              <div className={`flex h-8 w-8 items-center justify-center rounded-xl border ${stat.color} shrink-0`}>
                <Icon className="h-4 w-4 stroke-[2.25px]" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-ink-subtle opacity-40 group-hover:opacity-100 group-hover:text-accent transition-all" />
            </div>

            <div className="mt-3 space-y-0.5">
              <span className="text-[11px] font-semibold text-ink-muted group-hover:text-ink transition-colors block truncate">
                {stat.label}
              </span>
              {isLoading ? (
                <div className="h-7 w-12 animate-pulse rounded-md bg-inset" />
              ) : (
                <span className="font-heading text-2xl font-extrabold tracking-tight text-ink block leading-none">
                  {stat.value}
                </span>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
