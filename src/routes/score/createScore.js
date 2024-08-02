import GamePlayer from '../../models/gamePlayer.js';
import Game from '../../models/game.js';
import Player from '../../models/player.js';

export const createScore = async (req, res, next) => {
  try {
    const { playerId, gameId, score } = req.body;
    if (!playerId || !gameId || !score) {
      return res.status(400).json({ message: 'Invalid params' });
    }

    const user = await Player.findByPk(playerId);
    if (!user || user?.user) {
      return res.status(404).json({ message: 'Player not found' });
    }

    const game = await Game.findByPk(gameId);
    if (!game || game?.auditExcluded) {
      return res.status(404).json({ message: 'Game not found' });
    }
    const newGamePlayer = await GamePlayer.create({
      playerId: playerId,
      gameId: gameId,
      score: score,
    });
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
