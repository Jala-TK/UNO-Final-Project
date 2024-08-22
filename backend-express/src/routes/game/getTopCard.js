import { findGameById } from '../../services/gameService.js';
import { validateParams } from '../../utils/validation.js';
import { getTopDiscardedCard } from '../../services/gamePlayerService.js';

export const getTopCard = async (req, res, next) => {
  try {
    const { game_id } = req.body;
    validateParams({ game_id }, res);

    const game = await findGameById(game_id);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    const topCard = await getTopDiscardedCard(game_id);
    if (!topCard) {
      return res.status(404).json({ message: 'Card not found' });
    }

    const response = {
      game_id: game.id,
      top_card: topCard.value,
      color: topCard.color,
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
