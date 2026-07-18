// components/layout/owner/owner-shell.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/src/features/auth/api/auth-api";
import { OwnerSidebar } from "./owner-sidebar";
import { OwnerNavbar } from "./owner-navbar";
import { OwnerBottomTabs } from "./owner-bottom-tabs";

export function OwnerShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    authApi
      .me()
      .then((user) => {
        if (user.role !== "owner") {
          router.replace("/login");
          return;
        }
        setUserName(user.name);
        setChecking(false);
      })
      .catch(() => {
        router.replace("/login");
      });
  }, [router]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-line border-t-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas antialiased p-0 md:p-3 lg:p-4 flex">
      {/* Desktop Navigation Left Column */}
      <div className="hidden md:block md:w-[240px] shrink-0 overflow-hidden rounded-2xl md:mr-3 lg:mr-4">
        <OwnerSidebar />
      </div>

      {/* Main Right Bento Shell Container Frame */}
      <div className="flex-1 flex flex-col bg-card rounded-2xl border border-line shadow-bento overflow-hidden">
        <OwnerNavbar userName={userName ?? ""} />

        <main className="flex-1 px-6 py-6 overflow-y-auto pb-24 animate-in fade-in duration-300">
          <div className="max-w-[1300px] mx-auto w-full">{children}</div>
        </main>
      </div>

      {/* Floating System Tabs on Mobile Viewports */}
      <div className="fixed inset-x-0 bottom-0 z-40 md:hidden">
        <OwnerBottomTabs />
      </div>
    </div>
  );
}
