// features/settings/api/config-api.ts (or wherever settings lives)
import { apiClient } from "@/src/lib/api-client";
import { endpoints } from "@/src/lib/endpoints";

export interface ShowroomConfig {
  showroom_name: string;
  showroom_address: string;
  showroom_phone1: string;
  showroom_phone2: string | null;
  showroom_phone3: string | null;
  showroom_logo_url: string | null;
  default_margin: string;
  latitude: number | null;
  longitude: number | null;
  geofence_radius_meters: number;
}

export interface UpdateGeofencePayload {
  latitude: number | null;
  longitude: number | null;
  geofence_radius_meters: number;
}

export const configApi = {
  /** GET /config — read-only showroom info + geofence. */
  async get(): Promise<ShowroomConfig> {
    const res = await apiClient.get(endpoints.config.get);
    return res.data.data;
  },

  /** PATCH /config/geofence — update showroom location & geofence radius. */
  async updateGeofence(payload: UpdateGeofencePayload): Promise<ShowroomConfig> {
    const res = await apiClient.patch(endpoints.config.updateGeofence, payload);
    return res.data.data;
  },

  /** PATCH /config/logo — upload/replace showroom logo. */
  async uploadLogo(file: File | Blob): Promise<{ showroom_logo_url: string }> {
    const formData = new FormData();
    const fileName = (file as File).name || "showroom-logo.png";
    formData.append("logo", file, fileName);
    formData.append("file", file, fileName);
    const res = await apiClient.patch(endpoints.config.logo, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  },
};

