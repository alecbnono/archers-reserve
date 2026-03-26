import * as profileService from "./profile.service.js";
import { formatUserResponse } from "../../utils/user.utils.js";
/**
 * GET /profile/:userId — fetch a user's public profile.
 */
export async function getPublicProfile(req, res) {
    try {
        const targetUserId = Number(req.params.userId);
        if (!targetUserId || isNaN(targetUserId) || targetUserId <= 0) {
            res.status(400).json({ error: "Valid userId is required" });
            return;
        }
        const profile = await profileService.getPublicProfile(targetUserId, req.user.id, req.user.role);
        // Normalize avatar URL
        if (profile.profilePictureUrl &&
            profile.profilePictureUrl.startsWith("/") &&
            !profile.profilePictureUrl.startsWith("//")) {
            const baseUrl = process.env.API_URL || `${req.protocol}://${req.get("host")}`;
            profile.profilePictureUrl = `${baseUrl}${profile.profilePictureUrl}`;
        }
        res.status(200).json({ profile });
    }
    catch (error) {
        res
            .status(error.status || 500)
            .json({ error: error.message || "Internal server error" });
    }
}
export async function uploadAvatar(req, res) {
    try {
        if (!req.file) {
            res.status(400).json({ error: "No image file provided" });
            return;
        }
        const relativePath = `/uploads/profile/${req.file.filename}`;
        const user = await profileService.updateAvatar(req.user.id, relativePath);
        res.status(200).json({ user: formatUserResponse(user, req) });
    }
    catch (error) {
        res
            .status(error.status || 500)
            .json({ error: error.message || "Internal server error" });
    }
}
export async function updateBio(req, res) {
    try {
        const { bio } = req.body;
        if (typeof bio !== "string") {
            res.status(400).json({ error: "Bio must be a string" });
            return;
        }
        const user = await profileService.updateBio(req.user.id, bio);
        res.status(200).json({ user: formatUserResponse(user, req) });
    }
    catch (error) {
        res
            .status(error.status || 500)
            .json({ error: error.message || "Internal server error" });
    }
}
export async function deleteAccount(req, res) {
    try {
        await profileService.deleteAccount(req.user.id);
        // Clear auth cookie (same settings as logout)
        res.clearCookie("accessToken", {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
        });
        res.status(200).json({ message: "Account deleted successfully" });
    }
    catch (error) {
        res
            .status(error.status || 500)
            .json({ error: error.message || "Internal server error" });
    }
}
