import { Router } from 'express';
import { createPlayer } from '../routes/player/createPlayer.js';
import { getPlayer } from '../routes/player/getPlayer.js';
import { updatePlayer } from '../routes/player/updatePlayer.js';
import { deletePlayer } from '../routes/player/deletePlayer.js';
import { authMiddleware } from '../middleware/authenticate.js';
import { getPlayerPhoto } from '../routes/player/getPlayerPhoto.js';
import upload from '../middleware/imageMiddleware.js';

const router = Router();

router.post('/player', upload.single('photo'), createPlayer);
router.get('/player/:id', getPlayer);
router.post('/player/photo', getPlayerPhoto);
router.put('/player/:id', authMiddleware, updatePlayer);
router.delete('/player/:id', authMiddleware, deletePlayer);

export default router;
