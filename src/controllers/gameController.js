import Game from "../models/game.js";
import GamePlayer from "../models/gamePlayer.js";
import Player from "../models/player.js";
import Card from "../models/card.js";
import VerifyToken from "../utils/verifyToken.js";
import { Op } from "sequelize";
import { initializeGame } from "../services/dealerService.js";

export const createGame = async (req, res, next) => {
  try {
    let { title, maxPlayers } = req.body;
    const { name, access_token } = req.body;
    if (name != null) title = name;

    if (!title || !access_token || !maxPlayers)
      return res.status(400).json({ message: "Invalid params" });
    const user = VerifyToken(access_token);

    const newGame = await Game.create({
      title,
      status: "Waiting for players",
      maxPlayers,
      creatorId: user.id,
      auditExcluded: false,
    });
    await GamePlayer.create({ gameId: newGame.id, playerId: user.id });

    res
      .status(201)
      .json({ message: "Game created successfully", game_id: newGame.id });
  } catch (error) {
    next(error);
  }
};

export const getGame = async (req, res, next) => {
  try {
    const game_id = req.params.id;
    if (!game_id) return res.status(400).json({ message: "Invalid params" });

    const game = await Game.findByPk(game_id);
    if (!game || game?.auditExcluded) {
      return res.status(404).json({ message: "Game not found" });
    }
    res.status(200).json(game);
  } catch (error) {
    next(error);
  }
};

export const updateGame = async (req, res, next) => {
  try {
    const { title, status, maxPlayers } = req.body;
    const { name, access_token } = req.body;
    if (name != null) title = name;

    const game = await Game.findByPk(req.params.id);
    if (!game || game?.auditExcluded) {
      return res.status(404).json({ message: "Game not found" });
    }
    const user = VerifyToken(access_token);

    if (game.creatorId !== user.id) {
      return res
        .status(403)
        .json({ error: "Only the creator can edit the game" });
    }
    await game.update({ title, status, maxPlayers });
    res.status(200).json(game);
  } catch (error) {
    next(error);
  }
};

