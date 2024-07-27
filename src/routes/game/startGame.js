import Game from "../../models/game.js";
import GamePlayer from "../../models/gamePlayer.js";
import VerifyToken from "../../utils/verifyToken.js";
import { initializeGame } from "../../services/dealerService.js";

export const startGame = async (req, res, next) => {
  try {
    const { game_id, access_token } = req.body;
    if (!game_id || !access_token)
      return res.status(400).json({ message: "Invalid params" });

    const game = await Game.findByPk(game_id);
    if (!game || game?.auditExcluded)
      return res.status(404).json({ message: "Game not found" });

    const user = await VerifyToken(access_token);

    if (game.creatorId !== user.id) {
      return res.status(403).json({ error: "Only the creator can start the game" });
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

    await initializeGame(game_id);
    game.status = "In progress";
    game.currentPlayer = user.id;
    await game.save();

    res.status(200).json({ message: "Game started successfully" });
  } catch (err) {
    next(err);
  }
};
