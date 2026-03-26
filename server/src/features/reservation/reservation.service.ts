import { randomUUID } from "crypto";
import pool from "../../app/db.js";
import { AppError } from "../../utils/AppError.js";
import type { UserRole } from "../../types/auth.types.js";

// ─── Constants ─────────────────────────────────────────────────────────────
const STUDENT_MAX_ACTIVE_SLOTS = 20;

// ─── Types ─────────────────────────────────────────────────────────────

export type ReservationStatus = "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";

/**
 * A grouped reservation row returned by getUserReservations / getAllReservations.
 * One entry per reservation_batch_id (i.e. per submit).
 */
export interface ReservationRow {
  batchId: string;
  requestTime: string;
  reservationDate: string;
  reservationDateEnd: string | null;  // non-null for recurring batches
  timeSlot: string;
  building: string;
  roomId: number;
  roomCode: string;
  seatLabel: string;
  isAnonymous: boolean;
  isRecurring: boolean;
  status: ReservationStatus;
  cancelledAt: string | null;
  // Admin-only fields
  userId?: number;          
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
}

export interface SeatOccupant {
  seatId: number;
  profilePictureUrl: string | null;
  isAnonymous: boolean;
  /** Real user ID when visible (public + non-anonymous), unique negative sentinel otherwise. */
  visibleUserId: number;
}

export interface AvailabilityTimeslot {
  timeslotId: number;
  startTime: string;
  endTime: string;
  occupiedSeats: number;
  reservedSeatIds: number[];
  seatOccupants: SeatOccupant[];
}

export interface AvailabilityResult {
  room: {
    roomId: number;
    roomCode: string;
    building: string;
    floor: number;
    capacity: number;
  };
  date: string;
  timeslots: AvailabilityTimeslot[];
}

// ─── Time helpers (server-side, for merged timeslot display) ───────────

/**
 * Parse a DB time string ("HH:MM:SS", "HH:MM") or ISO datetime into
 * total minutes since midnight.
 */
function toMinutes(time: string): number {
  const iso = String(time).match(/T(\d{2}):(\d{2})/);
  if (iso) return parseInt(iso[1], 10) * 60 + parseInt(iso[2], 10);
  const parts = String(time).split(":");
  return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
}

