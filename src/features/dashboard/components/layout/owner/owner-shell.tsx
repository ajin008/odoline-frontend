// components/layout/owner/owner-shell.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { useAuth } from "@/src/features/auth/hooks/use-me";
import { AuthSplash } from "@/src/features/auth/component/auth-splash";
import { OwnerSidebar } from "./owner-sidebar";
import { OwnerNavbar } from "./owner-navbar";
import { OwnerBottomTabs } from "./owner-bottom-tabs";

export function OwnerShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, status, error } = useAuth();
  const isUnauthorized = isAxiosError(error) && error.response?.status === 401;

  // Redirect ONLY after the auth check resolves (status !== "loading")
  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated" || isUnauthorized || (user && !user.is_active)) {
      router.replace("/login");
    } else if (status === "authenticated" && user && user.role !== "owner") {
      router.replace("/staff/dashboard");
    }
  }, [user, status, isUnauthorized, router]);

  // While session is being verified, show the clean branded splash
  if (status === "loading") {
    return <AuthSplash />;
  }

  // Not an owner or unauthenticated → render nothing while redirect kicks in
  if (status !== "authenticated" || !user || user.role !== "owner" || !user.is_active) {
    return null;
  }

  return (
    <div className="h-[100dvh] max-h-[100dvh] bg-canvas antialiased p-0 md:p-3 lg:p-4 flex overflow-hidden">
      <div className="hidden md:block md:w-[240px] shrink-0 overflow-hidden rounded-xl md:mr-3 lg:mr-4">
        <OwnerSidebar />
      </div>

      {/* Unified Right Workspace Panel (Modern Premium SaaS Layout) */}
      <div className="flex-1 flex flex-col bg-card rounded-none md:rounded-xl border-none md:border border-line shadow-none md:shadow-bento overflow-hidden h-full min-w-0">
        <OwnerNavbar />
        <main className="flex-1 px-4 sm:px-6 py-3 sm:py-4 overflow-y-auto pb-36 md:pb-6 overscroll-y-contain animate-in fade-in duration-300">
          {children}
        </main>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 md:hidden pointer-events-none">
        <OwnerBottomTabs />
      </div>
    </div>
  );
}
