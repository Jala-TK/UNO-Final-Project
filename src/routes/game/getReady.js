import Game from "../../models/game.js";
import GamePlayer from "../../models/gamePlayer.js";
import VerifyToken from "../../utils/verifyToken.js";

export const getReady = async (req, res, next) => {
  try {
    const { game_id, access_token } = req.body;
    if (!game_id || !access_token)
      return res.status(400).json({ message: "Invalid params" });

    const game = await Game.findByPk(game_id);
    if (!game || game?.auditExcluded)
      return res.status(404).json({ message: "Game not found" });

    const user = await VerifyToken(access_token);

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
    next(err);
  }
};
