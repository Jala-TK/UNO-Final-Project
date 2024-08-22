import { findCardById } from '../../services/cardService.js';

export const getCard = async (req, res, next) => {
  try {
    const card = await findCardById(req.params.id);
    if (!card || card.auditExcluded) {
      return res.status(404).json({ message: 'Card not found' });
    }
    const response = {
      id: card.id,
      color: card.color,
      value: card.value,
      game_id: card.gameId,
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