export const deleteGame = async (req, res, next) => {
  try {
    const { access_token } = req.body;

    const game = await Game.findByPk(req.params.id);
    if (!game || game?.auditExcluded) {
      return res.status(404).json({ message: "Game not found" });
    }
    const user = VerifyToken(access_token);

    if (game.creatorId !== user.id) {
      return res
        .status(403)
        .json({ error: "Only the creator can edit the game" });
    }

    await game.update({ auditExcluded: true });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const joinGame = async (req, res, next) => {
  try {
    const { game_id, access_token } = req.body;
    if (!game_id || !access_token)
      return res.status(400).json({ message: "Invalid params" });

    const game = await Game.findByPk(game_id);
    if (!game || game?.auditExcluded)
      return res.status(404).json({ message: "Game not found" });

    const user = VerifyToken(access_token);

    const playerInGame = await GamePlayer.findOne({
      where: { gameId: game_id, playerId: user.id, auditExcluded: false },
    });
    if (playerInGame)
      return res.status(400).json({ error: "User is already in the game" });
    // Adicionar feature para resgatar dados do jogo do usuario ao entra no mesmo jogo
    await GamePlayer.create({ gameId: game_id, playerId: user.id });

    return res
      .status(200)
      .json({ message: "User joined the game successfully" });
  } catch (err) {
    if ((err.statusCode = 401))
      return res.status(401).json({ error: "Token is not valid" });
    next(err);
  }
};

export const getReady = async (req, res, next) => {
  try {
    const { game_id, access_token } = req.body;
    if (!game_id || !access_token)
      return res.status(400).json({ message: "Invalid params" });

    const game = await Game.findByPk(game_id);
    if (!game || game?.auditExcluded)
      return res.status(404).json({ message: "Game not found" });

    const user = VerifyToken(access_token);

    const playerInGame = await GamePlayer.findOne({
      where: { gameId: game_id, playerId: user.id, auditExcluded: false },
    });
    if (!playerInGame || playerInGame?.auditExcluded)
      return res.status(400).json({ error: "The player is not in this game" });

    if (playerInGame.status == true)
      return res.status(400).json({ error: "The player was ready" });
    playerInGame.status = true;
    await playerInGame.save();

    return res.status(200).json({ message: "The player is ready" });
  } catch (err) {
    if ((err.statusCode = 401))
      return res.status(401).json({ error: "Token is not valid" });
    next(err);
  }
};

export const startGame = async (req, res, next) => {
  try {
    const { game_id, access_token } = req.body;
    if (!game_id || !access_token)
      return res.status(400).json({ message: "Invalid params" });

    const game = await Game.findByPk(game_id);
    if (!game || game?.auditExcluded)
      return res.status(404).json({ message: "Game not found" });

    const user = VerifyToken(access_token);

    if (game.creatorId !== user.id) {
      return res
        .status(403)
        .json({ error: "Only the creator can start the game" });
    }

    const players = await GamePlayer.findAll({
      where: { gameId: game_id, auditExcluded: false },
    });
    if (players.length <= 1)
      return res.status(400).json({ message: "Only one player in the room" });

    const allReady = players.every((player) => player.status === true);
    if (!allReady)
      return res.status(400).json({ message: "Some players are not ready" });

    if (game.status == "In progress")
      return res.status(400).json({ message: "The game has already started" });

    const { shuffledDeck, hands } = await initializeGame(game_id);
    game.status = "In progress";
    game.currentPlayer = user.id;
    await game.save();

    res
      .status(200)
      .json({ message: "Game started successfully", shuffledDeck, hands });
  } catch (err) {
    if ((err.statusCode = 401))
      return res.status(401).json({ error: "Token is not valid" });
    next(err);
  }
};

export const leaveGame = async (req, res, next) => {
  try {
    const { game_id, access_token } = req.body;
    if (!game_id || !access_token)
      return res.status(400).json({ message: "Invalid params" });

    const game = await Game.findByPk(game_id);
    if (!game || game?.auditExcluded)
      return res.status(404).json({ message: "Game not found" });

    const user = VerifyToken(access_token);

    const gamePlayer = await GamePlayer.findOne({
      where: { gameId: game_id, playerId: user.id, auditExcluded: false },
    });
    if (!gamePlayer) {
      return res.status(404).json({ error: "Player not found in this game" });
    }

    if (game.creatorId === user.id) {
      const otherPlayers = await GamePlayer.findAll({
        where: {
          gameId: game_id,
          playerId: {
            [Op.not]: user.id,
          },
          auditExcluded: false,
        },
      });

      if (otherPlayers.length > 0) {
        game.creatorId = otherPlayers[0].dataValues.playerId;
        await game.save();
        gamePlayer.auditExcluded = true;
        await gamePlayer.save();
        return res.json({
          message:
            "Player removed from game and creator transferred successfully",
        });
      } else {
        const excluded = {
          auditExcluded: true,
        };
        await GamePlayer.update(excluded, { where: { gameId: game_id } });
        await game.update(excluded);
        return res.json({
          message: "Game and all players removed successfully",
        });
      }
    } else {
      await gamePlayer.update(excluded);
      return res
        .status(200)
        .json({ message: "User left the game successfully" });
    }
  } catch (err) {
    if ((err.statusCode = 401))
      return res.status(401).json({ error: "Token is not valid" });
    next(err);
  }
};

export const endGame = async (req, res, next) => {
  try {
    const { game_id, access_token } = req.body;
    if (!game_id || !access_token)
      return res.status(400).json({ message: "Invalid params" });

    const game = await Game.findByPk(game_id);
    if (!game || game?.auditExcluded)
      return res.status(404).json({ message: "Game not found" });

    const user = VerifyToken(access_token);

    if (game.creatorId !== user.id) {
      return res
        .status(403)
        .json({ error: "Only the creator can end the game" });
    }

    if (game.status == "In progress") {
      game.status = "Ended";
      await game.save();
      return res.status(200).json({ message: "Game ended successfully" });
    } else {
      return res.status(400).json({ error: "The game is not running" });
    }
  } catch (err) {
    if ((err.statusCode = 401))
      return res.status(401).json({ error: "Token is not valid" });
    next(err);
  }
};

export const getStatusGame = async (req, res, next) => {
  try {
    const { game_id } = req.body;

    const game = await Game.findByPk(game_id);
    if (!game || game?.auditExcluded) {
      return res.status(404).json({ message: "Game not found" });
    }
    const response = { game_id: game.id, state: game.status };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getPlayersInGame = async (req, res, next) => {
  try {
    const { game_id } = req.body;

    const game = await Game.findByPk(game_id);
    if (!game || game?.auditExcluded) {
      return res.status(404).json({ message: "Game not found" });
    }
    const players = await GamePlayer.findAll({
      where: { gameId: game_id, auditExcluded: false },
    });
    console.log(players);
    const userIds = players.map((player) => player.dataValues.playerId);
    const users = await Player.findAll({
      where: {
        id: userIds,
      },
    });
    const usernames = users.map((user) => user.username);

    const response = { game_id: game.id, players: usernames };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getCurrentPlayer = async (req, res, next) => {
  try {
    const { game_id } = req.body;

    const game = await Game.findByPk(game_id);
    if (!game || game?.auditExcluded) {
      return res.status(404).json({ message: "Game not found" });
    }

    const currentPlayer = game.currentPlayer;
    if (!currentPlayer)
      return res.status(400).json({ message: "Start the game first" });

    const player = await Player.findOne({
      where: {
        id: currentPlayer,
      },
    });

    if (!player) return res.status(404).json({ message: "Player not found" });

    const response = { game_id: game.id, current_player: player.username };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getTopCard = async (req, res, next) => {
  try {
    const { game_id } = req.body;

    const game = await Game.findByPk(game_id);
    if (!game || game?.auditExcluded) {
      return res.status(404).json({ message: "Game not found" });
    }

    const topCard = await Card.findOne({
      where: {
        gameId: game_id,
        orderDiscarded: { [Op.ne]: null },
      },
      order: [["orderDiscarded", "DESC"]],
    });

    if (!topCard) {
      return res.status(404).json({ message: "Card not found" });
    }

    const response = { game_id: game.id, top_card: topCard.value };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getPlayerHands = async (req, res, next) => {
  try {
    const { game_id } = req.body;
    if (!game_id) {
      return res.status(400).json({ message: "Game ID is required" });
    }

    const game = await Game.findByPk(game_id);
    if (!game || game?.auditExcluded) {
      return res.status(404).json({ message: "Game not found" });
    }

    const playersInGame = await GamePlayer.findAll({
      where: { gameId: game_id, auditExcluded: false },
    });

    const playerIds = playersInGame.map((player) => player.playerId);

    const playerHands = {};
    for (const playerId of playerIds) {
      const cards = await Card.findAll({
        where: {
          gameId: game_id,
          whoOwnerCard: playerId,
          orderDiscarded: null,
        },
      });
      playerHands[playerId] = cards.map((card) => ({
        id: card.id,
        points: card.points,
        description: card.value,
      }));
    }

    const players = await Player.findAll({
      where: {
        id: playerIds,
      },
    });

    const playerNames = players.reduce((acc, player) => {
      acc[player.id] = player.username;
      return acc;
    }, {});

    const response = {
      game_id: game.id,
      hands: Object.keys(playerHands).reduce((acc, playerId) => {
        acc[playerNames[playerId]] = playerHands[playerId];
        return acc;
      }, {}),
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