/** Format total minutes to "h:mm AM/PM". */
function fmtMinutes(mins: number): string {
  const h24 = Math.floor(mins / 60);
  const m = mins % 60;
  const period = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 || 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${period}`;
}

/** Format a DB time string to 12-hour. */
function fmt12h(time: string): string {
  return fmtMinutes(toMinutes(time));
}

/**
 * Normalize a date value (ISO datetime, Date object, or plain string)
 * into a "YYYY-MM-DD" string safe for the client.
 */
function toYyyyMmDd(value: unknown): string {
  const s = String(value).trim();

  // Already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

  // ISO datetime -> take the date portion
  if (/^\d{4}-\d{2}-\d{2}T/.test(s)) return s.slice(0, 10);

  // Fallback: try parsing as Date
  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  // Last resort: return the original string
  return s;
}

/**
 * Merge an array of {startTime, endTime} into contiguous ranges and
 * return a human-readable string like "7:00 AM - 8:00 AM, 8:30 AM - 9:00 AM".
 * Expects the array to be pre-sorted by startTime.
 */
function mergeTimeslotRanges(
  slots: { startTime: string; endTime: string }[],
): string {
  if (slots.length === 0) return "";

  const sorted = [...slots].sort(
    (a, b) => toMinutes(a.startTime) - toMinutes(b.startTime),
  );

  const groups: { start: string; end: string }[] = [];
  let cur = { start: sorted[0].startTime, end: sorted[0].endTime };

  for (let i = 1; i < sorted.length; i++) {
    if (toMinutes(sorted[i].startTime) === toMinutes(cur.end)) {
      cur = { start: cur.start, end: sorted[i].endTime };
    } else {
      groups.push(cur);
      cur = { start: sorted[i].startTime, end: sorted[i].endTime };
    }
  }
  groups.push(cur);

  return groups
    .map((g) => `${fmt12h(g.start)} - ${fmt12h(g.end)}`)
    .join(", ");
}

// ─── Recurring date expansion ─────────────────────────────────────────

/**
 * Expand a start date into an array of weekly dates (same weekday)
 * from the start date through +3 months (inclusive).
 * Returns dates as "YYYY-MM-DD" strings.
 */
function expandWeeklyDates(startDateStr: string): string[] {
  const [y, m, d] = startDateStr.split("-").map(Number);
  const start = new Date(y, m - 1, d);

  // End boundary: same day-of-month 3 calendar months later (inclusive)
  const end = new Date(y, m - 1 + 3, d);

  const dates: string[] = [];
  const cur = new Date(start);

  while (cur <= end) {
    const yy = cur.getFullYear();
    const mm = String(cur.getMonth() + 1).padStart(2, "0");
    const dd = String(cur.getDate()).padStart(2, "0");
    dates.push(`${yy}-${mm}-${dd}`);
    cur.setDate(cur.getDate() + 7);
  }

  return dates;
}

// ─── Grouped reservation queries ──────────────────────────────────────

/**
 * Raw row shape returned by the grouped SQL queries.
 */
interface GroupedRawRow {
  batch_key: string;
  request_time: string;
  request_date: string;       // MIN(request_date) for recurring
  request_date_end: string | null;  // MAX(request_date), non-null when recurring
  is_recurring: boolean;
  building: string;
  room_id: number;
  room_code: string;
  is_anonymous: boolean;
  cancelled_at: string | null;
  // aggregated
  seat_ids: number[];       // ARRAY_AGG(DISTINCT seat_id)
  start_times: string[];    // ARRAY_AGG(start_time ORDER BY start_time)
  end_times: string[];      // ARRAY_AGG(end_time ORDER BY start_time)
  statuses: string[];       // ARRAY_AGG(per-row status)
  // admin only
  user_id?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  role?: string;
}

/**
 * Derive a single group status from the set of per-row statuses.
 * Priority: ONGOING > UPCOMING > COMPLETED > CANCELLED
 * (If ANY row is ongoing the batch is ongoing; if all cancelled it's cancelled; etc.)
 */
function deriveGroupStatus(statuses: string[]): ReservationStatus {
  const set = new Set(statuses);
  if (set.has("ONGOING")) return "ONGOING";
  if (set.has("UPCOMING")) return "UPCOMING";
  if (set.has("COMPLETED")) return "COMPLETED";
  return "CANCELLED";
}

function mapGroupedRow(row: GroupedRawRow): ReservationRow {
  // Distinct seats
  const uniqueSeats = [...new Set(row.seat_ids)].sort((a, b) => a - b);
  const seatLabel = uniqueSeats.length > 1 ? "ALL" : String(uniqueSeats[0]);

  // Merge timeslots into display string — deduplicate first
  const slotMap = new Map<string, { startTime: string; endTime: string }>();
  for (let i = 0; i < row.start_times.length; i++) {
    const key = `${row.start_times[i]}-${row.end_times[i]}`;
    if (!slotMap.has(key)) {
      slotMap.set(key, { startTime: row.start_times[i], endTime: row.end_times[i] });
    }
  }
  const timeSlot = mergeTimeslotRanges([...slotMap.values()]);

  const mapped: ReservationRow = {
    batchId: row.batch_key,
    requestTime: row.request_time,
    reservationDate: toYyyyMmDd(row.request_date),
    reservationDateEnd: row.request_date_end ? toYyyyMmDd(row.request_date_end) : null,
    timeSlot,
    building: row.building,
    roomId: row.room_id,
    roomCode: row.room_code,
    seatLabel,
    isAnonymous: row.is_anonymous,
    isRecurring: row.is_recurring ?? false,
    status: deriveGroupStatus(row.statuses),
    cancelledAt: row.cancelled_at ?? null,
  };
  if (row.user_id !== undefined) {
    mapped.userId = row.user_id;
  }
  if (row.first_name !== undefined) {
    mapped.firstName = row.first_name;
    mapped.lastName = row.last_name;
    mapped.email = row.email;
    mapped.role = row.role;
  }

  return mapped;
}

/**
 * Base grouped SELECT used for both user and admin queries.
 * Groups by batch_key (reservation_batch_id with fallback for legacy rows).
 * The per-row status is computed inside the aggregate so the group can
 * derive a single status.
 *
 * Uses a CTE to prefer active rows over cancelled rows within the same batch.
 * After an edit (soft-cancel old + insert new under same batch_id), only the
 * new active rows appear — the old cancelled rows are hidden.
 * If ALL rows in a batch are cancelled (true cancellation), they are shown.
 */
const BATCH_FILTER_CTE = `
  WITH batch_rows AS (
    SELECT r.*,
           COALESCE(r.reservation_batch_id::text, 'legacy-' || r.reservation_id::text) AS batch_key
    FROM reservation r
  ),
  -- For each batch, determine if any active (non-cancelled) rows exist
  batch_has_active AS (
    SELECT batch_key,
           BOOL_OR(cancelled_at IS NULL) AS has_active
    FROM batch_rows
    GROUP BY batch_key
  ),
  -- Keep only active rows when they exist; keep cancelled rows only when entire batch is cancelled
  filtered AS (
    SELECT br.*
    FROM batch_rows br
    JOIN batch_has_active bha ON bha.batch_key = br.batch_key
    WHERE (bha.has_active AND br.cancelled_at IS NULL)
       OR (NOT bha.has_active)
  )
`;

const GROUPED_SELECT_COLUMNS = `
    f.batch_key,
    MIN(f.request_time)      AS request_time,
    MIN(f.request_date)      AS request_date,
    CASE WHEN BOOL_OR(f.is_recurring) THEN MAX(f.request_date) ELSE NULL END AS request_date_end,
    BOOL_OR(f.is_recurring)  AS is_recurring,
    MIN(rm.building)         AS building,
    MIN(f.room_id)           AS room_id,
    MIN(rm.room_code)        AS room_code,
    BOOL_OR(f.is_anonymous)  AS is_anonymous,
    MAX(f.cancelled_at)      AS cancelled_at,
    ARRAY_AGG(DISTINCT f.seat_id)                         AS seat_ids,
    ARRAY_AGG(t.start_time ORDER BY t.start_time)         AS start_times,
    ARRAY_AGG(t.end_time   ORDER BY t.start_time)         AS end_times,
    ARRAY_AGG(
      CASE
        WHEN f.cancelled_at IS NOT NULL                THEN 'CANCELLED'
        WHEN NOW() < (f.request_date + t.start_time)   THEN 'UPCOMING'
        WHEN NOW() >= (f.request_date + t.start_time)
         AND NOW() <= (f.request_date + t.end_time)    THEN 'ONGOING'
        ELSE 'COMPLETED'
      END
    ) AS statuses
`;

const GROUPED_GROUP_BY = `
  GROUP BY f.batch_key
  ORDER BY MAX(f.request_date) DESC, MIN(t.start_time) DESC
`;

/**
 * Get all reservations belonging to a single user, grouped by batch.
 * Used on the profile page (GET /reservations/me).
 */
export async function getUserReservations(
  userId: number,
): Promise<ReservationRow[]> {
  const query = `
    ${BATCH_FILTER_CTE}
    SELECT
      ${GROUPED_SELECT_COLUMNS}
    FROM filtered f
    JOIN timeslot t  ON t.timeslot_id = f.timeslot_id
    JOIN room     rm ON rm.room_id    = f.room_id
    WHERE f.user_id = $1
    ${GROUPED_GROUP_BY}
  `;

  const result = await pool.query(query, [userId]);
  return result.rows.map(mapGroupedRow);
}

/**
 * Get all reservations across all users (admin), grouped by batch.
 * Joins user table for name/email/role columns.
 * Used on the admin logs page (GET /reservations).
 */
export async function getAllReservations(): Promise<ReservationRow[]> {
  const query = `
    ${BATCH_FILTER_CTE}
    SELECT
      ${GROUPED_SELECT_COLUMNS},
      MIN(u.user_id)    AS user_id,  
      MIN(u.first_name) AS first_name,
      MIN(u.last_name)  AS last_name,
      MIN(u.email)      AS email,
      MIN(u.role)       AS role
    FROM filtered f
    JOIN timeslot t  ON t.timeslot_id = f.timeslot_id
    JOIN room     rm ON rm.room_id    = f.room_id
    JOIN "user"   u  ON u.user_id     = f.user_id
    ${GROUPED_GROUP_BY}
  `;

  const result = await pool.query(query);
  return result.rows.map(mapGroupedRow);
}

// ─── Availability ─────────────────────────────────────────────────────

/**
 * Get availability for a specific room on a specific date.
 * Returns all timeslots with their occupancy counts and reserved seat IDs.
 * Only counts active reservations (cancelled_at IS NULL).
 *
 * Capacity is derived from actual seat rows in the seat table (authoritative),
 * not from room.capacity, so occupancy numerics can reach full (e.g. 24/24).
 */
export async function getAvailability(
  roomId: number,
  date: string,
  excludeBatchId?: string,
): Promise<AvailabilityResult> {
  // 1. Fetch the room
  const roomResult = await pool.query(
    `SELECT room_id, room_code, building, floor, capacity
     FROM room WHERE room_id = $1`,
    [roomId],
  );

  if (roomResult.rows.length === 0) {
    throw new AppError("Room not found", 404);
  }

  const roomRow = roomResult.rows[0];

  // 2. Get authoritative seat count from seat table
  const seatCountResult = await pool.query(
    `SELECT COUNT(*)::int AS seat_count FROM seat WHERE room_id = $1`,
    [roomId],
  );
  const seatCount: number = seatCountResult.rows[0].seat_count;

  const room = {
    roomId: roomRow.room_id,
    roomCode: roomRow.room_code,
    building: roomRow.building,
    floor: roomRow.floor,
    capacity: seatCount,  // authoritative seat count
  };

  // 3. Fetch all timeslots
  const timeslotResult = await pool.query(
    `SELECT timeslot_id, start_time, end_time
     FROM timeslot
     ORDER BY start_time`,
  );

  // 4. Fetch active reservations for this room + date, including occupant info
  //    When editing, exclude the batch being edited so those seats aren't shown as occupied
  const reservationQuery = excludeBatchId
    ? `SELECT r.timeslot_id, r.seat_id, r.is_anonymous, r.user_id,
              u.is_public, u.profile_picture_url
       FROM reservation r
       JOIN "user" u ON u.user_id = r.user_id
       WHERE r.room_id = $1
         AND r.request_date = $2
         AND r.cancelled_at IS NULL
         AND r.reservation_batch_id != $3`
    : `SELECT r.timeslot_id, r.seat_id, r.is_anonymous, r.user_id,
              u.is_public, u.profile_picture_url
       FROM reservation r
       JOIN "user" u ON u.user_id = r.user_id
       WHERE r.room_id = $1
         AND r.request_date = $2
         AND r.cancelled_at IS NULL`;

  const reservationParams: any[] = excludeBatchId
    ? [roomId, date, excludeBatchId]
    : [roomId, date];

  const reservationResult = await pool.query(reservationQuery, reservationParams);

  // Group reserved seats and occupant info by timeslot
  // For hidden users (anonymous or private), use a unique negative sentinel per row
  // so the client never accidentally collapses two different hidden users into one.
  let hiddenSentinel = 0;
  const reservedByTimeslot = new Map<number, number[]>();
  const occupantsByTimeslot = new Map<number, SeatOccupant[]>();
  for (const row of reservationResult.rows) {
    const tsId = row.timeslot_id;
    if (!reservedByTimeslot.has(tsId)) {
      reservedByTimeslot.set(tsId, []);
      occupantsByTimeslot.set(tsId, []);
    }
    reservedByTimeslot.get(tsId)!.push(row.seat_id);

    // Privacy: only expose avatar + real userId when reservation is not anonymous AND user profile is public
    const isAnon = row.is_anonymous;
    const isPublic = row.is_public;
    const showIdentity = !isAnon && isPublic;
    occupantsByTimeslot.get(tsId)!.push({
      seatId: row.seat_id,
      profilePictureUrl: showIdentity ? (row.profile_picture_url || null) : null,
      isAnonymous: isAnon,
      visibleUserId: showIdentity ? row.user_id : --hiddenSentinel,
    });
  }

  // 5. Build timeslot availability
  const timeslots: AvailabilityTimeslot[] = timeslotResult.rows.map(
    (row: any) => {
      const tsId = row.timeslot_id;
      const reservedSeatIds = reservedByTimeslot.get(tsId) ?? [];
      return {
        timeslotId: tsId,
        startTime: row.start_time,
        endTime: row.end_time,
        occupiedSeats: reservedSeatIds.length,
        reservedSeatIds,
        seatOccupants: occupantsByTimeslot.get(tsId) ?? [],
      };
    },
  );

  return { room, date, timeslots };
}

// ─── Reservation creation ──────────────────────────────────────────────

export interface CreateReservationInput {
  userId: number;
  userRole: UserRole;
  roomId: number;
  date: string;          // YYYY-MM-DD
  timeslotIds: number[];
  seatId?: number | null;
  reserveAll: boolean;
  isAnonymous: boolean;
  isRecurring: boolean;
  targetUserId?: number; // Admin on-behalf: the user who will own the reservation
}

export interface CreateReservationResult {
  createdCount: number;
  overriddenCount: number;
}

/**
 * Create reservations for a user. All-or-nothing semantics.
 *
 * - Single seat: inserts one row per timeslot for the given seat.
 * - reserveAll: inserts one row per (seat x timeslot) for every seat in the room.
 *
 * All rows in a single submit share the same reservation_batch_id UUID.
 *
 * FACULTY/ADMIN can override (soft-cancel) conflicting STUDENT reservations.
 * If any conflict belongs to FACULTY or ADMIN, the entire request is rejected.
 */
export async function createReservation(
  input: CreateReservationInput,
): Promise<CreateReservationResult> {
  const {
    userId, userRole, roomId, date,
    timeslotIds, seatId, reserveAll, isAnonymous, isRecurring, targetUserId,
  } = input;

  // Defense-in-depth: recurring must always reserve all seats
  if (isRecurring && !reserveAll) {
    throw new AppError("Recurring reservations must reserve all seats", 400);
  }
  if (isRecurring && seatId != null) {
    throw new AppError("Recurring reservations cannot specify a single seat", 400);
  }

  // --- Admin on-behalf: validate target user exists and is not ADMIN ---
  if (targetUserId != null) {
    const targetResult = await pool.query(
      `SELECT user_id, role FROM "user" WHERE user_id = $1`,
      [targetUserId],
    );
    if (targetResult.rows.length === 0) {
      throw new AppError("Target user not found", 404);
    }
    const targetRole = targetResult.rows[0].role;
    if (targetRole === "ADMIN") {
      throw new AppError("Cannot reserve on behalf of an admin user", 403);
    }
  }

  // --- Validate room exists and get capacity ---
  const roomResult = await pool.query(
    `SELECT room_id, capacity FROM room WHERE room_id = $1`,
    [roomId],
  );
  if (roomResult.rows.length === 0) {
    throw new AppError("Room not found", 404);
  }

  // --- Validate timeslots exist ---
  const tsResult = await pool.query(
    `SELECT timeslot_id FROM timeslot WHERE timeslot_id = ANY($1::int[])`,
    [timeslotIds],
  );
  if (tsResult.rows.length !== timeslotIds.length) {
    throw new AppError("One or more timeslot IDs are invalid", 400);
  }

  // --- Reject any timeslots whose start time has already passed on the FIRST date ---
  // (For recurring, future dates inherently have future timeslots)
  const pastCheck = await pool.query(
    `SELECT timeslot_id
     FROM timeslot
     WHERE timeslot_id = ANY($1::int[])
       AND (($2::date + start_time)::timestamp <= NOW())`,
    [timeslotIds, date],
  );
  if (pastCheck.rows.length > 0) {
    throw new AppError("One or more selected timeslots have already passed", 400);
  }

  // --- Resolve target seat IDs ---
  let targetSeatIds: number[];

  if (reserveAll) {
    if (userRole === "STUDENT") {
      throw new AppError("Students cannot reserve all seats", 403);
    }
    const seatResult = await pool.query(
      `SELECT seat_id FROM seat WHERE room_id = $1 ORDER BY seat_id`,
      [roomId],
    );
    targetSeatIds = seatResult.rows.map((r: any) => r.seat_id);
    if (targetSeatIds.length === 0) {
      throw new AppError("Room has no seats", 400);
    }
  } else {
    if (seatId == null) {
      throw new AppError("seatId is required when reserveAll is false", 400);
    }
    const seatCheck = await pool.query(
      `SELECT 1 FROM seat WHERE room_id = $1 AND seat_id = $2`,
      [roomId, seatId],
    );
    if (seatCheck.rows.length === 0) {
      throw new AppError("Seat not found in this room", 404);
    }
    targetSeatIds = [seatId];
  }

  // --- Expand dates (single or weekly recurring) ---
  const dates = isRecurring ? expandWeeklyDates(date) : [date];

  // --- Generate a batch UUID for this entire submission ---
  const batchId = randomUUID();

  // --- Begin transaction ---
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Student quota check: max 20 active upcoming slots
    if (userRole === "STUDENT") {
      const activeCountResult = await client.query(
        `SELECT COUNT(*)::int AS active_count
         FROM reservation r
         JOIN timeslot t ON t.timeslot_id = r.timeslot_id
         WHERE r.user_id = $1
           AND r.cancelled_at IS NULL
           AND (r.request_date + t.start_time)::timestamp > NOW()`,
        [userId],
      );

      const activeCount: number = activeCountResult.rows[0].active_count;
      const requestedCount = timeslotIds.length; // student reserveAll is already blocked

      if (activeCount + requestedCount > STUDENT_MAX_ACTIVE_SLOTS) {
        await client.query("ROLLBACK");
        throw new AppError(
          `Students may only hold up to ${STUDENT_MAX_ACTIVE_SLOTS} active reservations (10 hours).`,
          409,
        );
      }
    }
    
    // 1. Find all active conflicting reservations across ALL dates
    const conflictResult = await client.query(
      `SELECT r.reservation_id, r.seat_id, r.timeslot_id, r.request_date, u.role AS owner_role
       FROM reservation r
       JOIN "user" u ON u.user_id = r.user_id
       WHERE r.room_id = $1
         AND r.request_date = ANY($2::date[])
         AND r.timeslot_id = ANY($3::int[])
         AND r.seat_id = ANY($4::int[])
         AND r.cancelled_at IS NULL`,
      [roomId, dates, timeslotIds, targetSeatIds],
    );

    const conflicts = conflictResult.rows;

    if (conflicts.length > 0) {
      const canOverride = userRole === "FACULTY" || userRole === "ADMIN";

      if (!canOverride) {
        await client.query("ROLLBACK");
        throw new AppError(
          "One or more selected slots are already reserved",
          409,
        );
      }

      const nonStudentConflict = conflicts.find(
        (c: any) => c.owner_role !== "STUDENT",
      );
      if (nonStudentConflict) {
        await client.query("ROLLBACK");
        throw new AppError(
          "Cannot override reservation owned by faculty or admin",
          409,
        );
      }

      // Soft-cancel all conflicting student reservations
      const conflictIds = conflicts.map((c: any) => c.reservation_id);
      await client.query(
        `UPDATE reservation
         SET cancelled_at = NOW()
         WHERE reservation_id = ANY($1::int[])`,
        [conflictIds],
      );
    }

    // 2. Insert new reservations for every (date x seat x timeslot)
    const rows: [string, number, number, number, number, string, boolean, boolean][] = [];
    for (const d of dates) {
      for (const sid of targetSeatIds) {
        for (const tid of timeslotIds) {
          rows.push([batchId, userId, sid, roomId, tid, d, isAnonymous, isRecurring]);
        }
      }
    }

    // Build a multi-row INSERT
    const valuePlaceholders: string[] = [];
    const params: any[] = [];
    let idx = 1;
    for (const [bid, uid, sid, rid, tid, d, anon, recur] of rows) {
      valuePlaceholders.push(
        `($${idx}, $${idx + 1}, $${idx + 2}, $${idx + 3}, $${idx + 4}, $${idx + 5}, $${idx + 6}, $${idx + 7})`,
      );
      params.push(bid, uid, sid, rid, tid, d, anon, recur);
      idx += 8;
    }

    await client.query(
      `INSERT INTO reservation (reservation_batch_id, user_id, seat_id, room_id, timeslot_id, request_date, is_anonymous, is_recurring)
       VALUES ${valuePlaceholders.join(", ")}`,
      params,
    );

    await client.query("COMMIT");

    return {
      createdCount: rows.length,
      overriddenCount: conflicts.length,
    };
  } catch (err: any) {
    await client.query("ROLLBACK").catch(() => {});

    if (err instanceof AppError) throw err;

    if (err.code === "23505") {
      throw new AppError(
        "One or more selected slots are already reserved (race condition)",
        409,
      );
    }

    throw new AppError("Failed to create reservation", 500);
  } finally {
    client.release();
  }
}

// ─── Reservation cancellation ─────────────────────────────────────────

export interface CancelReservationResult {
  cancelledCount: number;
}

/**
 * Cancel an entire reservation batch (all-or-nothing).
 *
 * - Resolves target rows by reservation_batch_id.
 * - For legacy rows (batch_key = "legacy-{id}"), resolves by reservation_id.
 * - Only the batch owner or an ADMIN can cancel.
 * - Only UPCOMING batches can be cancelled (all rows must be upcoming & active).
 */
export async function cancelReservationBatch(
  batchId: string,
  actorUserId: number,
  actorRole: UserRole,
): Promise<CancelReservationResult> {
  // Determine whether this is a legacy single-row key
  const isLegacy = batchId.startsWith("legacy-");

  // 1. Fetch all active (non-cancelled) rows for this batch
  let fetchQuery: string;
  let fetchParams: any[];

  if (isLegacy) {
    const reservationId = parseInt(batchId.replace("legacy-", ""), 10);
    if (isNaN(reservationId) || reservationId <= 0) {
      throw new AppError("Invalid batch ID", 400);
    }
    fetchQuery = `
      SELECT r.reservation_id, r.user_id, r.cancelled_at,
             (r.request_date + t.start_time)::timestamp AS slot_start
      FROM reservation r
      JOIN timeslot t ON t.timeslot_id = r.timeslot_id
      WHERE r.reservation_id = $1
    `;
    fetchParams = [reservationId];
  } else {
    // Validate UUID format
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(batchId)) {
      throw new AppError("Invalid batch ID", 400);
    }
    fetchQuery = `
      SELECT r.reservation_id, r.user_id, r.cancelled_at,
             (r.request_date + t.start_time)::timestamp AS slot_start
      FROM reservation r
      JOIN timeslot t ON t.timeslot_id = r.timeslot_id
      WHERE r.reservation_batch_id = $1
    `;
    fetchParams = [batchId];
  }

  const fetchResult = await pool.query(fetchQuery, fetchParams);

  if (fetchResult.rows.length === 0) {
    throw new AppError("Reservation batch not found", 404);
  }

  const allRows = fetchResult.rows;

  // After a previous edit the batch contains both cancelled (old generation)
  // and active (current generation) rows.  Only cancel the active ones.
  const activeRows = allRows.filter((r: any) => r.cancelled_at === null);

  if (activeRows.length === 0) {
    throw new AppError("This reservation has already been cancelled", 409);
  }

  const rows = activeRows;

  // 2. Permission check: owner or ADMIN
  const ownerUserId: number = rows[0].user_id;
  if (actorUserId !== ownerUserId && actorRole !== "ADMIN") {
    throw new AppError("You do not have permission to cancel this reservation", 403);
  }

  // 3. Only cancel FUTURE active rows (skip past/ongoing rows for recurring batches)
  const now = new Date();
  const futureRows = rows.filter((r: any) => new Date(r.slot_start) > now);

  if (futureRows.length === 0) {
    throw new AppError(
      "No upcoming rows to cancel (all have already started or completed)",
      409,
    );
  }

  // 4. Soft-cancel future active rows in the batch
  const ids = futureRows.map((r: any) => r.reservation_id);
  const updateResult = await pool.query(
    `UPDATE reservation
     SET cancelled_at = NOW()
     WHERE reservation_id = ANY($1::int[])
       AND cancelled_at IS NULL`,
    [ids],
  );

  return { cancelledCount: updateResult.rowCount ?? 0 };
}

// ─── Batch detail (for edit prefill) ──────────────────────────────────

export interface BatchDetail {
  batchId: string;
  userId: number;
  roomId: number;
  roomCode: string;
  building: string;
  date: string;           // YYYY-MM-DD — earliest future date (or first date if all past)
  dates: string[];        // All distinct request_dates sorted ascending
  timeslotIds: number[];
  seatId: number | null;  // null when reserveAll
  reserveAll: boolean;
  isAnonymous: boolean;
  isRecurring: boolean;
  status: ReservationStatus;
}

/**
 * Fetch editable detail for a reservation batch.
 * Owner or ADMIN only. Returns raw fields needed to prefill the edit form.
 */
export async function getReservationBatchDetail(
  batchId: string,
  actorUserId: number,
  actorRole: UserRole,
): Promise<BatchDetail> {
  const isLegacy = batchId.startsWith("legacy-");

  let fetchQuery: string;
  let fetchParams: any[];

  if (isLegacy) {
    const reservationId = parseInt(batchId.replace("legacy-", ""), 10);
    if (isNaN(reservationId) || reservationId <= 0) {
      throw new AppError("Invalid batch ID", 400);
    }
    fetchQuery = `
      SELECT r.reservation_id, r.user_id, r.room_id, r.seat_id,
             r.timeslot_id, r.request_date, r.is_anonymous, r.is_recurring,
             r.cancelled_at,
             rm.room_code, rm.building,
             (r.request_date + t.start_time)::timestamp AS slot_start
      FROM reservation r
      JOIN timeslot t  ON t.timeslot_id = r.timeslot_id
      JOIN room     rm ON rm.room_id    = r.room_id
      WHERE r.reservation_id = $1
    `;
    fetchParams = [reservationId];
  } else {
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(batchId)) {
      throw new AppError("Invalid batch ID", 400);
    }
    fetchQuery = `
      SELECT r.reservation_id, r.user_id, r.room_id, r.seat_id,
             r.timeslot_id, r.request_date, r.is_anonymous, r.is_recurring,
             r.cancelled_at,
             rm.room_code, rm.building,
             (r.request_date + t.start_time)::timestamp AS slot_start
      FROM reservation r
      JOIN timeslot t  ON t.timeslot_id = r.timeslot_id
      JOIN room     rm ON rm.room_id    = r.room_id
      WHERE r.reservation_batch_id = $1
    `;
    fetchParams = [batchId];
  }

  const result = await pool.query(fetchQuery, fetchParams);

  if (result.rows.length === 0) {
    throw new AppError("Reservation batch not found", 404);
  }

  const allRows = result.rows;

  // After a previous edit the batch contains both cancelled (old generation)
  // and active (current generation) rows.  Prefer active rows for detail/prefill.
  const activeRows = allRows.filter((r: any) => r.cancelled_at === null);
  const rows = activeRows.length > 0 ? activeRows : allRows;

  // Permission check
  const ownerUserId: number = rows[0].user_id;
  if (actorUserId !== ownerUserId && actorRole !== "ADMIN") {
    throw new AppError("You do not have permission to view this reservation", 403);
  }

  // Derive status — must be UPCOMING to be editable (checked by caller)
  const now = new Date();
  const statuses: ReservationStatus[] = rows.map((row: any) => {
    if (row.cancelled_at !== null) return "CANCELLED" as ReservationStatus;
    const slotStart = new Date(row.slot_start);
    if (now < slotStart) return "UPCOMING" as ReservationStatus;
    return "ONGOING" as ReservationStatus;
  });
  const status = deriveGroupStatus(statuses);

  // Extract unique timeslot IDs and seat IDs from the current generation
  const timeslotIds = [...new Set(rows.map((r: any) => r.timeslot_id as number))].sort(
    (a, b) => a - b,
  );
  const uniqueSeatIds = [...new Set(rows.map((r: any) => r.seat_id as number))].sort(
    (a, b) => a - b,
  );

  // Collect all distinct dates, sorted ascending
  const allDates = [...new Set(rows.map((r: any) => toYyyyMmDd(r.request_date)))].sort();

  // isRecurring: true if ANY row has is_recurring = true
  const isRecurring = rows.some((r: any) => r.is_recurring === true);

  // For edit prefill, use earliest future date as the "base" date; fallback to first date
  const futureDates = allDates.filter((d) => {
    const [y, m, dd] = d.split("-").map(Number);
    return new Date(y, m - 1, dd, 23, 59, 59) >= now;
  });
  const baseDate = futureDates.length > 0 ? futureDates[0] : allDates[0];

  // Determine reserveAll: if more than 1 unique seat, it was a reserveAll submission
  const seatCountResult = await pool.query(
    `SELECT COUNT(*)::int AS seat_count FROM seat WHERE room_id = $1`,
    [rows[0].room_id],
  );
  const totalSeats: number = seatCountResult.rows[0].seat_count;
  const reserveAll = uniqueSeatIds.length === totalSeats && totalSeats > 1;

  return {
    batchId,
    userId: ownerUserId,
    roomId: rows[0].room_id,
    roomCode: rows[0].room_code,
    building: rows[0].building,
    date: baseDate,
    dates: allDates,
    timeslotIds,
    seatId: reserveAll ? null : uniqueSeatIds[0],
    reserveAll,
    isAnonymous: rows[0].is_anonymous,
    isRecurring,
    status,
  };
}

// ─── Reservation editing (replace-in-place) ───────────────────────────

export interface EditReservationInput {
  batchId: string;
  actorUserId: number;
  actorRole: UserRole;
  roomId: number;
  date: string;          // YYYY-MM-DD
  timeslotIds: number[];
  seatId?: number | null;
  reserveAll: boolean;
  isAnonymous: boolean;
  isRecurring: boolean;
}

export interface EditReservationResult {
  updatedCount: number;
  overriddenCount: number;
}

/**
 * Edit a reservation batch with replace-in-place semantics.
 *
 * Transactional flow:
 * 1. Lock existing batch rows FOR UPDATE.
 * 2. Validate: owner or ADMIN, not all cancelled.
 * 3. Only soft-cancel FUTURE active rows (past rows are left untouched).
 * 4. Validate new selections (room, seats, timeslots, no past slots on first date).
 * 5. Conflict check across all dates with same override policy as create:
 *    - FACULTY/ADMIN can soft-cancel conflicting STUDENT reservations.
 *    - Cannot override FACULTY/ADMIN reservations.
 * 6. Insert new rows under the SAME reservation_batch_id.
 *
 * The original user_id is preserved (admin edits keep original owner).
 */
export async function editReservationBatch(
  input: EditReservationInput,
): Promise<EditReservationResult> {
  const {
    batchId, actorUserId, actorRole,
    roomId, date, timeslotIds, seatId, reserveAll, isAnonymous, isRecurring,
  } = input;

  // Defense-in-depth: recurring must always reserve all seats
  if (isRecurring && !reserveAll) {
    throw new AppError("Recurring reservations must reserve all seats", 400);
  }
  if (isRecurring && seatId != null) {
    throw new AppError("Recurring reservations cannot specify a single seat", 400);
  }

  const isLegacy = batchId.startsWith("legacy-");

  // --- Validate room exists ---
  const roomResult = await pool.query(
    `SELECT room_id FROM room WHERE room_id = $1`,
    [roomId],
  );
  if (roomResult.rows.length === 0) {
    throw new AppError("Room not found", 404);
  }

  // --- Validate timeslots exist ---
  const tsResult = await pool.query(
    `SELECT timeslot_id FROM timeslot WHERE timeslot_id = ANY($1::int[])`,
    [timeslotIds],
  );
  if (tsResult.rows.length !== timeslotIds.length) {
    throw new AppError("One or more timeslot IDs are invalid", 400);
  }

  // --- Reject past timeslots (only first date matters for recurring) ---
  const pastCheck = await pool.query(
    `SELECT timeslot_id
     FROM timeslot
     WHERE timeslot_id = ANY($1::int[])
       AND (($2::date + start_time)::timestamp <= NOW())`,
    [timeslotIds, date],
  );
  if (pastCheck.rows.length > 0) {
    throw new AppError("One or more selected timeslots have already passed", 400);
  }

  // --- Resolve target seat IDs ---
  let targetSeatIds: number[];

  if (reserveAll) {
    if (actorRole === "STUDENT") {
      throw new AppError("Students cannot reserve all seats", 403);
    }
    const seatResult = await pool.query(
      `SELECT seat_id FROM seat WHERE room_id = $1 ORDER BY seat_id`,
      [roomId],
    );
    targetSeatIds = seatResult.rows.map((r: any) => r.seat_id);
    if (targetSeatIds.length === 0) {
      throw new AppError("Room has no seats", 400);
    }
  } else {
    if (seatId == null) {
      throw new AppError("seatId is required when reserveAll is false", 400);
    }
    const seatCheck = await pool.query(
      `SELECT 1 FROM seat WHERE room_id = $1 AND seat_id = $2`,
      [roomId, seatId],
    );
    if (seatCheck.rows.length === 0) {
      throw new AppError("Seat not found in this room", 404);
    }
    targetSeatIds = [seatId];
  }

  // --- Expand dates (single or weekly recurring) ---
  const dates = isRecurring ? expandWeeklyDates(date) : [date];

  // --- Begin transaction ---
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Lock and fetch existing batch rows
    let lockQuery: string;
    let lockParams: any[];

    if (isLegacy) {
      const reservationId = parseInt(batchId.replace("legacy-", ""), 10);
      if (isNaN(reservationId) || reservationId <= 0) {
        throw new AppError("Invalid batch ID", 400);
      }
      lockQuery = `
        SELECT r.reservation_id, r.user_id, r.cancelled_at,
               (r.request_date + t.start_time)::timestamp AS slot_start
        FROM reservation r
        JOIN timeslot t ON t.timeslot_id = r.timeslot_id
        WHERE r.reservation_id = $1
        FOR UPDATE OF r
      `;
      lockParams = [reservationId];
    } else {
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(batchId)) {
        throw new AppError("Invalid batch ID", 400);
      }
      lockQuery = `
        SELECT r.reservation_id, r.user_id, r.cancelled_at,
               (r.request_date + t.start_time)::timestamp AS slot_start
        FROM reservation r
        JOIN timeslot t ON t.timeslot_id = r.timeslot_id
        WHERE r.reservation_batch_id = $1
        FOR UPDATE OF r
      `;
      lockParams = [batchId];
    }

    const lockResult = await client.query(lockQuery, lockParams);

    if (lockResult.rows.length === 0) {
      await client.query("ROLLBACK");
      throw new AppError("Reservation batch not found", 404);
    }

    // After a previous edit the batch contains both cancelled (old generation)
    // and active (current generation) rows.  We only care about the active ones.
    const allRows = lockResult.rows;
    const activeRows = allRows.filter((r: any) => r.cancelled_at === null);

    // If no active rows remain the entire batch was truly cancelled — reject.
    if (activeRows.length === 0) {
      await client.query("ROLLBACK");
      throw new AppError("Cannot edit a cancelled reservation", 409);
    }

    const ownerUserId: number = activeRows[0].user_id;

    // 2. Permission check
    if (actorUserId !== ownerUserId && actorRole !== "ADMIN") {
      await client.query("ROLLBACK");
      throw new AppError("You do not have permission to edit this reservation", 403);
    }

    // 3. Only soft-cancel FUTURE active rows (past/ongoing rows are left untouched)
    const now = new Date();
    const futureRows = activeRows.filter((r: any) => new Date(r.slot_start) > now);

    if (futureRows.length === 0) {
      await client.query("ROLLBACK");
      throw new AppError(
        "No upcoming rows remain to edit (all have started or completed)",
        409,
      );
    }

    const oldIds = futureRows.map((r: any) => r.reservation_id);
    await client.query(
      `UPDATE reservation
       SET cancelled_at = NOW()
       WHERE reservation_id = ANY($1::int[])
         AND cancelled_at IS NULL`,
      [oldIds],
    );

    // 5. Check for conflicts across all dates (excluding the rows we just cancelled)
    const conflictResult = await client.query(
      `SELECT r.reservation_id, r.seat_id, r.timeslot_id, r.request_date, u.role AS owner_role
       FROM reservation r
       JOIN "user" u ON u.user_id = r.user_id
       WHERE r.room_id = $1
         AND r.request_date = ANY($2::date[])
         AND r.timeslot_id = ANY($3::int[])
         AND r.seat_id = ANY($4::int[])
         AND r.cancelled_at IS NULL`,
      [roomId, dates, timeslotIds, targetSeatIds],
    );

    const conflicts = conflictResult.rows;
    let overriddenCount = 0;

    if (conflicts.length > 0) {
      const canOverride = actorRole === "FACULTY" || actorRole === "ADMIN";

      if (!canOverride) {
        await client.query("ROLLBACK");
        throw new AppError(
          "One or more selected slots are already reserved",
          409,
        );
      }

      const nonStudentConflict = conflicts.find(
        (c: any) => c.owner_role !== "STUDENT",
      );
      if (nonStudentConflict) {
        await client.query("ROLLBACK");
        throw new AppError(
          "Cannot override reservation owned by faculty or admin",
          409,
        );
      }

      // Soft-cancel conflicting student reservations
      const conflictIds = conflicts.map((c: any) => c.reservation_id);
      await client.query(
        `UPDATE reservation
         SET cancelled_at = NOW()
         WHERE reservation_id = ANY($1::int[])`,
        [conflictIds],
      );
      overriddenCount = conflictIds.length;
    }

    // 6. Insert new rows under the SAME batch ID, preserving original owner
    // For legacy batches, we need to assign a real UUID since we're inserting new rows
    const insertBatchId = isLegacy ? randomUUID() : batchId;

    const newRows: [string, number, number, number, number, string, boolean, boolean][] = [];
    for (const d of dates) {
      for (const sid of targetSeatIds) {
        for (const tid of timeslotIds) {
          newRows.push([insertBatchId, ownerUserId, sid, roomId, tid, d, isAnonymous, isRecurring]);
        }
      }
    }

    const valuePlaceholders: string[] = [];
    const params: any[] = [];
    let idx = 1;
    for (const [bid, uid, sid, rid, tid, d, anon, recur] of newRows) {
      valuePlaceholders.push(
        `($${idx}, $${idx + 1}, $${idx + 2}, $${idx + 3}, $${idx + 4}, $${idx + 5}, $${idx + 6}, $${idx + 7})`,
      );
      params.push(bid, uid, sid, rid, tid, d, anon, recur);
      idx += 8;
    }

    await client.query(
      `INSERT INTO reservation (reservation_batch_id, user_id, seat_id, room_id, timeslot_id, request_date, is_anonymous, is_recurring)
       VALUES ${valuePlaceholders.join(", ")}`,
      params,
    );

    await client.query("COMMIT");

    return {
      updatedCount: newRows.length,
      overriddenCount,
    };
  } catch (err: any) {
    await client.query("ROLLBACK").catch(() => {});

    if (err instanceof AppError) throw err;

    if (err.code === "23505") {
      throw new AppError(
        "One or more selected slots are already reserved (race condition)",
        409,
      );
    }

    throw new AppError("Failed to edit reservation", 500);
  } finally {
    client.release();
  }
}

// ─── Recurring conflict check ──────────────────────────────────────────

export interface RecurringConflictCheckInput {
  roomId: number;
  date: string;         // start date YYYY-MM-DD
  timeslotIds: number[];
  seatIds: number[];    // pre-resolved seat IDs (or all seats for reserveAll)
}

export interface RecurringConflictCheckResult {
  hasFacultyConflict: boolean;
}

/**
 * Lightweight check: do any FACULTY/ADMIN reservations conflict across the
 * recurring date series?  Used by the client to show a warning before submit.
 * Does NOT modify anything.
 */
export async function checkRecurringConflicts(
  input: RecurringConflictCheckInput,
): Promise<RecurringConflictCheckResult> {
  const { roomId, date, timeslotIds, seatIds } = input;

  const dates = expandWeeklyDates(date);

  const result = await pool.query(
    `SELECT 1
     FROM reservation r
     JOIN "user" u ON u.user_id = r.user_id
     WHERE r.room_id = $1
       AND r.request_date = ANY($2::date[])
       AND r.timeslot_id = ANY($3::int[])
       AND r.seat_id = ANY($4::int[])
       AND r.cancelled_at IS NULL
       AND u.role IN ('FACULTY', 'ADMIN')
     LIMIT 1`,
    [roomId, dates, timeslotIds, seatIds],
  );

  return { hasFacultyConflict: result.rows.length > 0 };
}
