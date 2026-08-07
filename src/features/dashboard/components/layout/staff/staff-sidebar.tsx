"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { staffNavItems } from "./staff-nav-items";
import { ShieldCheck, Building2 } from "lucide-react";

export function StaffSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full flex-col bg-[#171819] text-white border border-[#262729] rounded-xl shadow-bento overflow-hidden select-none">
      {/* Brand Identity Branding Header */}
      <div className="flex h-18 items-center px-6 border-b border-[#262729]">
        <div className="flex items-center gap-2.5">
          <Image
            src="/icons/icon-192.png"
            alt="Cars4 Logo"
            width={28}
            height={28}
            className="rounded-md object-contain"
            priority
          />
          <div className="flex flex-col">
            <span className="font-heading text-[15px] font-semibold tracking-tight text-white leading-tight">
              Cars4
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold tracking-wider uppercase">
              Staff Terminal
            </span>
          </div>
        </div>
      </div>

      {/* Dynamic Navigation Layout System */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {staffNavItems.map((item) => {
            const active = pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={[
                    "group flex items-center justify-between rounded-lg px-3.5 py-2.5 text-[13px] font-semibold transition-all duration-200 ease-out active:scale-[0.98]",
                    active
                      ? "bg-accent text-white shadow-sm"
                      : "text-slate-400 hover:bg-white/10 hover:text-white",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={[
                        "h-4 w-4 shrink-0 transition-all duration-200",
                        active
                          ? "text-white stroke-[2.5px]"
                          : "text-slate-400 group-hover:text-white",
                      ].join(" ")}
                    />
                    <span>{item.label}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Internal Showroom Context Block */}
      <div className="p-4 border-t border-[#262729] bg-[#121314]/60 space-y-2.5">
        <div className="flex items-center gap-2 text-slate-300">
          <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span className="text-xs font-semibold tracking-tight text-white">
            Sales Staff Portal
          </span>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-[#1e1f21] border border-[#2e2f33] p-2 shadow-sm">
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold tracking-wide uppercase text-slate-300">
              Session Active
            </span>
          </div>
          <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
        </div>
      </div>
    </aside>
  );
}
