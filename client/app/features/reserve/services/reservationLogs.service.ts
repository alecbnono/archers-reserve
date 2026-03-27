import type { ReservationType } from "~/types/reservation.types";
import { API_URL } from "~/config/api";
import { getAuthHeaders } from "~/lib/auth";

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
    headers: getAuthHeaders(),
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
    headers: getAuthHeaders(),
  });

  const data = await res.json();

  if (!res.ok) {
    return { error: data.error || "Failed to fetch reservations" };
  }

  return { reservations: data.reservations };
}

/**
 * Fetch a target user's reservations (GET /reservations/user/:userId).
 * Respects server-side privacy checks (profile must be public).
 */
export async function fetchUserReservations(
  userId: number,
): Promise<ReservationListResult> {
  try {
    const res = await fetch(`${BASE_URL}/user/${userId}`, {
      headers: getAuthHeaders(),
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.error || "Failed to fetch reservations" };
    }

    return { reservations: data.reservations };
  } catch {
    return { error: "Network error fetching reservations" };
  }
}

// ─── Cancellation ─────────────────────────────────────────────────────

export interface CancelReservationResult {
  message?: string;
  cancelledCount?: number;
  error?: string;
}

/**
 * Cancel an entire reservation batch (PATCH /reservations/:batchId/cancel).
 */
export async function cancelReservationBatch(
  batchId: string,
): Promise<CancelReservationResult> {
  try {
    const res = await fetch(
      `${BASE_URL}/${encodeURIComponent(batchId)}/cancel`,
      {
        method: "PATCH",
        headers: getAuthHeaders(),
      },
    );

    const data = await res.json();

    if (!res.ok) {
      return { error: data.error || "Failed to cancel reservation" };
    }

    return { message: data.message, cancelledCount: data.cancelledCount };
  } catch {
    return { error: "Network error cancelling reservation" };
  }
}

// ─── Batch detail (for edit prefill) ──────────────────────────────────

export interface BatchDetailResult {
  batchId: string;
  userId: number;
  roomId: number;
  roomCode: string;
  building: string;
  date: string;
  dates: string[];
  timeslotIds: number[];
  seatId: number | null;
  reserveAll: boolean;
  isAnonymous: boolean;
  isRecurring: boolean;
  status: string;
}

export interface FetchBatchDetailResult {
  data?: BatchDetailResult;
  error?: string;
}

/**
 * Fetch batch detail for edit prefill (GET /reservations/:batchId).
 */
export async function fetchReservationBatchDetail(
  batchId: string,
): Promise<FetchBatchDetailResult> {
  try {
    const res = await fetch(`${BASE_URL}/${encodeURIComponent(batchId)}`, {
      headers: getAuthHeaders(),
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.error || "Failed to fetch batch detail" };
    }

    return { data };
  } catch {
    return { error: "Network error fetching batch detail" };
  }
}

// ─── Edit reservation batch ───────────────────────────────────────────

export interface EditReservationPayload {
  roomId: number;
  date: string;
  timeslotIds: number[];
  seatId?: number | null;
  reserveAll: boolean;
  isAnonymous: boolean;
  isRecurring?: boolean;
}

export interface EditReservationResult {
  data?: {
    message: string;
    updatedCount: number;
    overriddenCount: number;
  };
  error?: string;
}

/**
 * Edit reservation batch (PATCH /reservations/:batchId).
 * Replace-in-place semantics — same batch ID is preserved.
 */
export async function editReservationBatch(
  batchId: string,
  payload: EditReservationPayload,
): Promise<EditReservationResult> {
  try {
    const res = await fetch(`${BASE_URL}/${encodeURIComponent(batchId)}`, {
      method: "PATCH",
      headers: getAuthHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.error || "Failed to edit reservation" };
    }

    return { data };
  } catch {
    return { error: "Network error editing reservation" };
  }
}
