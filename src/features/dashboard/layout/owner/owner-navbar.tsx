// components/layout/owner/owner-navbar.tsx
"use client";

import { usePathname } from "next/navigation";
import { ownerNavItems } from "./nav-items";
import { UserMenu } from "./user-menu";

export function OwnerNavbar({ userName }: { userName: string }) {
  const pathname = usePathname();

  const currentPage = ownerNavItems.find((item) =>
    pathname.startsWith(item.href)
  );
  const pageTitle = currentPage?.label || "Dashboard";

  return (
    /* Removed heavy canvas background and bounding layout borders */
    <header className="sticky top-0 z-30 bg-transparent select-none">
      <div className="flex h-[72px] items-center justify-between px-6">
        {/* Clean, open page title matching bento alignment grids */}
        <h1 className="font-heading text-lg font-bold tracking-tight text-ink">
          {pageTitle}
        </h1>

        {/* Clean user utility control menu */}
        <div className="flex items-center gap-3">
          <UserMenu userName={userName} variant="desktop" />
        </div>
      </div>
    </header>
  );
}
