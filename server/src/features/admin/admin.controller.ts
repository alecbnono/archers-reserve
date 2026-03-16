import type { Request, Response } from "express";
import type { AuthRequest } from "../../types/auth.types.js";
import * as adminService from "./admin.service.js";

export async function getDashboard(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (req.user?.role !== "ADMIN") {
      res.status(403).json({ error: "Admin access required" });
      return;
    }

    const reservations = await adminService.getAllReservations();
    res.json({ reservations });
  } catch (error: any) {
    res.status(500).json({ error: "Internal server error" });
  }
}