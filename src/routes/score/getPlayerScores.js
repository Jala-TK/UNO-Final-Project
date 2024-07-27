import GamePlayer from '../../models/gamePlayer.js';
import Game from '../../models/game.js';
import Player from '../../models/player.js';

export const getPlayerScores = async (req, res, next) => {
  try {
    const { game_id } = req.body;

    if (!game_id) {
      return res.status(400).json({ message: "Game ID is required" });
    }

    const game = await Game.findByPk(game_id);
    if (!game || game?.auditExcluded) {
      return res.status(404).json({ message: "Game not found" });
    }

    const gamePlayers = await GamePlayer.findAll({
      where: { gameId: game_id, auditExcluded: false },
    });

    if (gamePlayers.length === 0) {
      return res.status(404).json({ message: "No players found in this game" });
    }

    const playerIds = gamePlayers.map((gp) => gp.playerId);
    const players = await Player.findAll({
      where: {
        id: playerIds,
      },
    });

    const scores = {};
    for (const gp of gamePlayers) {
      const player = players.find((p) => p.id === gp.playerId);
      if (player) {
        scores[player.username] = gp.score;
      }
    }

    const response = {
      game_id: game.id,
      scores,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};