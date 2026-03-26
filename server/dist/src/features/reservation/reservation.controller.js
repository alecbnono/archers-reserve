import * as reservationService from "./reservation.service.js";
import * as profileService from "../profile/profile.service.js";
/**
 * POST /reservations — create reservation(s).
 * Body: { roomId, date, timeslotIds, seatId?, reserveAll, isAnonymous, targetUserId? }
 *
 * Admin on-behalf reserving:
 *   - Admin MUST provide targetUserId (STUDENT or FACULTY).
 *   - Non-admin requests with targetUserId are rejected.
 */
export async function createReservation(req, res) {
    try {
        const { roomId, date, timeslotIds, seatId, reserveAll, isAnonymous, targetUserId, isRecurring } = req.body;
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
        // --- Recurring validation: only non-STUDENT can use recurring ---
        if (isRecurring != null && typeof isRecurring !== "boolean") {
            res.status(400).json({ error: "isRecurring must be a boolean" });
            return;
        }
        if (isRecurring && req.user.role === "STUDENT") {
            res.status(403).json({ error: "Students cannot create recurring reservations" });
            return;
        }
        if (isRecurring && !reserveAll) {
            res.status(400).json({ error: "Recurring reservations must reserve all seats" });
            return;
        }
        if (isRecurring && seatId != null) {
            res.status(400).json({ error: "Recurring reservations cannot specify a single seat" });
            return;
        }
        // --- Admin on-behalf validation ---
        const actorRole = req.user.role;
        if (actorRole === "ADMIN" && (targetUserId == null || typeof targetUserId !== "number" || targetUserId <= 0)) {
            res.status(400).json({ error: "Admin must select a target user to reserve for" });
            return;
        }
        if (actorRole !== "ADMIN" && targetUserId != null) {
            res.status(403).json({ error: "Only admins can reserve on behalf of another user" });
            return;
        }
        const result = await reservationService.createReservation({
            userId: actorRole === "ADMIN" ? targetUserId : req.user.id,
            userRole: actorRole,
            roomId,
            date,
            timeslotIds: uniqueTimeslots,
            seatId: reserveAll ? null : seatId,
            reserveAll,
            isAnonymous: isAnonymous === true,
            isRecurring: isRecurring === true,
            targetUserId: actorRole === "ADMIN" ? targetUserId : undefined,
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
 * GET /reservations/user/:userId — reservations for a specific user (public profile).
 * Privacy: profile must be public, or requester is self/admin.
 * Anonymous reservation batches are excluded for non-self/non-admin viewers.
 */
export async function getUserReservations(req, res) {
    try {
        const targetUserId = Number(req.params.userId);
        if (!targetUserId || isNaN(targetUserId) || targetUserId <= 0) {
            res.status(400).json({ error: "Valid userId is required" });
            return;
        }
        // This call also enforces the privacy check (throws 403 if private)
        await profileService.getPublicProfile(targetUserId, req.user.id, req.user.role);
        let reservations = await reservationService.getUserReservations(targetUserId);
        // Hide anonymous batches from non-self/non-admin viewers
        const isSelf = req.user.id === targetUserId;
        const isAdmin = req.user.role === "ADMIN";
        if (!isSelf && !isAdmin) {
            reservations = reservations.filter((r) => !r.isAnonymous);
        }
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
        const excludeBatchId = req.query.excludeBatchId;
        const availability = await reservationService.getAvailability(roomId, date, excludeBatchId);
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
/**
 * GET /reservations/:batchId — fetch batch detail for edit prefill.
 * Owner or ADMIN only.
 */
export async function getReservationBatchDetail(req, res) {
    try {
        const { batchId } = req.params;
        if (!batchId || typeof batchId !== "string") {
            res.status(400).json({ error: "Valid batchId is required" });
            return;
        }
        const detail = await reservationService.getReservationBatchDetail(batchId, req.user.id, req.user.role);
        res.status(200).json(detail);
    }
    catch (error) {
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
export async function editReservationBatch(req, res) {
    try {
        const { batchId } = req.params;
        if (!batchId || typeof batchId !== "string") {
            res.status(400).json({ error: "Valid batchId is required" });
            return;
        }
        const { roomId, date, timeslotIds, seatId, reserveAll, isAnonymous, isRecurring } = req.body;
        // --- Basic validation (same as create) ---
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
        // --- Recurring validation ---
        if (isRecurring != null && typeof isRecurring !== "boolean") {
            res.status(400).json({ error: "isRecurring must be a boolean" });
            return;
        }
        if (isRecurring && req.user.role === "STUDENT") {
            res.status(403).json({ error: "Students cannot create recurring reservations" });
            return;
        }
        if (isRecurring && !reserveAll) {
            res.status(400).json({ error: "Recurring reservations must reserve all seats" });
            return;
        }
        if (isRecurring && seatId != null) {
            res.status(400).json({ error: "Recurring reservations cannot specify a single seat" });
            return;
        }
        const result = await reservationService.editReservationBatch({
            batchId,
            actorUserId: req.user.id,
            actorRole: req.user.role,
            roomId,
            date,
            timeslotIds: uniqueTimeslots,
            seatId: reserveAll ? null : seatId,
            reserveAll,
            isAnonymous: isAnonymous === true,
            isRecurring: isRecurring === true,
        });
        res.status(200).json({
            message: "Reservation updated successfully",
            updatedCount: result.updatedCount,
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
 * POST /reservations/recurring-conflicts — check if FACULTY/ADMIN conflicts exist
 * across a recurring date series. Lightweight, read-only.
 * Body: { roomId, date, timeslotIds, seatId?, reserveAll }
 */
export async function checkRecurringConflicts(req, res) {
    try {
        const { roomId, date, timeslotIds, seatId, reserveAll } = req.body;
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
        if (typeof reserveAll !== "boolean") {
            res.status(400).json({ error: "reserveAll must be a boolean" });
            return;
        }
        // Recurring conflict checks must always use reserveAll
        if (!reserveAll) {
            res.status(400).json({ error: "Recurring conflict check requires reserveAll to be true" });
            return;
        }
        if (seatId != null) {
            res.status(400).json({ error: "Recurring conflict check cannot specify a single seat" });
            return;
        }
        // Resolve seat IDs — if reserveAll, query the room's seat count
        let seatIds;
        if (reserveAll) {
            const roomResult = await import("../../app/db.js").then((mod) => mod.default.query("SELECT capacity FROM room WHERE room_id = $1", [roomId]));
            if (roomResult.rows.length === 0) {
                res.status(404).json({ error: "Room not found" });
                return;
            }
            const capacity = roomResult.rows[0].capacity;
            seatIds = Array.from({ length: capacity }, (_, i) => i + 1);
        }
        else {
            if (seatId == null || typeof seatId !== "number" || seatId <= 0) {
                res
                    .status(400)
                    .json({ error: "Valid seatId is required when reserveAll is false" });
                return;
            }
            seatIds = [seatId];
        }
        const result = await reservationService.checkRecurringConflicts({
            roomId,
            date,
            timeslotIds,
            seatIds,
        });
        res.status(200).json(result);
    }
    catch (error) {
        res
            .status(error.status || 500)
            .json({ error: error.message || "Internal server error" });
    }
}
