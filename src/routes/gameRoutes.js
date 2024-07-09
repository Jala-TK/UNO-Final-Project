import { Router } from 'express';
import { createGame, getGame, updateGame, deleteGame } from '../controllers/gameController.js';

const router = Router();

router.post('/game', createGame);
router.get('/game/:id', getGame);
router.put('/game/:id', updateGame);
router.delete('/game/:id', deleteGame);

export default router;
