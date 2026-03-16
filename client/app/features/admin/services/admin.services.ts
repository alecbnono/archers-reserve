

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
const BASE_URL = `${API_URL}/admin`;

/**
 * Fetch admin dashboard data (GET /admin/dashboard).
 */
export async function fetchAdminDashboard(): Promise<{
  rooms?: any[];
  error?: string;
}> {
  const res = await fetch(`${BASE_URL}/dashboard`, {
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    return { error: data.error || "Failed to fetch dashboard" };
  }

  return data;
}

