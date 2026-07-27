/* eslint-disable react-hooks/set-state-in-effect */
// components/layout/owner/owner-navbar.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, LayoutDashboard } from "lucide-react";
import { UserMenu } from "./user-menu";
import { AnimatedGreeting } from "@/src/components/ui/animated-greeting";

export function OwnerNavbar() {
  const pathname = usePathname();
  const [clientDate, setClientDate] = useState("");

  useEffect(() => {
    const formatted = new Date().toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
    setClientDate(formatted);
  }, []);

  // Determine active route state for clean breadcrumb context
  const isDashboard = pathname === "/owner/dashboard";
  const isInventory = pathname.startsWith("/owner/inventory") || pathname.startsWith("/owner/cars");
  const isSettings = pathname.startsWith("/owner/settings");

  return (
    <header className="sticky top-0 z-30 bg-card/90 backdrop-blur-md border-b border-line/60 select-none shrink-0 transition-colors">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        {/* Left Side: Modern SaaS Navigation Context & Breadcrumbs */}
        <div className="flex items-center gap-2.5">
          {/* Mobile App Brand Badge (Mobile view) */}
          <div className="flex md:hidden h-8 w-8 items-center justify-center rounded-xl border border-line bg-card overflow-hidden shadow-2xs">
            <Image
              src="/icons/icon-192.png"
              alt="App Icon"
              width={22}
              height={22}
              className="object-cover rounded-md"
            />
          </div>

          {/* Breadcrumb Navigation Trail */}
          {isDashboard ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:flex h-7 w-7 items-center justify-center rounded-lg bg-inset text-ink-subtle border border-line">
                <LayoutDashboard className="h-3.5 w-3.5" />
              </span>
              <div className="flex flex-col">
                <AnimatedGreeting />
                <span className="text-[10px] font-mono text-ink-subtle leading-tight hidden sm:inline-block">
                  {clientDate}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-medium font-sans text-ink-subtle">
              <Link
                href="/owner/dashboard"
                className="hover:text-ink transition-colors flex items-center gap-1"
              >
                <span>Console</span>
              </Link>
              <ChevronRight className="h-3 w-3 text-ink-subtle/50 shrink-0" />

              {isInventory && (
                <div className="flex items-center gap-1.5 font-bold text-ink">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Inventory</span>
                </div>
              )}

              {isSettings && (
                <div className="flex items-center gap-1.5 font-bold text-ink">
                  <span>Settings</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side Container — Action Menus & User Profile */}
        <div className="flex items-center gap-3">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
