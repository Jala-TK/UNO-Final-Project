import { validateParams } from '../../utils/validation.js';
import { findGameById } from '../../services/gameService.js';

export const getStatusGame = async (req, res, next) => {
  try {
    const { game_id } = req.body;
    validateParams({ game_id }, res);

    const game = await findGameById(game_id);
    if (!game || game?.auditExcluded) {
      return res.status(404).json({ message: 'Game not found' });
    }

    res.status(200).json({ status: game.status });
  } catch (err) {
    next(err);
  }
};
