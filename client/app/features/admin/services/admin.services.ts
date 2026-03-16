const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
const BASE_URL = `${API_URL}/admin`;

/**
 * Fetch admin dashboard data (GET /admin/me/adminLogs).
 */
export async function fetchAdminDashboard(): Promise<{
  rooms?: any[];
  error?: string;
}> {
  const token = localStorage.getItem('token');  
  
  const res = await fetch(`${BASE_URL}/me/adminLogs`, {  
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