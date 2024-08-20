import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Card from '../models/card.js';
import GamePlayer from '../models/gamePlayer.js';
import Game from '../models/game.js';
import { DeckMonad } from '../utils/deckMonad.js';
import { updateCardOrder } from './cardService.js';
import Player from '../models/player.js';
import { Op } from 'sequelize';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const initializeDeck = async (gameId) => {
  const filePath = path.join(__dirname, '../utils/cards.json');
  const rawData = fs.readFileSync(filePath, 'utf8');
  const { unoCards } = JSON.parse(rawData);

  const deckMonad = DeckMonad.of(unoCards).shuffle();

  const cardPromises = deckMonad.deck.map((card) =>
    Card.create({
      ...card,
      gameId,
      whoOwnerCard: null, // Inicializa com null
    }),
  );

  try {
    await Promise.all(cardPromises);
  } catch (error) {
    console.error('Error initializing deck:', error);
    throw error;
  }
};

export const setTopCard = async (gameId) => {
  const topCard = await Card.findOne({
    where: {
      whoOwnerCard: null,
      gameId: gameId,
      auditExcluded: false,
      value: {
        [Op.notIn]: ['wild', 'draw2', 'wild_draw4', 'skip', 'reverse'],
      },
    },
  });

  await updateCardOrder(topCard, 1);
};

export const deliverCards = async (gameId, handSize, players) => {
  const deck = await Card.findAll({
    where: { gameId: gameId, whoOwnerCard: null, orderDiscarded: null },
  });

  const hands = {};

  players.forEach((player) => {
    hands[player.username] = [];
  });

  try {
    for (let i = 0; i < handSize; i++) {
      players.forEach((player) => {
        if (deck.length === 0) return;
        const card = deck.shift();
        hands[player.username].push(card);
        card.whoOwnerCard = player.id;
        card.save();
      });
    }
  } catch (error) {
    console.error('Error updating cards:', error);
    throw error;
  }

  return { hands, deck };
};

export const dealCards = async (gameId, handSize, players) => {
  const { hands, deck } = await deliverCards(gameId, handSize, players);
  const playerPoints = players
    .map(async (player) => {
      const playerHand = hands[player.username] || [];

      const points = playerHand.reduce((total, card) => total + card.points, 0);

      const gamePlayer = await GamePlayer.findOne({
        where: { gameId: gameId, playerId: player.id },
      });

      gamePlayer.score += points;
      await gamePlayer.save();
    })
    .filter((update) => update !== null);

  try {
    await Promise.all(playerPoints);
  } catch (error) {
    console.error('Error updating player points:', error);
    throw error;
  }

  return { shuffledDeck: deck, hands };
};

export const setNextPlayer = async (game_id, position, res) => {
  try {
    const game = await Game.findByPk(game_id);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    const playersInGame = await GamePlayer.findAll({
      where: {
        gameId: game_id,
        auditExcluded: false,
      },
      order: [['createdAt', 'ASC']],
    });
    let nextPlayerIndex;
    if (game.clockwise === false) {
      nextPlayerIndex =
        (playersInGame.findIndex(
          (player) => player.playerId === game.currentPlayer,
        ) -
          position +
          playersInGame.length) %
        playersInGame.length;
    } else {
      nextPlayerIndex =
        (playersInGame.findIndex(
          (player) => player.playerId === game.currentPlayer,
        ) +
          position) %
        playersInGame.length;
    }

    game.currentPlayer = playersInGame[nextPlayerIndex].dataValues.playerId;
    await game.save();

    return await Player.findByPk(game.currentPlayer);
  } catch (error) {
    return res.status(500).json({
      message: 'An error occurred while setting the next player',
      error: error.message,
    });
  }
};

export const setNewPoints = async (card_id, game_id, user, res) => {
  try {
    const card = await Card.findByPk(card_id);
    if (!card || card?.auditExcluded)
      return res.status(404).json({ message: 'Card not found' });

    const game = await Game.findByPk(game_id);
    if (!game || game?.auditExcluded) {
      return res.status(404).json({ message: 'Game not found' });
    }

    const cardPoints = card.points;
    const gamePlayer = await GamePlayer.findOne({
      where: { gameId: game_id, playerId: user.id },
    });

    if (!gamePlayer) {
      return res.status(404).json({ message: 'Player not found in game' });
    }

    gamePlayer.score -= cardPoints;
    await gamePlayer.save();
  } catch (error) {
    return res.status(500).json({
      message: 'An error occurred while setting the points of player',
      error: error.message,
    });
  }
};

export const drawCards = async (gameId, quantity, playerId) => {
  let drawnCards = [];

  for (let i = 0; i < quantity; i++) {
    let deck = await Card.findAll({
      where: { gameId: gameId, whoOwnerCard: null, orderDiscarded: null },
      order: [['createdAt', 'ASC']],
    });

    if (deck.length === 0) {
      await initializeDeck(gameId);

      deck = await Card.findAll({
        where: { gameId: gameId, whoOwnerCard: null, orderDiscarded: null },
        order: [['createdAt', 'ASC']],
      });
    }

    const card = deck.shift();

    card.whoOwnerCard = playerId;
    await card.save();

    drawnCards.push(card);
  }

  return drawnCards;
};
