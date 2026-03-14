import type { Response } from "express";
import type { AuthRequest } from "../../types/auth.types.js";
import * as reservationService from "./reservation.service.js";

/**
 * GET /reservations/me — current user's reservations.
 */
export async function getMyReservations(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
    const reservations = await reservationService.getUserReservations(
      req.user!.id,
    );
    res.status(200).json({ reservations });
  } catch (error: any) {
    res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
}

/**
 * GET /reservations — all reservations (admin only).
 */
export async function getAllReservations(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
    if (req.user!.role !== "ADMIN") {
      res.status(403).json({ error: "Admin access required" });
      return;
    }

    const reservations = await reservationService.getAllReservations();
    res.status(200).json({ reservations });
  } catch (error: any) {
    res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
}
