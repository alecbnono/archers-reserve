import * as authService from "./auth.service.js";
import { generateAccessToken } from "../../middleware/token.js";
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const COOKIE_OPTIONS = {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SEVEN_DAYS_MS,
};
export async function register(req, res) {
    const { firstName, lastName, username, email, password, role } = req.body;
    // Basic required fields validation
    if (!firstName || !lastName || !username || !email || !password || !role) {
        res
            .status(400)
            .json({
            error: "All fields are required: firstName, lastName, username, email, password, role",
        });
        return;
    }
    try {
        const user = await authService.registerUser(firstName, lastName, username, email, password, role);
        res.status(201).json({ user });
    }
    catch (error) {
        res
            .status(error.status || 500)
            .json({ error: error.message || "Internal server error" });
    }
}
export async function login(req, res) {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
        res
            .status(400)
            .json({
            error: "Identifier (username or email) and password are required",
        });
        return;
    }
    try {
        const { user, payload } = await authService.loginUser(identifier, password);
        const accessToken = generateAccessToken(payload);
        res.cookie("accessToken", accessToken, COOKIE_OPTIONS);
        res.status(200).json({ user });
    }
    catch (error) {
        res
            .status(error.status || 500)
            .json({ error: error.message || "Internal server error" });
    }
}
export async function logout(_req, res) {
    res.clearCookie("accessToken", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({ message: "Logged out successfully" });
}
export async function me(req, res) {
    try {
        const user = await authService.getUserById(req.user.id);
        res.status(200).json({ user });
    }
    catch (error) {
        res
            .status(error.status || 500)
            .json({ error: error.message || "Internal server error" });
    }
}
