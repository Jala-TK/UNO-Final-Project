import {
  findCardById,
  getHighestDiscardOrder,
  updateCardOrder,
  isCardPlayable,
} from '../../services/cardService.js';
import {
  findGameById,
  isCurrentPlayer,
  updateGame,
} from '../../services/gameService.js';
import {
  setNextPlayer,
  setNewPoints,
  drawCards,
} from '../../services/dealerService.js';
import { validateParams } from '../../utils/validation.js';
import { getPlayerHand } from '../../services/playerService.js';
import {
  getPlayersInGame,
  findGamePlayer,
} from '../../services/gamePlayerService.js';
import {
  getPlayerScores,
  updateScoreAutomatic,
} from '../../services/scoreService.js';
import { addActionToHistory } from '../../services/historyService.js';

export const playCard = async (req, res, next) => {
  try {
    const { game_id, card_id, color } = req.body;
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

    const topDiscardCard = await findCardById(highestOrder.id);

    console.log(game.cardsToBuy);
    let position = 1;

    if (game.cardsToBuy > 0) {
      if (card.value === 'draw2' && topDiscardCard.value === card.value) {
        await updateGame(game, {
          cardsToBuy: game.cardsToBuy + 2,
        });
      } else if (card.value === 'wild_draw4') {
        if (color) {
          card.color = color;
          await card.save();
        } else {
          return res.status(400).json({
            message: `${user.username} not select the color`,
          });
        }
        await updateGame(game, {
          cardsToBuy: game.cardsToBuy + 4,
        });
      } else {
        console.log(game.cardsToBuy);
        const cards = await drawCards(game_id, game.cardsToBuy, user.id);

        const gamePlayer = await findGamePlayer(game_id, user.id);
        await updateScoreAutomatic(game_id, user);
        const nextPlayer = await setNextPlayer(game_id, 1, res);

        const newCards = {};
        cards.forEach((card) => {
          newCards[card.id] = `${card.color} ${card.value}`;
        });
        if (gamePlayer.uno === true) {
          await updatePlayerUNO(game_id, user.id, false);
        }

        await addActionToHistory(
          game_id,
          `Drew cards ${newCards}`,
          user.username,
        );

        game.cardsToBuy = 0;
        await game.save();
        return res.status(200).json({
          message: `${user.username} cannot play this card and drew cards from the deck`,
          cardDrawn: newCards,
          nextPlayer: nextPlayer?.username,
        });
      }
    } else {
      const isPlayable = isCardPlayable(card, topDiscardCard);
      if (!isPlayable && card.value !== 'wild_draw4') {
        return res.status(400).json({
          message:
            'Invalid card. Please play a card that matches the top card on the discard pile.',
        });
      }

      if (card.value === 'reverse') {
        await updateGame(game, {
          clockwise: !game.clockwise,
        });
      }
      if (card.value === 'skip') {
        position = 2;
      }

      if (card.value === 'draw2') {
        await updateGame(game, {
          cardsToBuy: game.cardsToBuy + 2,
        });
      } else if (card.value === 'wild_draw4') {
        if (color) {
          card.color = color;
          await card.save();
        } else {
          return res.status(400).json({
            message: `${user.username} not select the color`,
          });
        }
        await updateGame(game, {
          cardsToBuy: game.cardsToBuy + 4,
        });
      } else if (card.value === 'wild') {
        if (color) {
          card.color = color;
          await card.save();
        } else {
          return res.status(400).json({
            message: `${user.username} not select the color`,
          });
        }
      }
    }

    await updateCardOrder(card, (highestOrder.orderDiscarded || 0) + 1);

    const nextPlayer = await setNextPlayer(game_id, position, res);

    await setNewPoints(card_id, game_id, user, res);

    const hand = await getPlayerHand(game_id, user);

    if (hand.length === 0) {
      await updateGame(game, {
        status: 'Finished',
      });

      const gamePlayers = await getPlayersInGame(game_id);
      if (gamePlayers.length === 0) {
        return res
          .status(404)
          .json({ message: 'No players found in this game' });
      }

      const scores = await getPlayerScores(gamePlayers);

      return res.status(200).json({
        message: `Card played successfully. ${user.username} has won the game!`,
        scores: scores,
        winner: user.username,
      });
    }
    await addActionToHistory(
      game_id,
      `Played ${card.color} ${card.value}`,
      user.username,
    );
    return res.status(200).json({
      message: 'Card played successfully',
      nextPlayer: nextPlayer?.username,
    });
  } catch (error) {
    next(error);
  }
};
