import { findScoreById } from '../../services/scoreService.js';
export const getScore = async (req, res, next) => {
  try {
    const gamePlayer = await findScoreById(req.params.id);
    if (!gamePlayer || gamePlayer.auditExcluded) {
      return res.status(404).json({ message: 'Score not found' });
    }
    res.status(200).json({
      playerId: gamePlayer.playerId,
      gameId: gamePlayer.gameId,
      score: gamePlayer.score,
    });
  } catch (error) {
    next(error);
  }
};
