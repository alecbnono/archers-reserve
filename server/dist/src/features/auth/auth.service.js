import bcrypt from "bcrypt";
import pool from "../../app/db.js";
import { AppError } from "../../utils/AppError.js";
const SALT_ROUNDS = 10;
const ALLOWED_REGISTER_ROLES = ["STUDENT", "FACULTY"];
const DEFAULT_BIO = "New ArcherReserve user.";
function toSafeUser(row) {
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
export function toTokenPayload(row) {
    return {
        id: row.user_id,
        username: row.username,
        email: row.email,
        role: row.role,
    };
}
export async function registerUser(firstName, lastName, username, email, password, role) {
    // 1. Validate role
    if (!ALLOWED_REGISTER_ROLES.includes(role)) {
        throw new AppError("Role must be STUDENT or FACULTY", 400);
    }
    // 2. Check if username or email already exists
    const existingQuery = `SELECT username, email FROM "user" WHERE username = $1 OR email = $2 LIMIT 1`;
    const existing = await pool.query(existingQuery, [username, email]);
    if (existing.rows.length > 0) {
        const matched = existing.rows[0];
        if (matched.username === username) {
            throw new AppError("Username is already taken", 409);
        }
        if (matched.email === email) {
            throw new AppError("Email is already registered", 409);
        }
    }
    // 3. Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    // 4. Insert user (catch unique-violation race condition)
    const insertQuery = `
        INSERT INTO "user" (username, first_name, last_name, email, password_hash, role, bio)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
    `;
    try {
        const result = await pool.query(insertQuery, [
            username,
            firstName,
            lastName,
            email,
            passwordHash,
            role,
            DEFAULT_BIO,
        ]);
        return toSafeUser(result.rows[0]);
    }
    catch (error) {
        // Postgres unique_violation = 23505
        if (error.code === "23505") {
            const detail = error.detail || "";
            if (detail.includes("username")) {
                throw new AppError("Username is already taken", 409);
            }
            if (detail.includes("email")) {
                throw new AppError("Email is already registered", 409);
            }
            throw new AppError("Username or email already exists", 409);
        }
        throw error;
    }
}
export async function loginUser(identifier, password) {
    // 1. Find user by username or email
    const query = `SELECT * FROM "user" WHERE username = $1 OR email = $1 LIMIT 1`;
    const result = await pool.query(query, [identifier]);
    if (result.rows.length === 0) {
        throw new AppError("Invalid credentials", 401);
    }
    const dbUser = result.rows[0];
    // 2. Compare password
    const isMatch = await bcrypt.compare(password, dbUser.password_hash);
    if (!isMatch) {
        throw new AppError("Invalid credentials", 401);
    }
    return {
        user: toSafeUser(dbUser),
        payload: toTokenPayload(dbUser),
    };
}
export async function getUserById(userId) {
    const query = `SELECT * FROM "user" WHERE user_id = $1 LIMIT 1`;
    const result = await pool.query(query, [userId]);
    if (result.rows.length === 0) {
        throw new AppError("User not found", 404);
    }
    return toSafeUser(result.rows[0]);
}
