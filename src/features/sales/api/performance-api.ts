// src/features/sales/api/performance-api.ts

import { apiClient } from "@/src/lib/api-client";
import { endpoints } from "@/src/lib/endpoints";
import type {
  SalesPerformanceData,
  PerformanceStaffListItem,
} from "../types/performance-types";

function withPeriod(url: string, period?: string): string {
  return period ? `${url}?period=${encodeURIComponent(period)}` : url;
}

export const performanceApi = {
  /** GET /api/v1/sales/performance/overview — dealership-wide totals + 6-month trend (owner only) */
  async getOverview(period?: string): Promise<SalesPerformanceData> {
    const res = await apiClient.get(
      withPeriod(endpoints.salesPerformance.overview, period)
    );
    return res.data.data;
  },

  /** GET /api/v1/sales/performance/staff — active sales/cro reps for the staff selector (owner only) */
  async getStaffList(): Promise<PerformanceStaffListItem[]> {
    const res = await apiClient.get(endpoints.salesPerformance.staff);
    return res.data.data;
  },

  /** GET /api/v1/sales/performance/staff/:staffId — one rep's totals + trend (owner only) */
  async getStaffDetail(
    staffId: string,
    period?: string
  ): Promise<SalesPerformanceData> {
    const res = await apiClient.get(
      withPeriod(endpoints.salesPerformance.staffDetail(staffId), period)
    );
    return res.data.data;
  },

  /** GET /api/v1/sales/performance/me — the logged-in rep's own totals + trend */
  async getMe(period?: string): Promise<SalesPerformanceData> {
    const res = await apiClient.get(
      withPeriod(endpoints.salesPerformance.me, period)
    );
    return res.data.data;
  },
};
