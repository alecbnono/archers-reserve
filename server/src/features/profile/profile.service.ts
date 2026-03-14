import fs from "fs/promises";
import path from "path";
import pool from "../../app/db.js";
import { AppError } from "../../utils/AppError.js";
import type { DbUser, SafeUser } from "../../types/auth.types.js";

function toSafeUser(row: DbUser): SafeUser {
  return {
    id: row.user_id,
    username: row.username,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    bio: row.bio,
    profilePictureUrl: row.profile_picture_url,
    isAnonymous: row.is_anonymous,
    isPublic: row.is_public,
    role: row.role,
    createdAt: row.created_at,
  };
}

/**
 * Update the user's profile_picture_url and return the updated user.
 * If the user already has a local upload, delete the old file.
 */
export async function updateAvatar(
  userId: number,
  newRelativePath: string,
): Promise<SafeUser> {
  // 1. Fetch the current profile picture URL so we can clean up the old file
  const currentQuery = `SELECT profile_picture_url FROM "user" WHERE user_id = $1`;
  const currentResult = await pool.query(currentQuery, [userId]);

  if (currentResult.rows.length === 0) {
    throw new AppError("User not found", 404);
  }

  const oldUrl: string = currentResult.rows[0].profile_picture_url || "";

  // 2. Update the DB with the new path
  const updateQuery = `
    UPDATE "user"
    SET profile_picture_url = $1
    WHERE user_id = $2
    RETURNING *
  `;
  const updateResult = await pool.query(updateQuery, [newRelativePath, userId]);

  if (updateResult.rows.length === 0) {
    throw new AppError("User not found", 404);
  }

  // 3. Delete the old local file if it was a server upload
  if (oldUrl.startsWith("/uploads/profile/")) {
    const oldAbsolute = path.resolve("." + oldUrl);
    try {
      await fs.unlink(oldAbsolute);
    } catch {
      // File may already be gone — not critical
    }
  }

  return toSafeUser(updateResult.rows[0] as DbUser);
}

const BIO_MAX_LENGTH = 280;

/**
 * Update the user's bio and return the updated user.
 */
export async function updateBio(
  userId: number,
  bio: string,
): Promise<SafeUser> {
  const trimmed = bio.trim();

  if (trimmed.length > BIO_MAX_LENGTH) {
    throw new AppError(`Bio must be ${BIO_MAX_LENGTH} characters or fewer`, 400);
  }

  const query = `
    UPDATE "user"
    SET bio = $1
    WHERE user_id = $2
    RETURNING *
  `;
  const result = await pool.query(query, [trimmed, userId]);

  if (result.rows.length === 0) {
    throw new AppError("User not found", 404);
  }

  return toSafeUser(result.rows[0] as DbUser);
}

/**
 * Delete the user's account and clean up any local avatar file.
 * Reservations are cascade-deleted by the DB schema.
 */
export async function deleteAccount(userId: number): Promise<void> {
  // 1. Fetch current avatar URL before deleting the row
  const selectQuery = `SELECT profile_picture_url FROM "user" WHERE user_id = $1`;
  const selectResult = await pool.query(selectQuery, [userId]);

  if (selectResult.rows.length === 0) {
    throw new AppError("User not found", 404);
  }

  const avatarUrl: string = selectResult.rows[0].profile_picture_url || "";

  // 2. Delete the user row (cascades reservations)
  await pool.query(`DELETE FROM "user" WHERE user_id = $1`, [userId]);

  // 3. Clean up local avatar file if it exists
  if (avatarUrl.startsWith("/uploads/profile/")) {
    const absolute = path.resolve("." + avatarUrl);
    try {
      await fs.unlink(absolute);
    } catch {
      // File may already be gone — not critical
    }
  }
}
