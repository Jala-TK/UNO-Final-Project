import {
  findAvailableCard,
  assignCardToPlayer,
  findCardById,
} from '../../services/cardService.js';
import { findGameById, isCurrentPlayer } from '../../services/gameService.js';
import {
  findGamePlayer,
  updateGamePlayerScore,
} from '../../services/gamePlayerService.js';
import { setNextPlayer } from '../../services/dealerService.js';
import { validateParams } from '../../utils/validation.js';

export const drawCard = async (req, res, next) => {
  try {
    const { game_id } = req.body;

    validateParams({ game_id }, res);

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

    const card = await findAvailableCard(game_id);

    if (!card) {
      return res
        .status(400)
        .json({ message: 'No more cards available in the deck' });
    }

    await assignCardToPlayer(card.id, user.id);

    const gamePlayer = await findGamePlayer(game_id, user.id);
    await updateGamePlayerScore(gamePlayer, card.points);
    await setNextPlayer(game_id, res);

    const newCard = await findCardById(card.id);
    const response = {
      id: newCard.id,
      color: newCard.color,
      value: newCard.value,
      game_id: newCard.gameId,
      whoOwnerCard: newCard.whoOwnerCard,
      orderDiscarded: newCard.orderDiscarded,
    };

    res.status(200).json({ success: true, response });
  } catch (error) {
    next(error);
  }
};
