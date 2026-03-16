import { Router } from "express";
import { requireAuth } from "../../middleware/token.js";
import * as adminController from "./admin.controller.js";

const router = Router();

// GET /admin/dashboard — admin-only reservation logs
router.get("/dashboard", requireAuth, adminController.getDashboard);

export default router;