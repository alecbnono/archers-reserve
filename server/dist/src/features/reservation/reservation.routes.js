import { Router } from "express";
import { requireAuth } from "../../middleware/token.js";
import * as reservationController from "./reservation.controller.js";
const router = Router();
// GET /reservations/me — current user's reservations
router.get("/me", requireAuth, reservationController.getMyReservations);
// GET /reservations — all reservations (admin only)
router.get("/", requireAuth, reservationController.getAllReservations);
export default router;
