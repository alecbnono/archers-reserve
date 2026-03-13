import multer from "multer";
import path from "path";
import crypto from "crypto";
import { AppError } from "../../utils/AppError.js";

// --- Multer disk storage configuration ---
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.resolve("uploads/profile"));
  },
  filename: (req: any, file, cb) => {
    const userId = req.user?.id ?? "unknown";
    const timestamp = Date.now();
    const rand = crypto.randomBytes(4).toString("hex");
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `user-${userId}-${timestamp}-${rand}${ext}`);
  },
});

// --- File filter: accept only jpeg, png, webp ---
const ALLOWED_MIMES = ["image/jpeg", "image/png", "image/webp"];

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (ALLOWED_MIMES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError("Only JPEG, PNG, and WebP images are allowed", 400));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
});

export const uploadAvatarMiddleware = upload.single("avatar");
