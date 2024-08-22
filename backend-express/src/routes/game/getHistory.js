import { findGameById } from '../../services/gameService.js';
import { validateParams } from '../../utils/validation.js';
import { getGameHistory } from '../../services/historyService.js';

export const getHistory = async (req, res, next) => {
  try {
    const { game_id } = req.body;
    validateParams({ game_id }, res);

    const game = await findGameById(game_id);
    if (!game || game?.auditExcluded) {
      return res.status(404).json({ message: 'Game not found' });
    }

    const history = await getGameHistory(game_id);
    const response = history.map((entry) => ({
      player: entry.player,
      action: entry.action,
    }));
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
