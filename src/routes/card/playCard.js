import {
  findCardById,
  getHighestDiscardOrder,
  updateCardOrder,
} from '../../services/cardService.js';
import { findGameById, isCurrentPlayer } from '../../services/gameService.js';
import { setNextPlayer, setNewPoints } from '../../services/dealerService.js';
import { validateParams } from '../../utils/validation.js';

export const playCard = async (req, res, next) => {
  try {
    const { game_id, card_id } = req.body;
    validateParams({ game_id, card_id }, res);

    const user = req.user;
    const game = await findGameById(game_id);
    if (!game || game?.auditExcluded) {
      return res.status(404).json({ message: 'Game not found' });
    }

    if (!isCurrentPlayer(game, user.id)) {
      return res
        .status(400)
        .json({ message: 'It is not the players turn yet' });
    }

    const card = await findCardById(card_id);
    if (!card || card?.auditExcluded) {
      return res.status(404).json({ message: 'Card not found' });
    }

    if (card.gameId !== game.id) {
      return res.status(404).json({ message: 'Card is not from this game' });
    }

    if (card.whoOwnerCard !== user.id) {
      return res
        .status(400)
        .json({ message: 'Card does not belong to player' });
    }

    if (card.orderDiscarded !== null) {
      return res.status(400).json({ message: 'Card already discarded' });
    }

    const highestOrder = await getHighestDiscardOrder(game.id);
    await updateCardOrder(card, (highestOrder || 0) + 1);

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
