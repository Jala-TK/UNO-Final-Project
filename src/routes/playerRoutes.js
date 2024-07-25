import { Router } from "express";
import {
  createPlayer,
  getPlayer,
  updatePlayer,
  deletePlayer,
} from "../controllers/playerController.js";

const router = Router();

router.post("/player", createPlayer);
router.get("/player/:id", getPlayer);
router.put("/player/:id", updatePlayer);
router.delete("/player/:id", deletePlayer);

export default router;
