import { validateParams } from '../../utils/validation.js';
import {
  findGameById,
  updateGame as updateGameService,
} from '../../services/gameService.js';
import { io } from '../../../../server.js';

export const updateGame = async (req, res, next) => {
  try {
    let { title } = req.body;
    const { name, status, maxPlayers } = req.body;
    const game_id = req.params.id;
    const user = req.user;

    if (name != null) title = name;
    validateParams({ title, status, maxPlayers }, res);

    const game = await findGameById(game_id);
    if (!game || game?.auditExcluded) {
      return res.status(404).json({ message: 'Game not found' });
    }

    if (game.creatorId !== user.id) {
      return res
        .status(403)
        .json({ error: 'Only the creator can edit the game' });
    }

    const updatedGame = await updateGameService(game, {
      title: name || title,
      status,
      maxPlayers,
    });

    io.emit('update', {
      type: 'updateGame',
      game: newGame.id,
    });

    res.status(200).json({
      id: updatedGame.id,
      title: updatedGame.title,
      status: updatedGame.status,
      maxPlayers: updatedGame.maxPlayers,
    });
  } catch (error) {
    next(error);
  }
};
