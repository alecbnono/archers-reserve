import express, { Application } from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "../features/auth/auth.routes.js";
import profileRoutes from "../features/profile/profile.routes.js";

const app: Application = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

// Static file serving for uploads
app.use("/uploads", express.static(path.resolve("uploads")));

// Feature Routes
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

export default app;
