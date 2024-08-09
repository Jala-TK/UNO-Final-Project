import { validateParams } from '../../utils/validation.js';
import { createScore as createScoreService } from '../../services/scoreService.js';
import { findGameById } from '../../services/gameService.js';
import { findPlayerById } from '../../services/playerService.js';

export const createScore = async (req, res, next) => {
  try {
    const { playerId, gameId, score } = req.body;
    validateParams({ playerId, gameId, score }, res);

    const user = await findPlayerById(playerId);
    if (!user || user?.auditExcluded) {
      return res.status(404).json({ message: 'Player not found' });
    }

    const game = await findGameById(gameId);
    if (!game || game?.auditExcluded) {
      return res.status(404).json({ message: 'Game not found' });
    }

    const newGamePlayer = await createScoreService(gameId, playerId, score);

    const response = {
      id: newGamePlayer.id,
      playerId: newGamePlayer.playerId,
      gameId: newGamePlayer.gameId,
      score: newGamePlayer.score,
    };
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};
