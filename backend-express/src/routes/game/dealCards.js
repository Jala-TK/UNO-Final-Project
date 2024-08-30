import { dealCards as dealCardsService } from '../../services/dealerService.js';
import { findGameById } from '../../services/gameService.js';
import { validateParams } from '../../utils/validation.js';
import {
  validatePlayers,
  verifyPlayerInGame,
} from '../../services/playerService.js';
import { io } from '../../../../server.js';

export const dealCards = async (req, res, next) => {
  try {
    const game_id = req.params.id;
    const { players, cardsPerPlayer } = req.body;

    validateParams({ players }, res);

    if (cardsPerPlayer <= 0)
      return res
        .status(400)
        .json({ message: 'Cards per player must be greater than 0' });
    const game = await findGameById(game_id);
    if (!game || game?.auditExcluded) {
      return res.status(404).json({ message: 'Game not found' });
    }

    if (game.creatorId !== req.user.id) {
      return res
        .status(403)
        .json({ error: 'Only the creator can start the game' });
    }

    const validPlayers = await validatePlayers(players);
    if (validPlayers.valid === false)
      return res.status(400).json({ message: validPlayers.message });

    for (const player of validPlayers.players) {
      const inGame = await verifyPlayerInGame(player, game_id);
      if (!inGame) {
        return res
          .status(404)
          .json({ error: `Player not found in this game: ${player.username}` });
      }
    }

    if (validPlayers?.players.length <= 0)
      return res.status(404).json({ message: 'No players found' });

    const hands = await dealCardsService(
      game.id,
      cardsPerPlayer,
      validPlayers.players,
    );

    const response = {};
    for (const [playerId, cards] of Object.entries(hands.hands)) {
      if (Array.isArray(cards)) {
        response[playerId] = cards.map((card) => `${card.color} ${card.value}`);
      } else {
        response[playerId] = [];
      }
    }

    io.emit('update', {
      type: 'dealCard',
      game: game.id,
    });
    io.emit('update', 'playerInGame');

    res
      .status(200)
      .json({ message: 'Cards dealt successfully.', players: response });
  } catch (err) {
    next(err);
  }
};
