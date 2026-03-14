import pool from "../../app/db.js";
import { AppError } from "../../utils/AppError.js";

export type ReservationStatus = "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";

export interface ReservationRow {
  reservationId: number;
  requestTime: string;
  reservationDate: string;
  startTime: string;
  endTime: string;
  building: string;
  roomCode: string;
  seatId: number;
  isAnonymous: boolean;
  status: ReservationStatus;
  cancelledAt: string | null;
  // Admin-only fields (populated when fetching all)
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
}

/**
 * Derive reservation status by comparing request_date + timeslot times
 * against the current timestamp, all done in SQL for correctness.
 */
const BASE_SELECT = `
  SELECT
    r.reservation_id,
    r.request_time,
    r.request_date,
    t.start_time,
    t.end_time,
    rm.building,
    rm.room_code,
    r.seat_id,
    r.is_anonymous,
    r.cancelled_at,
    CASE
      WHEN r.cancelled_at IS NOT NULL                THEN 'CANCELLED'
      WHEN NOW() < (r.request_date + t.start_time)  THEN 'UPCOMING'
      WHEN NOW() >= (r.request_date + t.start_time)
       AND NOW() <= (r.request_date + t.end_time)    THEN 'ONGOING'
      ELSE 'COMPLETED'
    END AS status
  FROM reservation r
  JOIN timeslot t  ON t.timeslot_id = r.timeslot_id
  JOIN room     rm ON rm.room_id    = r.room_id
`;

function mapRow(row: any): ReservationRow {
  const mapped: ReservationRow = {
    reservationId: row.reservation_id,
    requestTime: row.request_time,
    reservationDate: row.request_date,
    startTime: row.start_time,
    endTime: row.end_time,
    building: row.building,
    roomCode: row.room_code,
    seatId: row.seat_id,
    isAnonymous: row.is_anonymous,
    status: row.status as ReservationStatus,
    cancelledAt: row.cancelled_at ?? null,
  };

  // Attach user fields when present (admin query)
  if (row.first_name !== undefined) {
    mapped.firstName = row.first_name;
    mapped.lastName = row.last_name;
    mapped.email = row.email;
    mapped.role = row.role;
  }

  return mapped;
}

/**
 * Get all reservations belonging to a single user.
 * Used on the profile page (GET /reservations/me).
 */
export async function getUserReservations(
  userId: number,
): Promise<ReservationRow[]> {
  const query = `
    ${BASE_SELECT}
    WHERE r.user_id = $1
    ORDER BY r.request_date DESC, t.start_time DESC
  `;

  const result = await pool.query(query, [userId]);
  return result.rows.map(mapRow);
}

/**
 * Get all reservations across all users (admin).
 * Joins user table for name/email/role columns.
 * Used on the admin logs page (GET /reservations).
 */
export async function getAllReservations(): Promise<ReservationRow[]> {
  const query = `
    SELECT
      r.reservation_id,
      r.request_time,
      r.request_date,
      t.start_time,
      t.end_time,
      rm.building,
      rm.room_code,
      r.seat_id,
      r.is_anonymous,
      r.cancelled_at,
      CASE
        WHEN r.cancelled_at IS NOT NULL                THEN 'CANCELLED'
        WHEN NOW() < (r.request_date + t.start_time)  THEN 'UPCOMING'
        WHEN NOW() >= (r.request_date + t.start_time)
         AND NOW() <= (r.request_date + t.end_time)    THEN 'ONGOING'
        ELSE 'COMPLETED'
      END AS status,
      u.first_name,
      u.last_name,
      u.email,
      u.role
    FROM reservation r
    JOIN timeslot t  ON t.timeslot_id = r.timeslot_id
    JOIN room     rm ON rm.room_id    = r.room_id
    JOIN "user"   u  ON u.user_id     = r.user_id
    ORDER BY r.request_date DESC, t.start_time DESC
  `;

  const result = await pool.query(query);
  return result.rows.map(mapRow);
}
