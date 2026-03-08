import type { RegisterPayload } from "../types/auth.types";

const REGISTER_URL = "http://localhost:3000/auth/register";

export interface RegisterResult {
  user?: Record<string, unknown>;
  error?: string;
}

export async function registerUser(
  payload: RegisterPayload,
): Promise<RegisterResult> {
  const res = await fetch(REGISTER_URL, {
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
