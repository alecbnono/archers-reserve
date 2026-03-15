import pool from "../../app/db.js";

export type RoomFilter = {
  buildings?: string[];
  vacant?: boolean;
  timeslotId?: number; // or start/end times if you have timeslot table
};

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

export async function getRooms(filter: RoomFilter = {}): Promise<RoomRow[]> {
  const { buildings, vacant, timeslotId } = filter;

  const values: Array<string | number | string[]> = [];
  const conditions: string[] = [];

  if (buildings && buildings.length > 0) {
    values.push(buildings);
    conditions.push(`r.building = ANY($${values.length})`);
  }

  const vacancyJoin = `
    LEFT JOIN (
      SELECT room_id, COUNT(*) AS reserved_count
      FROM reservation
      ${typeof timeslotId === "number" ? `WHERE timeslot_id = $${values.length + 1}` : ""}
      GROUP BY room_id
    ) AS reserved ON reserved.room_id = r.room_id
  `;

  if (typeof timeslotId === "number") {
    values.push(timeslotId);
  }

  if (vacant) {
    conditions.push(`COALESCE(reserved.reserved_count, 0) < r.capacity`);
  }

  let query = `
    SELECT r.room_id, r.room_code, r.building, r.floor, r.capacity
    FROM room r
    ${vacancyJoin}
  `;
  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }
  query += " ORDER BY r.building, r.room_code";

  const result = await pool.query(query, values);
  return result.rows.map(toRoomRow);
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