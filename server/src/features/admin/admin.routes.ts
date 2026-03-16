import { Router } from "express";
import { requireAuth } from "../../middleware/token.js";
import * as adminController from "./admin.controller.js";

const router = Router();

// GET /admin/adminLogs — admin-only admin logs data
router.get("/me/adminLogs", requireAuth, adminController.getDashboard);

export default router;
