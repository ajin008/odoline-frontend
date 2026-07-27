// src/lib/endpoints.ts

export const endpoints = {
  auth: {
    login: "/auth/login",
    logout: "/auth/logout",
    refresh: "/auth/refresh",
    me: "/auth/me",
  },

  cars: {
    list: "/cars",
    create: "/cars",
    detail: (id: string) => `/cars/${id}`,
    update: (id: string) => `/cars/${id}`,
    changeStatus: (id: string) => `/cars/${id}/status`,
    // addToStock: (id: string) => `/cars/${id}/add-to-stock`,

    documents: (id: string) => `/cars/${id}/documents`,
    refurbItems: (id: string) => `/cars/${id}/refurbishment-items`,
    margin: (id: string) => `/cars/${id}/margin`,
    addToStock: (id: string) => `/cars/${id}/add-to-stock`,
  },

  refurbItems: {
    update: (itemId: string) => `/refurbishment/items/${itemId}`,
    remove: (itemId: string) => `/refurbishment/items/${itemId}`,
  },

  dashboard: {
    stats: "/dashboard/stats",
    attention: "/dashboard/attention",
  },

  config: {
    get: "/config",
    update: "/config",
  },

  export: {
    cars: "/export/cars",
  },
} as const;
