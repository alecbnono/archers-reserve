import { Router } from "express";
import { requireAuth } from "../../middleware/token.js";
import { uploadAvatarMiddleware } from "./profile.upload.js";
import * as profileController from "./profile.controller.js";
const router = Router();
// GET /profile/search?q=... — public user directory search
// Must be registered BEFORE /:userId to avoid param catch-all conflict
router.get("/search", requireAuth, profileController.searchUsers);
// GET /profile/:userId — public profile view
router.get("/:userId", requireAuth, profileController.getPublicProfile);
// POST /profile/me/avatar
// requireAuth runs first so req.user is populated before multer needs it for filename
router.post("/me/avatar", requireAuth, uploadAvatarMiddleware, profileController.uploadAvatar);
// PATCH /profile/me/bio
router.patch("/me/bio", requireAuth, profileController.updateBio);
// DELETE /profile/me
router.delete("/me", requireAuth, profileController.deleteAccount);
export default router;
