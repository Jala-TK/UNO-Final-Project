import { validateParams } from '../../utils/validation.js';
import {
  findScoreById,
  updateScore as updateScoreService,
} from '../../services/scoreService.js';

export const updateScore = async (req, res, next) => {
  try {
    const gamePlayer = await findScoreById(req.params.id);
    if (!gamePlayer || gamePlayer.auditExcluded) {
      return res.status(404).json({ message: 'Score not found' });
    }

    const { playerId, gameId, score } = req.body;
    validateParams({ playerId, gameId, score }, res);
    if (gamePlayer.playerId != playerId) {
      return res.status(404).json({ message: 'Score with playerId not found' });
    }
    if (gamePlayer.gameId != gameId) {
      return res.status(404).json({ message: 'Score with gameId not found' });
    }

    await updateScoreService(gamePlayer, score);
    const response = {
      playerId: gamePlayer.playerId,
      gameId: gamePlayer.gameId,
      score: gamePlayer.score,
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
