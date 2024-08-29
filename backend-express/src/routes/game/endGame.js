import {
  findGameById,
  endGame as endGameService,
} from '../../services/gameService.js';
import { removeGamePlayers } from '../../services/gamePlayerService.js';
import { validateParams } from '../../utils/validation.js';
import { io } from '../../../../server.js';

export const endGame = async (req, res, next) => {
  try {
    const { game_id } = req.body;
    validateParams({ game_id }, res);

    const game = await findGameById(game_id);
    if (!game || game?.auditExcluded) {
      return res.status(404).json({ message: 'Game not found' });
    }

    const user = req.user;

    if (game.creatorId !== user.id) {
      return res
        .status(403)
        .json({ error: 'Only the creator can end the game' });
    }

    await removeGamePlayers(game_id);
    await endGameService(game_id);

    io.emit('update', {
      type: 'endGame',
      game: newGame.id,
    });
    io.emit('update', 'updatedGames');

    res.status(200).json({ message: 'Game ended successfully' });
  } catch (error) {
    next(error);
  }
};
