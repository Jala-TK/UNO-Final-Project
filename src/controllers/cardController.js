import { createCard } from '../routes/card/createCard.js';
import { getCard } from '../routes/card/getCard.js';
import { updateCard } from '../routes/card/updateCard.js';
import { deleteCard } from '../routes/card/deleteCard.js';
import { playCard } from '../routes/card/playCard.js';
import { drawCard } from '../routes/card/drawCard.js';
import { Router } from "express";

const router = Router();

router.post("/cards", createCard);
router.post("/cards/play", playCard);
router.post("/cards/draw", drawCard);
router.get("/cards/:id", getCard);
router.put("/cards/:id", updateCard);
router.delete("/cards/:id", deleteCard);

export default router;
