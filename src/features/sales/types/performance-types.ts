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

export type TrendBucket = "day" | "week" | "month" | "year";

export interface PerformanceTrendPoint {
  key: string;
  enquiries: number;
  bookings: number;
  deliveries: number;
}

export interface PerformanceTrendData {
  bucket: TrendBucket;
  points: PerformanceTrendPoint[];
}

export interface PerformanceStaffInfo {
  id: string;
  name: string;
}

export interface SalesPerformanceData {
  period: PerformancePeriod;
  totals: PerformanceTotals;
  trend: PerformanceTrendData;
  staff?: PerformanceStaffInfo | null;
}

export interface PerformanceStaffListItem {
  id: string;
  name: string;
  role: "sales" | "cro";
}

