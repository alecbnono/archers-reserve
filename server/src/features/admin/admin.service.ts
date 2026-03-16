import pool from "../../app/db.js";

interface ReservationLogRow {
  reservationId: number;
  reservation_batch_id: string;
  user_id: number;
  seat_id: number;
  room_id: number;
  timeslot_id: number;
  request_date: string;
  request_time: string;
  is_anonymous: boolean;
  is_reocurring: boolean;
  cancelled_at: string | null;
}

export async function getAllReservations(): Promise<ReservationLogRow[]>{
  const query = `
    SELECT * 
    FROM reservation
  `;

  const result = await pool.query(query);

  return result.rows.map((row: any) => ({
    reservationId: row.reservation_id,
    reservation_batch_id: row.reservation_batch_id,
    user_id: row.user_id,
    seat_id: row.seat_id,
    room_id: row.room_id,
    timeslot_id: row.timeslot_id,
    request_date: row.request_date,
    request_time: row.request_time,
    is_anonymous: row.is_anonymous,
    is_reocurring: row.is_reocurring,
    cancelled_at: row.cancelled_at,
  }));
}