import { Router } from "express";
import {
  createCard,
  getCard,
  updateCard,
  deleteCard,
  playCard,
  drawCard,
} from "../controllers/cardController.js";

const router = Router();

router.post("/cards", createCard);
router.post("/cards/play", playCard);
router.post("/cards/draw", drawCard);
router.get("/cards/:id", getCard);
router.put("/cards/:id", updateCard);
router.delete("/cards/:id", deleteCard);

export default router;
