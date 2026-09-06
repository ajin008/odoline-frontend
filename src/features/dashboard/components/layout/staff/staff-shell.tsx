"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { useAuth } from "@/src/features/auth/hooks/use-me";
import { AuthSplash } from "@/src/features/auth/component/auth-splash";
import { StaffSidebar } from "./staff-sidebar";
import { StaffNavbar } from "./staff-navbar";
import { StaffBottomTabs } from "./staff-bottom-tabs";

export function StaffShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, status, error } = useAuth();
  const isUnauthorized = isAxiosError(error) && error.response?.status === 401;

  // Role guard: non-owner staff (sales and cro) with is_active === true can access staff routes
  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated" || isUnauthorized || (user && !user.is_active)) {
      router.replace("/login");
    } else if (status === "authenticated" && user && user.role === "owner") {
      router.replace("/owner/dashboard");
    }
  }, [user, status, isUnauthorized, router]);

  if (status === "loading") {
    return <AuthSplash />;
  }

  if (status !== "authenticated" || !user || user.role === "owner" || !user.is_active) {
    return null;
  }

  return (
    <div className="h-[100dvh] max-h-[100dvh] bg-canvas antialiased p-0 md:p-3 lg:p-4 flex overflow-hidden">
      {/* Desktop Sidebar Navigation */}
      <div className="hidden md:block md:w-[240px] shrink-0 overflow-hidden rounded-xl md:mr-3 lg:mr-4">
        <StaffSidebar />
      </div>

      {/* Unified Right Workspace Panel */}
      <div className="flex-1 flex flex-col bg-card rounded-none md:rounded-xl border-none md:border border-line shadow-none md:shadow-bento overflow-hidden h-full min-w-0">
        <StaffNavbar />
        <main className="flex-1 flex flex-col px-4 sm:px-6 py-5 overflow-y-auto pb-24 md:pb-6 overscroll-y-contain animate-in fade-in duration-300">
          {children}
        </main>
      </div>

      {/* Mobile Floating Bottom Dock Navigation Bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 md:hidden pointer-events-none">
        <StaffBottomTabs />
      </div>
    </div>
  );
}
