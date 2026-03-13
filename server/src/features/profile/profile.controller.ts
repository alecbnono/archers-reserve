import type { Request, Response } from "express";
import type { AuthRequest } from "../../types/auth.types.js";
import * as profileService from "./profile.service.js";
import { formatUserResponse } from "../../utils/user.utils.js";

export async function uploadAvatar(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No image file provided" });
      return;
    }

    const relativePath = `/uploads/profile/${req.file.filename}`;
    const user = await profileService.updateAvatar(req.user!.id, relativePath);

    res.status(200).json({ user: formatUserResponse(user, req as Request) });
  } catch (error: any) {
    res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
}

export async function updateBio(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
    const { bio } = req.body;

    if (typeof bio !== "string") {
      res.status(400).json({ error: "Bio must be a string" });
      return;
    }

    const user = await profileService.updateBio(req.user!.id, bio);

    res.status(200).json({ user: formatUserResponse(user, req as Request) });
  } catch (error: any) {
    res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
}
