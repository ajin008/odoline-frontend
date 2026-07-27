// features/dashboard/api/dashboard-api.ts
import { apiClient } from "@/src/lib/api-client";
import { endpoints } from "@/src/lib/endpoints";

/** Financial metrics returned by GET /dashboard/stats. */
export interface FinancialStats {
  capital_tied_up: string;
  stock_value: string;
}

/** Attention metrics returned by GET /dashboard/attention or /dashboard/stats. */
export interface AttentionStats {
  docs_pending: number;
  aging_over_60: number;
}

/** Dashboard stats returned by GET /dashboard/stats. */
export interface DashboardStats {
  total_stock: number;
  booked: number;
  delivered_this_month: number;
  in_refurbishment: number;
  attention?: AttentionStats;
  financials?: FinancialStats;
}

export const dashboardApi = {
  /** GET /dashboard/stats — returns the four counts. */
  async getStats(): Promise<DashboardStats> {
    const res = await apiClient.get(endpoints.dashboard.stats);
    return res.data.data;
  },

  /** GET /dashboard/attention — returns attention counts (docs_pending, aging_over_60). */
  async getAttention(): Promise<AttentionStats> {
    const res = await apiClient.get(endpoints.dashboard.attention);
    return res.data.data;
  },
};
