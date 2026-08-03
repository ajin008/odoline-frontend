// lib/query-keys.ts

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
    refurbItems: (id: string) => ["cars", id, "refurbishment-items"] as const,
    // Infinite (cursor-paginated) lists — statuses/sort/search identify a
    // distinct scroll; changing any of them starts a fresh cache entry.
    infinite: (params: {
      statuses?: string[];
      sort?: string;
      search?: string;
    }) => ["cars", "infinite", params] as const,
  },

  dashboard: {
    stats: ["dashboard", "stats"] as const,
    attention: ["dashboard", "attention"] as const,
  },
} as const;
