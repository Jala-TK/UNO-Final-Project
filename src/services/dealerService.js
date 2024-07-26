import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Card from "../models/card.js";
import GamePlayer from "../models/gamePlayer.js";
import Game from "../models/game.js";
import { shuffle, dealCards } from "../utils/cardUtils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadCardsFromFile = () => {
  const filePath = path.join(__dirname, "../utils/cards.json");
  const rawData = fs.readFileSync(filePath, "utf8");
  const { unoCards } = JSON.parse(rawData);
  return unoCards;
};

// Initializes the deck and deals cards to players
export const initializeGame = async (gameId) => {
  const cards = loadCardsFromFile();
  const shuffledDeck = shuffle(cards);

  const players = await GamePlayer.findAll({
    where: { gameId, auditExcluded: false },
  });

  const handSize = 7;

  // Creates cards in the database
  const cardPromises = shuffledDeck.map((card, index) => {
    const playerIndex = Math.floor(index / handSize);
    const player = players[playerIndex];
    return Card.create({
      ...card,
      gameId,
      whoOwnerCard: player ? player.playerId : null,
    });
  });

  try {
    await Promise.all(cardPromises);
  } catch (error) {
    console.error("Error creating cards:", error);
    throw error;
  }
  const hands = dealCards(shuffledDeck, players, handSize);

  console.log(hands);

  // Calculate and update the player points
  const playerPoints = players
    .map(async (player) => {
      const playerHand = hands.find(
        (hand) => hand.playerId === player.playerId
      );

      const points = playerHand.cards.reduce(
        (total, card) => total + card.points,
        0
      );

      const gamePlayer = await GamePlayer.findOne({
        where: { gameId: gameId, playerId: player.playerId },
      });

      gamePlayer.score += points;
      await gamePlayer.save();
    })
    .filter((update) => update !== null);

  try {
    await Promise.all(playerPoints);
  } catch (error) {
    console.error("Error updating player points:", error);
    throw error;
  }

  return { shuffledDeck, hands };
};

export const setNextPlayer = async (game_id, res) => {
  try {
    const game = await Game.findByPk(game_id);
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    const playersInGame = await GamePlayer.findAll({
      where: {
        gameId: game_id,
        auditExcluded: false,
      },
      order: [["createdAt", "ASC"]],
    });

    let nextPlayerIndex =
      playersInGame.findIndex(
        (player) => player.playerId === game.currentPlayer
      ) + 1;
    if (nextPlayerIndex >= playersInGame.length) {
      nextPlayerIndex = 0;
    }

    game.currentPlayer = playersInGame[nextPlayerIndex].dataValues.playerId;
    await game.save();
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while setting the next player",
      error: error.message,
    });
  }
};

export const setNewPoints = async (card_id, game_id, user, res) => {
  try {
    const card = await Card.findByPk(card_id);
    if (!card || card?.auditExcluded)
      return res.status(404).json({ message: "Card not found" });

    const game = await Game.findByPk(game_id);
    if (!game || game?.auditExcluded) {
      return res.status(404).json({ message: "Game not found" });
    }

    const cardPoints = card.points;
    const gamePlayer = await GamePlayer.findOne({
      where: { gameId: game_id, playerId: user.id },
    });

    if (!gamePlayer) {
      return res.status(404).json({ message: "Player not found in game" });
    }

    gamePlayer.score -= cardPoints;
    await gamePlayer.save();
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while setting the points of player",
      error: error.message,
    });
  }
};
