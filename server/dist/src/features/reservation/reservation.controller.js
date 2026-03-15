import * as reservationService from "./reservation.service.js";
/**
 * POST /reservations — create reservation(s).
 * Body: { roomId, date, timeslotIds, seatId?, reserveAll, isAnonymous }
 */
export async function createReservation(req, res) {
    try {
        const { roomId, date, timeslotIds, seatId, reserveAll, isAnonymous } = req.body;
        // --- Basic validation ---
        if (!roomId || typeof roomId !== "number" || roomId <= 0) {
            res.status(400).json({ error: "Valid roomId is required" });
            return;
        }
        if (!date || typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            res.status(400).json({ error: "Valid date (YYYY-MM-DD) is required" });
            return;
        }
        if (!Array.isArray(timeslotIds) ||
            timeslotIds.length === 0 ||
            !timeslotIds.every((id) => typeof id === "number" && id > 0)) {
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
        const result = await reservationService.createReservation({
            userId: req.user.id,
            userRole: req.user.role,
            roomId,
            date,
            timeslotIds: uniqueTimeslots,
            seatId: reserveAll ? null : seatId,
            reserveAll,
            isAnonymous: isAnonymous === true,
        });
        res.status(201).json({
            message: "Reservation created successfully",
            createdCount: result.createdCount,
            overriddenCount: result.overriddenCount,
        });
    }
    catch (error) {
        res
            .status(error.status || 500)
            .json({ error: error.message || "Internal server error" });
    }
}
/**
 * GET /reservations/me — current user's reservations.
 */
export async function getMyReservations(req, res) {
    try {
        const reservations = await reservationService.getUserReservations(req.user.id);
        res.status(200).json({ reservations });
    }
    catch (error) {
        res
            .status(error.status || 500)
            .json({ error: error.message || "Internal server error" });
    }
}
/**
 * GET /reservations — all reservations (admin only).
 */
export async function getAllReservations(req, res) {
    try {
        if (req.user.role !== "ADMIN") {
            res.status(403).json({ error: "Admin access required" });
            return;
        }
        const reservations = await reservationService.getAllReservations();
        res.status(200).json({ reservations });
    }
    catch (error) {
        res
            .status(error.status || 500)
            .json({ error: error.message || "Internal server error" });
    }
}
/**
 * GET /reservations/availability?roomId=...&date=YYYY-MM-DD
 * Public (requires auth) — returns timeslot occupancy for a room on a date.
 */
export async function getAvailability(req, res) {
    try {
        const roomId = Number(req.query.roomId);
        const date = req.query.date;
        if (!roomId || isNaN(roomId) || roomId <= 0) {
            res.status(400).json({ error: "Valid roomId is required" });
            return;
        }
        if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            res.status(400).json({ error: "Valid date (YYYY-MM-DD) is required" });
            return;
        }
        const availability = await reservationService.getAvailability(roomId, date);
        res.status(200).json(availability);
    }
    catch (error) {
        res
            .status(error.status || 500)
            .json({ error: error.message || "Internal server error" });
    }
}
/**
 * PATCH /reservations/:batchId/cancel — cancel an entire reservation batch.
 * Owner or ADMIN only. Batch must be UPCOMING (not started/completed/cancelled).
 */
export async function cancelReservationBatch(req, res) {
    try {
        const { batchId } = req.params;
        if (!batchId || typeof batchId !== "string") {
            res.status(400).json({ error: "Valid batchId is required" });
            return;
        }
        const result = await reservationService.cancelReservationBatch(batchId, req.user.id, req.user.role);
        res.status(200).json({
            message: "Reservation cancelled successfully",
            cancelledCount: result.cancelledCount,
        });
    }
    catch (error) {
        res
            .status(error.status || 500)
            .json({ error: error.message || "Internal server error" });
    }
}
