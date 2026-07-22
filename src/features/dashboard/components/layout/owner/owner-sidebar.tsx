// components/layout/owner/owner-sidebar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ownerNavItems } from "./nav-items";
import { ShieldCheck, MapPin } from "lucide-react";

export function OwnerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full flex-col bg-card border border-line rounded-2xl shadow-bento overflow-hidden select-none">
      {/* Brand Identity Branding Header (Updated with Image & Fixed Typography) */}
      <div className="flex h-18 items-center px-6 border-b border-line/60">
        <div className="flex items-center gap-2.5">
          <Image
            src="/icons/icon-192.png"
            alt="Cars4 Logo"
            width={28}
            height={28}
            className="rounded-lg object-contain"
            priority
          />
          <span className="font-heading text-[15px] font-semibold tracking-tight text-ink">
            Cars4
          </span>
        </div>
      </div>

      {/* Dynamic Navigation Layout System */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {ownerNavItems.map((item) => {
            const active = pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={[
                    "group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-[13px] font-semibold transition-all duration-200 ease-out active:scale-[0.98]",
                    active
                      ? "bg-accent text-inverse shadow-sm"
                      : "text-ink-muted hover:bg-canvas/80 hover:text-ink",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={[
                        "h-4 w-4 shrink-0 transition-all duration-200",
                        active
                          ? "text-inverse stroke-[2.5px]"
                          : "text-ink-subtle group-hover:text-ink",
                      ].join(" ")}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.label === "Inventory" && (
                    <span
                      className={[
                        "px-1.5 py-0.5 text-[10px] font-bold rounded-md font-mono transition-colors duration-200",
                        active
                          ? "bg-inverse/20 text-inverse"
                          : "bg-inset text-ink-muted",
                      ].join(" ")}
                    >
                      0
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Internal Showroom Context Block */}
      <div className="p-4 border-t border-line/60 bg-inset/40 space-y-2.5">
        <div className="flex items-center gap-2 text-ink-muted">
          <MapPin className="h-3.5 w-3.5 text-ink-subtle shrink-0" />
          <span className="text-xs font-semibold tracking-tight text-ink">
            Main Showroom
          </span>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-card border border-line p-2 shadow-sm">
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            <span className="text-[10px] font-bold tracking-wide uppercase text-ink-muted">
              Terminal Online
            </span>
          </div>
          <ShieldCheck className="h-3.5 w-3.5 text-ink-subtle" />
        </div>
      </div>
    </aside>
  );
}
