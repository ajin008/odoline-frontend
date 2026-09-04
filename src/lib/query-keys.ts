// lib/query-keys.ts

export interface ListLeadsQueryParams {
  status?: "active" | "won" | "lost";
  priority?: "very_hot" | "hot" | "warm" | "cold";
  search?: string;
  assigned_to?: string;
  cursor?: string;
  limit?: number;
}

/**
 * Every query key in one place, mirroring the API resource structure.
 * Using these (instead of typing arrays by hand) keeps keys consistent,
 * which is what makes cache invalidation reliable.
 */
export const queryKeys = {
  me: ["me"] as const,

  cars: {
    all: ["cars"] as const,
    detail: (id: string) => ["cars", id] as const,
    documents: (id: string) => ["cars", id, "documents"] as const,
    photos: (id: string) => ["cars", id, "photos"] as const,
    refurbItems: (id: string) => ["cars", id, "refurbishment-items"] as const,
    dossier: (id: string) => ["cars", id, "dossier"] as const,
    // Infinite (cursor-paginated) lists — statuses/sort/search identify a
    // distinct scroll; changing any of them starts a fresh cache entry.
    infinite: (params: {
      statuses?: readonly string[] | string[];
      sort?: string;
      search?: string;
      fuel_type?: string;
      min_price?: number;
      max_price?: number;
    }) => {
      const statusesKey = params.statuses
        ? [...params.statuses].sort().join(",")
        : undefined;
      return [
        "cars",
        "infinite",
        {
          ...params,
          statuses: statusesKey,
        },
      ] as const;
    },
  },

  dashboard: {
    stats: ["dashboard", "stats"] as const,
    attention: ["dashboard", "attention"] as const,
  },

  config: ["config"] as const,

  departments: {
    all: ["departments"] as const,
    list: (status?: string) => ["departments", { status }] as const,
    detail: (id: string) => ["departments", id] as const,
  },

  staff: {
    all: ["staff"] as const,
    me: ["staff", "me"] as const,
    list: (status?: string) => ["staff", { status }] as const,
    detail: (id: string) => ["staff", id] as const,
  },

  leads: {
    all: ["leads"] as const,
    list: (params?: ListLeadsQueryParams) =>
      ["leads", "list", params] as const,
    infinite: (params?: ListLeadsQueryParams) =>
      ["leads", "infinite", params] as const,
    detail: (id: string) => ["leads", id] as const,
    activities: (id: string) => ["leads", id, "activities"] as const,
    followUps: (id: string) => ["leads", id, "follow-ups"] as const,
    stageHistory: (id: string) => ["leads", id, "stage-history"] as const,
    dashboardFunnel: (period?: string) =>
      ["leads", "dashboard", "funnel", { period }] as const,
    unassigned: ["leads", "unassigned"] as const,
    staffLoad: ["leads", "staff-load"] as const,
    croAtRisk: ["leads", "cro-at-risk"] as const,
    myAtRisk: ["leads", "my-at-risk"] as const,
  },

  followUps: {
    all: ["follow-ups"] as const,
    actionList: (bucket: string) => ["follow-ups", "action-list", bucket] as const,
  },

  attendance: {
    all: ["attendance"] as const,
    today: ["attendance", "today"] as const,
    overview: (date?: string) => ["attendance", "overview", date] as const,
    staffHeatmap: (staffId: string, month?: string) =>
      ["attendance", "staff", staffId, "heatmap", month] as const,
    meHeatmap: (month?: string) =>
      ["attendance", "me", "heatmap", month] as const,
  },

  salesPerformance: {
    all: ["sales-performance"] as const,
    overview: (period?: string) =>
      ["sales-performance", "overview", { period }] as const,
    staffList: ["sales-performance", "staff-list"] as const,
    staffDetail: (staffId: string, period?: string) =>
      ["sales-performance", "staff", staffId, { period }] as const,
    me: (period?: string) =>
      ["sales-performance", "me", { period }] as const,
  },

  booking: {
    all: ["bookings"] as const,
    list: (tab: string = "prebooked", role?: string) =>
      ["bookings", "list", { tab, role }] as const,
    detail: (id: string) => ["bookings", "detail", id] as const,
    order: (id: string) => ["bookings", id, "order"] as const,
  },
} as const;

