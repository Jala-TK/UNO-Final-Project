import { findCardById, updateCardDetails } from '../../services/cardService.js';
import { validateParams } from '../../utils/validation.js';

export const updateCard = async (req, res, next) => {
  try {
    const card = await findCardById(req.params.id);
    if (!card || card.auditExcluded) {
      return res.status(404).json({ message: 'Card not found' });
    }
    const { color, value, gameId } = req.body;
    validateParams({ color, value, gameId }, res);

    const updatedCard = await updateCardDetails(card, { color, value, gameId });
    const response = {
      card_id: updatedCard.id,
      game_id: updatedCard.gameId,
      points: updatedCard.points,
      value: updatedCard.value,
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
