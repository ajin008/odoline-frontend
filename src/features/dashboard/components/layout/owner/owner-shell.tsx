// components/layout/owner/owner-shell.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMe } from "@/src/features/auth/hooks/use-me";
import { OwnerSidebar } from "./owner-sidebar";
import { OwnerNavbar } from "./owner-navbar";
import { OwnerBottomTabs } from "./owner-bottom-tabs";

export function OwnerShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: user, isLoading, isError } = useMe();

  // Redirect if not an owner (or not logged in). Runs when the query resolves.
  useEffect(() => {
    if (isError || (user && user.role !== "owner")) {
      router.replace("/login");
    }
  }, [user, isError, router]);

  // While the session is being verified, show the loading spinner.
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-line border-t-accent" />
      </div>
    );
  }

  // Not an owner → render nothing while the redirect above kicks in.
  if (!user || user.role !== "owner") {
    return null;
  }

  return (
    <div className="h-screen max-h-screen bg-canvas antialiased p-0 md:p-3 lg:p-4 flex overflow-hidden">
      <div className="hidden md:block md:w-[240px] shrink-0 overflow-hidden rounded-2xl md:mr-3 lg:mr-4">
        <OwnerSidebar />
      </div>

      {/* Unified Right Workspace Panel (Modern Premium SaaS Layout) */}
      <div className="flex-1 flex flex-col bg-card rounded-none md:rounded-2xl border-none md:border border-line shadow-none md:shadow-bento overflow-hidden h-full min-w-0">
        <OwnerNavbar />
        <main className="flex-1 px-4 sm:px-6 py-5 overflow-y-auto pb-24 md:pb-6 animate-in fade-in duration-300">
          {children}
        </main>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 md:hidden">
        <OwnerBottomTabs />
      </div>
    </div>
  );
}
