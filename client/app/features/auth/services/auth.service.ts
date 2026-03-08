import type { RegisterPayload } from "../types/auth.types";

const BASE_URL = "http://localhost:3000/auth";

export interface AuthResult {
  user?: Record<string, unknown>;
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
