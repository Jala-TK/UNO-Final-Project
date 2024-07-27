import { Router } from "express";
import { createGame } from "../routes/game/createGame.js";
import { getGame } from "../routes/game/getGame.js";
import { updateGame } from "../routes/game/updateGame.js";
import { deleteGame } from "../routes/game/deleteGame.js";
import { joinGame } from "../routes/game/joinGame.js";
import { getReady } from "../routes/game/getReady.js";
import { startGame } from "../routes/game/startGame.js";
import { leaveGame } from "../routes/game/leaveGame.js";
import { endGame } from "../routes/game/endGame.js";
import { getStatusGame } from "../routes/game/getStatusGame.js";
import { getPlayersInGame } from "../routes/game/getPlayersInGame.js";
import { getCurrentPlayer } from "../routes/game/getCurrentPlayer.js";
import { getTopCard } from "../routes/game/getTopCard.js";
import { getPlayerHands } from "../routes/game/getPlayerHands.js";

const router = Router();

router.post("/games/", createGame);
router.get("/games/:id", getGame);
router.put("/games/:id", updateGame);
router.delete("/games/:id", deleteGame);
router.post("/game/join", joinGame);
router.post("/game/ready", getReady);
router.post("/game/start", startGame);
router.post("/game/leave", leaveGame);
router.post("/game/end", endGame);
router.get("/game/status/", getStatusGame);
router.get("/game/players", getPlayersInGame);
router.get("/game/currentPlayer", getCurrentPlayer);
router.get("/game/topCard", getTopCard);
router.get("/game/playerHands", getPlayerHands);

export default router;
