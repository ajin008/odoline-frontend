// src/features/sales/types/performance-types.ts

export type PerformancePeriodKey =
  | "this_month"
  | "last_month"
  | "last_3_months"
  | "this_year"
  | "all_time"
  | "custom";

export interface PerformancePeriod {
  from: string | null;
  to: string | null;
  label: string;
}

export interface PerformanceTotals {
  enquiries: number;
  bookings: number;
  deliveries: number;
}

export interface PerformanceTrendPoint {
  month: string; // "YYYY-MM"
  enquiries: number;
  bookings: number;
  deliveries: number;
}

export interface PerformanceStaffInfo {
  id: string;
  name: string;
}

export interface SalesPerformanceData {
  period: PerformancePeriod;
  totals: PerformanceTotals;
  trend: PerformanceTrendPoint[];
  staff?: PerformanceStaffInfo | null;
}

export interface PerformanceStaffListItem {
  id: string;
  name: string;
  role: "sales" | "cro";
}
