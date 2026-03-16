import type { Response } from "express";
import type { AuthRequest } from "../../types/auth.types.js";
import * as adminService from "./admin.service.js";
import { unmergeTimeslotRanges, toMinutes } from "./admin.service.js";


export async function getDashboard(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (req.user?.role !== "ADMIN") {
      res.status(403).json({ error: "Admin access required" });
      return;
    }

    const filters = {
      building: req.query.building as string,
      startTime: req.query.startTime ? parseInt(req.query.startTime as string) : undefined,
      endTime: req.query.endTime ? parseInt(req.query.endTime as string) : undefined,
      showVacant: req.query.showVacant === 'true',
    };

    const reservations = await adminService.getReservations();

    let filteredReservations = reservations;

    const buildings = filters.building.split(',')
    if (filters.building) {
      filteredReservations = filteredReservations.filter(
        r => buildings.includes(r.building.toString())!
      );
    }    

    if (filters.startTime && filters.endTime) {
      filteredReservations = filteredReservations.filter(r => {
        const timeSlots = unmergeTimeslotRanges(r.timeSlot || '');
        
        return timeSlots.some(slot => {
          const slotStart = toMinutes(slot.startTime);
          const slotEnd = toMinutes(slot.endTime);
          
          const overlaps = slotStart <= filters.endTime! && slotEnd >= filters.startTime!;
          return overlaps;
        });
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

