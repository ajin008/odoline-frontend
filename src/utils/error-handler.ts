// lib/error-handler.ts
import { AxiosError } from "axios";

/**
 * Global utility to turn any API error envelope into a human-readable string.
 */
export function getApiErrorMessage(error: unknown): string {
  if (error instanceof AxiosError && error.response) {
    const code = error.response.data?.error?.code;

    // You can keep global codes here
    if (code === "INVALID_CREDENTIALS") {
      return "Incorrect phone number or PIN.";
    }
    if (code === "UNAUTHORIZED") {
      return "Your session has expired. Please log in again.";
    }

    // If the server sent a specific message, use it
    if (error.response.data?.error?.message) {
      return error.response.data.error.message;
    }
  }

  // Catch-all fallback for network failures / server crashes
  return "Something went wrong. Please try again.";
}
