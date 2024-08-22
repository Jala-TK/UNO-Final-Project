import { Router } from "express";
import gameRoutes from "../controllers/gameController.js";
import playerRoutes from "../controllers/playerController.js";
import scoreRoutes from "../controllers/scoreController.js";
import cardRoutes from "../controllers/cardController.js";
import authRoutes from "../controllers/authController.js";

const router = Router();

router.use(gameRoutes);
router.use(playerRoutes);
router.use(scoreRoutes);
router.use(cardRoutes);
router.use(authRoutes);

export default router;
