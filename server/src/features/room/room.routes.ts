import { Router } from "express";
import * as roomController from "./room.controller.js";

const router = Router();
router.get("/", roomController.listRooms);
router.get("/buildings", roomController.listBuildings);
export default router;