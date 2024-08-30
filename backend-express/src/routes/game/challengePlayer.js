import {
  getPlayerHand,
  findExistPlayerByUsername,
  findPlayerById,
} from '../../services/playerService.js';
import { validateParams } from '../../utils/validation.js';
import { findGameById } from '../../services/gameService.js';
import { findGamePlayer } from '../../services/gamePlayerService.js';
import { drawCards } from '../../services/dealerService.js';
import { io } from '../../../../server.js';

export const challengePlayer = async (req, res, next) => {
  try {
    const { game_id, challengePlayer } = req.body;
    validateParams({ game_id, challengePlayer }, res);

    const user = req.user;
    const game = await findGameById(game_id);

    if (!game || game?.auditExcluded) {
      return res.status(404).json({ message: 'Game not found' });
    }
    const playerChallenged = await findExistPlayerByUsername(challengePlayer);

    const gamePlayer = await findGamePlayer(game_id, playerChallenged.id);
    if (!gamePlayer || gamePlayer?.auditExcluded) {
      return res.status(404).json({ message: 'Player not in this game' });
    }

    const playerHand = await getPlayerHand(game_id, playerChallenged);

    if (playerHand.length !== 1) {
      return res.status(400).json({
        message:
          'The player has more than one card and does not need to say UNO.',
      });
    }

    if (gamePlayer.uno === false && playerHand.length === 1) {
      await drawCards(game_id, 2, playerChallenged.id);

      const nextPlayer = await findPlayerById(game.currentPlayer);

      io.emit('update', {
        type: 'challenge',
        updateGame: game.id,
        updatedHand: 'update',
        player: user.username,
      });

      res.status(200).json({
        message: `Challenge successful. ${playerChallenged.username} forgot to say UNO and draws 2 cards.`,
        nextPlayer: nextPlayer.username,
      });
    } else {
      res.status(400).json({
        message: `Challenge failed. ${playerChallenged.username} said UNO on time.`,
      });
    }
  } catch (error) {
    next(error);
  }
};
