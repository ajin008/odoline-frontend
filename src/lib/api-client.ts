import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { env } from "../utils/env";

// ── 1. The ONE instance every feature imports ─────────────────
export const apiClient = axios.create({
  baseURL: env.apiUrl,
  withCredentials: true, // sends the httpOnly cookie every time
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// Request interceptor: If data is FormData, remove default JSON content-type
// so browser/axios sets the correct multipart/form-data boundary automatically.
apiClient.interceptors.request.use((config) => {
  if (typeof FormData !== "undefined" && config.data instanceof FormData) {
    if (config.headers) {
      delete config.headers["Content-Type"];
      delete config.headers["content-type"];
    }
  }
  return config;
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
    const isLoginCall = originalRequest.url?.includes("/auth/login");

    // Only 401 triggers refresh. 403 = "logged in but not allowed" → let it fail.
    // isRefreshCall guard = don't refresh a failed refresh (kills the infinite loop).
    // isLoginCall guard = a 401 from /auth/login means "wrong credentials", NOT
    // "session expired" — there was never a session to refresh. Without this,
    // a failed login attempt triggers a refresh (which also fails) and then a
    // hard window.location.href reload, wiping the error toast instantly.
    // _retry guard = each request is retried at most ONCE.
    if (status !== 401 || isRefreshCall || isLoginCall || originalRequest._retry) {
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
      // Don't reload if we're already on /login — e.g. useMe() checking
      // "is anyone logged in?" from the login page itself will 401 + fail
      // to refresh perfectly normally. Redirecting-to-login-from-login is
      // what caused the reload loop; let the caller just see the rejection.
      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/login"
      ) {
        window.location.href = "/login";
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
