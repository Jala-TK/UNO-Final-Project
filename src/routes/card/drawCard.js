import Card from "../../models/card.js";
import Game from "../../models/game.js";
import GamePlayer from "../../models/gamePlayer.js";
import { setNextPlayer } from "../../services/dealerService.js";
import VerifyToken from "../../utils/verifyToken.js";
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