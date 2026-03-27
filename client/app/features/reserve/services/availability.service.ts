import type { AvailabilityData } from "~/features/reserve/types/reserve.types";

const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_URL}/reservations`;

export interface AvailabilityResult {
  data?: AvailabilityData;
  error?: string;
}

/**
 * Fetch availability for a specific room on a specific date.
 * GET /reservations/availability?roomId=...&date=YYYY-MM-DD[&excludeBatchId=...]
 */
export async function fetchAvailability(
  roomId: number,
  date: string,
  excludeBatchId?: string,
): Promise<AvailabilityResult> {
  try {
    let url = `${BASE_URL}/availability?roomId=${roomId}&date=${date}`;
    if (excludeBatchId) {
      url += `&excludeBatchId=${encodeURIComponent(excludeBatchId)}`;
    }

    const res = await fetch(url, { credentials: "include" });

    const json = await res.json();

    if (!res.ok) {
      return { error: json.error || "Failed to fetch availability" };
    }

    // Map backend response to frontend types
    const data: AvailabilityData = {
      room: json.room,
      date: json.date,
      timeslots: json.timeslots.map((ts: any) => ({
        timeslotId: ts.timeslotId,
        startTime: ts.startTime,
        endTime: ts.endTime,
        occupiedSeats: ts.occupiedSeats,
        reservedSeatIds: ts.reservedSeatIds,
        seatOccupants: (ts.seatOccupants ?? []).map((o: any) => ({
          seatId: o.seatId,
          profilePictureUrl: o.profilePictureUrl ?? null,
          isAnonymous: o.isAnonymous ?? false,
          visibleUserId: o.visibleUserId,
        })),
        capacity: json.room.capacity,
      })),
    };

    return { data };
  } catch {
    return { error: "Network error fetching availability" };
  }
}

// ─── Recurring conflict check ─────────────────────────────────────────

export interface RecurringConflictPayload {
  roomId: number;
  date: string;
  timeslotIds: number[];
  seatId?: number | null;
  reserveAll: boolean;
}

export interface RecurringConflictResult {
  hasFacultyConflict?: boolean;
  error?: string;
}

/**
 * POST /reservations/recurring-conflicts
 * Lightweight check for FACULTY/ADMIN conflicts across a recurring date series.
 */
export async function checkRecurringConflicts(
  payload: RecurringConflictPayload,
): Promise<RecurringConflictResult> {
  try {
    const res = await fetch(`${BASE_URL}/recurring-conflicts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (!res.ok) {
      return { error: json.error || "Failed to check recurring conflicts" };
    }

    return { hasFacultyConflict: json.hasFacultyConflict };
  } catch {
    return { error: "Network error checking recurring conflicts" };
  }
}
