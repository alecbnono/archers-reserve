const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
const BASE_URL = `${API_URL}/admin`;

export interface SearchableUser {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "STUDENT" | "FACULTY";
}

export interface UserSearchResult {
  users?: SearchableUser[];
  error?: string;
}

/**
 * Search STUDENT/FACULTY users by username/name/email.
 * GET /admin/users/search?q=...
 * Admin-only.
 */
export async function searchUsers(query: string): Promise<UserSearchResult> {
  try {
    const res = await fetch(
      `${BASE_URL}/users/search?q=${encodeURIComponent(query)}`,
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
