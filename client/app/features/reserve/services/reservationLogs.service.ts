import type { ReservationType } from "~/types/reservation.types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
const BASE_URL = `${API_URL}/reservations`;

export interface ReservationListResult {
  reservations?: ReservationType[];
  error?: string;
}

/**
 * Fetch the current user's reservations (GET /reservations/me).
 */
export async function fetchMyReservations(): Promise<ReservationListResult> {
  const res = await fetch(`${BASE_URL}/me`, {
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    return { error: data.error || "Failed to fetch reservations" };
  }

  return { reservations: data.reservations };
}

/**
 * Fetch all reservations — admin only (GET /reservations).
 */
export async function fetchAllReservations(): Promise<ReservationListResult> {
  const res = await fetch(BASE_URL, {
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    return { error: data.error || "Failed to fetch reservations" };
  }

  return { reservations: data.reservations };
}
