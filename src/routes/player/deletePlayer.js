import { deletePlayer as deletePlayerService } from '../../services/playerService.js';
import { findPlayerById } from '../../services/playerService.js';

export const deletePlayer = async (req, res, next) => {
  try {
    const player = await findPlayerById(req.params.id);
    if (!player || player?.auditExcluded) {
      return res.status(404).json({ message: 'Player not found' });
    }

    const user = req.user;
    if (user?.id != req.params.id) {
      return res.status(401).json({ error: 'Unauthorized delete this user' });
    }

    await deletePlayerService(player);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
