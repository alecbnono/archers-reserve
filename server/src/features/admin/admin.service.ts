import pool from "../../app/db.js";
import { getAllReservations, ReservationRow } from "../reservation/reservation.service.js";

export async function getReservations(): Promise<ReservationRow[]>{

  /**
   * Returns the list of reservations by batch for admin dashboard.
   */
  const reservationsByBatch = await getAllReservations();

  return reservationsByBatch;
}

// ─── Admin user search ────────────────────────────────────────────────

export interface SearchableUser {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "STUDENT" | "FACULTY";
}

/**
 * Search for STUDENT/FACULTY users by partial username, name, or email.
 * Returns at most 10 results, ordered by username.
 */
export async function searchUsers(query: string): Promise<SearchableUser[]> {
  const pattern = `%${query}%`;

  const result = await pool.query(
    `SELECT user_id, username, first_name, last_name, email, role
     FROM "user"
     WHERE role IN ('STUDENT', 'FACULTY')
       AND (
         username   ILIKE $1
         OR first_name ILIKE $1
         OR last_name  ILIKE $1
         OR email      ILIKE $1
       )
     ORDER BY username
     LIMIT 10`,
    [pattern],
  );

  return result.rows.map((r: any) => ({
    id: r.user_id,
    username: r.username,
    firstName: r.first_name,
    lastName: r.last_name,
    email: r.email,
    role: r.role,
  }));
}


/**
 *  UNMERGE: "9:00 AM - 11:00 AM, 2:00 PM - 4:00 PM"  
 * [{start: "9:00", end: "11:00"}, {start: "14:00", end: "16:00"}]
 * 
 */ 
export function unmergeTimeslotRanges(timeSlotString: string): { startTime: string; endTime: string }[] {
  if (!timeSlotString || timeSlotString === "") return [];

  // Split merged ranges: "9:00 AM - 11:00 AM, 2:00 PM - 4:00 PM"
  const rangeStrings = timeSlotString.split(",").map(s => s.trim());

  const slots: { startTime: string; endTime: string }[] = [];

  for (const range of rangeStrings) {
    // Extract "9:00 AM - 11:00 AM" → ["9:00 AM", "11:00 AM"]
    const match = range.match(/(.+?)\s*-\s*(.+)/);
    if (match) {
      const [, start, end] = match;
      slots.push({
        startTime: start.trim(),
        endTime: end.trim(),
      });
    }
  }

  return slots;
}


export function toMinutes(timeStr: string): number {
  const trimmed = timeStr.trim();
  const [time, period] = trimmed.split(" ");
  const [hourPart, minutePart] = time.split(":");
  let hours = parseInt(hourPart, 10);
  const minutes = parseInt(minutePart, 10);

  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
}


