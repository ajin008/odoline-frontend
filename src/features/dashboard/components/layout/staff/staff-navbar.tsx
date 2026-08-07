"use client";

import Image from "next/image";
import { UserMenu } from "../owner/user-menu";

export function StaffNavbar() {
  return (
    <header className="sticky top-0 z-30 bg-card/90 backdrop-blur-md border-b border-line/60 select-none shrink-0 transition-colors">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        {/* Left Side: Brand Logo Context */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-line bg-card overflow-hidden shadow-2xs">
            <Image
              src="/icons/icon-192.png"
              alt="App Icon"
              width={22}
              height={22}
              className="object-cover rounded-md"
            />
          </div>
          <span className="font-heading text-sm font-semibold tracking-tight text-ink">
            Cars4
          </span>
        </div>

        {/* Right Side: User Profile Menu */}
        <div className="flex items-center gap-3">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
