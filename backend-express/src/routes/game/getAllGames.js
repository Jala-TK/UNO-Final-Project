import { findAll } from '../../services/gameService.js';
import { getPlayersInGame } from '../../services/gamePlayerService.js';

export const getAllGames = async (req, res, next) => {
  try {
    const games = await findAll();
    if (games.length > 0) {
      const response = await Promise.all(
        games.map(async (game) => {
          const gameData = game.dataValues;

          const playersCount = (await getPlayersInGame(gameData.id)).length;

          return {
            id: gameData.id,
            title: gameData.title,
            status: gameData.status,
            maxPlayers: gameData.maxPlayers,
            playersInGame: playersCount,
          };
        }),
      );

      return res.status(200).json({ games: response });
    } else {
      return res.status(200).json({ games: [] });
    }
  } catch (error) {
    next(error);
  }
};
