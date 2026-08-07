// features/auth/hooks/use-logout.ts
import { useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/auth-api";

/**
 * Logout logic: revoke the session server-side, wipe the frontend cache,
 * then perform a clean hard redirect to login.
 */
export function useLogout() {
  const queryClient = useQueryClient();

  async function logout() {
    try {
      await authApi.logout(); // backend revokes token + clears cookies
    } finally {
      // Runs whether or not the API call succeeded — always clean up locally.
      queryClient.clear(); // wipe the cached user (and everything else)
      window.location.assign("/login");
    }
  }

  return { logout };
}
