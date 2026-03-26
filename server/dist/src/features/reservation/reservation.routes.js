import { Router } from "express";
import { requireAuth } from "../../middleware/token.js";
import * as reservationController from "./reservation.controller.js";
const router = Router();
// POST /reservations — create reservation(s)
router.post("/", requireAuth, reservationController.createReservation);
// GET /reservations/availability?roomId=...&date=YYYY-MM-DD — timeslot + seat occupancy
router.get("/availability", requireAuth, reservationController.getAvailability);
// POST /reservations/recurring-conflicts — check FACULTY/ADMIN conflicts for recurring series
router.post("/recurring-conflicts", requireAuth, reservationController.checkRecurringConflicts);
// GET /reservations/me — current user's reservations
router.get("/me", requireAuth, reservationController.getMyReservations);
// GET /reservations/user/:userId — target user's reservations (public profile)
router.get("/user/:userId", requireAuth, reservationController.getUserReservations);
// GET /reservations — all reservations (admin only)
router.get("/", requireAuth, reservationController.getAllReservations);
// PATCH /reservations/:batchId/cancel — cancel an entire reservation batch
router.patch("/:batchId/cancel", requireAuth, reservationController.cancelReservationBatch);
// GET /reservations/:batchId — batch detail for edit prefill
router.get("/:batchId", requireAuth, reservationController.getReservationBatchDetail);
// PATCH /reservations/:batchId — edit a reservation batch (replace-in-place)
router.patch("/:batchId", requireAuth, reservationController.editReservationBatch);
export default router;
