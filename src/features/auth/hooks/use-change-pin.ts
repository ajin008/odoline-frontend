import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/auth-api";
import type { ChangePinPayload } from "../types/auth-types";

export function useChangePin() {
  return useMutation({
    mutationFn: (payload: ChangePinPayload) => authApi.changePin(payload),
  });
}
