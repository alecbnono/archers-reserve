import type { User } from "~/types/user.types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
const PROFILE_URL = `${API_URL}/profile`;

export interface ProfileResult {
  user?: User;
  error?: string;
}

export async function uploadAvatar(file: File): Promise<ProfileResult> {
  const formData = new FormData();
  formData.append("avatar", file);

  const res = await fetch(`${PROFILE_URL}/me/avatar`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    return { error: data.error || "Upload failed" };
  }

  return { user: data.user };
}

export async function updateBio(bio: string): Promise<ProfileResult> {
  const res = await fetch(`${PROFILE_URL}/me/bio`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ bio }),
  });

  const data = await res.json();

  if (!res.ok) {
    return { error: data.error || "Failed to update bio" };
  }

  return { user: data.user };
}
