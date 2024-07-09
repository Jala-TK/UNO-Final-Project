import { Router } from 'express';
import { createScore, getScore, updateScore, deleteScore } from '../controllers/scoreController.js';

const router = Router();

router.post('/score', createScore);
router.get('/score/:id', getScore);
router.put('/score/:id', updateScore);
router.delete('/score/:id', deleteScore);

export default router;
