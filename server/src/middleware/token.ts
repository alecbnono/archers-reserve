import type { Response, NextFunction } from "express";
import type { AuthRequest, TokenPayload } from "../types/auth.types.js";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_EXPIRY = "7d";

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
}

export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.header("Authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!,
    ) as TokenPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }
}
