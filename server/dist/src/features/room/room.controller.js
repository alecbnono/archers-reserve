import * as roomService from "./room.service.js";
import { AppError } from "../../utils/AppError.js";
export async function listRooms(req, res) {
    const q = req.query.building;
    let buildings = [];
    if (Array.isArray(q)) {
        buildings = q.filter((x) => typeof x === "string");
    }
    else if (typeof q === "string") {
        buildings = [q];
    }
    try {
        const vacant = req.query.vacant === "true";
        const startTime = typeof req.query.start_time === "string" ? req.query.start_time : undefined;
        const endTime = typeof req.query.end_time === "string" ? req.query.end_time : undefined;
        const date = typeof req.query.date === "string" ? req.query.date : undefined;
        const rooms = await roomService.getRooms({ buildings, vacant, startTime, endTime, date });
        res.status(200).json({ rooms });
    }
    catch (error) {
        if (error instanceof AppError) {
            res.status(error.status).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: "Internal server error" });
    }
}
export async function listBuildings(_req, res) {
    try {
        const buildings = await roomService.getBuildings();
        res.status(200).json({ buildings });
    }
    catch {
        res.status(500).json({ error: "Internal server error" });
    }
}
export async function getRoomOccupancy(req, res) {
    const roomId = Number(req.params.roomId);
    const date = typeof req.query.date === "string" ? req.query.date : "";
    if (!roomId || !date) {
        res.status(400).json({ error: "roomId and date required" });
        return;
    }
    try {
        const data = await roomService.getRoomOccupancy(roomId, date);
        res.status(200).json(data);
    }
    catch (error) {
        if (error instanceof AppError) {
            res.status(error.status).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: "Internal server error" });
    }
}
