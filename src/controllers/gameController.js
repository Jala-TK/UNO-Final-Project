import { Router } from 'express';
import { createGame } from '../routes/game/createGame.js';
import { getGame } from '../routes/game/getGame.js';
import { updateGame } from '../routes/game/updateGame.js';
import { deleteGame } from '../routes/game/deleteGame.js';
import { joinGame } from '../routes/game/joinGame.js';
import { getReady } from '../routes/game/getReady.js';
import { startGame } from '../routes/game/startGame.js';
import { leaveGame } from '../routes/game/leaveGame.js';
import { endGame } from '../routes/game/endGame.js';
import { getStatusGame } from '../routes/game/getStatusGame.js';
import { getPlayersInGame } from '../routes/game/getPlayersInGame.js';
import { getCurrentPlayer } from '../routes/game/getCurrentPlayer.js';
import { getTopCard } from '../routes/game/getTopCard.js';
import { getPlayerHands } from '../routes/game/getPlayerHands.js';
import { authMiddleware } from '../middleware/authenticate.js';

const router = Router();

router.post('/games/', authMiddleware, createGame);
router.get('/games/:id', getGame);
router.put('/games/:id', authMiddleware, updateGame);
router.delete('/games/:id', authMiddleware, deleteGame);
router.post('/game/join', authMiddleware, joinGame);
router.post('/game/ready', authMiddleware, getReady);
router.post('/game/start', authMiddleware, startGame);
router.post('/game/leave', authMiddleware, leaveGame);
router.post('/game/end', authMiddleware, endGame);
router.get('/game/status/', getStatusGame);
router.get('/game/players', getPlayersInGame);
router.get('/game/currentPlayer', getCurrentPlayer);
router.get('/game/topCard', getTopCard);
router.get('/game/playerHands', getPlayerHands);

export default router;
