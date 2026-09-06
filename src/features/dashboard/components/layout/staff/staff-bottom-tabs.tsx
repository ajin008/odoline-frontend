"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Car,
  Users,
  CalendarCheck,
  Clock,
  Settings,
  Plus,
  Menu,
  X,
} from "lucide-react";
import { LeadModal } from "@/src/features/leads/components/lead-modal";

export function StaffBottomTabs() {
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isCreateLeadOpen, setIsCreateLeadOpen] = useState(false);

  const overflowItems = [
    {
      href: "/staff/follow-ups",
      label: "Follow-ups",
      icon: Clock,
    },
    {
      href: "/staff/booking",
      label: "Booking",
      icon: CalendarCheck,
    },
    {
      href: "/staff/setting",
      label: "Setting",
      icon: Settings,
    },
  ];

  const isOverflowActive = overflowItems.some((item) =>
    pathname.startsWith(item.href)
  );

  return (
    <>
      {/* ------------------------------------------------------------- */}
      {/* FLOATING DETACHED DOCK NAVIGATION BAR WITH CENTER PLUS BUTTON */}
      {/* ------------------------------------------------------------- */}
      <div className="fixed bottom-5 left-3 right-3 z-50 bg-card/85 backdrop-blur-xl border border-line rounded-full shadow-bento md:hidden select-none max-w-md mx-auto pointer-events-auto">
        <nav className="flex h-14 items-center justify-between px-3">
          {/* 1. Dashboard */}
          <Link
            href="/staff/dashboard"
            onClick={() => setIsMoreOpen(false)}
            className={[
              "flex flex-1 flex-col items-center justify-center h-full gap-0.5 text-[10px] font-semibold tracking-tight transition-all duration-200 active:scale-90",
              pathname === "/staff/dashboard" && !isMoreOpen
                ? "text-accent"
                : "text-ink-muted",
            ].join(" ")}
          >
            <div
              className={[
                "flex items-center justify-center px-3 py-1 rounded-full transition-all duration-200 ease-out",
                pathname === "/staff/dashboard" && !isMoreOpen
                  ? "bg-accent-light/60 text-accent mb-0.5"
                  : "text-ink-subtle bg-transparent",
              ].join(" ")}
            >
              <LayoutDashboard
                className={`h-[18px] w-[18px] shrink-0 ${
                  pathname === "/staff/dashboard" && !isMoreOpen
                    ? "stroke-[2.5px]"
                    : "stroke-[2px]"
                }`}
              />
            </div>
            <span className="font-sans leading-none">Dashboard</span>
          </Link>

          {/* 2. Inventory */}
          <Link
            href="/staff/stock"
            onClick={() => setIsMoreOpen(false)}
            className={[
              "flex flex-1 flex-col items-center justify-center h-full gap-0.5 text-[10px] font-semibold tracking-tight transition-all duration-200 active:scale-90",
              pathname.startsWith("/staff/stock") && !isMoreOpen
                ? "text-accent"
                : "text-ink-muted",
            ].join(" ")}
          >
            <div
              className={[
                "flex items-center justify-center px-3 py-1 rounded-full transition-all duration-200 ease-out",
                pathname.startsWith("/staff/stock") && !isMoreOpen
                  ? "bg-accent-light/60 text-accent mb-0.5"
                  : "text-ink-subtle bg-transparent",
              ].join(" ")}
            >
              <Car
                className={`h-[18px] w-[18px] shrink-0 ${
                  pathname.startsWith("/staff/stock") && !isMoreOpen
                    ? "stroke-[2.5px]"
                    : "stroke-[2px]"
                }`}
              />
            </div>
            <span className="font-sans leading-none">Inventory</span>
          </Link>

          {/* 3. CENTER PLUS BUTTON FOR CREATING NEW LEADS */}
          <div className="flex items-center justify-center px-1 -mt-5 shrink-0">
            <button
              type="button"
              onClick={() => {
                setIsMoreOpen(false);
                setIsCreateLeadOpen(true);
              }}
              title="Create New Lead"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-inverse border-2 border-card shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="h-6 w-6 stroke-[3px]" />
            </button>
          </div>

          {/* 4. Leads */}
          <Link
            href="/staff/leads"
            onClick={() => setIsMoreOpen(false)}
            className={[
              "flex flex-1 flex-col items-center justify-center h-full gap-0.5 text-[10px] font-semibold tracking-tight transition-all duration-200 active:scale-90",
              pathname.startsWith("/staff/leads") && !isMoreOpen
                ? "text-accent"
                : "text-ink-muted",
            ].join(" ")}
          >
            <div
              className={[
                "flex items-center justify-center px-3 py-1 rounded-full transition-all duration-200 ease-out",
                pathname.startsWith("/staff/leads") && !isMoreOpen
                  ? "bg-accent-light/60 text-accent mb-0.5"
                  : "text-ink-subtle bg-transparent",
              ].join(" ")}
            >
              <Users
                className={`h-[18px] w-[18px] shrink-0 ${
                  pathname.startsWith("/staff/leads") && !isMoreOpen
                    ? "stroke-[2.5px]"
                    : "stroke-[2px]"
                }`}
              />
            </div>
            <span className="font-sans leading-none">Leads</span>
          </Link>

          {/* 5. More (Contains Booking & Setting) */}
          <button
            type="button"
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            className={[
              "flex flex-1 flex-col items-center justify-center h-full gap-0.5 text-[10px] font-semibold tracking-tight transition-all duration-200 active:scale-90 cursor-pointer",
              isMoreOpen || isOverflowActive
                ? "text-accent"
                : "text-ink-muted",
            ].join(" ")}
          >
            <div
              className={[
                "flex items-center justify-center px-3 py-1 rounded-full transition-all duration-200 ease-out",
                isMoreOpen || isOverflowActive
                  ? "bg-accent-light/60 text-accent mb-0.5"
                  : "text-ink-subtle bg-transparent",
              ].join(" ")}
            >
              {isMoreOpen ? (
                <X className="h-[18px] w-[18px] stroke-[2.5px]" />
              ) : (
                <Menu
                  className={`h-[18px] w-[18px] ${
                    isOverflowActive ? "stroke-[2.5px]" : "stroke-[2px]"
                  }`}
                />
              )}
            </div>
            <span className="font-sans leading-none">
              {isMoreOpen ? "Close" : "More"}
            </span>
          </button>
        </nav>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* FLOATING COMPLEMENTARY SHEET CONTAINER FOR OVERFLOW (BOOKING & SETTING) */}
      {/* ------------------------------------------------------------- */}
      {isMoreOpen && (
        <>
          {/* Backdrop Mask */}
          <div
            onClick={() => setIsMoreOpen(false)}
            className="fixed inset-0 z-40 bg-ink/15 backdrop-blur-sm transition-opacity md:hidden animate-in fade-in duration-200 pointer-events-auto"
          />

          {/* Floating Action Menu Drawer Sheet */}
          <div className="fixed bottom-24 left-4 right-4 z-40 max-h-[55vh] overflow-y-auto bg-card border border-line rounded-[2rem] shadow-bento p-4 space-y-1.5 md:hidden max-w-md mx-auto animate-in slide-in-from-bottom-6 cubic-bezier(0.16, 1, 0.3, 1) duration-300 pointer-events-auto">
            <div className="text-[10px] font-mono font-bold tracking-widest text-ink-subtle uppercase px-3 py-1.5 border-b border-line/40 mb-2">
              Staff Tools &amp; Settings
            </div>

            <div className="grid grid-cols-1 gap-1">
              {overflowItems.map((item) => {
                const active = pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMoreOpen(false)}
                    className={[
                      "group flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-150 active:scale-[0.99]",
                      active
                        ? "bg-accent text-inverse"
                        : "text-ink-muted hover:bg-canvas/80 hover:text-ink",
                    ].join(" ")}
                  >
                    <Icon
                      className={`h-4 w-4 shrink-0 ${
                        active
                          ? "text-inverse stroke-[2.5px]"
                          : "text-ink-subtle group-hover:text-ink"
                      }`}
                    />
                    <span className="font-sans tracking-tight">
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* FUNCTIONAL ADD LEAD MODAL */}
      <LeadModal
        isOpen={isCreateLeadOpen}
        onClose={() => setIsCreateLeadOpen(false)}
      />
    </>
  );
}
