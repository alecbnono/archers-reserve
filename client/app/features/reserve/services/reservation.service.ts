const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_URL}/reservations`;

export interface CreateReservationPayload {
  roomId: number;
  date: string;
  timeslotIds: number[];
  seatId?: number | null;
  reserveAll: boolean;
  isAnonymous: boolean;
  targetUserId?: number; // Admin on-behalf: the user who will own the reservation
  isRecurring?: boolean;
}

export interface CreateReservationResponse {
  message: string;
  createdCount: number;
  overriddenCount: number;
}

export interface CreateReservationResult {
  data?: CreateReservationResponse;
  error?: string;
}

/**
 * POST /reservations — create reservation(s).
 */
export async function createReservation(
  payload: CreateReservationPayload,
): Promise<CreateReservationResult> {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (!res.ok) {
      return { error: json.error || "Failed to create reservation" };
    }

    return { data: json };
  } catch {
    return { error: "Network error creating reservation" };
  }
}
