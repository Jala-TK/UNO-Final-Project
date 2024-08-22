import { findGameById } from '../../services/gameService.js';
import { validateParams } from '../../utils/validation.js';

export const getGame = async (req, res, next) => {
  try {
    const game_id = req.params.id;
    validateParams({ game_id }, res);

    const game = await findGameById(game_id);
    if (!game || game?.auditExcluded) {
      return res.status(404).json({ message: 'Game not found' });
    }

    res.status(200).json({
      id: game.id,
      title: game.title,
      status: game.status,
      maxPlayers: game.maxPlayers,
    });
  } catch (error) {
    next(error);
  }
};
