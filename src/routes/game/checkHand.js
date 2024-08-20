import { getTopDiscardedCard } from '../../services/gamePlayerService.js';
import { getPlayerHand } from '../../services/playerService.js';
import { isCardPlayable } from '../../services/cardService.js';
import { findGameById } from '../../services/gameService.js';

export const checkHand = async (req, res, next) => {
  try {
    const { game_id } = req.body;

    const game = await findGameById(game_id);
    if (!game || game?.auditExcluded) {
      return res.status(404).json({ message: 'Game not found' });
    }
    const player = req.user;

    const cards = await getPlayerHand(game_id, player);
    const topCard = await getTopDiscardedCard(game_id);

    const validCards = [];

    for (const card of cards) {
      if (isCardPlayable(card, topCard)) {
        validCards.push({
          id: card.id,
          color: card.color,
          value: card.value,
        });
      }
    }

    res.status(200).json({
      validCards,
      topCard: {
        id: topCard.id,
        color: topCard.color,
        value: topCard.value,
      },
    });
  } catch (error) {
    next(error);
  }
};
