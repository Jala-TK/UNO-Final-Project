import { Router } from 'express';
import { getPerfil, login, logout } from '../controllers/authController.js';

const router = Router();

router.post('/login', login);
router.get('/getPerfil', getPerfil);
router.post('/logout', logout);

export default router;
