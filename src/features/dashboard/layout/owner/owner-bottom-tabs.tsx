// components/layout/owner/owner-bottom-tabs.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ownerNavItems } from "./nav-items";

/**
 * Mobile bottom tab bar — the "feels like an app" navigation.
 * Same links as the sidebar, laid out as evenly-spaced tabs with
 * icon over label. Only the items flagged `mobile: true` show here.
 */
export function OwnerBottomTabs() {
  const pathname = usePathname();
  const items = ownerNavItems.filter((i) => i.mobile);

  return (
    <nav className="flex border-t border-line bg-canvas pb-[env(safe-area-inset-bottom)]">
      {items.map((item) => {
        const active = pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={[
              "flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium transition-colors",
              active ? "text-ink font-semibold" : "text-ink-secondary",
            ].join(" ")}
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
