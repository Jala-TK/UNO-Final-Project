import { Router } from 'express';
import { createGame, getGame, getStatusGame, getPlayersInGame, getCurrentPlayer, updateGame, deleteGame, joinGame, getReady, leaveGame, startGame } from '../controllers/gameController.js';

const router = Router();

router.post('/games', createGame);
router.get('/games/:id', getGame);
router.put('/games/:id', updateGame);
router.delete('/games/:id', deleteGame);


router.post('/game/join', joinGame);
router.post('/game/ready', getReady);
router.post('/game/leave', leaveGame);
router.post('/game/start', startGame);
router.get('/game/status', getStatusGame);
router.get('/game/players', getPlayersInGame);
router.get('/game/currentPlayer', getCurrentPlayer);

export default router;
