import Card from '../../models/card.js';
import Game from '../../models/game.js';

export const createCard = async (req, res, next) => {
  try {
    const { color, value, gameId, points, image } = req.body;
    if (!color || !value || !gameId || !points || !image) {
      return res.status(400).json({ message: 'Invalid params' });
    }

    const game = await Game.findByPk(gameId);
    if (!game || game?.auditExcluded) {
      return res.status(404).json({ message: 'Game not found' });
    }

    const newCard = await Card.create({ color, value, gameId, points, image });

    const response = {
      card_id: newCard.id,
      game_id: newCard.gameId,
      points: newCard.points,
      value: newCard.value,
    };
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};
