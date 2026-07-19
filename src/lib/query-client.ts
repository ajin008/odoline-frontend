// lib/query-client.ts
import { QueryClient, isServer } from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data stays "fresh" for 60s before a background refetch is allowed.
        // Prevents refetching on every mount/focus while still staying current.
        staleTime: 60 * 1000,
        retry: 1, // retry a failed request once, then give up
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/**
 * Returns the QueryClient.
 * - On the server: a NEW client every time (so users never share a cache).
 * - In the browser: ONE reused client (so the cache persists across renders).
 */
export function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}
