import * as reservationService from "./reservation.service.js";
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
