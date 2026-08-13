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
    photos: (id: string) => `/cars/${id}/photos`,
    photoDelete: (id: string, photoId: string) => `/cars/${id}/photos/${photoId}`,
    photoPrimary: (id: string, photoId: string) => `/cars/${id}/photos/${photoId}/primary`,
    photoFile: (id: string, photoId: string) => `/cars/${id}/photos/${photoId}/file`,
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

  leads: {
    list: "/leads",
    create: "/leads",
    detail: (id: string) => `/leads/${id}`,
    activities: (id: string) => `/leads/${id}/activities`,
    followUps: (id: string) => `/leads/${id}/follow-ups`,
    followUp: (id: string, fuId: string) => `/leads/${id}/follow-ups/${fuId}`,
    stage: (id: string) => `/leads/${id}/stage`,
    stageHistory: (id: string) => `/leads/${id}/stage-history`,
    cars: (id: string) => `/leads/${id}/cars`,
    car: (id: string, carId: string) => `/leads/${id}/cars/${carId}`,
  },

  followUps: {
    list: (bucket: string) => `/follow-ups?bucket=${bucket}`,
  },

  export: {
    cars: "/export/cars",
  },

  attendance: {
    today: "/attendance/me/today",
    clockIn: "/attendance/clock-in",
    clockOut: "/attendance/clock-out",
    overview: (date?: string) =>
      date ? `/attendance/overview?date=${date}` : "/attendance/overview",
    staffHeatmap: (staffId: string, month?: string) =>
      month
        ? `/attendance/staff/${staffId}/heatmap?month=${month}`
        : `/attendance/staff/${staffId}/heatmap`,
    manual: "/attendance/manual",
  },
} as const;
