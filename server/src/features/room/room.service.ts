import pool from "../../app/db.js";

export interface RoomRow {
  roomId: number;
  roomCode: string;
  building: string;
  floor: number;
  capacity: number;
}

/**
 * Get all buildings from given rooms
 */

export async function getBuildings(): Promise<string[]> {
  const result = await pool.query(
    "SELECT DISTINCT building FROM room ORDER BY building",
  );
  return result.rows.map((r) => r.building);
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

/**
 * Get rooms filtered by selected buildings
 * If no buildings are provided, return all rooms
 */

export async function getRooms(buildings?: string[]): Promise<RoomRow[]> {
  if (buildings && buildings.length > 0) {
    const result = await pool.query(
      `SELECT room_id, room_code, building, floor, capacity
       FROM room
       WHERE building = ANY($1)
       ORDER BY building, room_code`,
      [buildings],
    );
    return result.rows.map(toRoomRow);
  }
  return getAllRooms();
}

/**
 * Converts DB row to RoomRow type 
 */

function toRoomRow(row: any): RoomRow {
  return {
    roomId: row.room_id,
    roomCode: row.room_code,
    building: row.building,
    floor: row.floor,
    capacity: row.capacity,
  };
}