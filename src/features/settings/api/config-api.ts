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
}

export const configApi = {
  /** GET /config — read-only showroom info. */
  async get(): Promise<ShowroomConfig> {
    const res = await apiClient.get(endpoints.config.get);
    return res.data.data;
  },
};
