import { getPlayerHand as getPlayerHandService } from '../../services/playerService.js';
import { validateParams } from '../../utils/validation.js';
import {
  validateGameExists,
  validatePlayerInGame,
} from '../../services/validateService.js';

export const getPlayerHand = async (req, res, next) => {
  try {
    const { game_id } = req.body;
    validateParams({ game_id }, res);

    const game = await validateGameExists(game_id, res);
    await validatePlayerInGame(game, req.user, res);

    const hand = await getPlayerHandService(game_id, req.user);
    const response = {
      player: req.user.username,
      hand: hand.map((entry) => `${entry.color} ${entry.value}`),
    };

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
