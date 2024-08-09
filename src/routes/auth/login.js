import {
  authenticateLogin,
  generateToken,
} from '../../services/authService.js';
import { validateParams } from '../../utils/validation.js';

export const login = async (req, res, next) => {
  const { username, password } = req.body;
  validateParams({ username, password }, res);

  try {
    const player = await authenticateLogin(username, password);
    const access_token = generateToken(player);

    return res.status(200).json({ access_token });
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};
