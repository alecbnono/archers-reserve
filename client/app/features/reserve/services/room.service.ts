import type { RoomType } from "~/types/labs.types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
const BASE_URL = `${API_URL}/rooms`;

export interface RoomListResult {
  rooms?: RoomType[];
  error?: string;
}

/**
 * Fetch all rooms (GET /rooms).
 */
export async function fetchRooms(): Promise<RoomListResult> {
  const res = await fetch(BASE_URL, {
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    return { error: data.error || "Failed to fetch rooms" };
  }

  return { rooms: data.rooms };
}
