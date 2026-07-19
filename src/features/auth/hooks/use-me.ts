// features/auth/hooks/use-me.ts
import { useQuery } from "@tanstack/react-query";
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
    queryFn: authApi.me,
    retry: false, // a 401 means "not logged in" — don't retry it
    staleTime: 5 * 60 * 1000, // user rarely changes; keep fresh 5 min
  });
}
