import { Router } from "express";
import { requireAuth } from "../../middleware/token.js";
import { uploadAvatarMiddleware } from "./profile.upload.js";
import * as profileController from "./profile.controller.js";

const router = Router();

// POST /profile/me/avatar
// requireAuth runs first so req.user is populated before multer needs it for filename
router.post(
  "/me/avatar",
  requireAuth,
  uploadAvatarMiddleware,
  profileController.uploadAvatar,
);

// PATCH /profile/me/bio
router.patch("/me/bio", requireAuth, profileController.updateBio);

export default router;
