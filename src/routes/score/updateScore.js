import GamePlayer from '../../models/gamePlayer.js';

export const updateScore = async (req, res, next) => {
  try {
    const gamePlayer = await GamePlayer.findByPk(req.params.id);
    if (!gamePlayer || gamePlayer.auditExcluded) {
      return res.status(404).json({ message: "Score not found" });
    }
    const { playerId, gameId, score } = req.body;
    if ((gamePlayer.playerId = playerId)) {
      return res.status(404).json({ message: "Score with playerId not found" });
    }
    if ((gamePlayer.gameId = gameId)) {
      return res.status(404).json({ message: "Score with gameId not found" });
    }

    await gamePlayer.update({ score });
    res.status(200).json(gamePlayer);
  } catch (error) {
    next(error);
  }
};
