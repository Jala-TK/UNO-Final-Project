import Card from "../models/card.js";
import Game from "../models/game.js";
import GamePlayer from "../models/gamePlayer.js";
import { setNextPlayer, setNewPoints } from "../services/dealerService.js";
import VerifyToken from "../utils/verifyToken.js";
import { Op } from "sequelize";

export const createCard = async (req, res, next) => {
  try {
    const { color, value, gameId, point } = req.body;
    const newCard = await Card.create({ color, value, gameId, point });
    res.status(201).json(newCard);
  } catch (error) {
    next(error);
  }
};

export const getCard = async (req, res, next) => {
  try {
    const card = await Card.findByPk(req.params.id);
    if (!card || card?.auditExcluded) {
      return res.status(404).json({ message: "Card not found" });
    }
    res.status(200).json(card);
  } catch (error) {
    next(error);
  }
};

export const updateCard = async (req, res, next) => {
  try {
    const card = await Card.findByPk(req.params.id);
    if (!card || card?.auditExcluded) {
      return res.status(404).json({ message: "Card not found" });
    }
    const { color, value, gameId } = req.body;
    await card.update({ color, value, gameId });
    res.status(200).json(card);
  } catch (error) {
    next(error);
  }
};

export const deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findByPk(req.params.id);
    if (!card || card?.auditExcluded) {
      return res.status(404).json({ message: "Card not found" });
    }
    await card.update({ auditExcluded: true });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const playCard = async (req, res, next) => {
  try {
    const { game_id, card_id, access_token } = req.body;
    if (!game_id || !card_id || !access_token) {
      return res.status(400).json({ message: "Invalid params" });
    }

    const user = await VerifyToken(access_token);

    const game = await Game.findByPk(game_id);
    if (!game || game?.auditExcluded) {
      return res.status(404).json({ message: "Game not found" });
    }

    if (user.id !== game.currentPlayer)
      return res
        .status(400)
        .json({ message: "It is not the players turn yet" });

    const card = await Card.findByPk(card_id);
    if (!card || card?.auditExcluded)
      return res.status(404).json({ message: "Card not found" });

    if (card.gameId !== game.id)
      return res.status(404).json({ message: "Card is not from this game" });

    if (card.whoOwnerCard !== user.id)
      return res
        .status(400)
        .json({ message: "Card does not belong to player" });

    if (card.orderDiscarded !== null)
      return res.status(400).json({ message: "Card already discarded" });

    const highestOrder = await Card.max("orderDiscarded", {
      where: { gameId: game.id, orderDiscarded: { [Op.ne]: null } },
    });
    card.orderDiscarded = (highestOrder || 0) + 1;
    await card.save();

    await setNextPlayer(game_id, res);
    await setNewPoints(card_id, game_id, user, res);

    res.status(200).json({ message: "Card played successfully", card });
  } catch (error) {
    next(error);
  }
};

export const drawCard = async (req, res, next) => {
  try {
    const { game_id, access_token } = req.body;

    if (!game_id || !access_token) {
      return res.status(400).json({ message: "Invalid params" });
    }

    const user = await VerifyToken(access_token);

    const game = await Game.findByPk(game_id);
    if (!game || game?.auditExcluded) {
      return res.status(404).json({ message: "Game not found" });
    }

    if (user.id !== game.currentPlayer)
      return res
        .status(400)
        .json({ message: "It is not the players turn yet" });

    const card = await Card.findOne({
      where: { gameId: game_id, whoOwnerCard: null },
    });

    if (!card) {
      //Update to create a new cards
      return res
        .status(400)
        .json({ message: "No more cards available in the deck" });
    }

    await Card.update({ whoOwnerCard: user.id }, { where: { id: card.id } });

    const gamePlayer = await GamePlayer.findOne({
      where: { gameId: game_id, playerId: user.id },
    });

    gamePlayer.score += card.points;
    await gamePlayer.save();

    await setNextPlayer(game_id, res);

    res.status(200).json({ success: true, card });
  } catch (error) {
    next(error);
  }
};
