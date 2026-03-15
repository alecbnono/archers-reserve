import * as roomService from "./room.service.js";
/**
 * GET /rooms — list all rooms.
 */
export async function getRooms(req, res) {
    try {
        const rooms = await roomService.getAllRooms();
        res.status(200).json({ rooms });
    }
    catch (error) {
        res
            .status(error.status || 500)
            .json({ error: error.message || "Internal server error" });
    }
}
