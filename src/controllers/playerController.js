import { Router } from 'express';
import { createPlayer } from '../routes/player/createPlayer.js';
import { getPlayer } from '../routes/player/getPlayer.js';
import { updatePlayer } from '../routes/player/updatePlayer.js';
import { deletePlayer } from '../routes/player/deletePlayer.js';
import { authMiddleware } from '../middleware/authenticate.js';

const router = Router();

router.post('/player', createPlayer);
router.get('/player/:id', getPlayer);
router.put('/player/:id', authMiddleware, updatePlayer);
router.delete('/player/:id', authMiddleware, deletePlayer);

export default router;
