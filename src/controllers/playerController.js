import { Router } from 'express';
import { createPlayer } from '../routes/player/createPlayer.js';
import { getPlayer } from '../routes/player/getPlayer.js';
import { updatePlayer } from '../routes/player/updatePlayer.js';
import { deletePlayer } from '../routes/player/deletePlayer.js';

const router = Router();

router.post('/player', createPlayer);
router.get('/player/:id', getPlayer);
router.put('/player/:id', updatePlayer);
router.delete('/player/:id', deletePlayer);

export default router;
