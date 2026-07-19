// features/dashboard/api/dashboard-api.ts
import { apiClient } from "@/src/lib/api-client";
import { endpoints } from "@/src/lib/endpoints";

/** The four counts the dashboard shows. Shape matches the backend contract. */
export interface DashboardStats {
  total_stock: number;
  booked: number;
  delivered_this_month: number;
  in_refurbishment: number;
}

export const dashboardApi = {
  /** GET /dashboard/stats — returns the four counts. */
  async getStats(): Promise<DashboardStats> {
    const res = await apiClient.get(endpoints.dashboard.stats);
    return res.data.data;
  },
};
