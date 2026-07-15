// features/auth/hooks/use-login.ts
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { authApi } from "../api/auth-api";
import { loginSchema, type LoginFormValues } from "../schemas/login-schema";
import type { UserRole } from "../types/auth-types";

export type { LoginFormValues };

/**
 * Turn any thrown error into a message the UI can show.
 * Reads the contract's error envelope: { error: { code, message } }.
 * (Could move to lib/ later if other features need the same mapping.)
 */
function getLoginErrorMessage(error: unknown): string {
  if (error instanceof AxiosError && error.response) {
    const code = error.response.data?.error?.code;
    if (code === "INVALID_CREDENTIALS") {
      return "Incorrect phone number or PIN.";
    }
    if (error.response.data?.error?.message) {
      return error.response.data.error.message;
    }
  }
  // Network error / server down / anything unexpected
  return "Unable to log in right now. Please try again.";
}

/**
 * All the login *logic* lives here. The component that uses this hook
 * stays "dumb": it renders inputs and shows whatever this hook returns.
 */
export function useLogin() {
  const router = useRouter();

  // The owner/staff toggle. UX only — NOT sent as a credential.
  const [role, setRole] = useState<UserRole>("owner");

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
      // Send only phone + pin. The server determines the real role.
      await authApi.login({ phone: values.phone, pin: values.pin });

      // Success means the server already set the httpOnly cookie.
      // There's no token to store — just navigate in.
      // `replace` so the back button doesn't return to the login screen.
      router.replace("/dashboard");
    } catch (error) {
      toast.error(getLoginErrorMessage(error));
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
