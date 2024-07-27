import { login } from '../routes/auth/login.js';
import { logout } from '../routes/auth/logout.js';
import { getPerfil } from '../routes/auth/getPerfil.js';
import { Router } from "express";

const router = Router();

router.post("/login", login);
router.get("/getPerfil", getPerfil);
router.post("/logout", logout);

export default router;
