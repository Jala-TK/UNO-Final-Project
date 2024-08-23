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
      card: {
        id: topCard.id,
        color: topCard.color,
        value: topCard.value,
        image: topCard.image,
        description: topCard.description,
      },
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
