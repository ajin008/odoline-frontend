// components/layout/owner/owner-navbar.tsx
"use client";

import { UserMenu } from "./user-menu";
import { useMe } from "@/src/features/auth/hooks/use-me";
import { AnimatedGreeting } from "@/src/components/ui/animated-greeting";

export function OwnerNavbar() {
  const { data: user } = useMe();
  const firstName = user?.name?.split(" ")[0];

  return (
    <header className="sticky top-0 z-30 bg-transparent select-none">
      <div className="flex h-18 items-center justify-between px-6">
        {/* Animated Client-Side Text Reveal Element */}
        <AnimatedGreeting firstName={firstName} />

        <div className="flex items-center gap-4">
          {user?.name && (
            <div className="hidden sm:flex flex-col text-right items-end justify-center pr-1">
              <span className="text-sm font-semibold tracking-tight text-ink leading-tight">
                {user.name}
              </span>
              <span className="text-[10px] font-medium text-ink-secondary tracking-wide uppercase mt-0.5">
                Owner Terminal
              </span>
            </div>
          )}
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
