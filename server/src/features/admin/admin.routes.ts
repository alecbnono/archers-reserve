import { Router } from "express";
import { requireAuth } from "../../middleware/token.js";
import * as adminController from "./admin.controller.js";

const router = Router();

// Dashboard logs endpoint
router.get("/dashboard", requireAuth, adminController.getDashboard);

// Admin user search (STUDENT/FACULTY only)
router.get("/users/search", requireAuth, adminController.searchUsers);

export default router;