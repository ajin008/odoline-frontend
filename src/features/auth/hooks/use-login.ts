// features/auth/hooks/use-login.ts
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { authApi } from "../api/auth-api";
import { loginSchema, type LoginFormValues } from "../schemas/login-schema";
import type { UserRole } from "../types/auth-types";

export type { LoginFormValues };
import { getApiErrorMessage } from "@/src/utils/error-handler";

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
      // console.log("Login form submitted with values:", values);
      // Send only phone + pin. The server determines the real role.
      await authApi.login({ phone: values.phone, pin: values.pin });

      // Success means the server already set the httpOnly cookie.
      // There's no token to store — just navigate in.
      // `replace` so the back button doesn't return to the login screen.
      router.replace("/dashboard");
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
