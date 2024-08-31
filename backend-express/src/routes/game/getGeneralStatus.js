import { findGameById } from '../../services/gameService.js';
import { validateParams } from '../../utils/validation.js';
import { getTopDiscardedCard } from '../../services/gamePlayerService.js';
import {
  findPlayerById,
  getPlayerHandsInGame,
} from '../../services/playerService.js';
import { getGameHistory } from '../../services/historyService.js';

export const getGeneralStatus = async (req, res, next) => {
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
    const currentPlayer = await findPlayerById(game.currentPlayer);

    const topCard = await getTopDiscardedCard(game_id);
    if (!topCard) {
      return res.status(404).json({ message: 'Card not found' });
    }

    const players = await getPlayerHandsInGame(game_id);

    const history = await getGameHistory(game_id);
    const response = {
      game_id: game.id,
      status: game.status,
      current_player: currentPlayer.username,
      direction: game.clockwise === true ? 'clockwise' : 'counter-clockwise',
      top_card: {
        id: topCard.id,
        description: `${topCard.color} ${topCard.value}`,
      },
      players,
      turnHistory: history.map((entry) => ({
        player: entry.player,
        action: entry.action,
      })),
    };

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
