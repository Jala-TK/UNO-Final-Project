import { getPlayersInGame } from '../../services/gamePlayerService.js';
import { findGameById } from '../../services/gameService.js';
import { getPlayerScores as getPlayerScoresService } from '../../services/scoreService.js';
import { validateParams } from '../../utils/validation.js';

export const getPlayerScores = async (req, res, next) => {
  try {
    const { game_id } = req.body;
    validateParams({ game_id }, res);

    const game = await findGameById(game_id);
    if (!game || game?.auditExcluded) {
      return res.status(404).json({ message: 'Game not found' });
    }

    const gamePlayers = await getPlayersInGame(game_id);
    if (gamePlayers.length === 0) {
      return res.status(404).json({ message: 'No players found in this game' });
    }

    const scores = await getPlayerScoresService(gamePlayers);

    const response = {
      game_id: game.id,
      scores,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
