import { getAllRooms } from "../room/room.service.js";


export async function getAdminDashboardData() {
  const rooms = await getAllRooms();

  return {
    rooms,
  };
}
