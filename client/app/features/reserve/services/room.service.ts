import type { RoomType } from "~/types/labs.types";
import { API_URL } from "~/config/api";

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
