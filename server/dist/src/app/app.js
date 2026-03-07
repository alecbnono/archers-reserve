import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "../features/auth/auth.routes.js";
const app = express();
// Middleware
app.use(cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
// Feature Routes
app.use("/auth", authRoutes);
export default app;
