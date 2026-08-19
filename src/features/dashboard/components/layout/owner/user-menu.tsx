// components/layout/owner/user-menu.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LogOut,
  ChevronDown,
  User,
  Settings,
  Users,
  ShieldCheck,
} from "lucide-react";
import { useMe } from "@/src/features/auth/hooks/use-me";
import { useLogout } from "@/src/features/auth/hooks/use-logout";
import { ConfirmModal } from "@/src/components/ui/confirm-modal";

function getInitials(name?: string) {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function UserMenu() {
  const { data: user } = useMe();
  const { logout } = useLogout();
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const isOwner = user?.role === "owner";
  const initials = getInitials(user?.name);
  const profileLink = isOwner
    ? "/owner/settings?tab=profile"
    : "/staff/setting";

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Handle Escape key press
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className="relative inline-block text-left font-sans select-none"
    >
      {/* SaaS Profile Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        title={user?.name || "User Account"}
        className={[
          "group flex items-center gap-2 rounded-xl border p-1 sm:px-2.5 sm:py-1.5 transition-all duration-150 outline-none cursor-pointer",
          isOpen
            ? "border-line bg-inset text-ink shadow-xs"
            : "border-line/60 bg-card hover:border-line hover:bg-inset text-ink",
        ].join(" ")}
      >
        {/* Avatar Image / Initials Badge */}
        <div className="relative flex h-7.5 w-7.5 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-accent/10 border border-accent/20 text-accent font-bold font-mono text-xs shadow-2xs">
          {user?.photo_url ? (
            <Image
              src={user.photo_url}
              alt={user.name || "User Avatar"}
              fill
              sizes="30px"
              className="object-cover rounded-lg"
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>

        {/* User Name & Role (Shown on medium+ screens for premium SaaS feel) */}
        <div className="hidden md:flex flex-col text-left leading-none min-w-0 pr-0.5">
          <span className="text-xs font-bold text-ink truncate max-w-[120px]">
            {user?.name || "Account"}
          </span>
          <span className="text-[10px] font-mono text-ink-subtle capitalize mt-0.5">
            {isOwner ? "Owner" : "Sales Staff"}
          </span>
        </div>

        {/* Dynamic Chevron */}
        <ChevronDown
          className={[
            "h-3.5 w-3.5 shrink-0 text-ink-subtle transition-transform duration-200 ease-out",
            isOpen ? "rotate-180 text-ink" : "group-hover:text-ink",
          ].join(" ")}
        />
      </button>

      {/* Premium SaaS Dropdown Popover */}
      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-64 z-50 rounded-2xl border border-line bg-card p-1.5 shadow-2xl animate-in fade-in-50 zoom-in-95 duration-150 space-y-1"
        >
          {/* User Profile Card Header */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-inset/60 border border-line/40">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-accent/15 border border-accent/25 text-accent font-bold font-mono text-sm shadow-xs">
              {user?.photo_url ? (
                <Image
                  src={user.photo_url}
                  alt={user.name || "User Avatar"}
                  fill
                  sizes="40px"
                  className="object-cover rounded-xl"
                />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-ink truncate">
                {user?.name || "User"}
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={[
                    "text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-md leading-none border uppercase tracking-wider",
                    isOwner
                      ? "bg-indigo-500/10 text-indigo-600 border-indigo-500/20"
                      : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
                  ].join(" ")}
                >
                  {isOwner ? "Owner" : "Sales"}
                </span>
                {user?.phone && (
                  <span className="text-[10px] text-ink-subtle font-mono truncate">
                    {user.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="my-1 border-t border-line/60" />

          {/* Quick Navigation Items */}
          <div className="space-y-0.5">
            <Link
              href={profileLink}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-ink hover:bg-inset transition-colors group cursor-pointer"
            >
              <User className="h-4 w-4 text-ink-subtle group-hover:text-accent stroke-[2px] shrink-0 transition-colors" />
              <div className="flex flex-col min-w-0">
                <span>Profile & Account</span>
                <span className="text-[10px] font-normal text-ink-subtle">
                  Manage personal details & PIN
                </span>
              </div>
            </Link>

            {isOwner ? (
              <>
                <Link
                  href="/owner/settings"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-ink hover:bg-inset transition-colors group cursor-pointer"
                >
                  <Settings className="h-4 w-4 text-ink-subtle group-hover:text-accent stroke-[2px] shrink-0 transition-colors" />
                  <div className="flex flex-col min-w-0">
                    <span>Terminal Settings</span>
                    <span className="text-[10px] font-normal text-ink-subtle">
                      Showroom, departments & rules
                    </span>
                  </div>
                </Link>

                <Link
                  href="/owner/team"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-ink hover:bg-inset transition-colors group cursor-pointer"
                >
                  <Users className="h-4 w-4 text-ink-subtle group-hover:text-accent stroke-[2px] shrink-0 transition-colors" />
                  <div className="flex flex-col min-w-0">
                    <span>Team Management</span>
                    <span className="text-[10px] font-normal text-ink-subtle">
                      Staff permissions & attendance
                    </span>
                  </div>
                </Link>
              </>
            ) : (
              <Link
                href="/staff/setting?tab=attendance"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-ink hover:bg-inset transition-colors group cursor-pointer"
              >
                <ShieldCheck className="h-4 w-4 text-ink-subtle group-hover:text-accent stroke-[2px] shrink-0 transition-colors" />
                <div className="flex flex-col min-w-0">
                  <span>Attendance & Logs</span>
                  <span className="text-[10px] font-normal text-ink-subtle">
                    View work records & clock-ins
                  </span>
                </div>
              </Link>
            )}
          </div>

          <div className="my-1 border-t border-line/60" />

          {/* Sign Out Button */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setShowLogoutConfirm(true);
            }}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4 stroke-[2.25px] shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={logout}
        title="Sign Out of Terminal"
        description="Are you sure you want to sign out of your account session? You will need to sign in again to access inventory metrics."
        confirmText="Sign Out"
        cancelText="Cancel"
        variant="danger"
        icon={<LogOut className="h-5.5 w-5.5 stroke-[2.25px]" />}
      />
    </div>
  );
}
