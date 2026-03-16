import type { Request, Response } from "express";
import type { AuthRequest } from "../../types/auth.types.js";
import * as adminService from "./admin.service.js";

export async function getDashboard(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (req.user?.role !== "ADMIN") {
      res.status(403).json({ error: "Admin access required" });
      return;
    }

    const filters = {
      building: req.query.building as string | undefined,
      startTime: req.query.startTime ? parseInt(req.query.startTime as string) : undefined,
      endTime: req.query.endTime ? parseInt(req.query.endTime as string) : undefined,
      showVacant: req.query.showVacant === 'true',
    };

    const reservations = await adminService.getAllReservations();

    let filteredReservations = reservations;

    if (filters.building) {
      filteredReservations = filteredReservations.filter(
        r => r.room_id.toString().includes(filters.building!)
      );
    }

    if (filters.startTime && filters.endTime) {
      filteredReservations = filteredReservations.filter(r => {
        const dateTime = new Date(`${r.request_date} ${r.request_time}`);
        return dateTime.getTime() >= filters.startTime! && dateTime.getTime() <= filters.endTime!;
      });
    }

    res.json({ 
      reservations: filteredReservations 
    });
  } catch (error: any) {
    console.error("Admin dashboard error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}