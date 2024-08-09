import { getPlayersInGameData } from '../../services/playerService.js';
import { findGameById } from '../../services/gameService.js';
import { getPlayersInGame as getPlayersInGameService } from '../../services/gamePlayerService.js';
import { validateParams } from '../../utils/validation.js';

export const getPlayersInGame = async (req, res, next) => {
  try {
    const { game_id } = req.body;
    validateParams({ game_id }, res);

    const game = await findGameById(game_id);
    if (!game || game?.auditExcluded) {
      return res.status(404).json({ message: 'Game not found' });
    }
    const gamePlayers = await getPlayersInGameService(game_id);
    const players = await getPlayersInGameData(gamePlayers);

    res.status(200).json({ game_id: game.id, players: players.usernames });
  } catch (error) {
    next(error);
  }
};
