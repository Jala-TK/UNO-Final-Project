import Game from "../../models/game.js";
import GamePlayer from "../../models/gamePlayer.js";
import VerifyToken from "../../utils/verifyToken.js";

export const endGame = async (req, res, next) => {
  try {
    const { game_id, access_token } = req.body;
    if (!game_id || !access_token)
      return res.status(400).json({ message: "Invalid params" });

    const game = await Game.findByPk(game_id);
    if (!game || game?.auditExcluded)
      return res.status(404).json({ message: "Game not found" });

    const user = await VerifyToken(access_token);

    if (game.creatorId !== user.id) {
      return res.status(403).json({ error: "Only the creator can end the game" });
    }

    await GamePlayer.update(
      { auditExcluded: true },
      { where: { gameId: game_id } }
    );

    await game.update({ status: "Finished", auditExcluded: true });
    res.status(200).json({ message: "Game ended successfully" });
  } catch (err) {
    next(err);
  }
};
