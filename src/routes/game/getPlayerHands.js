import GamePlayer from "../../models/gamePlayer.js";
import Card from "../../models/card.js";
import Player from "../../models/player.js";
import Game from "../../models/game.js";


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
      hands: Object.keys(playerHands).reduce(
        (acc, playerId) => ({
          ...acc,
          [playerNames[playerId]]: playerHands[playerId],
        }),
        {}
      ),
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
