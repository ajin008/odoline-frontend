// features/auth/types/auth-types.ts

/** The two roles that exist in the users table. */
export type UserRole = "owner" | "sales";

/**
 * The authenticated user the backend returns.
 * Mirrors the `user` shape in the API contract — never includes pin_hash.
 */
export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  is_active: boolean;
  photo_url?: string | null;
  last_login_at: string | null;
}

/**
 * Exactly what we send to POST /auth/login.
 *
 * Note: there is NO `role` field here on purpose.
 * The server derives the real role from the user record (phone is unique).
 * The owner/staff toggle in the UI is a UX hint only — never a credential.
 */
export interface LoginCredentials {
  phone: string;
  pin: string;
}

export interface ChangePinPayload {
  current_pin: string;
  new_pin: string;
}
