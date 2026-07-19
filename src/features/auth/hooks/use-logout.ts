// features/auth/hooks/use-logout.ts
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/auth-api";

/**
 * Logout logic: revoke the session server-side, wipe the frontend cache,
 * then redirect to login. The API call and cache-clear are separate concerns
 * combined here.
 */
export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  async function logout() {
    try {
      await authApi.logout(); // backend revokes token + clears cookies
    } finally {
      // Runs whether or not the API call succeeded — always clean up locally.
      queryClient.clear(); // wipe the cached user (and everything else)
      router.replace("/login");
    }
  }

  return { logout };
}
