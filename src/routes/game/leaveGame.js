import Game from "../../models/game.js";
import GamePlayer from "../../models/gamePlayer.js";
import VerifyToken from "../../utils/verifyToken.js";
import { Op } from "sequelize";

export const leaveGame = async (req, res, next) => {
  try {
    const { game_id, access_token } = req.body;
    if (!game_id || !access_token)
      return res.status(400).json({ message: "Invalid params" });

    const game = await Game.findByPk(game_id);
    if (!game || game?.auditExcluded)
      return res.status(404).json({ message: "Game not found" });

    const user = await VerifyToken(access_token);

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
          playerId: { [Op.not]: user.id },
          auditExcluded: false,
        },
      });

      if (otherPlayers.length === 0) {
        await game.update({ auditExcluded: true });
        return res.status(200).json({ message: "Game deleted successfully" });
      } else {
        const newCreator = otherPlayers[0];
        await game.update({ creatorId: newCreator.playerId });
      }
    }

    await gamePlayer.update({ auditExcluded: true });
    return res.status(200).json({ message: "Player left the game successfully" });
  } catch (err) {
    next(err);
  }
};
