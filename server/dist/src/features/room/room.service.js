import pool from "../../app/db.js";
/**
 * Get all buildings from given rooms
 */
export async function getBuildings() {
    const result = await pool.query("SELECT DISTINCT building FROM room ORDER BY building");
    return result.rows.map((r) => r.building);
}
/**
 * Get all rooms, ordered by building then room code.
 */
export async function getAllRooms() {
    const query = `
    SELECT room_id, room_code, building, floor, capacity
    FROM room
    ORDER BY building, room_code
  `;
    const result = await pool.query(query);
    return result.rows.map((row) => ({
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
export async function getRooms(filter = {}) {
    const { buildings, vacant, startTime, endTime, date } = filter;
    const values = [];
    const conditions = [];
    let dateCondition = "";
    if (date) {
        values.push(date);
        const dateParam = values.length;
        dateCondition = `AND res.request_date = $${dateParam}::date`;
    }
    if (buildings && buildings.length > 0) {
        values.push(buildings);
        conditions.push(`r.building = ANY($${values.length})`);
    }
    let timeslotCondition = "";
    if (startTime && endTime) {
        values.push(startTime);
        const startParam = values.length;
        values.push(endTime);
        const endParam = values.length;
        timeslotCondition = `AND t.start_time >= $${startParam}::time AND t.start_time < $${endParam}::time`;
    }
    const vacancyLateral = `
      LEFT JOIN LATERAL (
        SELECT 1
        FROM timeslot t
        LEFT JOIN reservation res
          ON res.room_id = r.room_id
          AND res.timeslot_id = t.timeslot_id
          AND res.cancelled_at IS NULL
          ${dateCondition}
        WHERE 1=1 ${timeslotCondition}
        GROUP BY t.timeslot_id
        HAVING COUNT(res.reservation_id) < r.capacity
        LIMIT 1
      ) AS has_vacancy ON TRUE
    `;
    if (vacant) {
        conditions.push(`has_vacancy IS NOT NULL`);
    }
    let query = `
    SELECT r.room_id, r.room_code, r.building, r.floor, r.capacity
    FROM room r
    ${vacancyLateral}
  `;
    if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
    }
    query += " ORDER BY r.building, r.room_code";
    const result = await pool.query(query, values);
    return result.rows.map(toRoomRow);
}
export async function getRoomOccupancy(roomId, date) {
    const query = `
    SELECT 
      t.timeslot_id,
      t.start_time,
      t.end_time,
      COUNT(r.reservation_id)::int AS reserved_count
    FROM timeslot t
    LEFT JOIN reservation r
      ON r.timeslot_id = t.timeslot_id
      AND r.room_id = $1
      AND r.request_date = $2
      AND r.cancelled_at IS NULL
    GROUP BY t.timeslot_id, t.start_time, t.end_time
    ORDER BY t.start_time
  `;
    const result = await pool.query(query, [roomId, date]);
    return result.rows.map(row => ({
        timeslotId: row.timeslot_id,
        startTime: row.start_time,
        endTime: row.end_time,
        reservedCount: row.reserved_count,
    }));
}
/**
 * Converts DB row to RoomRow type
 */
function toRoomRow(row) {
    return {
        roomId: row.room_id,
        roomCode: row.room_code,
        building: row.building,
        floor: row.floor,
        capacity: row.capacity,
    };
}
