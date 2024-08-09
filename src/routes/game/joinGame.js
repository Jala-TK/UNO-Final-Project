import { findGameById } from '../../services/gameService.js';
import { verifyPlayerInGame } from '../../services/playerService.js';
import { validateParams } from '../../utils/validation.js';
import { addPlayerToGame } from '../../services/gamePlayerService.js';

export const joinGame = async (req, res, next) => {
  try {
    const { game_id } = req.body;
    const user = req.user;

    validateParams({ game_id }, res);

    const game = await findGameById(game_id);
    if (!game || game?.auditExcluded)
      return res.status(404).json({ message: 'Game not found' });

    const playerInGame = await verifyPlayerInGame(user, game_id);
    if (playerInGame)
      return res.status(400).json({ error: 'User is already in the game' });

    await addPlayerToGame(game_id, user.id);

    return res
      .status(200)
      .json({ message: 'User joined the game successfully' });
  } catch (err) {
    next(err);
  }
};
