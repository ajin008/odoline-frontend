import { defaultCache } from "@serwist/next/worker";
import { Serwist } from "serwist";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

// Exclude S3 / AWS origins from Serwist runtime caching so the Service Worker
// never intercepts cross-origin S3 fetches (preventing opaque response errors).
const customRuntimeCaching = defaultCache.map((entry) => {
  if (entry.matcher instanceof RegExp) {
    const originalRegExp = entry.matcher;
    return {
      ...entry,
      matcher: ({ url }: { url: URL }) => {
        if (
          url.hostname.includes("amazonaws.com") ||
          url.hostname.includes("s3")
        ) {
          return false;
        }
        return originalRegExp.test(url.href) || originalRegExp.test(url.pathname);
      },
    };
  }
  if (typeof entry.matcher === "function") {
    const originalMatcher = entry.matcher;
    return {
      ...entry,
      matcher: (options: { url?: URL }) => {
        if (
          options.url?.hostname?.includes("amazonaws.com") ||
          options.url?.hostname?.includes("s3")
        ) {
          return false;
        }
        return originalMatcher(options as Parameters<typeof originalMatcher>[0]);
      },
    };
  }
  return entry;
});

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: customRuntimeCaching,
});

serwist.addEventListeners();
