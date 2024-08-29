import { validateParams } from '../../utils/validation.js';
import { findGameById } from '../../services/gameService.js';
import { verifyPlayerInGame } from '../../services/playerService.js';
import { deleteGamePlayer } from '../../services/gamePlayerService.js';
import { handleGameCreatorLeaving } from '../../services/gamePlayerService.js';
import { io } from '../../../../server.js';

export const leaveGame = async (req, res, next) => {
  try {
    const { game_id } = req.body;
    const user = req.user;

    validateParams({ game_id }, res);
    const game = await findGameById(game_id);
    if (!game || game?.auditExcluded)
      return res.status(404).json({ message: 'Game not found' });

    const gamePlayer = await verifyPlayerInGame(user, game_id);
    if (!gamePlayer) {
      return res.status(404).json({ error: 'Player not found in this game' });
    }

    if (game.creatorId === user.id) {
      const responseMessage = await handleGameCreatorLeaving(game, user);
      await deleteGamePlayer(gamePlayer, true);
      return res.status(200).json({ message: responseMessage });
    } else {
      await deleteGamePlayer(gamePlayer, true);

      io.emit('update', {
        type: 'leaveGame',
        game: newGame.id,
      });
      io.emit('update', 'playerInGame');

      return res
        .status(200)
        .json({ message: 'Player left the game successfully' });
    }
  } catch (err) {
    next(err);
  }
};
