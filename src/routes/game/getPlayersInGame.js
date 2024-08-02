import Player from '../../models/player.js';
import GamePlayer from '../../models/gamePlayer.js';
import Game from '../../models/game.js';

export const getPlayersInGame = async (req, res, next) => {
  try {
    const { game_id } = req.body;
    if (!game_id) {
      return res.status(400).json({ message: 'Invalid Params' });
    }
    const game = await Game.findByPk(game_id);
    if (!game || game?.auditExcluded) {
      return res.status(404).json({ message: 'Game not found' });
    }
    const players = await GamePlayer.findAll({
      where: { gameId: game_id, auditExcluded: false },
    });
    const userIds = players.map((player) => player.dataValues.playerId);
    const users = await Player.findAll({
      where: {
        id: userIds,
      },
    });
    const usernames = users.map((user) => user.username);

    const response = { game_id: game.id, players: usernames };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
