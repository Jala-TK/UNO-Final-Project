import { createGame as createGameService } from '../../services/gameService.js';
import { createGamePlayer } from '../../services/gamePlayerService.js';

export const createGame = async (req, res, next) => {
  try {
    const { title, maxPlayers, name } = req.body;

    if ((!title && !name) || !maxPlayers) {
      return res.status(400).json({ message: 'Invalid params' });
    }

    const user = req.user;
    const newGame = await createGameService(name || title, maxPlayers, user.id);
    await createGamePlayer(newGame.id, user.id);

    res
      .status(201)
      .json({ message: 'Game created successfully', game_id: newGame.id });
  } catch (error) {
    next(error);
  }
};
