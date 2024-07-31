import Card from '../../models/card.js';

export const updateCard = async (req, res, next) => {
  try {
    const card = await Card.findByPk(req.params.id);
    if (!card || card?.auditExcluded) {
      return res.status(404).json({ message: 'Card not found' });
    }
    const { color, value, gameId } = req.body;
    if (!color || !value || !gameId) {
      return res.status(400).json({ message: 'Invalid params' });
    }
    const updateCard = await card.update({ color, value, gameId });
    const response = {
      card_id: updateCard.id,
      game_id: updateCard.gameId,
      points: updateCard.points,
      value: updateCard.value,
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
