import type { Request, Response } from "express";
import type { AuthRequest } from "../../types/auth.types.js";
import * as reservationService from "./reservation.service.js";

/**
 * POST /reservations — create reservation(s).
 * Body: { roomId, date, timeslotIds, seatId?, reserveAll, isAnonymous, targetUserId? }
 *
 * Admin on-behalf reserving:
 *   - Admin MUST provide targetUserId (STUDENT or FACULTY).
 *   - Non-admin requests with targetUserId are rejected.
 */
export async function createReservation(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
    const { roomId, date, timeslotIds, seatId, reserveAll, isAnonymous, targetUserId } =
      req.body;

    // --- Basic validation ---
    if (!roomId || typeof roomId !== "number" || roomId <= 0) {
      res.status(400).json({ error: "Valid roomId is required" });
      return;
    }

    if (!date || typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      res.status(400).json({ error: "Valid date (YYYY-MM-DD) is required" });
      return;
    }

    if (
      !Array.isArray(timeslotIds) ||
      timeslotIds.length === 0 ||
      !timeslotIds.every((id: any) => typeof id === "number" && id > 0)
    ) {
      res
        .status(400)
        .json({ error: "timeslotIds must be a non-empty array of positive integers" });
      return;
    }

    // Deduplicate timeslots
    const uniqueTimeslots = [...new Set(timeslotIds)];

    if (typeof reserveAll !== "boolean") {
      res.status(400).json({ error: "reserveAll must be a boolean" });
      return;
    }

    if (!reserveAll && (seatId == null || typeof seatId !== "number" || seatId <= 0)) {
      res
        .status(400)
        .json({ error: "Valid seatId is required when reserveAll is false" });
      return;
    }

    // --- Admin on-behalf validation ---
    const actorRole = req.user!.role;

    if (actorRole === "ADMIN" && (targetUserId == null || typeof targetUserId !== "number" || targetUserId <= 0)) {
      res.status(400).json({ error: "Admin must select a target user to reserve for" });
      return;
    }

    if (actorRole !== "ADMIN" && targetUserId != null) {
      res.status(403).json({ error: "Only admins can reserve on behalf of another user" });
      return;
    }

    const result = await reservationService.createReservation({
      userId: actorRole === "ADMIN" ? targetUserId : req.user!.id,
      userRole: actorRole,
      roomId,
      date,
      timeslotIds: uniqueTimeslots,
      seatId: reserveAll ? null : seatId,
      reserveAll,
      isAnonymous: isAnonymous === true,
      targetUserId: actorRole === "ADMIN" ? targetUserId : undefined,
    });

    res.status(201).json({
      message: "Reservation created successfully",
      createdCount: result.createdCount,
      overriddenCount: result.overriddenCount,
    });
  } catch (error: any) {
    res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
}

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

/**
 * GET /reservations/availability?roomId=...&date=YYYY-MM-DD
 * Public (requires auth) — returns timeslot occupancy for a room on a date.
 */
export async function getAvailability(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const roomId = Number(req.query.roomId);
    const date = req.query.date as string;

    if (!roomId || isNaN(roomId) || roomId <= 0) {
      res.status(400).json({ error: "Valid roomId is required" });
      return;
    }

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      res.status(400).json({ error: "Valid date (YYYY-MM-DD) is required" });
      return;
    }

    const excludeBatchId = req.query.excludeBatchId as string | undefined;

    const availability = await reservationService.getAvailability(roomId, date, excludeBatchId);
    res.status(200).json(availability);
  } catch (error: any) {
    res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
}

/**
 * PATCH /reservations/:batchId/cancel — cancel an entire reservation batch.
 * Owner or ADMIN only. Batch must be UPCOMING (not started/completed/cancelled).
 */
export async function cancelReservationBatch(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
    const { batchId } = req.params;

    if (!batchId || typeof batchId !== "string") {
      res.status(400).json({ error: "Valid batchId is required" });
      return;
    }

    const result = await reservationService.cancelReservationBatch(
      batchId,
      req.user!.id,
      req.user!.role,
    );

    res.status(200).json({
      message: "Reservation cancelled successfully",
      cancelledCount: result.cancelledCount,
    });
  } catch (error: any) {
    res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
}

/**
 * GET /reservations/:batchId — fetch batch detail for edit prefill.
 * Owner or ADMIN only.
 */
export async function getReservationBatchDetail(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
    const { batchId } = req.params;

    if (!batchId || typeof batchId !== "string") {
      res.status(400).json({ error: "Valid batchId is required" });
      return;
    }

    const detail = await reservationService.getReservationBatchDetail(
      batchId,
      req.user!.id,
      req.user!.role,
    );

    res.status(200).json(detail);
  } catch (error: any) {
    res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
}

/**
 * PATCH /reservations/:batchId — edit a reservation batch (replace-in-place).
 * Owner or ADMIN only. Batch must be UPCOMING.
 * Body: { roomId, date, timeslotIds, seatId?, reserveAll, isAnonymous }
 */
export async function editReservationBatch(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
    const { batchId } = req.params;

    if (!batchId || typeof batchId !== "string") {
      res.status(400).json({ error: "Valid batchId is required" });
      return;
    }

    const { roomId, date, timeslotIds, seatId, reserveAll, isAnonymous } =
      req.body;

    // --- Basic validation (same as create) ---
    if (!roomId || typeof roomId !== "number" || roomId <= 0) {
      res.status(400).json({ error: "Valid roomId is required" });
      return;
    }

    if (!date || typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      res.status(400).json({ error: "Valid date (YYYY-MM-DD) is required" });
      return;
    }

    if (
      !Array.isArray(timeslotIds) ||
      timeslotIds.length === 0 ||
      !timeslotIds.every((id: any) => typeof id === "number" && id > 0)
    ) {
      res
        .status(400)
        .json({ error: "timeslotIds must be a non-empty array of positive integers" });
      return;
    }

    const uniqueTimeslots = [...new Set(timeslotIds)];

    if (typeof reserveAll !== "boolean") {
      res.status(400).json({ error: "reserveAll must be a boolean" });
      return;
    }

    if (!reserveAll && (seatId == null || typeof seatId !== "number" || seatId <= 0)) {
      res
        .status(400)
        .json({ error: "Valid seatId is required when reserveAll is false" });
      return;
    }

    const result = await reservationService.editReservationBatch({
      batchId,
      actorUserId: req.user!.id,
      actorRole: req.user!.role,
      roomId,
      date,
      timeslotIds: uniqueTimeslots,
      seatId: reserveAll ? null : seatId,
      reserveAll,
      isAnonymous: isAnonymous === true,
    });

    res.status(200).json({
      message: "Reservation updated successfully",
      updatedCount: result.updatedCount,
      overriddenCount: result.overriddenCount,
    });
  } catch (error: any) {
    res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
}
