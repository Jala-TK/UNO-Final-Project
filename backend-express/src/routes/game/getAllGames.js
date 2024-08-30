import { findAll } from '../../services/gameService.js';
import {
  findPlayerById,
  getPlayerNamesInGame,
} from '../../services/playerService.js';

export const getAllGames = async (req, res, next) => {
  try {
    const games = await findAll();
    if (games.length > 0) {
      const response = await Promise.all(
        games.map(async (game) => {
          const gameData = game.dataValues;

          const creator = await findPlayerById(game.creatorId);
          if (creator.auditExcluded) {
            return res.status(404).json({ message: 'Creator not found' });
          }

          const players = await getPlayerNamesInGame(gameData.id);
          const playersCount = players.length;

          return {
            id: gameData.id,
            title: gameData.title,
            status: gameData.status,
            maxPlayers: gameData.maxPlayers,
            playersInGame: playersCount,
            creator: creator.username,
            players: players,
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
