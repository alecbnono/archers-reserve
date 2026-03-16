const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
const BASE_URL = `${API_URL}/admin`;

/**
 * Fetch admin dashboard data with filters.
 */
export async function fetchAdminDashboard(filters?: any): Promise<{
  rooms?: any[];
  error?: string;
}> {
  const token = localStorage.getItem('token');
  const params = new URLSearchParams(filters).toString();
  const url = `${BASE_URL}/me/adminLogs${params ? `?${params}` : ''}`;

  const res = await fetch(url, {
    credentials: "include",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();

  if (!res.ok) {
    return { error: data.error || "Failed to fetch dashboard" };
  }

  return data;
}