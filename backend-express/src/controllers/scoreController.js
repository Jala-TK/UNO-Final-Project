import express from 'express';
import { createScore } from '../routes/score/createScore.js';
import { getScore } from '../routes/score/getScore.js';
import { updateScore } from '../routes/score/updateScore.js';
import { deleteScore } from '../routes/score/deleteScore.js';
import { getPlayerScores } from '../routes/score/getPlayerScores.js';

const router = express.Router();

router.post('/score', createScore);
router.get('/score/:id', getScore);
router.put('/score/:id', updateScore);
router.delete('/score/:id', deleteScore);
router.get('/score', getPlayerScores);

export default router;
