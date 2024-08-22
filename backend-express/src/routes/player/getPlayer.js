import { findPlayerById } from '../../services/playerService.js';

export const getPlayer = async (req, res, next) => {
  try {
    const player = await findPlayerById(req.params.id);
    if (!player || player?.auditExcluded) {
      return res.status(404).json({ message: 'Player not found' });
    }
    const response = {
      username: player.username,
      email: player.email,
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
