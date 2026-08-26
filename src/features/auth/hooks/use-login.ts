// features/auth/hooks/use-login.ts
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { authApi } from "../api/auth-api";
import { loginSchema, type LoginFormValues } from "../schemas/login-schema";
import type { UserRole } from "../types/auth-types";

export type { LoginFormValues };
import { getApiErrorMessage } from "@/src/utils/error-handler";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/src/lib/query-keys";
import { useMe } from "./use-me";

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [role, setRole] = useState<UserRole>("owner");

  const { data: user } = useMe();

  // If user visits /login while already authenticated, redirect to their dashboard
  useEffect(() => {
    if (user) {
      const targetUrl =
        user.role === "owner" ? "/owner/dashboard" : "/staff/dashboard";
      router.replace(targetUrl);
    }
  }, [user, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { phone: "", pin: "" },
    mode: "onSubmit",
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const loggedInUser = await authApi.login({
        phone: values.phone,
        pin: values.pin,
      });

      queryClient.setQueryData(queryKeys.me, loggedInUser);

      // Perform a hard browser redirect using window.location.assign to clear
      // router cache and guarantee fresh httpOnly cookies on the new dashboard document
      // without violating React Compiler immutability rules.
      const targetUrl =
        loggedInUser.role === "owner"
          ? "/owner/dashboard"
          : "/staff/dashboard";

      window.location.assign(targetUrl);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  });

  return {
    register,
    errors,
    onSubmit,
    isSubmitting,
    role,
    setRole,
  };
}
