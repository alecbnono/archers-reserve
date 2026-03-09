import type { RegisterPayload } from "../types/auth.types";
import type { User } from "~/types/user.types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
const BASE_URL = `${API_URL}/auth`;

export interface AuthResult {
  user?: User;
  error?: string;
}

export async function registerUser(
  payload: RegisterPayload,
): Promise<AuthResult> {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    return { error: data.error || "Registration failed" };
  }

  return { user: data.user };
}

export async function loginUser(
  identifier: string,
  password: string,
  remember: boolean,
): Promise<AuthResult> {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ identifier, password, remember }),
  });

  const data = await res.json();

  if (!res.ok) {
    return { error: data.error || "Login failed" };
  }

  return { user: data.user };
}

export async function logoutUser(): Promise<{ error?: string }> {
  const res = await fetch(`${BASE_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    const data = await res.json();
    return { error: data.error || "Logout failed" };
  }

  return {};
}

export async function fetchCurrentUser(): Promise<AuthResult> {
  const res = await fetch(`${BASE_URL}/me`, {
    credentials: "include",
  });

  if (!res.ok) {
    return { error: "Not authenticated" };
  }

  const data = await res.json();
  return { user: data.user };
}
