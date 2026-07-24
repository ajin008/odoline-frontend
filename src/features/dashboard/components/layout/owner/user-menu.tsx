// components/layout/owner/user-menu.tsx
"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { useLogout } from "@/src/features/auth/hooks/use-logout";
import { ConfirmModal } from "@/src/components/ui/confirm-modal";

export function UserMenu() {
  const { logout } = useLogout();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowLogoutConfirm(true)}
        title="Sign out"
        className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-inverse transition-all duration-150 hover:bg-accent-hover active:scale-95 cursor-pointer shadow-sm"
      >
        <LogOut className="h-4 w-4 stroke-[2.5px]" />
      </button>

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
    </>
  );
}
