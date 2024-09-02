import {
  createNewPlayer,
  findExistingPlayer,
} from '../../services/playerService.js';
import { validateParams } from '../../utils/validation.js';

export const createPlayer = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    let photo = null;

    if (req.file) {
      photo = req.file.buffer;
    }

    validateParams({ username, email, password }, res);

    const existingPlayer = await findExistingPlayer(username, email);
    if (existingPlayer) return res.status(400).json(existingPlayer);

    await createNewPlayer(username, email, password, photo);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    next(error);
  }
};
