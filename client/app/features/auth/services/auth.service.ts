import type { RegisterPayload } from "../types/auth.types";
import type { User } from "~/types/user.types";
import { API_URL } from "~/config/api";
import {
  clearAccessToken,
  getAuthHeaders,
  setAccessToken,
} from "~/lib/auth";

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
    body: JSON.stringify({ identifier, password, remember }),
  });

  const data = await res.json();

  if (!res.ok) {
    return { error: data.error || "Login failed" };
  }

  if (data.accessToken) {
    setAccessToken(data.accessToken);
  }

  return { user: data.user };
}

export async function logoutUser(): Promise<{ error?: string }> {
  const res = await fetch(`${BASE_URL}/logout`, {
    method: "POST",
    headers: getAuthHeaders(),
  });

  clearAccessToken();

  if (!res.ok) {
    const data = await res.json();
    return { error: data.error || "Logout failed" };
  }

  return {};
}

export async function fetchCurrentUser(): Promise<AuthResult> {
  const res = await fetch(`${BASE_URL}/me`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    return { error: "Not authenticated" };
  }

  const data = await res.json();
  return { user: data.user };
}