import { findGameById } from '../../services/gameService.js';
import { verifyPlayerInGame } from '../../services/playerService.js';
import { validateParams } from '../../utils/validation.js';
import {
  addPlayerToGame,
  getPlayersInGame,
} from '../../services/gamePlayerService.js';
import { io } from '../../../../server.js';

export const joinGame = async (req, res, next) => {
  try {
    const { game_id } = req.body;
    const user = req.user;

    validateParams({ game_id }, res);

    const game = await findGameById(game_id);
    if (!game || game?.auditExcluded)
      return res.status(404).json({ message: 'Game not found' });

    const players = await getPlayersInGame(game.id);
    if (players.lenght > game.maxPlayers) {
      return res.status(400).json({ error: 'Game is full' });
    }

    const playerInGame = await verifyPlayerInGame(user, game_id);
    if (playerInGame)
      return res.status(400).json({ error: 'User is already in the game' });

    await addPlayerToGame(game_id, user.id);

    io.emit('update', {
      type: 'joinGame',
      game: game.id,
      player: user.username,
      updateGame: game.id,
    });
    io.emit('update', 'playerInGame');

    return res
      .status(200)
      .json({ message: 'User joined the game successfully' });
  } catch (err) {
    next(err);
  }
};
