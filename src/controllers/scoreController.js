import GamePlayer from "../models/gamePlayer.js";
import Game from "../models/game.js";
import Player from "../models/player.js";

export const createScore = async (req, res, next) => {
  try {
    const { playerId, gameId, score } = req.body;
    const newGamePlayer = await GamePlayer.create({
      playerId: playerId,
      gameId: gameId,
      score: score,
    });
    res.status(201).json(newGamePlayer);
  } catch (error) {
    next(error);
  }
};

export const getScore = async (req, res, next) => {
  try {
    const gamePlayer = await GamePlayer.findByPk(req.params.id);
    if (!gamePlayer || gamePlayer.auditExcluded) {
      return res.status(404).json({ message: "Score not found" });
    }
    res.status(200).json(gamePlayer);
  } catch (error) {
    next(error);
  }
};

export const updateScore = async (req, res, next) => {
  try {
    const gamePlayer = await GamePlayer.findByPk(req.params.id);
    if (!gamePlayer || gamePlayer.auditExcluded) {
      return res.status(404).json({ message: "Score not found" });
    }
    const { playerId, gameId, score } = req.body;
    if ((gamePlayer.playerId = playerId)) {
      return res.status(404).json({ message: "Score with playerId not found" });
    }
    if ((gamePlayer.gameId = gameId)) {
      return res.status(404).json({ message: "Score with gameId not found" });
    }

    await gamePlayer.update({ score });
    res.status(200).json(gamePlayer);
  } catch (error) {
    next(error);
  }
};

export const deleteScore = async (req, res, next) => {
  try {
    const gamePlayer = await GamePlayer.findByPk(req.params.id);
    if (!gamePlayer || gamePlayer.auditExcluded) {
      return res.status(404).json({ message: "Score not found" });
    }
    await gamePlayer.update({ score: 0 });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getPlayerScores = async (req, res, next) => {
  try {
    const { game_id } = req.body;

    if (!game_id) {
      return res.status(400).json({ message: "Game ID is required" });
    }

    const game = await Game.findByPk(game_id);
    if (!game || game?.auditExcluded) {
      return res.status(404).json({ message: "Game not found" });
    }

    const gamePlayers = await GamePlayer.findAll({
      where: { gameId: game_id, auditExcluded: false },
    });

    if (gamePlayers.length === 0) {
      return res.status(404).json({ message: "No players found in this game" });
    }

    const playerIds = gamePlayers.map((gp) => gp.playerId);
    const players = await Player.findAll({
      where: {
        id: playerIds,
      },
    });

    const scores = {};
    for (const gp of gamePlayers) {
      const player = players.find((p) => p.id === gp.playerId);
      if (player) {
        scores[player.username] = gp.score;
      }
    }

    const response = {
      game_id: game.id,
      scores,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
