import express, { Application } from "express";
import path from "path";
import cors from "cors";
import authRoutes from "../features/auth/auth.routes.js";
import profileRoutes from "../features/profile/profile.routes.js";
import reservationRoutes from "../features/reservation/reservation.routes.js";
import roomRoutes from "../features/room/room.routes.js";
import adminRoutes from "../features/admin/admin.routes.js";

const app: Application = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

// Static file serving for uploads
app.use("/uploads", express.static(path.resolve("uploads")));

// Feature Routes
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/reservations", reservationRoutes);
app.use("/rooms", roomRoutes);
app.use("/admin", adminRoutes);

export default app;
