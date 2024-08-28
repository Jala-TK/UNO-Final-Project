import { findGameById } from '../../services/gameService.js';
import { validateParams } from '../../utils/validation.js';
import {
  findPlayerById,
  getPlayerNamesInGame,
} from '../../services/playerService.js';
export const getGame = async (req, res, next) => {
  try {
    const game_id = req.params.id;
    validateParams({ game_id }, res);

    const game = await findGameById(game_id);
    if (!game || game?.auditExcluded) {
      return res.status(404).json({ message: 'Game not found' });
    }

    const creator = await findPlayerById(game.creatorId);
    if (creator.auditExcluded) {
      return res.status(404).json({ message: 'Creator not found' });
    }

    const players = await getPlayerNamesInGame(game_id);

    res.status(200).json({
      id: game.id,
      title: game.title,
      status: game.status,
      maxPlayers: game.maxPlayers,
      creator: creator.username,
      players: players,
    });
  } catch (error) {
    next(error);
  }
};
