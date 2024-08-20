import { updateGame } from '../services/gameService.js';
import { drawCards } from '../services/dealerService.js';
import { addActionToHistory } from '../services/historyService.js';
import {
  findGamePlayer,
  updatePlayerUNO,
} from '../services/gamePlayerService.js';
import { updateScoreAutomatic } from '../services/scoreService.js';
import { setNextPlayer } from '../services/dealerService.js';

export const handleDrawTwo = async (game, card, res) => {
  await updateGame(game, {
    cardsToBuy: game.cardsToBuy + 2,
  });
};

export const handleWildDrawFour = async (game, card, color, res) => {
  card.color = color;
  await card.save();

  await updateGame(game, {
    cardsToBuy: game.cardsToBuy + 4,
  });
};

export const handleReverse = async (game, res) => {
  await updateGame(game, {
    clockwise: !game.clockwise,
  });
  await setNextPlayer(game.id, 1, res);
};

export const handleSkip = async (game, res) => {
  await setNextPlayer(game.id, 1, res);
};

export const handleWild = async (card, color, res) => {
  card.color = color;
  await card.save();
};

export const drawCardsAndUpdateState = async (game, user, res) => {
  try {
    const cards = await drawCards(game.id, game.cardsToBuy, user.id);
    const gamePlayer = await findGamePlayer(game.id, user.id);
    await updateScoreAutomatic(game.id, user);
    const nextPlayer = await setNextPlayer(game.id, 1, res);

    const newCards = {};
    cards.forEach((card) => {
      newCards[card.id] = `${card.color} ${card.value}`;
    });

    if (gamePlayer.uno === true) {
      await updatePlayerUNO(game.id, user.id, false);
    }

    await addActionToHistory(game.id, `Drew cards ${newCards}`, user.username);

    game.cardsToBuy = 0;
    await game.save();

    return res.status(200).json({
      message: `${user.username} cannot play this card and drew cards from the deck`,
      cardDrawn: newCards,
      nextPlayer: nextPlayer?.username,
    });
  } catch (error) {
    console.log(error);
  }
};
