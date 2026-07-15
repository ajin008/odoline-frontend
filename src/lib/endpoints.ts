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
    remove: (id: string) => `/cars/${id}`,
    changeStatus: (id: string) => `/cars/${id}/status`,
    addToStock: (id: string) => `/cars/${id}/add-to-stock`,

    documents: (carId: string) => `/cars/${carId}/documents`,
    document: (carId: string, docId: string) =>
      `/cars/${carId}/documents/${docId}`,

    refurbItems: (carId: string) => `/cars/${carId}/refurbishment-items`,
  },

  refurbItems: {
    update: (itemId: string) => `/refurbishment-items/${itemId}`,
    remove: (itemId: string) => `/refurbishment-items/${itemId}`,
  },

  dashboard: {
    stats: "/dashboard/stats",
  },

  config: {
    get: "/config",
    update: "/config",
  },

  export: {
    cars: "/export/cars",
  },
} as const;
