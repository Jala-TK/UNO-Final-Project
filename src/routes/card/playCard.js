import Card from '../../models/card.js';
import Game from '../../models/game.js';
import { setNextPlayer, setNewPoints } from '../../services/dealerService.js';
import VerifyToken from '../../utils/verifyToken.js';
import { Op } from 'sequelize';

export const playCard = async (req, res, next) => {
  try {
    const { game_id, card_id, access_token } = req.body;
    if (!game_id || !card_id || !access_token) {
      return res.status(400).json({ message: 'Invalid params' });
    }

    const user = await VerifyToken(access_token);

    const game = await Game.findByPk(game_id);
    if (!game || game?.auditExcluded) {
      return res.status(404).json({ message: 'Game not found' });
    }

    if (user.id !== game.currentPlayer)
      return res
        .status(400)
        .json({ message: 'It is not the players turn yet' });

    const card = await Card.findByPk(card_id);
    if (!card || card?.auditExcluded)
      return res.status(404).json({ message: 'Card not found' });

    if (card.gameId !== game.id)
      return res.status(404).json({ message: 'Card is not from this game' });

    if (card.whoOwnerCard !== user.id)
      return res
        .status(400)
        .json({ message: 'Card does not belong to player' });

    if (card.orderDiscarded !== null)
      return res.status(400).json({ message: 'Card already discarded' });

    const highestOrder = await Card.max('orderDiscarded', {
      where: { gameId: game.id, orderDiscarded: { [Op.ne]: null } },
    });
    card.orderDiscarded = (highestOrder || 0) + 1;
    await card.save();

    await setNextPlayer(game_id, res);
    await setNewPoints(card_id, game_id, user, res);

    const response = {
      id: card.id,
      color: card.color,
      value: card.value,
      game_id: card.gameId,
      whoOwnerCard: card.whoOwnerCard,
      orderDiscarded: card.orderDiscarded,
    };

    res.status(200).json({ message: 'Card played successfully', response });
  } catch (error) {
    next(error);
  }
};
