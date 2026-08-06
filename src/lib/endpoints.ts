// src/lib/endpoints.ts

export const endpoints = {
  auth: {
    login: "/auth/login",
    logout: "/auth/logout",
    refresh: "/auth/refresh",
    me: "/auth/me",
    changePin: "/auth/change-pin",
    updatePhoto: "/auth/me/photo",
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
    updateGeofence: "/config/geofence",
  },

  departments: {
    list: "/departments",
    create: "/departments",
    detail: (id: string) => `/departments/${id}`,
    update: (id: string) => `/departments/${id}`,
    deactivate: (id: string) => `/departments/${id}/deactivate`,
    activate: (id: string) => `/departments/${id}/activate`,
  },

  staff: {
    list: "/staff",
    create: "/staff",
    detail: (id: string) => `/staff/${id}`,
    update: (id: string) => `/staff/${id}`,
    updatePhoto: (id: string) => `/staff/${id}/photo`,
    resetPin: (id: string) => `/staff/${id}/reset-pin`,
    deactivate: (id: string) => `/staff/${id}/deactivate`,
    activate: (id: string) => `/staff/${id}/activate`,
  },

  export: {
    cars: "/export/cars",
  },
} as const;
