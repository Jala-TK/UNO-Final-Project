import Game from "../../models/game.js";
import Player from "../../models/player.js";


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