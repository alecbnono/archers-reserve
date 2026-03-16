import type { AdminLogFilters } from "../types/filter.types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
const BASE_URL = `${API_URL}/admin`; 

/**
 * Fetch admin reservation logs (GET /admin/dashboard).
 */
export async function fetchAllReservations(filters?: AdminLogFilters): Promise<{
  reservations: any[];
  error?: string;
}> {
  const token = localStorage.getItem('token');
  
  const params = new URLSearchParams();
  if (filters) {
    if (filters.buildings?.length) {
      params.append('building', filters.buildings[0]);
    }
    if (filters.timeRange) {
      params.append('startTime', filters.timeRange[0].toString());
      params.append('endTime', filters.timeRange[1].toString());
    }
    if (filters.showVacant !== undefined) {
      params.append('showVacant', filters.showVacant.toString());
    }
  }

  const url = `${BASE_URL}/dashboard${params.toString() ? `?${params.toString()}` : ''}`;

  const res = await fetch(url, {  
    credentials: "include",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();

  if (!res.ok) {
    return { 
      reservations: [],
      error: data.error || "Failed to fetch admin logs" 
    };
  }

  return { 
    reservations: data.reservations || [] 
  };
}