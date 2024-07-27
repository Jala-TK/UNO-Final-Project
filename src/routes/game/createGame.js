import Game from "../../models/game.js";
import GamePlayer from "../../models/gamePlayer.js";
import VerifyToken from "../../utils/verifyToken.js";

export const createGame = async (req, res, next) => {
  try {
    let { title, maxPlayers } = req.body;
    const { name, access_token } = req.body;

    if ((!title && !name) || !access_token || !maxPlayers)
      return res.status(400).json({ message: "Invalid params" });
    const user = await VerifyToken(access_token);

    const newGame = await Game.create({
      title: name || title,
      status: "Waiting for players",
      maxPlayers,
      creatorId: user.id,
      auditExcluded: false,
    });
    await GamePlayer.create({ gameId: newGame.id, playerId: user.id });

    res.status(201).json({ message: "Game created successfully", game_id: newGame.id });
  } catch (error) {
    next(error);
  }
};
