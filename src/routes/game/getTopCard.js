import Game from '../../models/game.js';
import Card from '../../models/card.js';
import { Op } from 'sequelize';

export const getTopCard = async (req, res, next) => {
  try {
    const { game_id } = req.body;
    if (!game_id) {
      return res.status(400).json({ message: 'Invalid Params' });
    }
    const game = await Game.findByPk(game_id);
    if (!game || game?.auditExcluded) {
      return res.status(404).json({ message: 'Game not found' });
    }

    const topCard = await Card.findOne({
      where: {
        gameId: game_id,
        orderDiscarded: { [Op.ne]: null },
      },
      order: [['orderDiscarded', 'DESC']],
    });

    if (!topCard) {
      return res.status(404).json({ message: 'Card not found' });
    }

    const response = { game_id: game.id, top_card: topCard.value };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
