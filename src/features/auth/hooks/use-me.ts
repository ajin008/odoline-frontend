// features/auth/hooks/use-me.ts
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { authApi } from "../api/auth-api";
import { queryKeys } from "@/src/lib/query-keys";

/**
 * The current logged-in user, as server state.
 * One source of truth: the backend, via GET /auth/me.
 *
 * Any component can call useMe() to know who's logged in — TanStack Query
 * caches the result, so /auth/me is called once and shared, not refetched
 * per component.
 *
 * Returns { data: user, isLoading, isError, ... }.
 */
export function useMe() {
  return useQuery({
    queryKey: queryKeys.me,
    // "Not logged in" is a valid answer, not an error: resolve it as null so
    // the query holds data and never flips back to "pending" on a refetch.
    queryFn: async () => {
      try {
        return await authApi.me();
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 401) return null;
        throw error;
      }
    },
    retry: false, // a 401 means "not logged in" — don't retry it
    // An errored /me (429, 5xx, offline) must NOT refetch just because another
    // component mounted — on /login that re-shows the splash, unmounts the form,
    // and remounts it on failure: an infinite request loop.
    retryOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // user rarely changes; keep fresh 5 min
  });
}

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export interface UseAuthReturn {
  status: AuthStatus;
  user: ReturnType<typeof useMe>["data"];
  isLoading: boolean;
  isAuthenticated: boolean;
  isUnauthenticated: boolean;
  error: ReturnType<typeof useMe>["error"];
  isError: boolean;
  isSuccess: boolean;
}

/**
 * Three-state authentication hook (loading | authenticated | unauthenticated).
 * Initial state on app open is ALWAYS "loading" while GET /auth/me is in flight.
 */
export function useAuth(): UseAuthReturn {
  const { data: user, isLoading, isError, error, isSuccess } = useMe();

  let status: AuthStatus = "loading";
  if (isLoading) {
    status = "loading";
  } else if (user) {
    status = "authenticated";
  } else {
    status = "unauthenticated";
  }

  return {
    status,
    user,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    isUnauthenticated: status === "unauthenticated",
    error,
    isError,
    isSuccess,
  };
}

