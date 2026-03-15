import { Router } from "express";
import * as roomController from "./room.controller.js";
const router = Router();
// GET /rooms — list all rooms
router.get("/", roomController.getRooms);
export default router;
