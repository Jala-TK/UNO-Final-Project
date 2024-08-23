import { validateParams } from '../../utils/validation.js';
import {
  validateGameExists,
  validateCardExists,
  validatePlayerTurn,
  validateCardOwnership,
  validateCardPlayable,
} from '../../services/validateService.js';
import {
  handleDrawTwo,
  handleWildDrawFour,
  handleReverse,
  handleSkip,
  handleWild,
  drawCardsAndUpdateState,
} from '../../services/cardActionService.js';
import { processEndOfGame } from '../../services/gameFlowService.js';
import { addActionToHistory } from '../../services/historyService.js';
import { setNextPlayer } from '../../services/dealerService.js';
import { getTopDiscardedCard } from '../../services/gamePlayerService.js';
import { discardCard } from '../../services/cardService.js';
import { getPlayerHand } from '../../services/playerService.js';
import { updateScoreAutomatic } from '../../services/scoreService.js';

export const playCard = async (req, res, next) => {
  try {
    const { game_id, card_id, color } = req.body;

    await validateParams({ game_id, card_id }, res);
    const user = req.user;

    const game = await validateGameExists(game_id, res);
    if (!game) return;

    const isTurn = await validatePlayerTurn(game, user, res);
    if (!isTurn) return;

    const card = await validateCardExists(card_id, game, res);
    if (!card) return;

    const ownsCard = await validateCardOwnership(card, user, res);
    if (!ownsCard) return;

    // Verifica se há cartas a serem compradas
    if (game.cardsToBuy > 0) {
      const topDiscardCard = await getTopDiscardedCard(game_id);

      if (card.value === 'draw2' && topDiscardCard.value === card.value) {
        await handleDrawTwo(game, card, res);
      } else if (card.value === 'wild_draw4') {
        await handleWildDrawFour(game, card, color, user, res);
      } else {
        // Jogador não pode jogar outra carta, deve comprar as cartas acumuladas
        await drawCardsAndUpdateState(game, user, res, next);
        return;
      }
    } else {
      switch (card.value) {
        case 'draw2':
          await handleDrawTwo(game, card, res);
          break;
        case 'wild_draw4':
          if (!color)
            return res.status(400).json({
              message: `${user.username} did not select the color`,
            });
          await handleWildDrawFour(game, card, color, user, res);
          break;
        case 'reverse':
          await handleReverse(game, res);
          break;
        case 'skip':
          await handleSkip(game, res);
          break;
        case 'wild':
          if (!color)
            return res.status(400).json({
              message: `${user.username} did not select the color`,
            });
          await handleWild(card, color, user, res);
          break;
      }
    }

    const topDiscardCard = await getTopDiscardedCard(game_id);
    const validateCard = await validateCardPlayable(card, topDiscardCard, res);
    if (!validateCard) return;

    await discardCard(game_id, card, res);
    await updateScoreAutomatic(game.id, user);

    await addActionToHistory(
      game_id,
      `Played ${card.color} ${card.value}`,
      user.username,
    );

    const hand = await getPlayerHand(game.id, user);

    if (hand.length === 0) {
      await processEndOfGame(game, user, card, res);
      return;
    }

    const nextPlayer = await setNextPlayer(game_id, 1, res);

    return res.status(200).json({
      message: `${user.username} played ${card.color} ${card.value}`,
      nextPlayer: nextPlayer?.username,
    });
  } catch (error) {
    next(error);
  }
};
