import { Router } from 'express';
import { login } from '../routes/auth/login.js';
import { logout } from '../routes/auth/logout.js';
import { getPerfil } from '../routes/auth/getPerfil.js';
import { authMiddleware } from '../middleware/authenticate.js';

const router = Router();

router.post('/login', login);
router.get('/getPerfil', authMiddleware, getPerfil);
router.post('/logout', authMiddleware, logout);

export default router;
