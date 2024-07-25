import { Router } from "express";
import {
  createGame,
  getGame,
  getStatusGame,
  getPlayersInGame,
  getCurrentPlayer,
  updateGame,
  deleteGame,
  joinGame,
  getReady,
  endGame,
  leaveGame,
  startGame,
  getTopCard,
  getPlayerHands,
} from "../controllers/gameController.js";

const router = Router();

router.post("/games", createGame);
router.get("/games/:id", getGame);
router.put("/games/:id", updateGame);
router.delete("/games/:id", deleteGame);

router.post("/game/join", joinGame);
router.post("/game/ready", getReady);
router.post("/game/leave", leaveGame);
router.post("/game/start", startGame);
router.post("/game/end", endGame);
router.get("/game/status", getStatusGame);
router.get("/game/players", getPlayersInGame);
router.get("/game/currentPlayer", getCurrentPlayer);
router.get("/game/topCard", getTopCard);
router.get("/game/playerHands", getPlayerHands);

export default router;
