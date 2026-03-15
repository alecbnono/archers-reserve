import { Router } from "express";
import { requireAuth } from "../../middleware/token.js";
import * as reservationController from "./reservation.controller.js";
const router = Router();
// POST /reservations — create reservation(s)
router.post("/", requireAuth, reservationController.createReservation);
// GET /reservations/availability?roomId=...&date=YYYY-MM-DD — timeslot + seat occupancy
router.get("/availability", requireAuth, reservationController.getAvailability);
// GET /reservations/me — current user's reservations
router.get("/me", requireAuth, reservationController.getMyReservations);
// GET /reservations — all reservations (admin only)
router.get("/", requireAuth, reservationController.getAllReservations);
// PATCH /reservations/:batchId/cancel — cancel an entire reservation batch
router.patch("/:batchId/cancel", requireAuth, reservationController.cancelReservationBatch);
export default router;
