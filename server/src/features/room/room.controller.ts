import type { Request, Response } from "express";
import * as roomService from "./room.service.js";
import { AppError } from "../../utils/AppError.js";

export async function listRooms(req: Request, res: Response): Promise<void> {
  const q = req.query.building;
  let buildings: string[] = [];

  if (Array.isArray(q)) {
    buildings = q.filter((x): x is string => typeof x === "string");
  } else if (typeof q === "string") {
    buildings = [q];
  }
    
  try {
    const vacant = req.query.vacant === "true";
    const timeslotId = req.query.timeslot_id ? Number(req.query.timeslot_id) : undefined;

    const rooms = await roomService.getRooms({ buildings, vacant, timeslotId });
    res.status(200).json({ rooms });
  } catch (error: any) {
    if (error instanceof AppError) {
      res.status(error.status).json({ error: error.message });
      return;
    }

    res.status(500).json({ error: "Internal server error" });
  }
}

export async function listBuildings(_req: Request, res: Response): Promise<void> {
  try {
    const buildings = await roomService.getBuildings(); // implement in room.service
    res.status(200).json({ buildings });
  } catch (error: any) {
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getRoomOccupancy(req: Request, res: Response): Promise<void> {
  const roomId = Number(req.params.roomId);
  const date = typeof req.query.date === "string" ? req.query.date : "";
  if (!roomId || !date) { res.status(400).json({ error: "roomId and date required" }); return; }
  const data = await roomService.getRoomOccupancy(roomId, date);
  res.json(data);
}