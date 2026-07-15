import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { env } from "../utils/env";

// ── 1. The ONE instance every feature imports ─────────────────
export const apiClient = axios.create({
  baseURL: env.apiUrl,
  withCredentials: true, // sends the httpOnly cookie every time
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// ── 2. Refresh-queue state (shared across ALL requests) ───────
let isRefreshing = false;
let waitingQueue: Array<{
  resolve: () => void;
  reject: (error: unknown) => void;
}> = [];

// Wake every queued request once the single refresh finishes
const processQueue = (error: unknown | null) => {
  waitingQueue.forEach((p) => (error ? p.reject(error) : p.resolve()));
  waitingQueue = [];
};

// ── 3. Response interceptor — the heart of it ─────────────────
apiClient.interceptors.response.use(
  (response) => response, // any 2xx: nothing to do, pass it through
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Network error / no response → can't refresh, just fail
    if (!originalRequest || !error.response) {
      return Promise.reject(error);
    }

    const status = error.response.status;
    const isRefreshCall = originalRequest.url?.includes("/auth/refresh");

    // Only 401 triggers refresh. 403 = "logged in but not allowed" → let it fail.
    // isRefreshCall guard = don't refresh a failed refresh (kills the infinite loop).
    // _retry guard = each request is retried at most ONCE.
    if (status !== 401 || isRefreshCall || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // A refresh is already in flight → get in line, don't start another
    if (isRefreshing) {
      return new Promise<void>((resolve, reject) => {
        waitingQueue.push({ resolve, reject });
      }).then(() => apiClient(originalRequest));
    }

    // I'm the first 401 → I own the refresh
    isRefreshing = true;
    try {
      await apiClient.post("/auth/refresh"); // browser sends refresh cookie automatically
      processQueue(null); // wake everyone waiting
      return apiClient(originalRequest); // retry the request that started this
    } catch (refreshError) {
      processQueue(refreshError); // refresh dead → fail everyone
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
