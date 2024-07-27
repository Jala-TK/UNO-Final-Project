import Game from "../../models/game.js";
import VerifyToken from "../../utils/verifyToken.js";

export const deleteGame = async (req, res, next) => {
  try {
    const { access_token } = req.body;

    const game = await Game.findByPk(req.params.id);
    if (!game || game?.auditExcluded) {
      return res.status(404).json({ message: "Game not found" });
    }
    const user = await VerifyToken(access_token);

    if (game.creatorId !== user.id) {
      return res.status(403).json({ error: "Only the creator can edit the game" });
    }

    await game.update({ auditExcluded: true });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
