import { findCardById } from '../../services/cardService.js';
import { findGameById, isCurrentPlayer } from '../../services/gameService.js';
import {
  findGamePlayer,
  updateGamePlayerScore,
} from '../../services/gamePlayerService.js';
import { setNextPlayer, drawCards } from '../../services/dealerService.js';
import { validateParams } from '../../utils/validation.js';
import { addActionToHistory } from '../../services/historyService.js';
import { updatePlayerUNO } from '../../services/gamePlayerService.js';
import { io } from '../../../../server.js';

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

    let card = await drawCards(game_id, 1, user.id);
    card = card[0];
    const gamePlayer = await findGamePlayer(game_id, user.id);
    await updateGamePlayerScore(gamePlayer, card.points);
    await setNextPlayer(game_id, 1, res);

    const newCard = await findCardById(card.id);
    if (gamePlayer.uno === true) {
      await updatePlayerUNO(game_id, user.id, false);
    }

    await addActionToHistory(
      game_id,
      `Drew a card ${card.color} ${card.value}`,
      user.username,
    );

    io.emit('update', {
      type: 'drawCard',
      updateGame: game_id,
      updatedHand: 'update',
      player: user.username,
      topCard: 'update',
    });

    res.status(200).json({
      message: `${user.username} drew a card from the deck`,
      cardDrawn: `${newCard.color} ${newCard.value}`,
    });
  } catch (error) {
    next(error);
  }
};
