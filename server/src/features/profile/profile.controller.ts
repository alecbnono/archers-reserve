import type { Request, Response } from "express";
import type { AuthRequest } from "../../types/auth.types.js";
import * as profileService from "./profile.service.js";
import { formatUserResponse } from "../../utils/user.utils.js";

/**
 * GET /profile/search?q=... — search users by name/username.
 */
export async function searchUsers(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
    const q = (req.query.q as string | undefined)?.trim() ?? "";

    if (q.length === 0) {
      res.status(200).json({ users: [] });
      return;
    }

    const users = await profileService.searchPublicUsers(q, req.user!.role);

    // Normalize avatar URLs to absolute
    const baseUrl =
      process.env.API_URL || `${req.protocol}://${req.get("host")}`;

    const normalized = users.map((u) => {
      if (
        u.profilePictureUrl &&
        u.profilePictureUrl.startsWith("/") &&
        !u.profilePictureUrl.startsWith("//")
      ) {
        return { ...u, profilePictureUrl: `${baseUrl}${u.profilePictureUrl}` };
      }
      return u;
    });

    res.status(200).json({ users: normalized });
  } catch (error: any) {
    res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
}

/**
 * GET /profile/:userId — fetch a user's public profile.
 */
export async function getPublicProfile(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
    const targetUserId = Number(req.params.userId);
    if (!targetUserId || isNaN(targetUserId) || targetUserId <= 0) {
      res.status(400).json({ error: "Valid userId is required" });
      return;
    }

    const profile = await profileService.getPublicProfile(
      targetUserId,
      req.user!.id,
      req.user!.role,
    );

    // Normalize avatar URL
    if (
      profile.profilePictureUrl &&
      profile.profilePictureUrl.startsWith("/") &&
      !profile.profilePictureUrl.startsWith("//")
    ) {
      const baseUrl =
        process.env.API_URL || `${req.protocol}://${req.get("host")}`;
      profile.profilePictureUrl = `${baseUrl}${profile.profilePictureUrl}`;
    }

    res.status(200).json({ profile });
  } catch (error: any) {
    res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
}

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

export async function deleteAccount(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
    await profileService.deleteAccount(req.user!.id);

    // Clear auth cookie (same settings as logout)
    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "none" as const,
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error: any) {
    res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
}
