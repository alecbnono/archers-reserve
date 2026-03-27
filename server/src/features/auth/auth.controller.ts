import type { Request, Response } from "express";
import type { AuthRequest } from "../../types/auth.types.js";
import * as authService from "./auth.service.js";
import { generateAccessToken } from "../../middleware/token.js";
import { formatUserResponse } from "../../utils/user.utils.js";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

function buildCookieOptions(remember: boolean) {
  const base = {
    httpOnly: true,
    sameSite: "none" as const,
    secure: process.env.NODE_ENV === "production",
  };

  if (remember) {
    return { ...base, maxAge: SEVEN_DAYS_MS };
  }

  return base;
}

export async function register(req: Request, res: Response): Promise<void> {
  const { firstName, lastName, username, email, password, role } = req.body;

  // Basic required fields validation
  if (!firstName || !lastName || !username || !email || !password || !role) {
    res.status(400).json({
      error:
        "All fields are required: firstName, lastName, username, email, password, role",
    });
    return;
  }

  // Basic required fields validation
  if (!email.endsWith("@dlsu.edu.ph")) {
    res.status(400).json({
      error: "Email must be a DLSU account",
    });
    return;
  }

  try {
    const user = await authService.registerUser(
      firstName,
      lastName,
      username,
      email,
      password,
      role,
    );

    res.status(201).json({ user: formatUserResponse(user, req) });
  } catch (error: any) {
    res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  const { identifier, password } = req.body;
  const remember = req.body.remember === true;

  if (!identifier || !password) {
    res.status(400).json({
      error: "Identifier (username or email) and password are required",
    });
    return;
  }

  try {
    const { user, payload } = await authService.loginUser(identifier, password);
    const accessToken = generateAccessToken(payload);

    res.cookie("accessToken", accessToken, buildCookieOptions(remember));
    res.status(200).json({ user: formatUserResponse(user, req) });
  } catch (error: any) {
    res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
}

export async function logout(_req: Request, res: Response): Promise<void> {
  res.clearCookie("accessToken", {
    httpOnly: true,
    sameSite: "none" as const,
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({ message: "Logged out successfully" });
}

export async function me(req: AuthRequest, res: Response): Promise<void> {
  try {
    const user = await authService.getUserById(req.user!.id);
    res.status(200).json({ user: formatUserResponse(user, req as Request) });
  } catch (error: any) {
    res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
}
