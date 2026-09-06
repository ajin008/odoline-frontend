// features/auth/hooks/use-logout.ts
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "../api/auth-api";
import { queryKeys } from "@/src/lib/query-keys";

/**
 * Logout logic: revoke session server-side, transition auth state directly
 * to unauthenticated (null) in query cache to avoid splash glitch, clean feature cache,
 * then navigate straight to /login.
 */
export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  async function logout() {
    try {
      await authApi.logout(); // backend revokes token + clears cookies
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("[logout] Server logout failed or offline:", err);
    } finally {
      // 1. Explicitly set auth state in query cache to null (unauthenticated).
      // This sets isLoading: false, user: null so useAuth() immediately returns status = "unauthenticated".
      queryClient.setQueryData(queryKeys.me, null);

      // 2. Remove all cached feature queries (inventory, leads, bookings, etc.)
      // but retain queryKeys.me as null so auth state doesn't revert to loading.
      queryClient.removeQueries({
        predicate: (query) =>
          JSON.stringify(query.queryKey) !== JSON.stringify(queryKeys.me),
      });

      // 3. Navigate directly to /login
      router.replace("/login");
    }
  }

  return { logout };
}
