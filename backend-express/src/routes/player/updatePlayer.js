import { validateParams } from '../../utils/validation.js';
import {
  updatePlayer as updatePlayerService,
  findPlayerById,
  findExistingPlayerUpdate,
} from '../../services/playerService.js';
export const updatePlayer = async (req, res, next) => {
  try {
    const id = req.params.id;
    const player = await findPlayerById(id);
    if (!player || player?.auditExcluded) {
      return res.status(404).json({ message: 'Player not found' });
    }
    const { username, email, password } = req.body;
    validateParams({ username, email, password }, res);

    const user = req.user;
    if (user?.id != id) {
      return res.status(401).json({ error: 'Unauthorized update this user' });
    }

    const existingPlayer = await findExistingPlayerUpdate(
      user,
      username,
      email,
    );
    if (existingPlayer) return res.status(400).json(existingPlayer);

    await updatePlayerService(player, { username, email, password });
    res.status(200).json({ message: 'User updated sucessfully' });
  } catch (error) {
    next(error);
  }
};
