import { Suspense } from "react";
import { SettingsShell } from "@/src/features/settings/components/settings-shell";

export const metadata = {
  title: "Settings | Owner Terminal",
  description: "Manage owner profile credentials and system data exports.",
};

/**
 * Server Component: Owner Settings Page
 *
 * Keeps page.tsx pure Server-side (no 'use client' directive).
 * Mounts client-interactive SettingsShell wrapped in Suspense for searchParams hydration.
 */
export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full space-y-4 animate-pulse">
          <div className="h-10 w-48 rounded-lg bg-inset border border-line/40" />
          <div className="h-64 w-full rounded-xl bg-inset border border-line/40" />
        </div>
      }
    >
      <SettingsShell />
    </Suspense>
  );
}
