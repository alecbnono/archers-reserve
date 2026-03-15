import pool from "../../app/db.js";

export interface RoomRow {
  roomId: number;
  roomCode: string;
  building: string;
  floor: number;
  capacity: number;
}

/**
 * Get all rooms, ordered by building then room code.
 */
export async function getAllRooms(): Promise<RoomRow[]> {
  const query = `
    SELECT room_id, room_code, building, floor, capacity
    FROM room
    ORDER BY building, room_code
  `;

  const result = await pool.query(query);

  return result.rows.map((row: any) => ({
    roomId: row.room_id,
    roomCode: row.room_code,
    building: row.building,
    floor: row.floor,
    capacity: row.capacity,
  }));
}
