import { apiClient } from "./../../../lib/api-client";
import { endpoints } from "@/src/lib/endpoints";

import type { AuthUser, LoginCredentials, ChangePinPayload } from "../types/auth-types";

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    const res = await apiClient.post(endpoints.auth.login, credentials);
    return res.data.data;
  },
  async logout(): Promise<void> {
    await apiClient.post(endpoints.auth.logout);
  },
  async me(): Promise<AuthUser> {
    const res = await apiClient.get(endpoints.auth.me);
    return res.data.data;
  },
  async changePin(payload: ChangePinPayload): Promise<void> {
    await apiClient.patch(endpoints.auth.changePin, payload);
  },
};
