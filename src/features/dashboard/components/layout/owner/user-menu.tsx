// components/layout/owner/user-menu.tsx
"use client";

import { LogOut } from "lucide-react";
import { useLogout } from "@/src/features/auth/hooks/use-logout";

export function UserMenu() {
  const { logout } = useLogout();

  return (
    <button
      onClick={logout}
      title="Sign out"
      className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-inverse transition-all duration-150 hover:bg-accent-hover active:scale-95 cursor-pointer shadow-sm"
    >
      <LogOut className="h-4 w-4 stroke-[2.5px]" />
    </button>
  );
}
