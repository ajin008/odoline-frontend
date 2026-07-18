// components/layout/owner/user-menu.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, ChevronDown, User, Settings } from "lucide-react";
import { authApi } from "@/src/features/auth/api/auth-api";

interface UserMenuProps {
  userName: string;
  variant?: "desktop" | "mobile";
}

export function UserMenu({ userName, variant = "desktop" }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    try {
      await authApi.logout();
    } finally {
      router.replace("/login");
    }
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={[
          "flex items-center gap-2 rounded-lg transition-all duration-150",
          variant === "desktop"
            ? "p-1.5 hover:bg-canvas-secondary"
            : "p-1 hover:bg-canvas-secondary",
          isOpen && "bg-canvas-secondary",
        ].join(" ")}
      >
        {/* User icon instead of dark circle */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-canvas-secondary">
          <User className="h-4 w-4 text-ink-secondary" />
        </div>

        {variant === "desktop" && (
          <>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-medium leading-tight text-ink">
                {userName}
              </p>
              <p className="text-2xs text-ink-secondary">Owner</p>
            </div>
            <ChevronDown
              className={[
                "hidden h-4 w-4 text-ink-secondary transition-transform duration-150 sm:block",
                isOpen && "rotate-180",
              ].join(" ")}
            />
          </>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 overflow-hidden rounded-lg border border-line bg-canvas shadow-md">
          {/* User info */}
          <div className="border-b border-line px-4 py-3">
            <p className="text-sm font-medium text-ink">{userName}</p>
            <p className="text-2xs text-ink-secondary">Owner account</p>
          </div>

          {/* Menu items */}
          <div className="py-1">
            <button
              onClick={() => {
                setIsOpen(false);
                router.push("/owner/settings");
              }}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-ink-secondary transition-colors hover:bg-canvas-secondary hover:text-ink"
            >
              <Settings className="h-4 w-4" />
              Settings
            </button>

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-danger transition-colors hover:bg-danger-light"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
