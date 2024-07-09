import { Router } from 'express';
import { createCard, getCard, updateCard, deleteCard } from '../controllers/cardController.js';

const router = Router();

router.post('/card', createCard);
router.get('/card/:id', getCard);
router.put('/card/:id', updateCard);
router.delete('/card/:id', deleteCard);

export default router;
