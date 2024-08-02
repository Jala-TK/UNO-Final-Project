import GamePlayer from '../../models/gamePlayer.js';

export const getScore = async (req, res, next) => {
  try {
    const gamePlayer = await GamePlayer.findByPk(req.params.id);
    if (!gamePlayer || gamePlayer.auditExcluded) {
      return res.status(404).json({ message: 'Score not found' });
    }
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
