import * as adminService from "./admin.service.js";
import { unmergeTimeslotRanges, toMinutes } from "./admin.service.js";
export async function getDashboard(req, res) {
    try {
        if (req.user?.role !== "ADMIN") {
            res.status(403).json({ error: "Admin access required" });
            return;
        }
        const buildingParam = typeof req.query.building === "string" ? req.query.building : "";
        const startTimeParam = typeof req.query.startTime === "string" ? req.query.startTime : undefined;
        const endTimeParam = typeof req.query.endTime === "string" ? req.query.endTime : undefined;
        const filters = {
            building: buildingParam,
            startTime: startTimeParam ? parseInt(startTimeParam, 10) : undefined,
            endTime: endTimeParam ? parseInt(endTimeParam, 10) : undefined,
        };
        const reservations = await adminService.getReservations();
        let filteredReservations = reservations;
        const buildings = filters.building ? filters.building.split(',') : [];
        if (filters.building) {
            filteredReservations = filteredReservations.filter(r => buildings.includes(r.building.toString()));
        }
        if (filters.startTime !== undefined && filters.endTime !== undefined) {
            filteredReservations = filteredReservations.filter(r => {
                const timeSlots = unmergeTimeslotRanges(r.timeSlot || '');
                return timeSlots.some(slot => {
                    const slotStart = toMinutes(slot.startTime);
                    const slotEnd = toMinutes(slot.endTime);
                    const overlaps = slotStart < filters.endTime && slotEnd > filters.startTime;
                    return overlaps;
                });
            });
        }
        res.json({
            reservations: filteredReservations
        });
    }
    catch (error) {
        console.error("Admin dashboard error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
/**
 * GET /admin/users/search?q=...
 * Admin-only endpoint to search STUDENT/FACULTY users by username/name/email.
 */
export async function searchUsers(req, res) {
    try {
        if (req.user?.role !== "ADMIN") {
            res.status(403).json({ error: "Admin access required" });
            return;
        }
        const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
        if (q.length === 0) {
            res.status(200).json({ users: [] });
            return;
        }
        const users = await adminService.searchUsers(q);
        res.status(200).json({ users });
    }
    catch (error) {
        res
            .status(error.status || 500)
            .json({ error: error.message || "Internal server error" });
    }
}
