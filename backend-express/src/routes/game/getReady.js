import { findGameById } from '../../services/gameService.js';
import { getPlayerInGame } from '../../services/gamePlayerService.js';
import { updatePlayerStatus } from '../../services/gamePlayerService.js';
import { validateParams } from '../../utils/validation.js';
import { io } from '../../../../server.js';

export const getReady = async (req, res, next) => {
  try {
    const { game_id } = req.body;
    validateParams({ game_id }, res);

    const game = await findGameById(game_id);
    if (!game || game?.auditExcluded)
      return res.status(404).json({ message: 'Game not found' });

    const user = req.user;

    const playerInGame = await getPlayerInGame(game_id, user.id);
    if (!playerInGame || playerInGame?.auditExcluded)
      return res.status(400).json({ error: 'The player is not in this game' });

    if (playerInGame.status)
      return res.status(400).json({ error: 'The player was ready' });

    await updatePlayerStatus(playerInGame, true);

    io.emit('update', 'playerInGame');

    return res.status(200).json({ message: 'The player is ready' });
  } catch (err) {
    next(err);
  }
};
