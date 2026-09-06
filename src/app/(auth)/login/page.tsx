"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/features/auth/hooks/use-me";
import { LoginForm } from "@/src/features/auth/component/login-form";
import { AuthSplash } from "@/src/features/auth/component/auth-splash";

export default function LoginPage() {
  const { status, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && user) {
      const targetUrl =
        user.role === "owner" ? "/owner/dashboard" : "/staff/dashboard";
      router.replace(targetUrl);
    }
  }, [status, user, router]);

  // Initial auth check in flight → show neutral app splash, NEVER login form
  if (status === "loading") {
    return <AuthSplash />;
  }

  // Already authenticated → show splash while redirecting to dashboard
  if (status === "authenticated") {
    return <AuthSplash />;
  }

  // Unauthenticated → show login form
  return <LoginForm />;
}
