import GamePlayer from '../../models/gamePlayer.js';

export const createScore = async (req, res, next) => {
  try {
    const { playerId, gameId, score } = req.body;
    const newGamePlayer = await GamePlayer.create({
      playerId: playerId,
      gameId: gameId,
      score: score,
    });
    res.status(201).json(newGamePlayer);
  } catch (error) {
    next(error);
  }
};
