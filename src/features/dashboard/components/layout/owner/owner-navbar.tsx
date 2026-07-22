/* eslint-disable react-hooks/set-state-in-effect */
// components/layout/owner/owner-navbar.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import { UserMenu } from "./user-menu";
import { AnimatedGreeting } from "@/src/components/ui/animated-greeting";

export function OwnerNavbar() {
  const pathname = usePathname();
  const [clientDate, setClientDate] = useState("");

  useEffect(() => {
    const formatted = new Date().toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    setClientDate(formatted);
  }, []);

  // Determine if the current route is strictly the main entry dashboard
  const isDashboard = pathname === "/owner/dashboard";

  return (
    <header className="sticky top-0 z-30 bg-transparent select-none">
      <div className="flex h-18 items-center justify-between px-6">
        {/* Left Side: Conditional Layout Stream */}
        <div className="flex items-center min-h-11">
          {isDashboard ? (
            <div className="flex flex-col justify-center">
              {/* Animated text element executes greeting sequence without username */}
              <AnimatedGreeting />
              <p className="text-xs font-medium text-ink-subtle font-sans mt-1 min-h-4">
                {clientDate}
              </p>
            </div>
          ) : (
            /* Non-dashboard layout icon control */
            <>
              {/* Mobile View: Custom PWA App Icon */}
              <div className="flex sm:hidden h-9 w-9 items-center justify-center rounded-xl border border-line bg-card overflow-hidden shadow-sm transition-colors duration-200">
                <Image
                  src="/icons/icon-192.png"
                  alt="App Icon"
                  width={24}
                  height={24}
                  className="object-cover rounded-md"
                />
              </div>

              {/* Tablet & Desktop View: ShieldCheck Icon */}
              <div className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-card text-ink-muted shadow-sm transition-colors duration-200">
                <ShieldCheck className="h-5 w-5 stroke-[2px]" />
              </div>
            </>
          )}
        </div>

        {/* Right Side Container — Action Menus */}
        <div className="flex items-center gap-4">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
