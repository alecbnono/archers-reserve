const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
const PROFILE_URL = `${API_URL}/profile`;

export interface UserSearchEntry {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  profilePictureUrl: string;
  role: string;
}

export interface UserSearchResult {
  users?: UserSearchEntry[];
  error?: string;
}

/**
 * Search users by username/name.
 * GET /profile/search?q=...
 * Available to all authenticated users.
 */
export async function searchUsers(query: string): Promise<UserSearchResult> {
  try {
    const res = await fetch(
      `${PROFILE_URL}/search?q=${encodeURIComponent(query)}`,
      { credentials: "include" },
    );

    const data = await res.json();

    if (!res.ok) {
      return { error: data.error || "Failed to search users" };
    }

    return { users: data.users };
  } catch {
    return { error: "Network error searching users" };
  }
}
