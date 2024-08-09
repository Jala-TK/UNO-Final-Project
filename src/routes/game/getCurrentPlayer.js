import { findGameById } from '../../services/gameService.js';
import { findPlayerById } from '../../services/playerService.js';
import { validateParams } from '../../utils/validation.js';

export const getCurrentPlayer = async (req, res, next) => {
  try {
    const { game_id } = req.body;
    validateParams({ game_id }, res);

    const game = await findGameById(game_id);
    if (!game || game?.auditExcluded) {
      return res.status(404).json({ message: 'Game not found' });
    }

    if (!game.currentPlayer) {
      return res.status(400).json({ message: 'Start the game first' });
    }

    const player = await findPlayerById(game.currentPlayer);
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    res.status(200).json({ game_id, current_player: player.username });
  } catch (error) {
    next(error);
  }
};
